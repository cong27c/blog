import PropTypes from "prop-types";
import PostCard from "../PostCard/PostCard";
import EmptyState from "../EmptyState/EmptyState";
import styles from "./RelatedPosts.module.scss";
import { useEffect, useState } from "react";
import { getUserBookmarks } from "@/services/homeService";

const RelatedPosts = ({
  posts = [],
  loading = false,
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
    const bookmarks = await getUserBookmarks();
    setBookmarkedPostIds(bookmarks.data?.map((p) => p.id));
  };
  const displayPosts = posts.slice(0, maxPosts);

  if (loading) {
    return (
      <section
        className={`${styles.relatedPosts} ${className || ""}`}
        {...props}
      >
        <h2 className={styles.title}>Related Posts</h2>
        <div className={styles.grid}>
          {Array.from({ length: maxPosts }, (_, index) => (
            <PostCard key={index} loading />
          ))}
        </div>
      </section>
    );
  }

  if (displayPosts.length === 0) {
    return (
      <section
        className={`${styles.relatedPosts} ${className || ""}`}
        {...props}
      >
        <h2 className={styles.title}>Related Posts</h2>
        <EmptyState
          icon="📰"
          title="No related posts"
          description="Check back later for more content on this topic."
        />
      </section>
    );
  }

  return (
    <section className={`${styles.relatedPosts} ${className || ""}`} {...props}>
      <h2 className={styles.title}>Related Posts</h2>
      <div className={styles.grid}>
        {displayPosts.map((post) => (
          <div key={post.id || post.slug} className={styles.postItem}>
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
          </div>
        ))}
      </div>
    </section>
  );
};

RelatedPosts.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      featuredImage: PropTypes.string,
      author: PropTypes.shape({
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string,
      }),
      publishedAt: PropTypes.string,
      readTime: PropTypes.number,
      topic: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  maxPosts: PropTypes.number,
  className: PropTypes.string,
};

export default RelatedPosts;
