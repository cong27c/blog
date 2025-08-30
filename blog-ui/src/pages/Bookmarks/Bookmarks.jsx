import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PostCard from "../../components/PostCard/PostCard";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loading from "../../components/Loading/Loading";
import Badge from "../../components/Badge/Badge";
import Button from "../../components/Button/Button";
import styles from "./Bookmarks.module.scss";
import {
  clearAllBookmarks,
  getMyPostBookmarked,
  getUserBookmarks,
  togglePostBookmarks,
} from "@/services/homeService";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 10;

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const result = await getMyPostBookmarked(page, postsPerPage);
      console.log(result);
      setBookmarks(result?.data);
      setTotalPages(Math.ceil(result?.total / postsPerPage));
    } catch (error) {
      console.error("Fetch bookmarks failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi khi mount và khi cập nhật bookmark
  useEffect(() => {
    fetchBookmarks();
  }, [page]);

  // Get all unique topics from bookmarks
  const availableTopics = [
    ...new Set(bookmarks.flatMap((bookmark) => bookmark.topics)),
  ].sort();

  const handleRemoveBookmark = (bookmarkId) => {
    setBookmarks((prev) =>
      prev.filter((bookmark) => bookmark.id !== bookmarkId)
    );
  };

  const handleClearAllBookmarks = async () => {
    if (window.confirm("Are you sure you want to remove all bookmarks?")) {
      await clearAllBookmarks();
      setBookmarks([]);
      setTotalPages(0);
    }
  };

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

  if (loading) {
    return (
      <div className={styles.container}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>My Bookmarks</h1>
            <p className={styles.subtitle}>
              {bookmarks.length} saved{" "}
              {bookmarks.length === 1 ? "article" : "articles"}
            </p>
          </div>
          {bookmarks.length > 0 && (
            <div className={styles.actions}>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleClearAllBookmarks}
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        {bookmarks.length > 0 && (
          <div className={styles.controls}>
            <div className={styles.searchContainer}>
              <div className={styles.searchInput}>
                <svg
                  className={styles.searchIcon}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M7.333 12.667A5.333 5.333 0 100 7.333a5.333 5.333 0 000 5.334zM14 14l-2.9-2.9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.filterContainer}>
              <label className={styles.filterLabel}>Filter by topic:</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className={styles.topicFilter}
              >
                <option value="all">All Topics</option>
                {availableTopics.map((topic, index) => (
                  <option key={index} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className={styles.content}>
          {bookmarks.length === 0 ? (
            <EmptyState
              title={
                bookmarks.length === 0
                  ? "No bookmarks yet"
                  : searchTerm || selectedTopic !== "all"
                  ? "No bookmarks found"
                  : "No bookmarks"
              }
              description={
                bookmarks.length === 0
                  ? "Start bookmarking articles you want to read later"
                  : "Try adjusting your search terms or filters"
              }
              actionButton={
                bookmarks.length === 0 && (
                  <Link to="/">
                    <Button variant="primary">Explore Articles</Button>
                  </Link>
                )
              }
            />
          ) : (
            <div className={styles.bookmarksGrid}>
              {console.log(bookmarks)}
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className={styles.bookmarkItem}>
                  <PostCard
                    postId={bookmark.id}
                    title={bookmark.title}
                    excerpt={bookmark.description}
                    author={bookmark.author}
                    publishedAt={bookmark.published_at}
                    readTime={bookmark.readTime}
                    topic={bookmark.topic}
                    slug={bookmark.slug}
                    featuredImage={bookmark.thumbnail}
                    likes={bookmark.likes_count}
                    views={bookmark.views_count}
                    isBookmarked={true}
                    onBookmark={fetchBookmarks}
                  />
                  <div className={styles.bookmarkMeta}>
                    <div className={styles.bookmarkInfo}>
                      <span className={styles.bookmarkedDate}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M3 1C2.45 1 2 1.45 2 2V15L8 12L14 15V2C14 1.45 13.55 1 13 1H3Z"
                            fill="currentColor"
                          />
                        </svg>
                        Saved{" "}
                        {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
                      </span>
                      <div className={styles.postStats}>
                        <span className={styles.stat}>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
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
                          {bookmark.viewsCount}
                        </span>
                        <span className={styles.stat}>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M14 6.5c0 4.8-5.25 7.5-6 7.5s-6-2.7-6-7.5C2 3.8 4.8 1 8 1s6 2.8 6 5.5z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {bookmark.likesCount}
                        </span>
                      </div>
                    </div>
                    <div className={styles.bookmarkActions}>
                      <Link
                        to={`/blog/${bookmark.slug}`}
                        className={styles.actionButton}
                        title="Read article"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M6 12l6-6-6-6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleRemoveBookmark(bookmark.id)}
                        className={`${styles.actionButton} ${styles.removeButton}`}
                        title="Remove bookmark"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M12 4L4 12M4 4l8 8"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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
                  onClick={() => setPage(p)}
                  className={`${styles.pageButton} ${
                    page === p ? styles.activePage : ""
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={styles.pageButton}
            >
              &raquo;
            </button>
          </div>
        )}

        {bookmarks.length > 0 && (
          <div className={styles.resultsInfo}>
            <p className={styles.resultsText}>
              Showing {bookmarks.length} of {bookmarks.length} bookmarks
              {selectedTopic !== "all" && (
                <Badge variant="secondary" className={styles.activeTopic}>
                  {selectedTopic}
                  <button
                    onClick={() => setSelectedTopic("all")}
                    className={styles.clearFilter}
                  >
                    ×
                  </button>
                </Badge>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
