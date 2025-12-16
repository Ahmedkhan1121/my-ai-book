import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';
import AnimatedCard from '../components/AnimatedCard';
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
    <AnimatedSection className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero__title text-4xl md:text-5xl font-bold mb-4">
            AI Robotics Blog
          </h1>
          <p className="hero__subtitle text-xl md:text-2xl text-gray-700">
            Stay updated with the latest insights, research, and developments in AI-powered robotics
          </p>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

function BlogPostCard({ post, index }) {
  return (
    <AnimatedCard
      delay={index * 0.1}
      className="p-6 hover:shadow-xl transition-shadow duration-300 mb-6"
    >
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
          <a
            href={`/blog/${post.id}`}
            className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            {post.title}
          </a>
        </h2>
        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-3">
          <span className="mr-4">{post.date}</span>
          <span className="mr-4">by {post.author}</span>
          <span>{post.readTime}</span>
        </div>
      </div>
      <p className="text-gray-600 mb-4 leading-relaxed">
        {post.excerpt}
      </p>
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </AnimatedCard>
  );
}

function BlogFilter({ selectedCategory, onCategoryChange }) {
  const categories = ['All', 'AI', 'Robotics', 'Humanoid', 'ROS', 'Simulation', 'VLA', 'Development'];

  return (
    <AnimatedCard className="p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </AnimatedCard>
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
      <main className="py-12">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <AnimatedSection>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post, index) => (
                    <BlogPostCard key={post.id} post={post} index={index} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No posts found in this category.</p>
                  </div>
                )}
              </AnimatedSection>
            </div>

            <div className="lg:col-span-1">
              <AnimatedSection>
                <div className="space-y-6">
                  <BlogFilter
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />

                  <AnimatedCard className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Blog</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Welcome to our AI Robotics blog! Here you'll find the latest research,
                      technical insights, and industry updates related to artificial intelligence
                      and robotics. Our team of experts shares knowledge on topics ranging from
                      humanoid robotics to ROS development and AI integration.
                    </p>
                  </AnimatedCard>

                  <AnimatedCard className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
                    <ul className="space-y-3">
                      {blogPosts.slice(0, 3).map((post) => (
                        <li key={post.id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                          <a
                            href={`/blog/${post.id}`}
                            className="text-blue-600 hover:text-blue-700 hover:underline text-sm block mb-1"
                          >
                            {post.title}
                          </a>
                          <span className="text-xs text-gray-500">{post.date}</span>
                        </li>
                      ))}
                    </ul>
                  </AnimatedCard>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default BlogPage;