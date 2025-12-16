import React from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '../contexts/AuthContext';
import Link from '@docusaurus/Link';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';
import AnimatedCard from '../components/AnimatedCard';

function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <Layout title="Profile" description="User profile page">
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
                    Please sign in to access your profile.
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

  return (
    <Layout title="Profile" description="Your user profile">
      <AnimatedSection className="py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👤</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {user.username}
                </h1>
                <p className="text-gray-600">Member since {user.created_at ? new Date(user.created_at).toLocaleDateString() : '2024'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <AnimatedCard className="p-6 text-center">
                  <div className="text-3xl mb-2">📚</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Learning Modules</h3>
                  <p className="text-2xl font-bold text-blue-600">5</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </AnimatedCard>

                <AnimatedCard className="p-6 text-center">
                  <div className="text-3xl mb-2">💬</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">AI Chats</h3>
                  <p className="text-2xl font-bold text-blue-600">24</p>
                  <p className="text-sm text-gray-600">This month</p>
                </AnimatedCard>

                <AnimatedCard className="p-6 text-center">
                  <div className="text-3xl mb-2">🏆</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Achievements</h3>
                  <p className="text-2xl font-bold text-blue-600">8</p>
                  <p className="text-sm text-gray-600">Badges earned</p>
                </AnimatedCard>
              </div>

              <AnimatedCard className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <p className="text-gray-900">{user.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <p className="text-gray-900">{user.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                    <p className="text-gray-900">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '2024'}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/dashboard"
                    className="flex-1 bg-gray-100 text-gray-800 px-6 py-3 rounded-xl font-medium text-center hover:bg-gray-200 transition-colors duration-200"
                  >
                    Back to Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </AnimatedCard>
            </div>
          </motion.div>
        </div>
      </AnimatedSection>
    </Layout>
  );
}

export default ProfilePage;