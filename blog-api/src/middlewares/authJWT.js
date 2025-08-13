const jwtService = require("@/services/jwt.service");
const response = require("@/utils/response");
const { User } = require("@/models");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response.error(res, 401, "Access token missing");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwtService.verifyAccessToken(token);
    const userId = decoded?.userId;

    if (!userId) {
      throw new Error("id user ko hợp lệ");
    }
    const user = await User.findOne({
      where: { id: userId },
    });

    req.user = user;
    next();
  } catch (err) {
    return response.error(res, 401, "Token không hợp lệ hoặc đã hết hạn");
  }
};

module.exports = authMiddleware;
