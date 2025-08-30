import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button } from "../../components";
import styles from "./Login.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, loginUser } from "@/features/auth/authAsync";
import useQuery from "@/hooks/useQuery";
import { config } from "@/config/config";
import toast from "react-hot-toast";
import { verifyLoginOtp } from "@/services/authServices";

const Login = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ State cho 2FA
  const [require2FA, setRequire2FA] = useState(false);
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState("");

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    if (currentUser) {
      navigate(query.get("continue") || config.routes.home);
    }
  }, [currentUser, navigate, query]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email address";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "otp") {
      setOtp(value);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // 🚀 Bước 1: Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng nhập đầy đủ thông tin hợp lệ!");
      return;
    }

    setIsSubmitting(true);
    try {
      const login = await dispatch(loginUser(formData)).unwrap();

      if (!login) {
        toast.error("Sai thông tin đăng nhập hoặc chưa xác thực email");
        return;
      }

      // ✅ Nếu user cần OTP → chuyển qua OTP step
      if (login.require2FA) {
        setRequire2FA(true);
        setUserId(login.user_id);
        toast("Nhập mã OTP để tiếp tục");
      } else {
        // ✅ Login thành công bình thường
        toast.success("Đăng nhập thành công!");
        dispatch(fetchUserProfile());
        navigate("/");
      }
    } catch (error) {
      toast.error("Sai thông tin đăng nhập hoặc chưa xác thực email");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🚀 Bước 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Vui lòng nhập OTP");
      return;
    }

    try {
      const res = await verifyLoginOtp(userId, otp);
      localStorage.setItem("access_token", res.access_token);

      toast.success("Xác thực OTP thành công!");
      dispatch(fetchUserProfile());
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "OTP không hợp lệ");
    }
  };

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>
          Sign in to your account to continue reading and engaging with our
          community.
        </p>
      </div>

      {/* Nếu chưa require 2FA → hiện form login */}
      {!require2FA ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            placeholder="Enter your email"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            placeholder="Enter your password"
            required
          />

          <div className={styles.formOptions}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>Remember me</span>
            </label>
            <Link to="/forgot-password" className={styles.forgotLink}>
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      ) : (
        // ✅ Form nhập OTP
        <form className={styles.form} onSubmit={handleVerifyOtp}>
          <Input
            label="OTP Code"
            type="text"
            name="otp"
            value={otp}
            onChange={handleInputChange}
            placeholder="Enter your 6-digit OTP"
            required
          />

          <Button type="submit" variant="primary" size="lg" fullWidth>
            Verify OTP
          </Button>
        </form>
      )}
    </>
  );
};

export default Login;
