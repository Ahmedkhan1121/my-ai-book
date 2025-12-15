// AI Chatbot functionality for the textbook
class AIChatbot {
  constructor() {
    this.isOpen = false;
    this.initializeChatbot();
    this.setupTextSelection();
  }

  initializeChatbot() {
    // Create chatbot UI elements
    this.createChatbotUI();

    // Set up event listeners
    this.setupEventListeners();
  }

  createChatbotUI() {
    // Create the chatbot container
    const chatbotContainer = document.createElement('div');
    chatbotContainer.className = 'ai-chatbot-container';
    chatbotContainer.innerHTML = `
      <button class="ai-chatbot-button" id="chatbotToggle">💬</button>
      <div class="ai-chatbot-panel" id="chatbotPanel">
        <div class="chat-header">
          <strong>AI Assistant</strong>
        </div>
        <div class="chat-messages" id="chatMessages">
          <div class="message bot-message">
            Hello! I'm your AI assistant for the Physical AI & Humanoid Robotics textbook.
            Ask me questions about any chapter content, and I'll provide answers based on the textbook material.
          </div>
        </div>
        <div class="chat-input">
          <input type="text" id="chatInput" placeholder="Ask a question about the textbook..." />
          <button id="chatSend">Send</button>
        </div>
      </div>
    `;

    document.body.appendChild(chatbotContainer);
  }

  setupEventListeners() {
    const toggleButton = document.getElementById('chatbotToggle');
    const chatPanel = document.getElementById('chatPanel');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');

    // Toggle chatbot panel
    toggleButton.addEventListener('click', () => {
      this.toggleChatbot();
    });

    // Send message on button click
    chatSend.addEventListener('click', () => {
      this.sendMessage();
    });

    // Send message on Enter key
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
  }

  toggleChatbot() {
    const chatPanel = document.getElementById('chatbotPanel');
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      chatPanel.classList.add('open');
    } else {
      chatPanel.classList.remove('open');
    }
  }

  async sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();

    if (!message) return;

    // Add user message to chat
    this.addMessage(message, 'user');
    chatInput.value = '';

    // Show typing indicator
    this.addMessage('Thinking...', 'bot', true);

    try {
      // Call the backend API to get AI response
      const response = await this.getAIResponse(message);

      // Remove typing indicator and add actual response
      this.removeTypingIndicator();
      this.addMessage(response, 'bot');
    } catch (error) {
      this.removeTypingIndicator();
      this.addMessage('Sorry, I encountered an error processing your request.', 'bot');
    }
  }

  async getAIResponse(userMessage) {
    // In a real implementation, this would call the backend API
    // For now, we'll simulate a response
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage,
          session_id: this.getSessionId(),
          include_citations: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return "I'm having trouble connecting to the AI service. Please try again later.";
    }
  }

  addMessage(text, sender, isTyping = false) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');

    messageDiv.className = `message ${sender}-message`;
    if (isTyping) {
      messageDiv.id = 'typing-indicator';
      messageDiv.innerHTML = `<em>${text}</em>`;
    } else {
      messageDiv.textContent = text;
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  getSessionId() {
    // Simple session ID generation
    if (!localStorage.getItem('sessionId')) {
      const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sessionId', sessionId);
    }
    return localStorage.getItem('sessionId');
  }

  setupTextSelection() {
    // Create the text selection popup
    this.createTextSelectionPopup();

    // Set up the selection event listener
    document.addEventListener('mouseup', this.handleTextSelection.bind(this));
  }

  createTextSelectionPopup() {
    const popup = document.createElement('div');
    popup.className = 'text-selection-popup';
    popup.id = 'textSelectionPopup';
    popup.textContent = 'Ask AI';
    popup.title = 'Ask AI about selected text';

    popup.addEventListener('click', this.handlePopupClick.bind(this));

    document.body.appendChild(popup);
    this.popup = popup;
  }

  handleTextSelection() {
    const selectedText = window.getSelection().toString().trim();

    if (selectedText) {
      // Show the popup near the selection
      const range = window.getSelection().getRangeAt(0);
      const rect = range.getBoundingClientRect();

      this.popup.style.top = (rect.top - 40) + 'px';
      this.popup.style.left = (rect.left + rect.width/2 - 30) + 'px';
      this.popup.classList.add('visible');

      // Store the selected text for later use
      this.selectedText = selectedText;
    } else {
      this.popup.classList.remove('visible');
      this.selectedText = null;
    }
  }

  handlePopupClick() {
    if (this.selectedText) {
      // Show the chatbot if it's not already open
      if (!this.isOpen) {
        this.toggleChatbot();
      }

      // Focus the chat input and pre-fill with selected text context
      const chatInput = document.getElementById('chatInput');
      chatInput.focus();
      chatInput.value = `About this text: "${this.selectedText}". `;
      chatInput.setSelectionRange(chatInput.value.length, chatInput.value.length);

      // Hide the popup
      this.popup.classList.remove('visible');
      this.selectedText = null;
    }
  }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
  new AIChatbot();
});