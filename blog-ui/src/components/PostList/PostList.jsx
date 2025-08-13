import PropTypes from "prop-types";
import PostCard from "../PostCard/PostCard";
import Pagination from "../Pagination/Pagination";
import EmptyState from "../EmptyState/EmptyState";
import Loading from "../Loading/Loading";
import styles from "./PostList.module.scss";
import { useEffect, useState } from "react";
import { getUserBookmarks } from "@/services/homeService";

const PostList = ({
  posts = [],
  loading = false,
  page = 1,
  totalPages = 1,
  onPageChange,
  showPagination = true,
  layout = "grid",
  className,
  ...props
}) => {
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const bookmarks = await getUserBookmarks();
      setBookmarkedPostIds(bookmarks.data?.map((p) => p.id));
    };
    fetchData();
  }, []);

  const handleUpdateBookmarks = async () => {
    const bookmarks = await getUserBookmarks(); // gọi lại sau khi toggle
    setBookmarkedPostIds(bookmarks.data?.map((p) => p.id));
  };

  if (loading) {
    return (
      <div className={`${styles.postList} ${className || ""}`} {...props}>
        <Loading size="md" text="Loading posts..." />
      </div>
    );
  }

  function getPagination(currentPage, totalPages) {
    const delta = 2;
    const range = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);

    return range;
  }

  if (!posts.length) {
    return (
      <div className={`${styles.postList} ${className || ""}`} {...props}>
        <EmptyState
          title="No posts found"
          description="There are no posts available for this topic."
          icon="📝"
        />
      </div>
    );
  }

  return (
    <div className={`${styles.postList} ${className || ""}`} {...props}>
      <div className={`${styles.postsContainer} ${styles[layout]}`}>
        {posts.map((post) => (
          <div key={post.id || post.slug} className={styles.postItem}>
            <PostCard
              postId={post.id}
              title={post.title}
              excerpt={post.description}
              author={post.author}
              publishedAt={post.published_at}
              readTime={post.readTime}
              topic={post.topic}
              slug={post.slug}
              featuredImage={post.thumbnail}
              likes={post.likes_count}
              views={post.views_count}
              isBookmarked={bookmarkedPostIds.includes(post.id)}
              onBookmark={handleUpdateBookmarks}
            />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => onPageChange((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={styles.pageButton}
          >
            &laquo;
          </button>

          {getPagination(page, totalPages).map((p, idx) =>
            p === "..." ? (
              <span key={idx} className={styles.ellipsis}>
                ...
              </span>
            ) : (
              <button
                key={idx}
                onClick={() => onPageChange(p)}
                className={`${styles.pageButton} ${
                  page === p ? styles.activePage : ""
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() =>
              onPageChange((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={page === totalPages}
            className={styles.pageButton}
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

PostList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      author: PropTypes.shape({
        username: PropTypes.string,
        avatar: PropTypes.string,
      }).isRequired,
      publishedAt: PropTypes.string,
      readTime: PropTypes.number,
      topic: PropTypes.array,
      slug: PropTypes.string.isRequired,
      featuredImage: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  page: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,
  showPagination: PropTypes.bool,
  layout: PropTypes.oneOf(["grid", "list"]),
  className: PropTypes.string,
};

export default PostList;
