// Client-side script to handle authentication-based navigation
export const initAuthNavbar = () => {
  // Wait for the page to fully load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNavbar);
  } else {
    setTimeout(updateNavbar, 100); // Small delay to ensure navbar is rendered
  }

  // Also set up a periodic check in case auth state changes
  setInterval(updateNavbar, 2000);
};

const updateNavbar = () => {
  // Check for auth tokens in localStorage
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const isAuthenticated = !!(accessToken && refreshToken);

  // Find the navbar
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // Update navbar items based on auth status
  const dashboardLink = navbar.querySelector('a[href="/dashboard"]');
  const profileLink = navbar.querySelector('a[href="/profile"]');
  const loginLink = navbar.querySelector('a[href="/auth/login"]');

  if (dashboardLink) {
    dashboardLink.style.display = isAuthenticated ? 'block' : 'none';
  }

  if (loginLink) {
    loginLink.style.display = isAuthenticated ? 'none' : 'block';
  }

  // Add or update user menu if authenticated
  if (isAuthenticated) {
    createUserMenu(navbar);
  } else {
    removeUserMenu(navbar);
  }

  // Update body class for CSS rules
  if (isAuthenticated) {
    document.body.classList.add('authenticated');
    document.body.classList.remove('guest');
  } else {
    document.body.classList.add('guest');
    document.body.classList.remove('authenticated');
  }
};

const createUserMenu = (navbar) => {
  // Check if user menu already exists
  let userMenuContainer = document.getElementById('user-menu-container');

  if (!userMenuContainer) {
    // Create user menu container
    userMenuContainer = document.createElement('div');
    userMenuContainer.id = 'user-menu-container';
    userMenuContainer.className = 'user-menu-container';

    // Add CSS styles dynamically if not already added
    if (!document.getElementById('auth-navbar-styles')) {
      const style = document.createElement('style');
      style.id = 'auth-navbar-styles';
      style.textContent = `
        .user-menu-container {
          position: relative;
          display: inline-block;
          margin-left: 1rem;
        }

        .user-menu-button {
          background: none;
          border: none;
          color: white;
          font-size: 16px;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 4px;
          transition: background-color 0.2s ease;
          text-decoration: none;
        }

        .user-menu-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .user-menu-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          min-width: 180px;
          overflow: hidden;
          display: none;
        }

        .user-menu-dropdown.open {
          display: block;
        }

        .dropdown-item {
          display: block;
          padding: 12px 16px;
          text-decoration: none !important;
          color: #1e293b !important;
          border-bottom: 1px solid #e2e8f0;
          transition: background-color 0.2s ease;
        }

        .dropdown-item:last-child {
          border-bottom: none;
        }

        .dropdown-item:hover {
          background-color: #f1f5f9;
        }

        .logout-button {
          width: 100%;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          padding: 12px 16px;
          text-decoration: none;
          color: #dc2626;
        }

        .logout-button:hover {
          background-color: #fee2e2 !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Add the container to the navbar
    const rightItems = navbar.querySelector('.navbar__items--right');
    if (rightItems) {
      rightItems.appendChild(userMenuContainer);
    } else {
      // If no right items container, append to navbar directly
      navbar.appendChild(userMenuContainer);
    }
  }

  // Update user menu content
  updateUserMenuContent(userMenuContainer);
};

const updateUserMenuContent = (container) => {
  // Get username from a potential API call or fallback
  const username = getStoredUsername() || 'User';

  // Create the menu HTML
  container.innerHTML = `
    <button id="user-menu-button" class="user-menu-button" aria-expanded="false">
      👤 ${username} ▼
    </button>
    <div id="user-menu-dropdown" class="user-menu-dropdown">
      <a href="/dashboard" class="dropdown-item">Dashboard</a>
      <a href="/profile" class="dropdown-item">Profile</a>
      <a href="/ai-chatbot" class="dropdown-item">AI Assistant</a>
      <button id="logout-button" class="logout-button">Sign Out</button>
    </div>
  `;

  // Add event listeners
  const menuButton = document.getElementById('user-menu-button');
  const dropdown = document.getElementById('user-menu-dropdown');
  const logoutButton = document.getElementById('logout-button');

  if (menuButton && dropdown) {
    menuButton.onclick = (e) => {
      e.preventDefault();
      const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', !isExpanded);
      dropdown.classList.toggle('open');
    };

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        menuButton.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('open');
      }
    });
  }

  if (logoutButton) {
    logoutButton.onclick = () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/'; // Redirect to home after logout
    };
  }
};

const getStoredUsername = () => {
  // In a real implementation, you might store the username in localStorage
  // when the user logs in, or retrieve it from the token payload
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // Decode JWT token to get username (simplified)
      const tokenParts = accessToken.split('.');
      if (tokenParts.length === 3) {
        try {
          const payload = JSON.parse(atob(tokenParts[1]));
          return payload.sub || 'User';
        } catch (e) {
          return 'User';
        }
      }
    }
  } catch (e) {
    return 'User';
  }
  return 'User';
};

const removeUserMenu = (navbar) => {
  const userMenuContainer = document.getElementById('user-menu-container');
  if (userMenuContainer) {
    userMenuContainer.remove();
  }
};

// Initialize when script is loaded
if (typeof window !== 'undefined') {
  initAuthNavbar();
}