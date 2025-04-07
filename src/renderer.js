const { ipcRenderer } = require('electron');

// DOM Elements
const minimizeBtn = document.getElementById('minimize-btn');
const maximizeBtn = document.getElementById('maximize-btn');
const closeBtn = document.getElementById('close-btn');
const menuButtons = document.querySelectorAll('.menu-button');
const menus = document.querySelectorAll('.menu');
const notificationContainer = document.getElementById('notification-container');

// Theme definitions
const themes = {
  default: {
    background: '#0f0f0f',
    cardBg: '#1a1a1a',
    primary: '#8A2BE2',
    secondary: '#8A2BE2',
    accent: '#8A2BE2',
    text: '#FFFFFF',
    textSecondary: '#BBBBBB',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    primaryRgb: '138, 43, 226'
  },
  dark: {
    background: '#0f0f0f',
    cardBg: '#1a1a1a',
    primary: '#BB86FC',
    secondary: '#BB86FC',
    accent: '#BB86FC',
    text: '#FFFFFF',
    textSecondary: '#BBBBBB',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    primaryRgb: '187, 134, 252'
  },
  light: {
    background: '#0f0f0f',
    cardBg: '#1a1a1a',
    primary: '#6200EE',
    secondary: '#6200EE',
    accent: '#6200EE',
    text: '#FFFFFF',
    textSecondary: '#BBBBBB',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    primaryRgb: '98, 0, 238'
  },
  purple: {
    background: '#0f0f0f',
    cardBg: '#1a1a1a',
    primary: '#E94560',
    secondary: '#E94560',
    accent: '#E94560',
    text: '#FFFFFF',
    textSecondary: '#BBBBBB',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    primaryRgb: '233, 69, 96'
  },
  blue: {
    background: '#0f0f0f',
    cardBg: '#1a1a1a',
    primary: '#64FFDA',
    secondary: '#64FFDA',
    accent: '#64FFDA',
    text: '#FFFFFF',
    textSecondary: '#BBBBBB',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    primaryRgb: '100, 255, 218'
  },
  green: {
    background: '#0f0f0f',
    cardBg: '#1a1a1a',
    primary: '#95D5B2',
    secondary: '#95D5B2',
    accent: '#95D5B2',
    text: '#FFFFFF',
    textSecondary: '#BBBBBB',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    primaryRgb: '149, 213, 178'
  },
  red: {
    background: '#0f0f0f',
    cardBg: '#1a1a1a',
    primary: '#FF6B6B',
    secondary: '#FF6B6B',
    accent: '#FF6B6B',
    text: '#FFFFFF',
    textSecondary: '#BBBBBB',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    primaryRgb: '255, 107, 107'
  },
  orange: {
    background: '#0f0f0f',
    cardBg: '#1a1a1a',
    primary: '#FF9F1C',
    secondary: '#FF9F1C',
    accent: '#FF9F1C',
    text: '#FFFFFF',
    textSecondary: '#BBBBBB',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    primaryRgb: '255, 159, 28'
  },
  cyberpunk: {
    background: '#0f0f0f',
    cardBg: '#1a1a1a',
    primary: '#FF00FF',
    secondary: '#FF00FF',
    accent: '#FF00FF',
    text: '#FFFFFF',
    textSecondary: '#BBBBBB',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    primaryRgb: '255, 0, 255'
  },
  retro: {
    background: '#0f0f0f',
    cardBg: '#1a1a1a',
    primary: '#FFD700',
    secondary: '#FFD700',
    accent: '#FFD700',
    text: '#FFFFFF',
    textSecondary: '#BBBBBB',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    primaryRgb: '255, 215, 0'
  }
};

// Theme management
let currentTheme = 'default';

function applyTheme(themeName) {
  const theme = themes[themeName];
  const root = document.documentElement;
  
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
  
  currentTheme = themeName;
  
  // Update active theme in dropdown
  document.querySelectorAll('.theme-option').forEach(option => {
    option.classList.remove('active');
    if (option.dataset.theme === themeName) {
      option.classList.add('active');
    }
  });
}

// Theme selector functionality
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('.theme-toggle');
  const themeDropdown = document.querySelector('.theme-dropdown');
  
  themeToggle.addEventListener('click', () => {
    themeDropdown.classList.toggle('show');
  });
  
  document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', () => {
      const themeName = option.dataset.theme;
      applyTheme(themeName);
      themeDropdown.classList.remove('show');
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.theme-selector')) {
      themeDropdown.classList.remove('show');
    }
  });
  
  // Apply default theme
  applyTheme('default');
});

// Window Controls
minimizeBtn.addEventListener('click', () => {
  ipcRenderer.send('minimize-window');
});

maximizeBtn.addEventListener('click', () => {
  ipcRenderer.send('maximize-window');
});

closeBtn.addEventListener('click', () => {
  ipcRenderer.send('close-window');
});

// Menu Navigation
menuButtons.forEach(button => {
  button.addEventListener('click', () => {
    const action = button.getAttribute('data-action');
    
    // Add click animation
    button.classList.add('clicked');
    setTimeout(() => button.classList.remove('clicked'), 300);
    
    // Handle different actions
    switch (action) {
      case 'launcher-menu':
      case 'hack-client-menu':
      case 'config-menu':
      case 'alt-menu':
        switchMenu(action);
        break;
      case 'back-to-main':
        switchMenu('main-menu');
        break;
      case 'launch-tlauncher':
        ipcRenderer.send('launch-tlauncher');
        break;
      case 'vpn':
        ipcRenderer.send('open-softether-vpn');
        break;
      case 'open-minecraft-versions':
        ipcRenderer.send('open-minecraft-versions');
        break;
      case 'open-minecraft-mods':
        ipcRenderer.send('open-minecraft-mods');
        break;
      case 'open-url':
        const url = button.getAttribute('data-url');
        ipcRenderer.send('open-url', url);
        break;
      case 'exit':
        ipcRenderer.send('close-window');
        break;
    }
  });
});

// Switch between menus with animation
function switchMenu(menuId) {
  // Hide all menus
  menus.forEach(menu => {
    menu.classList.remove('active');
  });
  
  // Show the selected menu
  const targetMenu = document.getElementById(menuId);
  if (targetMenu) {
    targetMenu.classList.add('active');
  }
}

// Notification System
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const icon = document.createElement('i');
  icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
  
  const text = document.createElement('span');
  text.textContent = message;
  
  notification.appendChild(icon);
  notification.appendChild(text);
  notificationContainer.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Show welcome notification
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    showNotification('Welcome to Zeqi - A Minecraft Multitool!', 'success');
  }, 1000);
}); 