# AWS monitoring setup: CloudWatch, EventBridge Scheduler, Lambda, SNS

Created on 22 Oct 2026 for the AWS course project. All resources are in the CloudCover project
account `448592647758`, Region `ap-southeast-2` (Sydney), tagged `Project=CloudCover`.

## What it does

```text
 Office PC                                 AWS (Sydney)
 ┌───────────────────────┐   every 5 min   ┌──────────────────────────────┐
 │ CloudCover server     │ ───metrics────► │ CloudWatch metrics           │──► 3 alarms ──┐
 │ (monitoringService.js)│ ───logs───────► │ CloudWatch Logs /cloudcover/ │               │
 └───────────────────────┘   every 1 min   └──────────────────────────────┘               ▼
                                                    ▲ reads                         SNS topic
             8:00 AM IST  EventBridge Scheduler ──► Lambda cloudcover-daily-summary ──► cloudcover-alerts
                                                                                          │ email
                                                                                          ▼
                                                                              redrighthand2007@gmail.com
```

- The **server** sends its numbers and logs to CloudWatch. The Lambda never touches the database,
  so this works while the app runs on a PC (AWS cannot reach a PC's database).
- Every morning the **Lambda** reads the numbers and emails a short summary: missed premiums, dues in
  the next 5 days, money collected this month, and login/error totals for the last 24 hours.
- **Alarms** email straight away when something goes wrong.
- The **dashboard** shows everything on one page:
  https://ap-southeast-2.console.aws.amazon.com/cloudwatch/home?region=ap-southeast-2#dashboards/dashboard/CloudCover

## Resources

| Service | Name | Details |
|---|---|---|
| CloudWatch metrics | namespace `CloudCover` | `MissedDues`, `UpcomingDues`, `CollectedThisMonth` (latest values); `Logins`, `LoginFailures`, `ServerErrors` (counts) |
| CloudWatch Logs | `/cloudcover/app` | Server events (start/stop, logins, failed logins, server errors). Kept 14 days |
| CloudWatch Logs | `/aws/lambda/cloudcover-daily-summary` | The Lambda's own logs. Kept 14 days |
| CloudWatch alarms | `cloudcover-server-errors` | Any server error (HTTP 500) in 5 minutes. Emails on alarm and when fixed |
| | `cloudcover-many-failed-logins` | 10+ failed logins in 15 minutes (possible password guessing) |
| | `cloudcover-daily-summary-failed` | The daily Lambda failed |
| CloudWatch dashboard | `CloudCover` | Dues, collected amount, alarms, logins, errors, recent server events |
| Lambda | `cloudcover-daily-summary` | Node.js 22, arm64, 128 MB, 30 s timeout. Code: `aws/lambda/daily-summary/index.mjs` |
| EventBridge Scheduler | `cloudcover-daily-summary` | `cron(0 8 * * ? *)` in `Asia/Kolkata`, 2 retries |
| SNS topic | `cloudcover-alerts` | Email subscription to the owner (must be confirmed once from the email) |
| IAM role | `cloudcover-daily-summary-lambda` | Read metrics, write its own logs, publish to `cloudcover-alerts` only (`aws/iam/lambda-permissions.json`) |
| IAM role | `cloudcover-scheduler` | Invoke only this Lambda (`aws/iam/scheduler-permissions.json`) |
| AWS Budgets | `cloudcover-monthly-50-inr` | $0.60/month (about ₹50), usage before credits; emails at 50%, 100% and forecast 100% |

## Cost

All within the always-free allowances at this size (about 30 Lambda runs, 30 schedule runs,
6 custom metrics, 3 alarms, 1 dashboard and a few MB of logs per month). The budget above emails
if anything starts to cost money.

## Privacy

Only counts and short event names go to AWS. No customer names, PAN, phone numbers or passwords.
The daily email says how many premiums are missed; names are looked up inside CloudCover.

## Turning it on and off

In `.env`:

```env
AWS_MONITORING=on          # off = the server sends nothing to AWS
AWS_PROFILE=cloudcover     # uses this PC's "aws login" (renews automatically for 90 days)
AWS_REGION=ap-southeast-2
```

If the AWS login expires, the app keeps working and prints a short `[CloudWatch]` warning. Fix it with
`aws login --profile cloudcover`.

To pause the morning email without deleting anything: AWS console → **Amazon EventBridge** →
**Schedules** → `cloudcover-daily-summary` → **Disable** (and **Enable** to resume).

## Updating the Lambda code

```powershell
Compress-Archive -Path aws\lambda\daily-summary\index.mjs -DestinationPath daily-summary.zip -Force
aws lambda update-function-code --function-name cloudcover-daily-summary --zip-file fileb://daily-summary.zip --profile cloudcover --region ap-southeast-2
```

## Tested on 22 Oct 2026

- Server metrics (all 6) and log events arrived in CloudWatch after a real login and a failed login.
- Lambda run manually: read the metrics (`reported: true`) and published the summary.
- A one-time EventBridge schedule invoked the Lambda through the `cloudcover-scheduler` role, then deleted itself.
- Dashboard created with no validation errors; alarms created.

## Removing it (January 2027, if AWS is dropped)

Set `AWS_MONITORING=off` in `.env`, then:

```bash
aws scheduler delete-schedule --name cloudcover-daily-summary
aws lambda delete-function --function-name cloudcover-daily-summary
aws cloudwatch delete-alarms --alarm-names cloudcover-server-errors cloudcover-many-failed-logins cloudcover-daily-summary-failed
aws cloudwatch delete-dashboards --dashboard-names CloudCover
aws logs delete-log-group --log-group-name /cloudcover/app
aws logs delete-log-group --log-group-name /aws/lambda/cloudcover-daily-summary
aws sns delete-topic --topic-arn arn:aws:sns:ap-southeast-2:448592647758:cloudcover-alerts
aws iam delete-role-policy --role-name cloudcover-daily-summary-lambda --policy-name daily-summary
aws iam delete-role --role-name cloudcover-daily-summary-lambda
aws iam delete-role-policy --role-name cloudcover-scheduler --policy-name invoke-daily-summary
aws iam delete-role --role-name cloudcover-scheduler
aws budgets delete-budget --account-id 448592647758 --budget-name cloudcover-monthly-50-inr
```
