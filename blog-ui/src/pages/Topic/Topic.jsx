import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import TopicHeader from "../../components/TopicHeader/TopicHeader";
import PostList from "../../components/PostList/PostList";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loading from "../../components/Loading/Loading";
import styles from "./Topic.module.scss";
import { getPostBySlugTopic, getTopicBySlug } from "@/services/postService";

const Topic = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // States
  const [topic, setTopic] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 10;

  // Mock data - replace with actual API calls

  // Fetch topic data
  useEffect(() => {
    const fetchTopic = async () => {
      setLoading(true);
      setError(null);

      try {
        const topic = await getTopicBySlug(slug);
        const data = await getPostBySlugTopic(slug, currentPage, postsPerPage);
        console.log(topic);
        setPosts(data.posts);
        setTotalPages(data.pagination.totalPages);
        setTopic(topic);

        // Calculate total pages
        // setTotalPages(Math.ceil(totalPostsCount / postsPerPage));
      } catch (err) {
        setError("Failed to load topic");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchTopic();
    }
  }, [slug, currentPage]);

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className={styles.topicPage}>
        <div className="container">
          <Loading size="md" text="Loading topic..." />
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className={styles.topicPage}>
        <div className="container">
          <EmptyState
            icon="📚"
            title="Topic not found"
            description="The topic you're looking for doesn't exist or has been removed."
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.topicPage}>
      <div className="container">
        {/* Topic Header */}
        <TopicHeader topic={topic} />

        {/* Posts List */}
        <PostList
          posts={posts}
          loading={postsLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          showPagination={true}
          className={styles.postsList}
        />
      </div>
    </div>
  );
};

export default Topic;
