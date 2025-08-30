import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Navigation from "../Navigation/Navigation";
import Button from "../Button/Button";
import FallbackImage from "../FallbackImage/FallbackImage";
import NotificationDropdown from "../NotificationDropdown/NotificationDropdown";
import styles from "./Header.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { logoutAsync } from "@/features/auth/authAsync";
import { markAllAsRead, markAsRead } from "@/services/notificationService";
import {
  markAllAsReadSlice,
  markAsReadSlice,
} from "@/features/notification/notificationSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const notifications = useSelector((state) => state.notifications.list);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleUserDropdown = () => {
    if (isAuthenticated) {
      setIsDropdownOpen((prev) => !prev);
    }
  };

  const handleLogout = () => {
    dispatch(logoutAsync());
    localStorage.removeItem("access_token");
    setIsDropdownOpen(false);
    navigate("/login");
  };

  const handleNotificationToggle = () => {
    setIsNotificationOpen((prev) => !prev);
    setIsDropdownOpen(false);
  };

  const handleMarkAsRead = async (notificationId) => {
    dispatch(markAsReadSlice(notificationId));
    markAsRead();
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsReadSlice());
    markAllAsRead();
  };

  // Close dropdown/notification on clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when window resizes >= 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.content}>
          {/* Brand/Logo */}
          <div className={styles.brand}>
            <Link to="/" className={styles.brandLink}>
              <div className={styles.logo}>
                <div className={styles.logoIcon}>
                  <span className={styles.logoText}>B</span>
                </div>
                <h1 className={styles.brandTitle}>BlogUI</h1>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className={styles.nav}>
            <Navigation />
          </div>

          {/* Auth Actions */}
          <div className={styles.actions}>
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div ref={notificationRef}>
                  <NotificationDropdown
                    notifications={notifications}
                    unreadCount={unreadCount}
                    isOpen={isNotificationOpen}
                    onToggle={handleNotificationToggle}
                  />
                </div>

                {/* User Menu */}
                <div className={styles.userMenu} ref={dropdownRef}>
                  <button
                    className={styles.userButton}
                    onClick={toggleUserDropdown}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    <FallbackImage
                      src={user?.avatar}
                      alt={user?.name}
                      className={styles.userAvatar}
                    />
                    <span className={styles.userName}>{user?.name}</span>
                    <svg
                      className={`${styles.chevron} ${
                        isDropdownOpen ? styles.chevronOpen : ""
                      }`}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div className={styles.dropdown}>
                      <div className={styles.dropdownHeader}>
                        <div className={styles.dropdownUserInfo}>
                          <div className={styles.dropdownUserName}>
                            {user?.name}
                          </div>
                          <div className={styles.dropdownUserEmail}>
                            {user?.email}
                          </div>
                          <div className={styles.dropdownUserRole}>
                            {user?.role}
                          </div>
                        </div>
                      </div>
                      <nav className={styles.dropdownNav}>
                        <Link
                          to={`/profile/${user?.username || "john-doe"}`}
                          className={styles.dropdownItem}
                        >
                          Profile
                        </Link>
                        <Link to="/my-posts" className={styles.dropdownItem}>
                          My Posts
                        </Link>
                        <Link to="/write" className={styles.dropdownItem}>
                          Write Post
                        </Link>
                        <Link to="/bookmarks" className={styles.dropdownItem}>
                          Bookmarks
                        </Link>
                        <Link to="/settings" className={styles.dropdownItem}>
                          Settings
                        </Link>
                      </nav>
                      <button
                        className={`${styles.dropdownItem} ${styles.logout}`}
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className={styles.authActions}>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button variant="primary" size="sm" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className={styles.mobileMenuToggle}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              <span className={isMobileMenuOpen ? styles.active : ""}></span>
              <span className={isMobileMenuOpen ? styles.active : ""}></span>
              <span className={isMobileMenuOpen ? styles.active : ""}></span>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className={styles.mobileMenu}>
              <Navigation />
              {!isAuthenticated ? (
                <div className={styles.mobileAuth}>
                  <Button variant="ghost" size="md" fullWidth asChild>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </Button>
                  <Button variant="primary" size="md" fullWidth asChild>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className={styles.mobileUserMenu}>
                  <div className={styles.mobileUserInfo}>
                    <FallbackImage
                      src={user?.avatar}
                      alt={user?.name}
                      className={styles.mobileUserAvatar}
                    />
                    <div>
                      <div className={styles.mobileUserName}>{user?.name}</div>
                      <div className={styles.mobileUserEmail}>
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <nav className={styles.mobileUserNav}>
                    <Link
                      to={`/profile/${user?.username || "john-doe"}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/my-posts"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Posts
                    </Link>
                    <Link
                      to="/write"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Write Post
                    </Link>
                    <Link
                      to="/bookmarks"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Bookmarks
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      className={styles.mobileLogoutButton}
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Logout
                    </button>
                  </nav>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
