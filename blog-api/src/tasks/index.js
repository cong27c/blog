const scheduleJob = require("@/utils/scheduler");
const sendDailyReportEmail = require("./sendDailyReportEmail");

scheduleJob("send_daily_report_email", "*/3 * * * * *", sendDailyReportEmail);
