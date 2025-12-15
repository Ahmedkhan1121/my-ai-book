import React, { useState, useRef, useEffect } from 'react';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import styles from './ai-chatbot.module.css';

// Sample responses for the chatbot
const sampleResponses = {
  'hello': 'Hello! I\'m your AI Robotics assistant. How can I help you today?',
  'hi': 'Hi there! I\'m here to answer your questions about AI robotics, Physical AI, ROS, humanoid robots, and more.',
  'what is physical ai': 'Physical AI represents the intersection of artificial intelligence and physical systems. It encompasses the development of intelligent systems that can perceive, reason, and act in the physical world, combining robotics, computer vision, machine learning, and control theory.',
  'what is ros': 'ROS (Robot Operating System) is a flexible framework for writing robot software. It provides services designed for a heterogeneous computer cluster including hardware abstraction, device drivers, libraries, visualizers, message-passing, package management, and more.',
  'humanoid robotics': 'Humanoid robotics is a specialized field focusing on creating robots with human-like characteristics and capabilities. These robots are designed to operate in human environments and interact with humans naturally.',
  'digital twin': 'A digital twin is a virtual representation of a physical object or system that spans its lifecycle. In robotics, it includes physical models, behavioral models, environmental models, sensor models, and control models.',
  'vision language action': 'Vision-Language-Action (VLA) systems integrate visual perception, natural language understanding, and physical action in a unified framework, enabling robots to understand human instructions and execute appropriate actions.',
  'capstone project': 'The capstone project demonstrates a complete AI-robot pipeline integrating Physical AI, ROS 2, digital twin simulation, and Vision-Language-Action systems into a working demonstration.',
  'help': 'I can help you with questions about AI robotics, Physical AI, ROS 2, humanoid robotics, digital twin simulation, Vision-Language-Action systems, and our textbook content. Try asking about any of these topics!',
  'default': 'I\'m an AI Robotics assistant. I can help you with questions about Physical AI, ROS 2, humanoid robotics, digital twin simulation, and Vision-Language-Action systems. Could you please rephrase your question or ask about one of these topics?'
};

function ChatHeader() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">AI Robotics Assistant</h1>
        <p className="hero__subtitle">Ask questions about Physical AI, Robotics, ROS 2, and more</p>
      </div>
    </header>
  );
}

function Message({ text, isUser, timestamp }) {
  return (
    <div className={clsx(styles.message, {
      [styles.userMessage]: isUser,
      [styles.botMessage]: !isUser
    })}>
      <div className={styles.messageContent}>
        {text}
      </div>
      <div className={styles.messageTimestamp}>
        {timestamp}
      </div>
    </div>
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
    <form className={styles.chatInputForm} onSubmit={handleSubmit}>
      <div className={styles.inputContainer}>
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about AI Robotics, Physical AI, ROS 2, Humanoid Robotics..."
          className={styles.chatInput}
          disabled={disabled}
          rows={1}
        />
        <button
          type="submit"
          className={styles.sendButton}
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
    <div className={styles.suggestions}>
      <h3 className={styles.suggestionsTitle}>Try asking:</h3>
      <div className={styles.suggestionsList}>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className={styles.suggestionButton}
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processMessage = (text) => {
    const lowerText = text.toLowerCase();

    // Check for specific keywords in the message
    if (lowerText.includes('physical ai') || lowerText.includes('physical ai')) {
      return sampleResponses['what is physical ai'];
    } else if (lowerText.includes('ros') || lowerText.includes('robot operating system')) {
      return sampleResponses['what is ros'];
    } else if (lowerText.includes('humanoid') || lowerText.includes('human like')) {
      return sampleResponses['humanoid robotics'];
    } else if (lowerText.includes('digital twin') || lowerText.includes('simulation')) {
      return sampleResponses['digital twin'];
    } else if (lowerText.includes('vision') || lowerText.includes('language') || lowerText.includes('action')) {
      return sampleResponses['vision language action'];
    } else if (lowerText.includes('capstone') || lowerText.includes('project')) {
      return sampleResponses['capstone project'];
    } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
      return sampleResponses['hello'];
    } else if (lowerText.includes('help') || lowerText.includes('what can you do')) {
      return sampleResponses['help'];
    }

    // Check for exact matches in sample responses
    for (const [key, response] of Object.entries(sampleResponses)) {
      if (lowerText.includes(key) && key !== 'default' && key !== 'help') {
        return response;
      }
    }

    return sampleResponses['default'];
  };

  const handleSendMessage = (text) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: text,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate bot response with delay
    setTimeout(() => {
      const botResponse = processMessage(text);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  return (
    <Layout title="AI Robotics Chatbot" description="Interactive AI assistant for AI robotics questions">
      <ChatHeader />
      <main className={clsx(styles.chatPage, 'container', 'margin-vert--lg')}>
        <div className={styles.chatContainer}>
          <div className={styles.chatMessages}>
            {messages.map((message) => (
              <Message
                key={message.id}
                text={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            {isLoading && (
              <div className={clsx(styles.message, styles.botMessage)}>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <div className={styles.typingDot}></div>
                    <div className={styles.typingDot}></div>
                    <div className={styles.typingDot}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.chatInputArea}>
            <ChatSuggestions onSuggestionClick={handleSuggestionClick} />
            <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>About This Assistant</h3>
            <p className={styles.infoText}>
              This AI Robotics assistant is designed to help you learn about Physical AI,
              ROS 2, humanoid robotics, digital twin simulation, and Vision-Language-Action systems.
              Ask questions about any of these topics to get detailed explanations.
            </p>
          </div>

          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Topics Covered</h3>
            <ul className={styles.topicsList}>
              <li>• Physical AI fundamentals</li>
              <li>• ROS 2 architecture and components</li>
              <li>• Humanoid robotics design principles</li>
              <li>• Digital twin simulation (Gazebo + Isaac)</li>
              <li>• Vision-Language-Action systems</li>
              <li>• AI-robot pipeline integration</li>
            </ul>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default ChatPage;