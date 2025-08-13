import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  BlogContent,
  AuthorInfo,
  RelatedPosts,
  CommentSection,
  Loading,
} from "../../components";
import styles from "./BlogDetail.module.scss";
import {
  createComment,
  deleteComment,
  getBlogPost,
  getPostComments,
  getRelatedPosts,
  incrementView,
  replyToComment,
  toggleCommentLike,
  updateComment,
} from "@/services/blogService";
import {
  getPostLikes,
  getUserBookmarks,
  togglePostBookmarks,
  togglePostLike,
} from "@/services/homeService";
import toast from "react-hot-toast";

const BlogDetail = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const postId = post?.id;
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [isAuthenticated] = useState(true); // Mock authentication

  // Like and bookmark states
  const [views, setViews] = useState(1); // Mock views
  const [likingInProgress, setLikingInProgress] = useState(false);
  const [bookmarkingInProgress, setBookmarkingInProgress] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState([]);
  const isBookmarked = bookmarkedPostIds.includes(postId);

  const handleToggleLike = async () => {
    if (!postId || likingInProgress) return; // chặn spam
    setLikingInProgress(true); // thêm dòng này

    try {
      const data = await togglePostLike(postId);
      setLiked(data.liked);
      setLikeCount((prev) => prev + (data.liked ? 1 : -1));
    } catch (error) {
      console.error("Lỗi khi thích/bỏ thích:", error);
    } finally {
      setLikingInProgress(false);
    }
  };
  const handleToggleBookmark = async () => {
    if (bookmarkingInProgress) return;
    setBookmarkingInProgress(true);

    try {
      await togglePostBookmarks(postId);

      setBookmarkedPostIds((prev) => {
        if (prev.includes(postId)) {
          return prev.filter((id) => id !== postId);
        } else {
          return [...prev, postId];
        }
      });
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookmarks = await getUserBookmarks();
        setBookmarkedPostIds((prev) => {
          if (prev.includes(postId)) {
            return prev.filter((id) => id !== postId);
          } else {
            return [...prev, postId];
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Simulate API call
    const loadPost = async () => {
      setLoading(true);
      try {
        console.log(slug);
        const blogPost = await getBlogPost(slug);
        if (!blogPost) {
          setLoading(false);
          return;
        }
        const relatedPosts = await getRelatedPosts(
          Array.isArray(blogPost.topics) ? blogPost.topics : [],
          blogPost?.id
        );

        const commentsByPost = await getPostComments(slug);
        setPost(blogPost);
        setRelatedPosts(relatedPosts);
        setViews(blogPost.views);
        setComments(commentsByPost.comments);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  useEffect(() => {
    if (!postId) return;

    const timeout = setTimeout(() => {
      const sendView = async () => {
        try {
          const result = await incrementView(postId);
          setViews(result.views);
        } catch (err) {
          console.error("Failed to increment view", err);
        }
      };
      sendView();
    }, 30000); // 30 giây

    return () => clearTimeout(timeout);
  }, [postId]);
  const handleAddComment = async (content) => {
    try {
      const newComment = await createComment(postId, content);
      setComments((prev) => [newComment, ...prev]);
      toast.success("Bình luận đã được thêm!");
    } catch (error) {
      console.error(error);
      toast.error("Không thể thêm bình luận.");
    }
  };

  const handleReplyComment = async (parentId, content) => {
    try {
      const newReply = await replyToComment({ parentId, postId, content });
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === parentId) {
            return { ...comment, replies: [...comment.replies, newReply] };
          }
          const isParentLevel2 = comment.replies.some((r) => r.id === parentId);
          if (isParentLevel2) {
            return { ...comment, replies: [...comment.replies, newReply] };
          }
          return comment;
        })
      );
      toast.success("Đã trả lời bình luận!");
    } catch (error) {
      console.error(error);
      toast.error("Không thể trả lời bình luận.");
    }
  };

  function updateCommentLike(comments, commentId, liked, likeCount) {
    return comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, isLiked: liked, likes: likeCount };
      }
      if (comment.replies?.length > 0) {
        return {
          ...comment,
          replies: updateCommentLike(
            comment.replies,
            commentId,
            liked,
            likeCount
          ),
        };
      }
      return comment;
    });
  }

  const handleLikeComment = async (commentId) => {
    try {
      const data = await toggleCommentLike(commentId);
      setComments((prev) =>
        updateCommentLike(prev, commentId, data.liked, data.likeCount)
      );
      toast.success(data.liked ? "Đã thích bình luận!" : "Bỏ thích bình luận!");
    } catch (error) {
      console.error(error);
      toast.error("Không thể thay đổi trạng thái thích.");
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      const newComment = await updateComment(commentId, newContent);
      const updateCommentRecursively = (comments) =>
        comments.map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, content: newComment.content, isEdited: true };
          }
          if (comment.replies?.length > 0) {
            return {
              ...comment,
              replies: updateCommentRecursively(comment.replies),
            };
          }
          return comment;
        });

      setComments((prevComments) => updateCommentRecursively(prevComments));
      toast.success("Bình luận đã được chỉnh sửa!");
    } catch (error) {
      console.error(error);
      toast.error("Không thể chỉnh sửa bình luận.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await deleteComment(commentId);
      if (!response) {
        toast.error("Xóa bình luận thất bại.");
        return;
      }

      const deleteCommentRecursively = (comments) =>
        comments
          .filter((comment) => comment.id !== commentId)
          .map((comment) => {
            if (comment.replies?.length > 0) {
              return {
                ...comment,
                replies: deleteCommentRecursively(comment.replies),
              };
            }
            return comment;
          });

      setComments((prev) => deleteCommentRecursively(prev));
      toast.success("Bình luận đã được xóa!");
    } catch (error) {
      console.error(error);
      toast.error("Không thể xóa bình luận.");
    }
  };
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading size="md" text="Loading article..." />
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.notFoundContainer}>
        <h1>Article not found</h1>
        <p>
          The article you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Article Header with Interactions */}
      <div className={styles.articleHeader}>
        <BlogContent {...post} />

        {/* Post Interactions - Moved to top for better UX */}
        <div className={styles.interactions}>
          {/* Stats */}
          <div className={styles.stats}>
            {/* Views */}
            <div className={styles.stat}>
              <svg viewBox="0 0 16 16" fill="none">
                <path
                  d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="8" cy="8" r="2" />
              </svg>
              <span>{views} views</span>
            </div>

            {/* Likes */}
            <div className={styles.stat}>
              <svg viewBox="0 0 16 16" fill="none">
                <path
                  d="M14 6.5c0 4.8-5.25 7.5-6 7.5s-6-2.7-6-7.5C2 3.8 4.8 1 8 1s6 2.8 6 5.5z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{likeCount} likes</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            {/* Like Button */}
            <button
              className={`${styles.actionButton} ${liked ? styles.liked : ""} ${
                likingInProgress ? styles.loading : ""
              }`}
              onClick={handleToggleLike}
              disabled={likingInProgress}
              title={liked ? "Unlike" : "Like"}
              aria-label={`${liked ? "Unlike" : "Like"} this post`}
            >
              <svg viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"}>
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {liked ? "Liked" : "Like"}
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
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </button>
          </div>
        </div>
      </div>

      {/* Author Info */}
      <div className={styles.authorSection}>
        <AuthorInfo author={post.author} />
      </div>

      {/* Related Posts */}
      <div className={styles.contentSection}>
        <RelatedPosts posts={relatedPosts} />
      </div>

      {/* Comments */}
      <div className={styles.contentSection}>
        <CommentSection
          comments={comments}
          onAddComment={handleAddComment}
          onReplyComment={handleReplyComment}
          onLikeComment={handleLikeComment}
          onEditComment={handleEditComment}
          onDeleteComment={handleDeleteComment}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  );
};

export default BlogDetail;
