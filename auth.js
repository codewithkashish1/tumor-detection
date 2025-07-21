
/**
 * Authentication JavaScript
 * Handles user login, registration, and session management
 */

// Authentication form elements
let signinForm, signupForm;

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

/**
 * Initialize authentication forms and event listeners
 */
function initializeAuth() {
    signinForm = document.getElementById('signin-form');
    signupForm = document.getElementById('signup-form');
    
    // Set up form event listeners
    if (signinForm) {
        signinForm.addEventListener('submit', handleSignIn);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignUp);
    }
    
    console.log('Authentication module initialized');
}

/**
 * Switch between signin and signup tabs
 * @param {string} tab - Tab to switch to ('signin' or 'signup')
 */
function switchTab(tab) {
    console.log(`Switching to ${tab} tab`);
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick="switchTab('${tab}')"]`).classList.add('active');
    
    // Update form visibility
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`${tab}-form`).classList.add('active');
}

/**
 * Handle user sign in
 * @param {Event} event - Form submit event
 */
async function handleSignIn(event) {
    event.preventDefault();
    console.log('Handling sign in');
    
    // Get form data
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    
    // Validate inputs
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Show loading state
    showLoading('Signing you in...');
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In a real application, this would call your Python backend
        const loginResult = await simulateLogin(email, password);
        
        if (loginResult.success) {
            // Store user session
            currentUser = loginResult.user;
            isAuthenticated = true;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update UI
            updateAuthUI();
            showSection('upload');
            showToast('Welcome back! Login successful', 'success');
            
            // Clear form
            signinForm.reset();
        } else {
            showToast(loginResult.message, 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Login failed. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

/**
 * Handle user sign up
 * @param {Event} event - Form submit event
 */
async function handleSignUp(event) {
    event.preventDefault();
    console.log('Handling sign up');
    
    // Get form data
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    // Validate inputs
    if (name.trim().length < 2) {
        showToast('Please enter your full name', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Show loading state
    showLoading('Creating your account...');
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real application, this would call your Python backend
        const signupResult = await simulateSignup(name, email, password);
        
        if (signupResult.success) {
            // Store user session
            currentUser = signupResult.user;
            isAuthenticated = true;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update UI
            updateAuthUI();
            showSection('upload');
            showToast('Account created successfully! Welcome aboard!', 'success');
            
            // Clear form
            signupForm.reset();
        } else {
            showToast(signupResult.message, 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showToast('Account creation failed. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

/**
 * Simulate login API call
 * In a real application, this would make an HTTP request to your Python backend
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Login result
 */
async function simulateLogin(email, password) {
    console.log(`Attempting login for: ${email}`);
    
    // Simulate different login scenarios
    if (email === 'demo@example.com' && password === 'demo123') {
        return {
            success: true,
            user: {
                id: generateId(),
                name: 'Demo User',
                email: email,
                role: 'patient',
                joinDate: new Date().toISOString()
            }
        };
    } else if (email === 'admin@tumor-vision.com' && password === 'admin123') {
        return {
            success: true,
            user: {
                id: generateId(),
                name: 'Dr. Admin',
                email: email,
                role: 'doctor',
                joinDate: '2024-01-01T00:00:00Z'
            }
        };
    } else {
        // Check if user exists in localStorage (for demo purposes)
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = existingUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            return {
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role || 'patient',
                    joinDate: user.joinDate
                }
            };
        } else {
            return {
                success: false,
                message: 'Invalid email or password. Try demo@example.com / demo123'
            };
        }
    }
}

/**
 * Simulate signup API call
 * In a real application, this would make an HTTP request to your Python backend
 * @param {string} name - User full name
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Signup result
 */
async function simulateSignup(name, email, password) {
    console.log(`Attempting signup for: ${email}`);
    
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = existingUsers.find(u => u.email === email);
    
    if (existingUser) {
        return {
            success: false,
            message: 'An account with this email already exists'
        };
    }
    
    // Create new user
    const newUser = {
        id: generateId(),
        name: name,
        email: email,
        password: password, // In real app, this would be hashed
        role: 'patient',
        joinDate: new Date().toISOString()
    };
    
    // Save to localStorage (for demo purposes)
    existingUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
    
    return {
        success: true,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            joinDate: newUser.joinDate
        }
    };
}

/**
 * Check if user session is still valid
 * In a real application, this would validate with the backend
 * @returns {boolean} Whether session is valid
 */
function validateSession() {
    if (!currentUser || !localStorage.getItem('currentUser')) {
        return false;
    }
    
    // In a real app, you'd check token expiration, etc.
    return true;
}

/**
 * Refresh user session
 * In a real application, this would refresh authentication tokens
 */
async function refreshSession() {
    try {
        // Simulate API call to refresh session
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Session refreshed');
        return true;
    } catch (error) {
        console.error('Session refresh failed:', error);
        return false;
    }
}

/**
 * Handle password reset request
 * @param {string} email - Email for password reset
 */
async function requestPasswordReset(email) {
    console.log(`Password reset requested for: ${email}`);
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    showLoading('Sending reset instructions...');
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showToast('Password reset instructions sent to your email', 'success');
    } catch (error) {
        showToast('Failed to send reset instructions', 'error');
    } finally {
        hideLoading();
    }
}

// Export functions for global use
window.switchTab = switchTab;
window.handleSignIn = handleSignIn;
window.handleSignUp = handleSignUp;
window.requestPasswordReset = requestPasswordReset;
