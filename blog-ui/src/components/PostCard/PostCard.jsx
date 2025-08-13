import { useState, memo, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Card from "../Card/Card";
import Badge from "../Badge/Badge";
import FallbackImage from "../FallbackImage/FallbackImage";
import styles from "./PostCard.module.scss";
import {
  getPostLikes,
  togglePostBookmarks,
  togglePostLike,
} from "@/services/homeService";
import toast from "react-hot-toast";

const PostCard = ({
  postId,
  title,
  excerpt,
  author,
  publishedAt,
  readTime,
  topic,
  slug,
  featuredImage,
  loading = false,
  compact = false,
  className,
  likes = 0,
  views = 0,
  isLiked = false,
  isBookmarked = false,
  showViewCount = true,
  showInteractions = true,
  onLike,
  onBookmark,
  ...props
}) => {
  const [likingInProgress, setLikingInProgress] = useState(false);
  const [bookmarkingInProgress, setBookmarkingInProgress] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleToggleLike = async () => {
    if (!postId) return;
    setLikingInProgress(true);

    try {
      const data = await togglePostLike(postId);
      setLiked(data.liked);
      setLikeCount((prev) => prev + (data.liked ? 1 : -1));

      toast.success(data.liked ? "Đã thích bài viết ❤️" : "Đã bỏ thích 💔");
    } catch (error) {
      console.error("Lỗi khi thích/bỏ thích:", error);
      toast.error("Không thể thay đổi trạng thái thích!");
    } finally {
      setLikingInProgress(false);
    }
  };

  const handleToggleBookmark = async () => {
    try {
      setBookmarkingInProgress(true);

      await toast.promise(togglePostBookmarks(postId), {
        loading: "Đang xử lý bookmark...",
        success: "Cập nhật bookmark thành công 📚",
        error: "Không thể cập nhật bookmark!",
      });

      onBookmark?.();
    } catch (error) {
      console.error("Toggle bookmark failed:", error);
    } finally {
      setBookmarkingInProgress(false);
    }
  };

  useEffect(() => {
    if (!postId) return;

    const fetchLikes = async () => {
      try {
        const data = await getPostLikes(postId);
        setLiked(data.liked);
        setLikeCount(data.count);
      } catch (error) {
        console.error("Lỗi khi tải lượt thích:", error);
      }
    };

    fetchLikes();
  }, [postId]);

  if (loading) {
    return (
      <Card
        className={`${styles.postCard} ${styles.loading} ${className || ""}`}
        variant="default"
        padding="none"
        {...props}
      >
        <div className={styles.skeletonImage} />
        <div className={styles.content}>
          <div className={styles.skeletonBadge} />
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonExcerpt} />
          <div className={styles.skeletonMeta} />
        </div>
      </Card>
    );
  }
  return (
    <Card
      className={`${styles.postCard} ${compact ? styles.compact : ""} ${
        className || ""
      }`}
      variant="default"
      hoverable
      padding="none"
      {...props}
    >
      <div className={styles.imageContainer}>
        <Link to={`/blog/${slug}`}>
          <FallbackImage
            src={featuredImage}
            alt={title}
            className={styles.image}
            lazy={true}
          />
        </Link>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Topic Badge */}
        {topic && Array.isArray(topic) && (
          <div className={styles.topicBadge}>
            {topic.map((t, index) => (
              <Badge key={index} variant="primary" size="sm" className="mr-1">
                {t.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className={styles.title}>
          <Link to={`/blog/${slug}`} className={styles.titleLink}>
            {title}
          </Link>
        </h3>

        {/* Excerpt */}
        {excerpt && <p className={styles.excerpt}>{excerpt}</p>}

        {/* Meta Information */}
        <div className={styles.meta}>
          <div className={styles.author}>
            {author?.avatar && (
              <FallbackImage
                src={author.avatar}
                alt={typeof author.username === "string" ? author.username : ""}
                className={styles.authorAvatar}
                lazy={true}
              />
            )}
            <Link
              to={`/profile/${
                author?.username ||
                author?.username?.toLowerCase().replace(/\s+/g, "-")
              }`}
              className={styles.authorName}
            >
              {author?.username}
            </Link>
          </div>

          <div className={styles.metaInfo}>
            <span className={styles.date}>
              {formatDate(publishedAt || "2025-07-29 10:25:37.000")}
            </span>
            {readTime && (
              <>
                <span className={styles.separator}>•</span>
                <span className={styles.readTime}>{readTime} min read</span>
              </>
            )}
          </div>
        </div>

        {/* Interactions */}
        {showInteractions && (
          <div className={styles.interactions}>
            <div className={styles.stats}>
              {/* View Count */}
              {showViewCount && views > 0 && (
                <span className={styles.stat}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="8"
                      cy="8"
                      r="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  {views}
                </span>
              )}

              {/* Like Count */}
              {likeCount > 0 && (
                <span className={styles.stat}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M14 6.5c0 4.8-5.25 7.5-6 7.5s-6-2.7-6-7.5C2 3.8 4.8 1 8 1s6 2.8 6 5.5z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {likeCount}
                </span>
              )}
            </div>

            <div className={styles.actions}>
              {/* Like Button */}
              <button
                className={`${styles.actionButton} ${
                  liked ? styles.liked : ""
                } ${likingInProgress ? styles.loading : ""}`}
                onClick={handleToggleLike}
                disabled={likingInProgress}
                title={liked ? "Unlike" : "Like"}
                aria-label={`${liked ? "Unlike" : "Like"} this post`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={liked ? "currentColor" : "none"}
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Bookmark Button */}
              <button
                className={`${styles.actionButton} ${
                  isBookmarked ? styles.bookmarked : ""
                } ${bookmarkingInProgress ? styles.loading : ""}`}
                onClick={handleToggleBookmark}
                disabled={bookmarkingInProgress}
                title={isBookmarked ? "Remove bookmark" : "Bookmark"}
                aria-label={`${
                  isBookmarked ? "Remove bookmark from" : "Bookmark"
                } this post`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill={isBookmarked ? "currentColor" : "none"}
                >
                  <path
                    d="M3 1C2.45 1 2 1.45 2 2V15L8 12L14 15V2C14 1.45 13.55 1 13 1H3Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

PostCard.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string.isRequired,
  excerpt: PropTypes.string,
  author: PropTypes.shape({
    avatar: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
  publishedAt: PropTypes.string,
  readTime: PropTypes.number,
  topic: PropTypes.array,
  slug: PropTypes.string,
  featuredImage: PropTypes.string,
  loading: PropTypes.bool,
  compact: PropTypes.bool,
  className: PropTypes.string,
  // New interaction props
  likes: PropTypes.number,
  views: PropTypes.number,
  isLiked: PropTypes.bool,
  isBookmarked: PropTypes.bool,
  showViewCount: PropTypes.bool,
  showInteractions: PropTypes.bool,
  onLike: PropTypes.func,
  onBookmark: PropTypes.func,
};

export default memo(PostCard);
