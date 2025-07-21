/**
 * Upload JavaScript
 * Handles file upload, processing, and AI analysis simulation
 */

let uploadArea, fileInput, uploadProgress, resultsContainer;
let selectedFile = null;
let uploadInProgress = false;

// Initialize upload functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeUpload();
});

/**
 * Initialize upload area and event listeners
 */
function initializeUpload() {
    uploadArea = document.getElementById('upload-area');
    fileInput = document.getElementById('file-input');
    uploadProgress = document.getElementById('upload-progress');
    resultsContainer = document.getElementById('results-container');
    
    if (uploadArea && fileInput) {
        setupUploadEventListeners();
        console.log('Upload module initialized');
    }
}

/**
 * Set up event listeners for file upload functionality
 */
function setupUploadEventListeners() {
    // Click to select file
    uploadArea.addEventListener('click', function() {
        if (!uploadInProgress) {
            fileInput.click();
        }
    });
    
    // File selection change
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleFileSelection(file);
        }
    });
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        if (!uploadInProgress) {
            uploadArea.classList.add('drag-over');
        }
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        if (!uploadInProgress) {
            const file = e.dataTransfer.files[0];
            if (file) {
                handleFileSelection(file);
            }
        }
    });
}

/**
 * Handle file selection and validation
 * @param {File} file - Selected file object
 */
function handleFileSelection(file) {
    console.log('File selected:', file.name);
    
    // Validate file type
    if (!isValidImageFile(file)) {
        showToast('Please select a valid image file (PNG, JPG, JPEG, GIF, BMP, TIFF)', 'error');
        return;
    }
    
    // Validate file size (max 10MB for demo)
    if (file.size > 10 * 1024 * 1024) {
        showToast('File size must be less than 10MB', 'error');
        return;
    }
    
    selectedFile = file;
    startUploadProcess();
}

/**
 * Validate if file is a supported image format
 * @param {File} file - File to validate
 * @returns {boolean} Whether file is valid
 */
function isValidImageFile(file) {
    const validTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/bmp',
        'image/tiff',
        'image/webp'
    ];
    
    return validTypes.includes(file.type.toLowerCase());
}

/**
 * Start the upload and analysis process
 */
async function startUploadProcess() {
    if (!selectedFile) return;
    
    console.log('Starting upload process for:', selectedFile.name);
    uploadInProgress = true;
    
    // Hide upload area and show progress
    uploadArea.style.display = 'none';
    uploadProgress.style.display = 'block';
    resultsContainer.style.display = 'none';
    
    try {
        // Step 1: Upload file
        await simulateFileUpload();
        
        // Step 2: Process and analyze
        await simulateAIAnalysis();
        
        // Step 3: Show results
        displayAnalysisResults();
        
    } catch (error) {
        console.error('Upload process failed:', error);
        showToast('Upload failed. Please try again.', 'error');
        resetUpload();
    }
}

/**
 * Simulate file upload with progress tracking
 */
