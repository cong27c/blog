const {
  User,
  Post,
  Topic,
  Follow,
  Like,
  sequelize,
} = require("@/models/index");

const getProfile = async (username, currentUserId = null) => {
  try {
    // Tìm user theo username
    const user = await User.findOne({
      where: { user_name: username },
      attributes: [
        "id",
        "user_name",
        "title",
        "cover_image",
        "avatar",
        "address",
        "website_url",
        "twitter_url",
        "github_url",
        "linkedin_url",
        "skills",
        "privacy",
        "created_at",
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Đếm số bài post
    const postsCount = await Post.count({
      where: { user_id: user.id },
    });

    // Đếm số followers (những người follow user này)
    const followersCount = await Follow.count({
      where: { followed_id: user.id },
    });

    // Đếm số following (những người mà user này đang follow)
    const followingCount = await Follow.count({
      where: { following_id: user.id },
    });

    // Đếm số likes mà user này nhận được trên các posts
    // Cách 3: Sử dụng raw query (đơn giản và hiệu quả nhất)
    const likesResult = await sequelize.query(
      `
      SELECT COUNT(*) as count 
      FROM Likes l 
      INNER JOIN Posts p ON l.likable_id = p.id 
      WHERE p.user_id = :userId AND l.likable_type = 'Post'
    `,
      {
        replacements: { userId: user.id },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    const likesCount = likesResult[0]?.count || 0;

    // Kiểm tra xem user hiện tại có đang follow user này không
    let isFollowing = false;
    if (currentUserId && currentUserId !== user.id) {
      const followRecord = await Follow.findOne({
        where: {
          following_id: currentUserId,
          followed_id: user.id,
        },
      });
      isFollowing = !!followRecord;
    }

    // Trả về data theo format yêu cầu
    return {
      id: user.id,
      username: user.user_name,
      name: user.user_name,
      title: user.title,
      bio: "Passionate about modern web development, React ecosystem, and creating amazing user experiences.",
      coverImage: user.cover_image || null,
      avatar: user.avatar,
      location: user.address || "Hanoi",
      website: user.website_url,
      joinedDate: user.created_at,
      social: {
        twitter: user.twitter_url,
        github: user.github_url,
        linkedin: user.linkedin_url,
        website: user.website_url,
      },
      stats: {
        postsCount,
        followers: followersCount,
        following: followingCount,
        likes: likesCount,
      },
      skills: JSON.parse(user.skills || "[]"),
      badges: [
        { name: "Top Author", color: "primary", icon: "🏆" },
        { name: "Early Adopter", color: "secondary", icon: "🚀" },
        { name: "Community Helper", color: "success", icon: "🤝" },
      ],
      privacy: JSON.parse(user.privacy || "{}"),
      isFollowing,
    };
  } catch (error) {
    console.error("Error in getProfile service:", error);
    throw error;
  }
};

async function getByUsername(username, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const { rows: items, count: total } = await Post.findAndCountAll({
    limit,
    offset,
    order: [["created_at", "DESC"]],
    distinct: true,
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "email", ["user_name", "username"], "avatar"],
        where: { user_name: username },
        required: true,
      },
      {
        model: Topic,
        as: "topics",
        attributes: ["id", "name", "slug"],
      },
    ],
  });

  return { items, total };
}

async function updateProfile(username, data) {
  const user = await User.findOne({ where: { user_name: username } });
  if (!user) throw new Error("User not found");

  // Merge privacy
  const currentPrivacy = user.privacy || {};
  const newPrivacy = {
    ...currentPrivacy,
    ...(data.privacy || {}),
  };

  // Merge social links
  const currentSocial = {
    twitter: user.twitter_url,
    github: user.github_url,
    linkedin: user.linkedin_url,
    website: user.website_url,
  };
  const newSocial = { ...currentSocial, ...(data.social || {}) };

  // Update database
  await user.update({
    user_name: data.username ?? user.user_name,
    name: data.name ?? user.name,
    title: data.title ?? user.title,
    bio: data.bio ?? user.bio,
    cover_image: data.coverImage ?? user.cover_image,
    avatar: data.avatar ?? user.avatar,
    address: data.location ?? user.location,
    website_url: newSocial.website ?? user.website_url,
    twitter_url: newSocial.twitter ?? user.twitter_url,
    github_url: newSocial.github ?? user.github_url,
    linkedin_url: newSocial.linkedin ?? user.linkedin_url,
    skills: data.skills ?? user.skills,
    privacy: newPrivacy,
  });

  return {
    ...data,
  };
}

module.exports = {
  updateProfile,
  getByUsername,
  getProfile,
};
