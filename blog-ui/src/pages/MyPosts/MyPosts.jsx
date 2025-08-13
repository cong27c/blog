import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import PostCard from "../../components/PostCard/PostCard";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loading from "../../components/Loading/Loading";
import Badge from "../../components/Badge/Badge";
import styles from "./MyPosts.module.scss";
import { getMyPosts, getUserBookmarks } from "@/services/homeService";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  // Mock data - trong thực tế sẽ fetch từ API

  useEffect(() => {
    // Simulate API call
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await getMyPosts(page, postsPerPage);
        setPosts(
          res?.map((post) => ({
            ...post,
            author: {
              ...post.author,
              username: post.author.email?.split("@")[0],
              avatar: "https://via.placeholder.com/32?text=You",
            },
          }))
        );

        const computedTotalPages = Math.ceil(res.total / postsPerPage);
        if (page > computedTotalPages) {
          setPage(1);
        }
        setTotalPages(computedTotalPages);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, postsPerPage]);

  const filteredPosts = posts.filter((post) => {
    const matchesTab = activeTab === "all" || post.status === activeTab;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });
  //   console.log(filteredPosts);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      default:
        return "secondary";
    }
  };

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

  const tabs = [
    { key: "all", label: "All Posts", count: posts.length },
    {
      key: "published",
      label: "Published",
      count: posts.filter((p) => p.status === "published").length,
    },
    {
      key: "draft",
      label: "Drafts",
      count: posts.filter((p) => p.status === "draft").length,
    },
  ];
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
            <h1 className={styles.title}>My Posts</h1>
            <p className={styles.subtitle}>
              Manage and track your published articles and drafts
            </p>
          </div>
          <div className={styles.actions}>
            <Link to="/write">
              <Button variant="primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 2V14M2 8H14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Write New Post
              </Button>
            </Link>
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.tab} ${
                  activeTab === tab.key ? styles.tabActive : ""
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                <span className={styles.tabCount}>{tab.count}</span>
              </button>
            ))}
          </div>

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
                placeholder="Search your posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {filteredPosts.length === 0 ? (
            <EmptyState
              title={searchTerm ? "No posts found" : "No posts yet"}
              description={
                searchTerm
                  ? "Try adjusting your search terms or filters"
                  : "Start writing your first blog post to see it here"
              }
              actionButton={
                !searchTerm && (
                  <Link to="/write">
                    <Button variant="primary">Write Your First Post</Button>
                  </Link>
                )
              }
            />
          ) : (
            <div className={styles.postsGrid}>
              {filteredPosts.map((post) => (
                <div key={post.id} className={styles.postItem}>
                  <PostCard
                    postId={post.id}
                    title={post.title}
                    excerpt={post.description}
                    author={post.author}
                    publishedAt={post.published_at}
                    readTime={post.readTime}
                    topic={post.topics}
                    slug={post.slug}
                    featuredImage={post.thumbnail}
                    likes={post.likes_count}
                    views={post.views_count}
                    isBookmarked={bookmarkedPostIds.includes(post.id)}
                    onBookmark={handleUpdateBookmarks}
                  />
                  <div className={styles.postMeta}>
                    <div className={styles.postStatus}>
                      <Badge variant={getStatusBadgeVariant(post.status)}>
                        {post.status}
                      </Badge>
                    </div>
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
                        {post.viewsCount}
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
                        {post.likesCount}
                      </span>
                      <span className={styles.stat}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M14 10c0 .6-.4 1-1 1H4l-3 3V3c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {post.commentsCount}
                      </span>
                    </div>
                    <div className={styles.postActions}>
                      <Link
                        to={`/write/${post.slug}`}
                        className={styles.actionButton}
                        title="Edit post"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M11.333 2a1.885 1.885 0 012.667 2.667L4.667 14 1 14.333l.333-3.666L11.333 2z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>Edit</span>
                      </Link>

                      {post.status === "published" && (
                        <Link
                          to={`/blog/${post.slug}`}
                          className={styles.gradientButton}
                          title="View post"
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
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPosts;
