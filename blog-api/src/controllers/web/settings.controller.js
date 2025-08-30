const userSettingService = require("@/services/setting.service");
const response = require("@/utils/response");

const getSettings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const settings = await userSettingService.getUserSettings(userId);
    response.success(res, 200, settings);
  } catch (error) {
    console.error("Error getting user settings:", error);
    response.error(res, 500, error.message);
  }
};

const getAuthorSettings = async (req, res, next) => {
  try {
    const authorId = req.body;
    const settings = await userSettingService.getUserSettings(authorId);
    console.log(settings);
    response.success(res, 200, settings);
  } catch (error) {
    console.error("Error getting user settings:", error);
    response.error(res, 500, error.message);
  }
};

const updateSettings = async (req, res) => {
  try {
    const updated = await userSettingService.updateSettings(
      req.user.id,
      req.body
    );
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update settings" });
  }
};

const updateEmail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email } = req.body;

    const result = await userSettingService.requestUpdateEmail(userId, email);

    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const verifyUpdateEmail = async (req, res) => {
  try {
    console.log(req.query);
    const { token } = req.query;
    const result = await userSettingService.confirmUpdateEmail(token);

    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const exportData = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await userSettingService.exportUserData(userId);
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
module.exports = {
  exportData,
  verifyUpdateEmail,
  updateEmail,
  getAuthorSettings,
  updateSettings,
  getSettings,
};
