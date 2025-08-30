import { useState, useEffect } from "react";
import TopicList from "../../components/TopicList/TopicList";
import Loading from "../../components/Loading/Loading";
import styles from "./TopicsListing.module.scss";
import { getAllTopics } from "@/services/homeService";

const TopicsListing = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Mock data - replace with API call

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);

      try {
        const res = await getAllTopics(page, postsPerPage);
        console.log(res);

        setTopics(
          res.items?.map((topic) => ({
            ...topic,
            posts_count: topic.posts.length,
          }))
        );
        const computedTotalPages = Math.ceil(res.total / postsPerPage);
        if (page > computedTotalPages) {
          setPage(1);
        }
        setTotalPages(computedTotalPages);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [page, postsPerPage]);

  const handlePageClick = (pageNumber) => {
    if (pageNumber !== page) {
      setPage(pageNumber);
    }
  };

  const renderPageNumbers = () => {
    const numbers = [];
    const maxButtons = 5;
    let start = Math.max(1, page - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      numbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`${styles.pageNumber} ${i === page ? styles.active : ""}`}
        >
          {i}
        </button>
      );
    }
    return numbers;
  };
  if (loading) {
    return (
      <div className={styles.topicsListing}>
        <div className="container">
          <Loading size="md" text="Loading topics..." />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.topicsListing}>
      <div className="container">
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>All Topics</h1>
          <p className={styles.description}>
            Explore all available topics and find content that interests you.
          </p>
        </header>

        <section className={styles.content}>
          <TopicList topics={topics} loading={loading} />
        </section>
        {/* pagination */}
        <div className={styles.pagination}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={styles.pageNav}
          >
            ←
          </button>

          {renderPageNumbers()}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={styles.pageNav}
          >
            →
          </button>

          {/* Select posts per page */}
          <select
            value={postsPerPage}
            onChange={(e) => {
              setPostsPerPage(Number(e.target.value));
              setPage(1); // reset to page 1
            }}
            className={styles.pageSizeSelector}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default TopicsListing;
