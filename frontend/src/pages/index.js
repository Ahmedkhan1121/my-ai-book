import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/ch1-introduction-to-physical-ai">
            Read Textbook 📚
          </Link>
          <Link
            className="button button--primary button--lg"
            to="/blog"
            style={{ marginLeft: '1rem' }}>
            Read Blog 📝
          </Link>
        </div>
      </div>
    </header>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <div className={clsx('col col--4')}>
            <div className="text--center padding-horiz--md">
              <h3>Physical AI</h3>
              <p>Learn about the intersection of artificial intelligence and physical systems.</p>
            </div>
          </div>
          <div className={clsx('col col--4')}>
            <div className="text--center padding-horiz--md">
              <h3>Humanoid Robotics</h3>
              <p>Explore the fundamentals of humanoid robot design and control.</p>
            </div>
          </div>
          <div className={clsx('col col--4')}>
            <div className="text--center padding-horiz--md">
              <h3>ROS 2 & Simulation</h3>
              <p>Master ROS 2 frameworks and digital twin simulation techniques.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomepageAIAssistant() {
  return (
    <section className={styles.aiAssistant}>
      <div className="container padding-vert--xl text--center">
        <h2>AI Robotics Assistant</h2>
        <p>Need help with robotics concepts? Chat with our AI assistant!</p>
        <Link
          className="button button--primary button--lg"
          to="/ai-chatbot">
          Talk to AI Assistant 🤖
        </Link>
      </div>
    </section>
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