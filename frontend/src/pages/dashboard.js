import React from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '../contexts/AuthContext';
import Link from '@docusaurus/Link';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';
import AnimatedCard from '../components/AnimatedCard';
import clsx from 'clsx';

function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <Layout title="Dashboard" description="User dashboard">
        <AnimatedSection className="py-16">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
                  <p className="text-gray-600 mb-6">
                    Please sign in to access your dashboard.
                  </p>
                  <Link
                    to="/auth/login"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </Layout>
    );
  }

  const dashboardFeatures = [
    {
      title: 'AI Assistant',
      description: 'Access your personalized AI assistant for textbook content',
      icon: '🤖',
      link: '/ai-chatbot'
    },
    {
      title: 'Learning Progress',
      description: 'Track your progress through the textbook chapters',
      icon: '📚',
      link: '/docs'
    },
    {
      title: 'Saved Content',
      description: 'View and manage your saved notes and bookmarks',
      icon: '📝',
      link: '/docs'
    },
    {
      title: 'Learning Analytics',
      description: 'Review your learning statistics and insights',
      icon: '📊',
      link: '/docs'
    }
  ];

  return (
    <Layout title="Dashboard" description="Your personalized AI textbook dashboard">
      <AnimatedSection className="py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Welcome back, {user.username}!
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your personalized dashboard for AI textbook learning and resources
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {dashboardFeatures.map((feature, index) => (
                <AnimatedCard
                  key={index}
                  delay={index * 0.1}
                  className="p-6 text-center hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{feature.description}</p>
                  <Link
                    to={feature.link}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Access
                  </Link>
                </AnimatedCard>
              ))}
            </div>

            <AnimatedCard className="p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">AI Assistant Chat</h3>
                    <p className="text-sm text-gray-600">Last used 2 hours ago</p>
                  </div>
                  <Link to="/ai-chatbot" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Continue
                  </Link>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Chapter Progress</h3>
                    <p className="text-sm text-gray-600">ROS 2 Fundamentals - 75% complete</p>
                  </div>
                  <Link to="/docs/ch3-ros-2-fundamentals" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Continue
                  </Link>
                </div>
              </div>
            </AnimatedCard>

            <div className="text-center">
              <button
                onClick={logout}
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>
    </Layout>
  );
}

export default DashboardPage;