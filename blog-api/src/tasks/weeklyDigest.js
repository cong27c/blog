const queue = require("@/utils/queue");
const { User } = require("@/models/index");

const sendWeeklyDigestJob = async () => {
  const users = await User.findAll();
  for (let user of users) {
    await queue.dispatch("sendWeeklyDigestJob", { userId: user.id });
  }
  console.log("Weekly digest jobs dispatched!");
};
module.exports = sendWeeklyDigestJob;
