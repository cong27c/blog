const { Follow, User, UserSetting } = require("@/models");
const { where } = require("sequelize");
const { createNotification } = require("./notification.service");
const pusher = require("@/config/pusher");

module.exports = {
  async followUser(followingId, followedId) {
    const exists = await Follow.findOne({
      where: { following_id: followingId, followed_id: followedId },
    });
    if (exists) throw new Error("Already followed");

    const follow = await Follow.create({
      following_id: followingId,
      followed_id: followedId,
    });

    const follower = await User.findOne({ where: { id: followingId } });

    const userSetting = await UserSetting.findOne({
      where: { user_id: followedId },
    });

    if (!userSetting || userSetting.email_new_followers === true) {
      // Nếu chưa có setting thì coi như true (bật thông báo)
      const notification = await createNotification({
        userId: followedId,
        type: "follow",
        title: `${follower.user_name} đã theo dõi bạn`,
        link: `/profile/${follower.user_name}`,
        notifiableType: "User",
        notifiableId: follower.id,
        read: false,
      });

      await pusher.trigger(
        `private-notifications-${followedId}`,
        "new-notification",
        { notification }
      );
    }

    return follow;
  },

  async unfollowUser(followingId, followedId) {
    const deleted = await Follow.destroy({
      where: { following_id: followingId, followed_id: followedId },
    });
    if (!deleted) throw new Error("Follow not found");
    return true;
  },

  async getFollowers(userId) {
    return await Follow.findAll({
      where: { followed_id: userId },
    });
  },

  async getFollowing(userId) {
    return await Follow.findAll({
      where: { following_id: userId },
    });
  },

  async isFollowing(followingId, followedId) {
    const follow = await Follow.findOne({
      where: { following_id: followingId, followed_id: followedId },
    });
    return !!follow;
  },
};
