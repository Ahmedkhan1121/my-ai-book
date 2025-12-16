import React, { useState, useRef, useEffect } from 'react';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from '../components/AnimatedSection';
import AnimatedCard from '../components/AnimatedCard';
import styles from './ai-chatbot.module.css';

// API configuration
const API_BASE_URL = typeof window !== 'undefined'
  ? `${window.location.origin}/api`
  : process.env.API_BASE_URL || 'http://localhost:8000/api';

// Function to send query to backend RAG API
const sendQueryToBackend = async (query, sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        session_id: sessionId,
        include_citations: true
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending query to backend:', error);
    // Return a fallback response if API fails
    return {
      response: "I'm having trouble connecting to the AI backend. Please try again later.",
      citations: [],
      query_id: 'fallback'
    };
  }
};

function ChatHeader() {
  return (
    <AnimatedSection className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="hero__title text-4xl md:text-5xl font-bold mb-4">
            AI Robotics Assistant
          </h1>
          <p className="hero__subtitle text-xl md:text-2xl text-gray-700">
            Ask questions about Physical AI, Robotics, ROS 2, and more
          </p>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

function Message({ text, isUser, timestamp, citations }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-blue-600 text-white rounded-br-none'
          : 'bg-gray-100 text-gray-800 rounded-bl-none'
      }`}>
        <div className="text-sm leading-relaxed">{text}</div>

        {/* Display citations for bot messages */}
        {!isUser && citations && citations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <details className="group">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 flex items-center">
                <span>Sources ({citations.length})</span>
                <svg
                  className="w-3 h-3 ml-1 transition-transform duration-200 group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-2 space-y-2">
                {citations.map((citation, index) => (
                  <div key={index} className="text-xs bg-blue-50 p-2 rounded border border-blue-100">
                    <strong className="text-blue-800">{citation.chapter_title}</strong>: {citation.content_preview}
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}

        <div className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-500'} text-right`}>
          {timestamp}
        </div>
      </div>
    </motion.div>
  );
}

function ChatInput({ onSendMessage, disabled }) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about AI Robotics, Physical AI, ROS 2, Humanoid Robotics..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[44px] max-h-32"
          disabled={disabled}
          rows={1}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-xl px-4 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          disabled={disabled || !inputValue.trim()}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </form>
  );
}

function ChatSuggestions({ onSuggestionClick }) {
  const suggestions = [
    'What is Physical AI?',
    'Explain ROS 2 fundamentals',
    'What are humanoid robots?',
    'How does digital twin simulation work?',
    'Tell me about Vision-Language-Action systems'
  ];

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-500 mb-3">Try asking:</h3>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors duration-200"
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I\'m your AI Robotics assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const sessionId = useRef(`session_${Date.now()}`).current; // Generate unique session ID

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: text,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send query to backend RAG API
      const response = await sendQueryToBackend(text, sessionId);

      const botMessage = {
        id: Date.now() + 1,
        text: response.response,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: response.citations || []
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error processing your request. Please try again.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  return (
    <Layout title="AI Robotics Chatbot" description="Interactive AI assistant for AI robotics questions">
      <ChatHeader />
      <main className="py-8">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <AnimatedCard className="h-[600px] flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <Message
                        key={message.id}
                        text={message.text}
                        isUser={message.isUser}
                        timestamp={message.timestamp}
                        citations={message.citations}
                      />
                    ))}
                  </AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start mb-4"
                    >
                      <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-3 rounded-bl-none">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-6 border-t border-gray-100">
                  <ChatSuggestions onSuggestionClick={handleSuggestionClick} />
                  <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
                </div>
              </AnimatedCard>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <AnimatedCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Assistant</h3>
                <p className="text-gray-600 leading-relaxed">
                  This AI Robotics assistant is designed to help you learn about Physical AI,
                  ROS 2, humanoid robotics, digital twin simulation, and Vision-Language-Action systems.
                  Ask questions about any of these topics to get detailed explanations.
                </p>
              </AnimatedCard>

              <AnimatedCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Topics Covered</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">Physical AI fundamentals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">ROS 2 architecture and components</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">Humanoid robotics design principles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">Digital twin simulation (Gazebo + Isaac)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">Vision-Language-Action systems</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span className="text-gray-700">AI-robot pipeline integration</span>
                  </li>
                </ul>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default ChatPage;