async function simulateFileUpload() {
    console.log('Simulating file upload...');
    
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 5) {
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Uploading... ${progress}%`;
        
        // Variable delay to simulate network conditions
        const delay = progress < 50 ? 100 : 150;
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    console.log('File upload completed');
}

/**
 * Simulate AI analysis process
 */
async function simulateAIAnalysis() {
    console.log('Starting AI analysis...');
    
    const progressText = document.getElementById('progress-text');
    progressText.textContent = 'Analyzing brain scan with AI...';
    
    // Simulate AI processing time (2-4 seconds)
    const processingTime = 2000 + Math.random() * 2000;
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    console.log('AI analysis completed');
}

/**
 * Display analysis results with simulated AI predictions
 */
function displayAnalysisResults() {
    console.log('Displaying analysis results');
    
    // Generate simulated results
    const results = generateSimulatedResults();
    
    // Update results UI
    updateResultsDisplay(results);
    
    // Save results to user history
    saveResultsToHistory(results);
    
    // Show results container
    uploadProgress.style.display = 'none';
    resultsContainer.style.display = 'block';
    
    uploadInProgress = false;
    
    showToast('Analysis completed successfully!', 'success');
}

/**
 * Generate simulated AI analysis results
 * @returns {Object} Simulated analysis results
 */
function generateSimulatedResults() {
    // Predefined result scenarios for demonstration
    const scenarios = [
        {
            result: 'no_tumor',
            confidence: 0.92 + Math.random() * 0.07, // 92-99%
            description: 'No signs of tumor detected. Brain structure appears normal with healthy tissue patterns.',
            recommendation: 'Regular monitoring recommended. Consult with your healthcare provider for routine follow-up.'
        },
        {
            result: 'tumor_detected',
            confidence: 0.82 + Math.random() * 0.15, // 82-97%
            description: 'Potential tumor detected in the brain region. Abnormal tissue growth patterns identified.',
            recommendation: 'Immediate consultation with a neurology specialist is strongly recommended for further evaluation.'
        },
        {
            result: 'inconclusive',
            confidence: 0.55 + Math.random() * 0.20, // 55-75%
            description: 'Image quality or positioning may be affecting analysis accuracy. Results are inconclusive.',
            recommendation: 'Consider retaking the scan with improved positioning or consult with imaging specialist.'
        }
    ];
    
    // Weighted random selection (favor no_tumor for demo)
    const weights = [0.6, 0.25, 0.15]; // 60% no tumor, 25% tumor, 15% inconclusive
    const random = Math.random();
    let cumulativeWeight = 0;
    let selectedIndex = 0;
    
    for (let i = 0; i < weights.length; i++) {
        cumulativeWeight += weights[i];
        if (random <= cumulativeWeight) {
            selectedIndex = i;
            break;
        }
    }
    
    const scenario = scenarios[selectedIndex];
    
    return {
        id: generateId(),
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        uploadDate: new Date().toISOString(),
        result: scenario.result,
        confidence: scenario.confidence,
        description: scenario.description,
        recommendation: scenario.recommendation,
        processingTime: Math.floor(2000 + Math.random() * 2000), // 2-4 seconds
        modelVersion: 'TumorVision-CNN-v2.1'
    };
}

/**
 * Update the results display with analysis data
 * @param {Object} results - Analysis results to display
 */
function updateResultsDisplay(results) {
    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const confidencePercentage = document.getElementById('confidence-percentage');
    const resultDescription = document.getElementById('result-description');
    
    // Update confidence score
    confidencePercentage.textContent = `${(results.confidence * 100).toFixed(1)}%`;
    
    // Update content based on result type
    switch (results.result) {
        case 'no_tumor':
            resultIcon.className = 'fas fa-check-circle';
            resultIcon.style.color = '#28a745';
            resultTitle.textContent = 'No Tumor Detected';
            resultTitle.style.color = '#28a745';
            break;
            
        case 'tumor_detected':
            resultIcon.className = 'fas fa-exclamation-triangle';
            resultIcon.style.color = '#dc3545';
            resultTitle.textContent = 'Potential Tumor Detected';
            resultTitle.style.color = '#dc3545';
            break;
            
        case 'inconclusive':
            resultIcon.className = 'fas fa-question-circle';
            resultIcon.style.color = '#ffc107';
            resultTitle.textContent = 'Inconclusive Results';
            resultTitle.style.color = '#ffc107';
            break;
    }
    
    // Update description
    resultDescription.innerHTML = `
        <p><strong>Analysis:</strong> ${results.description}</p>
        <p><strong>Recommendation:</strong> ${results.recommendation}</p>
        <hr style="margin: 1rem 0;">
        <p><small><strong>Processing Time:</strong> ${results.processingTime}ms | 
        <strong>Model:</strong> ${results.modelVersion} | 
        <strong>File:</strong> ${results.fileName}</small></p>
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
            <p><small><strong>Important:</strong> This AI analysis is for informational purposes only. 
            Please consult with a qualified medical professional for proper diagnosis and treatment.</small></p>
        </div>
    `;
}

/**
 * Save analysis results to user history
 * @param {Object} results - Results to save
 */
function saveResultsToHistory(results) {
    if (!isAuthenticated || !currentUser) {
        console.log('User not authenticated, skipping history save');
        return;
    }
    
    console.log('Saving results to user history');
    
    // Get existing history from localStorage
    const historyKey = `history_${currentUser.id}`;
    const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
    
    // Add new result to history
    const historyItem = {
        ...results,
        userId: currentUser.id,
        timestamp: new Date().toISOString()
    };
    
    existingHistory.unshift(historyItem); // Add to beginning
    
    // Keep only last 50 results
    if (existingHistory.length > 50) {
        existingHistory.splice(50);
    }
    
    // Save back to localStorage
    localStorage.setItem(historyKey, JSON.stringify(existingHistory));
    
    console.log('Results saved to history');
}

/**
 * Reset the upload interface to initial state
 */
function resetUpload() {
    console.log('Resetting upload interface');
    
    selectedFile = null;
    uploadInProgress = false;
    
    // Reset file input
    if (fileInput) {
        fileInput.value = '';
    }
    
    // Reset UI elements
    if (uploadArea) {
        uploadArea.style.display = 'block';
        uploadArea.classList.remove('drag-over');
    }
    
    if (uploadProgress) {
        uploadProgress.style.display = 'none';
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill) progressFill.style.width = '0%';
        if (progressText) progressText.textContent = 'Uploading... 0%';
    }
    
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
function formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Get user's upload history
 * @returns {Array} Array of user's upload history
 */
function getUserHistory() {
    if (!isAuthenticated || !currentUser) {
        return [];
    }
    
    const historyKey = `history_${currentUser.id}`;
    return JSON.parse(localStorage.getItem(historyKey) || '[]');
}

/**
 * Clear user's upload history
 */
function clearUserHistory() {
    if (!isAuthenticated || !currentUser) {
        return;
    }
    
    const historyKey = `history_${currentUser.id}`;
    localStorage.removeItem(historyKey);
    
    // Refresh history display if currently viewing
    const currentSection = document.querySelector('.section.active');
    if (currentSection && currentSection.id === 'history') {
        loadUserHistory();
    }
    
    showToast('History cleared successfully', 'success');
}

// Export functions for global use
window.resetUpload = resetUpload;
window.clearUserHistory = clearUserHistory;
window.getUserHistory = getUserHistory;
