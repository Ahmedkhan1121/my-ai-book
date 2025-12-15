import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import styles from './blog.module.css';

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: 'The Future of Physical AI in Robotics',
    excerpt: 'Exploring how physical AI is transforming the robotics industry and enabling more sophisticated autonomous systems.',
    date: '2024-01-15',
    author: 'AI Robotics Team',
    readTime: '5 min read',
    tags: ['AI', 'Robotics', 'Physical AI']
  },
  {
    id: 2,
    title: 'Advancements in Humanoid Robot Locomotion',
    excerpt: 'Recent breakthroughs in bipedal walking algorithms and their impact on humanoid robot mobility.',
    date: '2024-01-10',
    author: 'Dr. Sarah Johnson',
    readTime: '7 min read',
    tags: ['Humanoid', 'Locomotion', 'Control']
  },
  {
    id: 3,
    title: 'ROS 2: A Game Changer for Robotic Applications',
    excerpt: 'How ROS 2 is revolutionizing robot software development with improved security, real-time capabilities, and multi-robot systems.',
    date: '2024-01-05',
    author: 'ROS Development Team',
    readTime: '6 min read',
    tags: ['ROS', 'Software', 'Development']
  },
  {
    id: 4,
    title: 'Digital Twins in Robotics: Bridging Simulation and Reality',
    excerpt: 'The role of digital twin technology in accelerating robot development and deployment cycles.',
    date: '2023-12-28',
    author: 'Simulation Experts',
    readTime: '8 min read',
    tags: ['Simulation', 'Digital Twin', 'Gazebo']
  },
  {
    id: 5,
    title: 'Vision-Language-Action Systems: The Next Frontier',
    excerpt: 'Understanding how VLA systems are enabling more natural human-robot interaction.',
    date: '2023-12-20',
    author: 'Computer Vision Team',
    readTime: '6 min read',
    tags: ['VLA', 'Computer Vision', 'NLP']
  },
  {
    id: 6,
    title: 'Building Robust AI-Robot Pipelines',
    excerpt: 'Best practices for creating reliable and efficient AI-robot integration systems.',
    date: '2023-12-15',
    author: 'Engineering Team',
    readTime: '9 min read',
    tags: ['Pipeline', 'Integration', 'Best Practices']
  }
];

function BlogHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">AI Robotics Blog</h1>
        <p className="hero__subtitle">Stay updated with the latest insights, research, and developments in AI-powered robotics</p>
      </div>
    </header>
  );
}

function BlogPostCard({ post }) {
  return (
    <article className={clsx('margin-bottom--lg', styles.blogPostCard)}>
      <div className={styles.blogPostHeader}>
        <h2 className={styles.blogPostTitle}>
          <a href={`/blog/${post.id}`} className={styles.blogPostLink}>
            {post.title}
          </a>
        </h2>
        <div className={styles.blogPostMeta}>
          <span className={styles.blogPostDate}>{post.date}</span>
          <span className={styles.blogPostAuthor}>by {post.author}</span>
          <span className={styles.blogPostReadTime}>{post.readTime}</span>
        </div>
      </div>
      <p className={styles.blogPostExcerpt}>{post.excerpt}</p>
      <div className={styles.blogPostTags}>
        {post.tags.map((tag, index) => (
          <span key={index} className={styles.blogPostTag}>
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

function BlogFilter({ selectedCategory, onCategoryChange }) {
  const categories = ['All', 'AI', 'Robotics', 'Humanoid', 'ROS', 'Simulation', 'VLA', 'Development'];

  return (
    <div className={styles.blogFilter}>
      <h3 className={styles.filterTitle}>Filter by Category</h3>
      <div className={styles.filterButtons}>
        {categories.map((category) => (
          <button
            key={category}
            className={clsx(styles.filterButton, {
              [styles.filterButtonActive]: selectedCategory === category,
            })}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredPosts(blogPosts);
    } else {
      const filtered = blogPosts.filter(post =>
        post.tags.includes(selectedCategory)
      );
      setFilteredPosts(filtered);
    }
  }, [selectedCategory]);

  return (
    <Layout title="AI Robotics Blog" description="Latest insights and research in AI-powered robotics">
      <BlogHeader />
      <main className="container margin-vert--lg">
        <div className={styles.blogPage}>
          <div className={styles.blogContent}>
            <div className={styles.blogPosts}>
              <h2 className={styles.sectionTitle}>Latest Articles</h2>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))
              ) : (
                <div className={styles.noPosts}>
                  <p>No posts found in this category.</p>
                </div>
              )}
            </div>
          </div>
          <div className={styles.blogSidebar}>
            <BlogFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>About This Blog</h3>
              <p className={styles.sidebarText}>
                Welcome to our AI Robotics blog! Here you'll find the latest research,
                technical insights, and industry updates related to artificial intelligence
                and robotics. Our team of experts shares knowledge on topics ranging from
                humanoid robotics to ROS development and AI integration.
              </p>
            </div>

            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>Recent Posts</h3>
              <ul className={styles.recentPosts}>
                {blogPosts.slice(0, 3).map((post) => (
                  <li key={post.id} className={styles.recentPostItem}>
                    <a href={`/blog/${post.id}`} className={styles.recentPostLink}>
                      {post.title}
                    </a>
                    <span className={styles.recentPostDate}>{post.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default BlogPage;