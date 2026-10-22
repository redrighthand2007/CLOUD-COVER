// Sends CloudCover's health numbers and logs to Amazon CloudWatch (when AWS_MONITORING=on).
//   Metrics (namespace "CloudCover", every 5 minutes):
//     MissedDues, UpcomingDues, CollectedThisMonth  - current office numbers
//     Logins, LoginFailures, ServerErrors            - counts since the last report
//   Logs (log group /cloudcover/app, every minute): logins, failed logins, server errors.
// Uses the AWS login on this PC (AWS_PROFILE) - no access keys in code or .env.
// Never sends passwords, PAN or phone numbers. If AWS can't be reached, the app keeps
// working normally and only a short warning is printed.
const os = require('os');
const { CloudWatchClient, PutMetricDataCommand } = require('@aws-sdk/client-cloudwatch');
const { CloudWatchLogsClient, CreateLogStreamCommand, PutLogEventsCommand } = require('@aws-sdk/client-cloudwatch-logs');
const { getSummary } = require('./statsService');

const enabled = process.env.AWS_MONITORING === 'on';
const NAMESPACE = 'CloudCover';
const LOG_GROUP = process.env.CLOUDWATCH_LOG_GROUP || '/cloudcover/app';
const METRICS_EVERY_MS = 5 * 60 * 1000;
const LOGS_EVERY_MS = 60 * 1000;

const counters = { Logins: 0, LoginFailures: 0, ServerErrors: 0 };
let logBuffer = [];
let logStream = null;
let lastWarning = 0;

const cloudwatch = enabled ? new CloudWatchClient({}) : null;
const logsClient = enabled ? new CloudWatchLogsClient({}) : null;

function warn(message) {
    // At most one warning every 10 minutes, so a missing AWS login doesn't flood the console
    if (Date.now() - lastWarning > 10 * 60 * 1000) {
        lastWarning = Date.now();
        console.warn(`[CloudWatch] ${message} (the app keeps working; run "aws login --profile cloudcover" if credentials expired)`);
    }
}

function count(name, by = 1) {
    if (enabled) counters[name] += by;
}

// event: short name like 'login'; details: small object without personal data
function log(level, event, details = {}) {
    if (!enabled) return;
    logBuffer.push({ timestamp: Date.now(), message: JSON.stringify({ level, event, ...details }) });
    if (logBuffer.length > 1000) logBuffer = logBuffer.slice(-1000);
}

async function sendMetrics() {
    const summary = await getSummary();
    const counts = { ...counters };
    const now = new Date();
    const metric = (MetricName, Value, Unit = 'Count') => ({ MetricName, Value: Number(Value), Unit, Timestamp: now });
    try {
        await cloudwatch.send(new PutMetricDataCommand({
            Namespace: NAMESPACE,
            MetricData: [
                metric('MissedDues', summary.missed_dues),
                metric('UpcomingDues', summary.upcoming_dues),
                metric('CollectedThisMonth', summary.collected_this_month, 'None'),
                metric('Logins', counts.Logins),
                metric('LoginFailures', counts.LoginFailures),
                metric('ServerErrors', counts.ServerErrors),
            ],
        }));
        // Only subtract what was sent, so counts that arrived meanwhile aren't lost
        for (const key of Object.keys(counts)) counters[key] -= counts[key];
    } catch (err) {
        warn(`Could not send metrics: ${err.name}`);
    }
}

async function sendLogs() {
    if (!logBuffer.length) return;
    const events = logBuffer;
    logBuffer = [];
    try {
        if (!logStream) {
            const name = `${os.hostname()}-${new Date().toISOString().replace(/[:.]/g, '-')}`;
            try {
                await logsClient.send(new CreateLogStreamCommand({ logGroupName: LOG_GROUP, logStreamName: name }));
            } catch (err) {
                if (err.name !== 'ResourceAlreadyExistsException') throw err;
            }
            logStream = name;
        }
        await logsClient.send(new PutLogEventsCommand({ logGroupName: LOG_GROUP, logStreamName: logStream, logEvents: events }));
    } catch (err) {
        logBuffer = events.concat(logBuffer).slice(-1000); // keep them for the next try
        if (err.name === 'ResourceNotFoundException') logStream = null;
        warn(`Could not send logs: ${err.name}`);
    }
}

// Express middleware: counts logins, failed logins and server errors from responses
function middleware(req, res, next) {
    if (!enabled) return next();
    res.on('finish', () => {
        const path = req.originalUrl.split('?')[0];
        if (req.method === 'POST' && (path === '/api/auth/login' || path === '/api/auth/cognito')) {
            const type = path.endsWith('cognito') ? 'office-mfa' : (req.body && req.body.type) || 'unknown';
            if (res.statusCode === 200) {
                count('Logins');
                log('info', 'login', { type });
            } else if ([401, 403, 429].includes(res.statusCode)) {
                count('LoginFailures');
                log('warn', 'login_failed', { type, status: res.statusCode });
            }
        }
        if (res.statusCode >= 500) {
            count('ServerErrors');
            log('error', 'server_error', { method: req.method, path: path.replace(/\/\d+/g, '/:id'), status: res.statusCode });
        }
    });
    next();
}

function start() {
    if (!enabled) return;
    log('info', 'server_started', { host: os.hostname() });
    sendMetrics().catch(err => warn(`Could not read numbers: ${err.message}`));
    setInterval(() => sendMetrics().catch(err => warn(`Could not read numbers: ${err.message}`)), METRICS_EVERY_MS).unref();
    setInterval(() => sendLogs(), LOGS_EVERY_MS).unref();
    console.log(`[CloudWatch] Sending metrics (namespace ${NAMESPACE}) and logs (${LOG_GROUP}) to AWS`);
}

// Send what's left before the server stops
async function flush() {
    if (!enabled) return;
    log('info', 'server_stopped', {});
    await Promise.allSettled([sendMetrics(), sendLogs()]);
}

module.exports = { enabled, start, flush, middleware, count, log };
