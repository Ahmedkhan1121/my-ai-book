import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <AnimatedSection className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero__title text-4xl md:text-5xl font-bold mb-4">
            {siteConfig.title}
          </h1>
          <p className="hero__subtitle text-xl md:text-2xl mb-8 text-gray-700">
            {siteConfig.tagline}
          </p>
          <div className={styles.buttons}>
            <AnimatedButton
              variant="secondary"
              size="lg"
              as={Link}
              to="/docs/ch1-introduction-to-physical-ai"
              className="mr-4 mb-4 md:mb-0"
            >
              Read Textbook 📚
            </AnimatedButton>
            <AnimatedButton
              variant="primary"
              size="lg"
              as={Link}
              to="/blog"
            >
              Read Blog 📝
            </AnimatedButton>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

function HomepageFeatures() {
  const features = [
    {
      title: 'Physical AI',
      description: 'Learn about the intersection of artificial intelligence and physical systems.',
      icon: '🤖'
    },
    {
      title: 'Humanoid Robotics',
      description: 'Explore the fundamentals of humanoid robot design and control.',
      icon: '🦾'
    },
    {
      title: 'ROS 2 & Simulation',
      description: 'Master ROS 2 frameworks and digital twin simulation techniques.',
      icon: '🔧'
    }
  ];

  return (
    <AnimatedSection className={styles.features}>
      <div className="container px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Key Learning Areas
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Comprehensive coverage of modern AI and robotics concepts
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimatedCard
              key={index}
              delay={index * 0.1}
              className="p-8 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function HomepageAIAssistant() {
  return (
    <AnimatedSection className={styles.aiAssistant}>
      <div className="container px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12"
          >
            <div className="text-5xl mb-6">🤖</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AI Robotics Assistant
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Need help with robotics concepts? Chat with our AI assistant powered by textbook knowledge!
            </p>
            <AnimatedButton
              variant="primary"
              size="lg"
              as={Link}
              to="/ai-chatbot"
            >
              Talk to AI Assistant 🤖
            </AnimatedButton>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Physical AI & Humanoid Robotics — Essentials: A short, clean, professional AI-Native textbook">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <HomepageAIAssistant />
      </main>
    </Layout>
  );
}