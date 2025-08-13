import PropTypes from "prop-types";
import PostCard from "../PostCard/PostCard";
import EmptyState from "../EmptyState/EmptyState";
import Loading from "../Loading/Loading";
import styles from "./FeaturedPosts.module.scss";
import { getUserBookmarks } from "@/services/homeService";
import { useEffect, useState } from "react";

const FeaturedPosts = ({
  posts = [],
  loading = false,
  title = "Featured Posts",
  showTitle = true,
  maxPosts = 3,
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
      <section
        className={`${styles.featuredPosts} ${className || ""}`}
        {...props}
      >
        {showTitle && <h2 className={styles.title}>{title}</h2>}
        <Loading size="md" text="Loading featured posts..." />
      </section>
    );
  }

  if (!posts.length) {
    return (
      <section
        className={`${styles.featuredPosts} ${className || ""}`}
        {...props}
      >
        {showTitle && <h2 className={styles.title}>{title}</h2>}
        <EmptyState
          title="No featured posts"
          description="There are no featured posts available at the moment."
          icon="⭐"
        />
      </section>
    );
  }

  const displayPosts = posts.slice(0, maxPosts);

  return (
    <section
      className={`${styles.featuredPosts} ${className || ""}`}
      {...props}
    >
      {showTitle && <h2 className={styles.title}>{title}</h2>}

      <div className={styles.postsGrid}>
        {displayPosts.length > 0 &&
          displayPosts.map((post, index) => (
            <div
              key={post.id || post.slug}
              className={`${styles.postItem} ${
                index === 0 ? styles.featured : ""
              }`}
            >
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
    </section>
  );
};

FeaturedPosts.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      author: PropTypes.shape({
        username: PropTypes.string.isRequired,
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
  title: PropTypes.string,
  showTitle: PropTypes.bool,
  maxPosts: PropTypes.number,
  className: PropTypes.string,
};

export default FeaturedPosts;
