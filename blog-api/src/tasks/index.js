const scheduleJob = require("@/utils/scheduler");
const sendDailyReportEmail = require("./sendDailyReportEmail");
const sendWeeklyDigestJob = require("./weeklyDigest");

scheduleJob("send_daily_report_email", "*/3 * * * * *", sendDailyReportEmail);
scheduleJob("weekly_digest", "0 0 2 * * 0", sendWeeklyDigestJob);
