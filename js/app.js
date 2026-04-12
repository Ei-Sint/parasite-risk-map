// ========================================
// THEME TOGGLE FUNCTIONALITY
// ========================================

// Get the toggle button element
const themeToggle = document.getElementById('theme-toggle');

// Add click event listener
themeToggle.addEventListener('click', function() {
    // Toggle the dark-mode class on body
    document.body.classList.toggle('dark-mode');
    
    // Update button text based on current mode
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.textContent = '☀️ Light Mode';
    } else {
        themeToggle.textContent = '🌙 Dark Mode';
    }
});