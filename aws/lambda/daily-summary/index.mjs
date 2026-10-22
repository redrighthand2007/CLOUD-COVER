// AWS Lambda: CloudCover daily summary email.
// Runs every morning (EventBridge Scheduler). Reads the numbers the CloudCover server
// sends to CloudWatch, and emails a short summary through SNS (topic cloudcover-alerts).
// It never touches the database, so it works while the app runs on a PC.
import { CloudWatchClient, GetMetricDataCommand } from '@aws-sdk/client-cloudwatch';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const cloudwatch = new CloudWatchClient({});
const sns = new SNSClient({});
const NAMESPACE = 'CloudCover';
const TOPIC_ARN = process.env.TOPIC_ARN;
const DASHBOARD_URL = process.env.DASHBOARD_URL || '';

const DAY_MS = 24 * 60 * 60 * 1000;

const query = (id, metric, stat, period) => ({
    Id: id,
    MetricStat: { Metric: { Namespace: NAMESPACE, MetricName: metric }, Period: period, Stat: stat },
    ReturnData: true,
});

const rupees = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

export const handler = async () => {
    const end = new Date();
    const start = new Date(end.getTime() - DAY_MS);

    const { MetricDataResults } = await cloudwatch.send(new GetMetricDataCommand({
        StartTime: start,
        EndTime: end,
        ScanBy: 'TimestampDescending',   // newest value first
        MetricDataQueries: [
            // Latest office numbers (the server reports every 5 minutes)
            query('missed', 'MissedDues', 'Maximum', 300),
            query('upcoming', 'UpcomingDues', 'Maximum', 300),
            query('collected', 'CollectedThisMonth', 'Maximum', 300),
            // Totals for the last 24 hours
            query('logins', 'Logins', 'Sum', 86400),
            query('failures', 'LoginFailures', 'Sum', 86400),
            query('errors', 'ServerErrors', 'Sum', 86400),
        ],
    }));

    const values = Object.fromEntries(MetricDataResults.map(r => [r.Id, r.Values || []]));
    const latest = (id) => values[id][0];
    const total = (id) => values[id].reduce((a, b) => a + b, 0);

    const reported = values.missed.length > 0;
    const dateText = end.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' });

    const lines = [`CloudCover daily summary - ${dateText}`, ''];
    if (reported) {
        const missed = latest('missed');
        lines.push(
            `Missed premiums:          ${missed}${missed > 0 ? '   <-- needs follow-up' : ''}`,
            `Due in the next 5 days:   ${latest('upcoming')}`,
            `Collected this month:     ${rupees(latest('collected'))}`,
        );
    } else {
        lines.push('The CloudCover server did not report in the last 24 hours.',
            'This is normal if the office PC was off. Otherwise, check that the server is running.');
    }
    lines.push(
        '',
        `Last 24 hours: ${total('logins')} logins, ${total('failures')} failed logins, ${total('errors')} server errors.`,
    );
    if (total('failures') >= 10) lines.push('Many failed logins - someone may be guessing passwords.');
    if (DASHBOARD_URL) lines.push('', `Dashboard: ${DASHBOARD_URL}`);
    lines.push('', 'Open CloudCover for customer names and phone numbers.');

    const subject = reported && latest('missed') > 0
        ? `CloudCover: ${latest('missed')} missed premium(s) - ${dateText}`
        : `CloudCover daily summary - ${dateText}`;

    await sns.send(new PublishCommand({ TopicArn: TOPIC_ARN, Subject: subject.slice(0, 99), Message: lines.join('\n') }));
    return { reported, subject };
};
