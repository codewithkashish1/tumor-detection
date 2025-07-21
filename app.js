
/**
 * Main Application JavaScript
 * Handles navigation, section switching, and general app functionality
 */

// Global state management for user authentication
let currentUser = null;
let isAuthenticated = false;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Application initialized');
    initializeApp();
    setupEventListeners();
    checkAuthState();
});

/**
 * Initialize the application
 * Sets up initial state and checks for saved user session
 */
function initializeApp() {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isAuthenticated = true;
        updateAuthUI();
    }
    
    // Set default active section
    showSection('home');
}

/**
 * Set up event listeners for navigation and interactions
 */
function setupEventListeners() {
    // Navigation link click handlers
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            
            // Check if user needs to be authenticated for certain sections
            if ((section === 'upload' || section === 'history') && !isAuthenticated) {
                showToast('Please log in to access this feature', 'warning');
                showSection('login');
                return;
            }
            
            showSection(section);
            updateActiveNavLink(this);
        });
    });
    
    // Handle responsive navigation menu
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            const navMenu = document.getElementById('nav-menu');
            navMenu.classList.toggle('active');
        });
    }
}

/**
 * Show specific section and hide others
 * @param {string} sectionId - The ID of the section to show
 */
function showSection(sectionId) {
    console.log(`Switching to section: ${sectionId}`);
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load section-specific data
        loadSectionData(sectionId);
    }
}

/**
 * Load data specific to the section being shown
 * @param {string} sectionId - The section that was activated
 */
function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'history':
            if (isAuthenticated) {
                loadUserHistory();
            }
            break;
        case 'upload':
            if (isAuthenticated) {
                resetUpload();
            }
            break;
        default:
            break;
    }
}

/**
 * Update active navigation link styling
 * @param {Element} activeLink - The navigation link that was clicked
 */
function updateActiveNavLink(activeLink) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to clicked link
    activeLink.classList.add('active');
}

/**
 * Check authentication state and update UI accordingly
 */
function checkAuthState() {
    const authLink = document.getElementById('auth-link');
    if (isAuthenticated && currentUser) {
        authLink.textContent = 'Logout';
        authLink.setAttribute('data-section', 'logout');
        authLink.onclick = logout;
    } else {
        authLink.textContent = 'Login';
        authLink.setAttribute('data-section', 'login');
        authLink.onclick = null;
    }
}

/**
 * Update UI elements based on authentication state
 */
function updateAuthUI() {
    checkAuthState();
    
    if (isAuthenticated) {
        // Update welcome message or user info if needed
        console.log(`User ${currentUser.name} is logged in`);
    }
}

/**
 * Handle user logout
 */
function logout() {
    console.log('User logging out');
    
    // Clear user data
    currentUser = null;
    isAuthenticated = false;
    localStorage.removeItem('currentUser');
    
    // Update UI
    updateAuthUI();
    showSection('home');
    showToast('Logged out successfully', 'success');
}

/**
 * Load user's scan history from storage/API
 */
function loadUserHistory() {
    console.log('Loading user history');
    
    // In a real application, this would fetch from your Python backend
    // For demo purposes, we'll use sample data
    const sampleHistory = [
        {
            id: 1,
            fileName: 'brain_scan_001.jpg',
            uploadDate: '2024-03-15',
            result: 'no_tumor',
            confidence: 95.2,
            size: '2.1 MB'
        },
        {
            id: 2,
            fileName: 'mri_scan_002.png',
            uploadDate: '2024-03-10',
            result: 'tumor_detected',
            confidence: 87.8,
            size: '3.4 MB'
        },
        {
            id: 3,
            fileName: 'brain_image_003.jpg',
            uploadDate: '2024-03-05',
            result: 'inconclusive',
            confidence: 65.3,
            size: '1.8 MB'
        }
    ];
    
    displayHistory(sampleHistory);
}

/**
 * Display history items in the history section
 * @param {Array} historyItems - Array of history objects
 */
function displayHistory(historyItems) {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    
    historyItems.forEach(item => {
        const historyItem = createHistoryItem(item);
        historyList.appendChild(historyItem);
    });
}

/**
 * Create HTML element for a history item
 * @param {Object} item - History item data
 * @returns {Element} HTML element for the history item
 */
function createHistoryItem(item) {
    const div = document.createElement('div');
    div.className = 'history-item';
    
    // Determine status badge class
    let statusClass = 'processing';
    let statusText = 'Processing';
    
    switch(item.result) {
        case 'no_tumor':
            statusClass = 'no-tumor';
            statusText = 'No Tumor';
            break;
        case 'tumor_detected':
            statusClass = 'tumor';
            statusText = 'Tumor Detected';
            break;
        case 'inconclusive':
            statusClass = 'processing';
            statusText = 'Inconclusive';
            break;
    }
    
    div.innerHTML = `
        <div class="history-info">
            <div class="file-icon">
                <i class="fas fa-brain"></i>
            </div>
            <div class="file-details">
                <h4>${item.fileName}</h4>
                <p>Uploaded on ${formatDate(item.uploadDate)} • ${item.size}</p>
            </div>
        </div>
        <div class="history-result">
            <span class="status-badge ${statusClass}">${statusText}</span>
            <span class="confidence">${item.confidence}% confidence</span>
        </div>
        <div class="history-actions">
            <button class="btn-icon" title="View Details" onclick="viewDetails(${item.id})">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn-icon" title="Download" onclick="downloadScan(${item.id})">
                <i class="fas fa-download"></i>
            </button>
        </div>
    `;
    
    return div;
}

/**
 * Format date for display
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * View details of a specific scan
 * @param {number} scanId - ID of the scan to view
 */
function viewDetails(scanId) {
    console.log(`Viewing details for scan ${scanId}`);
    showToast('Feature coming soon - View detailed analysis', 'info');
}

/**
 * Download a specific scan
 * @param {number} scanId - ID of the scan to download
 */
function downloadScan(scanId) {
    console.log(`Downloading scan ${scanId}`);
    showToast('Feature coming soon - Download scan results', 'info');
}

/**
 * Show loading overlay
 * @param {string} message - Loading message to display
 */
function showLoading(message = 'Processing your request...') {
    const overlay = document.getElementById('loading-overlay');
    const text = overlay.querySelector('p');
    text.textContent = message;
    overlay.style.display = 'flex';
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = 'none';
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, warning, info)
 */
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Utility function to validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Generate unique ID for uploads and records
 * @returns {string} Unique identifier
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Export functions for use in other modules
window.showSection = showSection;
window.showToast = showToast;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.resetUpload = resetUpload; // Will be defined in upload.js
window.viewDetails = viewDetails;
window.downloadScan = downloadScan;
