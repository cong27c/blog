const jwtService = require("@/services/jwt.service");
const { User } = require("@/models");

const optionalAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Không có token => bỏ qua, cho qua luôn
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwtService.verifyAccessToken(token);
    const userId = decoded?.userId;

    if (userId) {
      const user = await User.findOne({
        where: { id: userId },
      });
      req.user = user;
    }
  } catch (err) {
    // Token sai hoặc hết hạn thì cũng bỏ qua, không chặn
  }

  next();
};

module.exports = optionalAuthMiddleware;
