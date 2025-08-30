import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Card from "../../components/Card/Card";
import Badge from "../../components/Badge/Badge";
import styles from "./Settings.module.scss";
import {
  changePassword,
  confirm2FASetup,
  exportData,
  generate2FASecret,
  getSettings,
  updateEmail,
  updateSettings,
} from "@/services/authServices";
import toast from "react-hot-toast";

const Settings = () => {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("account");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [otp, setOtp] = useState("");

  const [errors, setErrors] = useState({});

  // Settings State
  const [auth, setAuth] = useState({});
  const [settings, setSettings] = useState({
    // Account

    confirmPassword: "",
    twoFactorEnabled: false,

    // Content
    defaultPostVisibility: "public",
    allowComments: true,
    requireCommentApproval: false,
    showViewCounts: true,

    // Notifications
    emailNewComments: true,
    emailNewLikes: true,
    emailNewFollowers: true,
    emailWeeklyDigest: true,
    pushNotifications: true,

    // Privacy
    profileVisibility: "public",
    allowDirectMessages: "everyone",
    searchEngineIndexing: true,
    showEmail: false,
  });

  const settingsSections = [
    { id: "account", label: "Account", icon: "👤" },
    { id: "content", label: "Content", icon: "📝" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "privacy", label: "Privacy", icon: "🔒" },
  ];
  useEffect(() => {
    const fetchData = async () => {
      const data = await getSettings();
      setSettings(data);
      setAuth((prev) => ({
        ...prev,
        email: data.email,
      }));
    };
    fetchData();
  }, []);
  console.log(settings);

  const handleToggle2FA = async (enabled) => {
    if (enabled) {
      // Bật → gọi API generate secret
      try {
        setLoading(true);
        const qrCode = await generate2FASecret();
        setQrCode(qrCode);
        setMessage(
          "Quét QR Code trong Google Authenticator và nhập OTP để xác nhận"
        );
      } catch (err) {
        setMessage(err.message || "Không thể tạo 2FA");
      } finally {
        setLoading(false);
      }
    } else {
      // Tắt → reset
      setQrCode("");
      setOtp("");
      handleSettingChange("twoFactorEnabled", false);
      setMessage("Đã tắt 2FA");
    }
  };

  const handleConfirm2FA = async () => {
    try {
      setLoading(true);
      const res = await confirm2FASetup(otp);
      if (res.success) {
        handleSettingChange("twoFactorEnabled", true);
        setMessage(res.message);
        setQrCode("");
        setOtp("");
      }
    } catch (err) {
      setMessage(err.message || "OTP không hợp lệ");
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };
  const handleAuthChange = (field, value) => {
    setAuth((prev) => ({ ...prev, [field]: value }));
  };
  const validateForm = () => {
    const newErrors = {};

    // Current password chỉ cần required
    if (!auth.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    // New password validation
    if (!auth.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (auth.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(auth.newPassword)) {
      newErrors.newPassword =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm password validation
    if (!auth.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (auth.newPassword !== auth.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);

    try {
      const { success } = await changePassword(auth); // BE trả về { success: true/false }

      if (success) {
        toast.success("Thay đổi mật khẩu thành công!!");
        navigate("/");
      } else {
        toast.error("Mật khẩu hiện tại ko chính xác!");
      }
    } catch (error) {
      console.error("Password reset failed:", error);
      setErrors({
        submit: "Failed to reset password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const changeEmail = async () => {
    setLoading(true);
    try {
      if (!auth.email) {
        toast.error("Vui lòng nhập email");
        return;
      }

      // Regex kiểm tra email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(auth.email)) {
        toast.error("Email không hợp lệ");
        return;
      }

      const res = await updateEmail(auth.email);
      console.log(res);

      if (res.success) {
        toast.success(res.message || "Vui lòng kiểm tra email để xác thực");
        setAuth((prev) => ({
          ...prev,
          email: auth.email,
          email_verified: false,
        }));
      } else {
        toast.error(res.message || "Cập nhật email thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const res = await updateSettings(settings);
      setMessage("Settings saved successfully!");
      setAuth((prev) => ({
        ...prev,
        email: res.data.email,
      }));
      setSettings(res.data); // cập nhật lại state bằng data trả về từ BE
    } catch (error) {
      console.error(error);
      setMessage("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    if (!auth.email) return;
    try {
      const res = await exportData(auth.email);
      if (res.success) {
        const exportData = res.data;

        // Tạo file JSON tải xuống
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "my-blog-data.json";
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Data exported successfully!");
      } else {
        toast.error("Failed to export data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to export data");
    } finally {
      setLoading(false);
    }
  };
  const renderAccountSettings = () => (
    <div className={styles.settingsContent}>
      <h2>Account Settings</h2>

      <div className={styles.settingGroup}>
        <h3>Email & Authentication</h3>
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>Email Address</label>
            <span className={styles.settingDescription}>
              Your primary email for notifications
            </span>
          </div>
          <div className={styles.settingControl}>
            <Input
              value={auth.email}
              onChange={(e) => handleAuthChange("email", e.target.value)}
            />
            <Badge variant={auth.email_verified ? "success" : "default"}>
              {auth.email_verified ? "Verified" : "Unverified"}
            </Badge>
            <button
              className={styles.saveBtn}
              disabled={loading}
              onClick={changeEmail}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>Two-Factor Authentication</label>
            <span className={styles.settingDescription}>
              Add extra security to your account
            </span>
          </div>
          <div className={styles.settingControl}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={settings.twoFactorEnabled}
                onChange={(e) => handleToggle2FA(e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>

        {qrCode && (
          <div className={styles.qrContainer}>
            <p>Scan this QR code with Google Authenticator</p>
            <img src={qrCode} alt="2FA QR Code" />
            <Input
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
            />
            <Button
              variant="primary"
              onClick={handleConfirm2FA}
              loading={loading}
            >
              Confirm 2FA
            </Button>
          </div>
        )}
      </div>

      <div className={styles.settingGroup}>
        <h3>Change Password</h3>
        <form onSubmit={handlePasswordChange} className={styles.passwordForm}>
          <Input
            label="Current Password"
            type="password"
            value={auth.currentPassword}
            onChange={(e) =>
              handleAuthChange("currentPassword", e.target.value)
            }
            required
          />
          {errors.currentPassword && (
            <p className={styles.error}>{errors.currentPassword}</p>
          )}

          <Input
            label="New Password"
            type="password"
            value={auth.newPassword}
            onChange={(e) => handleAuthChange("newPassword", e.target.value)}
            required
          />
          {errors.newPassword && (
            <p className={styles.error}>{errors.newPassword}</p>
          )}

          <Input
            label="Confirm New Password"
            type="password"
            value={auth.confirmPassword}
            onChange={(e) =>
              handleAuthChange("confirmPassword", e.target.value)
            }
            required
          />
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword}</p>
          )}

          <Button type="submit" variant="primary" loading={loading}>
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );

  const renderContentSettings = () => (
    <div className={styles.settingsContent}>
      <h2>Content & Publishing</h2>

      <div className={styles.settingGroup}>
        <h3>Default Settings</h3>
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>Default Post Visibility</label>
            <span className={styles.settingDescription}>
              Choose default visibility for new posts
            </span>
          </div>
          <select
            value={settings.defaultPostVisibility}
            onChange={(e) =>
              handleSettingChange("defaultPostVisibility", e.target.value)
            }
            className={styles.selectInput}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>Allow Comments</label>
            <span className={styles.settingDescription}>
              Let readers comment on your posts
            </span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={settings.allowComments}
              onChange={(e) =>
                handleSettingChange("allowComments", e.target.checked)
              }
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>Show View Counts</label>
            <span className={styles.settingDescription}>
              Display view counts on your posts
            </span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={settings.showViewCounts}
              onChange={(e) =>
                handleSettingChange("showViewCounts", e.target.checked)
              }
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className={styles.settingsContent}>
      <h2>Notifications</h2>

      <div className={styles.settingGroup}>
        <h3>Email Notifications</h3>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>New Comments</label>
            <span className={styles.settingDescription}>
              Get notified when someone comments on your posts
            </span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={settings.emailNewComments}
              onChange={(e) =>
                handleSettingChange("emailNewComments", e.target.checked)
              }
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>New Followers</label>
            <span className={styles.settingDescription}>
              Get notified when someone follows you
            </span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={settings.emailNewFollowers}
              onChange={(e) =>
                handleSettingChange("emailNewFollowers", e.target.checked)
              }
            />
            <span className={styles.slider}></span>
          </label>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>Weekly Digest</label>
            <span className={styles.settingDescription}>
              Receive weekly summary of your activity
            </span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={settings.emailWeeklyDigest}
              onChange={(e) =>
                handleSettingChange("emailWeeklyDigest", e.target.checked)
              }
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className={styles.settingsContent}>
      <h2>Privacy & Security</h2>

      <div className={styles.settingGroup}>
        <h3>Profile Privacy</h3>
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>Profile Visibility</label>
            <span className={styles.settingDescription}>
              Control who can see your profile
            </span>
          </div>
          <select
            value={settings.profileVisibility}
            onChange={(e) =>
              handleSettingChange("profileVisibility", e.target.value)
            }
            className={styles.selectInput}
          >
            <option value="public">Public</option>
            <option value="followers">Followers Only</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>Search Engine Indexing</label>
            <span className={styles.settingDescription}>
              Allow search engines to index your content
            </span>
          </div>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={settings.searchEngineIndexing}
              onChange={(e) =>
                handleSettingChange("searchEngineIndexing", e.target.checked)
              }
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>

      <div className={styles.settingGroup}>
        <h3>Data Export</h3>
        <div className={styles.settingRow}>
          <div className={styles.settingInfo}>
            <label>Download Your Data</label>
            <span className={styles.settingDescription}>
              Export all your data in JSON format
            </span>
          </div>
          <Button
            variant="secondary"
            onClick={handleExportData}
            loading={loading}
          >
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return renderAccountSettings();
      case "content":
        return renderContentSettings();
      case "notifications":
        return renderNotificationSettings();
      case "privacy":
        return renderPrivacySettings();
      default:
        return renderAccountSettings();
    }
  };

  return (
    <div className={styles.container}>
      <div className="container">
        <div className={styles.header}>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className={styles.backButton}
          >
            ← Back
          </Button>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>
            Manage your account preferences and privacy settings
          </p>
        </div>

        <div className={styles.settingsLayout}>
          <nav className={styles.sidebar}>
            {settingsSections.map((section) => (
              <button
                key={section.id}
                className={`${styles.sidebarItem} ${
                  activeSection === section.id ? styles.active : ""
                }`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className={styles.sidebarIcon}>{section.icon}</span>
                <span className={styles.sidebarLabel}>{section.label}</span>
              </button>
            ))}
          </nav>

          <Card className={styles.mainContent}>
            {message && (
              <div className={styles.message}>
                {message}
                <button
                  onClick={() => setMessage("")}
                  className={styles.messageClose}
                >
                  ×
                </button>
              </div>
            )}
            {renderContent()}

            <div className={styles.saveActions}>
              <Button
                variant="primary"
                onClick={handleSaveSettings}
                loading={loading}
              >
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
