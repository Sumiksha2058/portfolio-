// Shared Components for Portfolio
// This file contains reusable components to reduce code repetition

/**
 * Inject Navigation Bar
 * Call this function at the start of your HTML body
 */
function injectNavbar() {
    const navHTML = `
    <nav class="navbar">
        <div class="container">
            <div class="nav-brand">Sumiksha Neupane</div>
            <ul class="nav-menu">
                <li><a href="${getBasePath()}index.html#home" class="nav-link">Home</a></li>
                <li><a href="${getBasePath()}index.html#about" class="nav-link">About</a></li>
                <li><a href="${getBasePath()}index.html#education" class="nav-link">Education</a></li>
                <li><a href="${getBasePath()}blog/blog.html" class="nav-link">Blog</a></li>
                <li><a href="${getBasePath()}fun/fun.html" class="nav-link">Fun</a></li>
                <li><a href="${getBasePath()}index.html#contact" class="nav-link">Contact</a></li>
            </ul>
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>
    `;
    
    // Insert navbar at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', navHTML);
    
    // Initialize hamburger menu
    initHamburgerMenu();
}

/**
 * Inject Footer
 * Call this function at the end of your HTML body
 */
function injectFooter() {
    const footerHTML = `
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Sumiksha Neupane</h3>
                    <p>BCA Student | Aspiring Web Developer</p>
                </div>
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="${getBasePath()}index.html#home">Home</a></li>
                        <li><a href="${getBasePath()}index.html#about">About</a></li>
                        <li><a href="${getBasePath()}blog/blog.html">Blog</a></li>
                        <li><a href="${getBasePath()}fun/fun.html">Fun</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Connect</h4>
                    <div class="social-links">
                        <a href="https://github.com/Sumiksha2058" target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-github"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/sumiksha-neupane/" target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-linkedin"></i>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <i class="fab fa-twitter"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; <span id="year"></span> Sumiksha Neupane. All rights reserved.</p>
            </div>
        </div>
    </footer>
    `;
    
    // Append footer at the end of body
    document.body.insertAdjacentHTML('beforeend', footerHTML);
    
    // Update year
    document.getElementById('year').textContent = new Date().getFullYear();
}

/**
 * Get the base path for relative links
 * Detects current directory depth and adjusts paths accordingly
 */
function getBasePath() {
    const currentPath = window.location.pathname;
    
    // Count the number of directories
    const pathParts = currentPath.split('/').filter(part => part && part !== 'index.html');
    
    // If we're in a subdirectory (like /blog/ or /fun/), go up
    if (pathParts.length > 1) {
        return '../';
    }
    
    return './';
}

/**
 * Initialize Hamburger Menu
 */
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when a link is clicked
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

/**
 * Initialize Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Only smooth scroll if the target is on the same page
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize all shared components
 */
function initializeComponents() {
    injectNavbar();
    injectFooter();
    initSmoothScroll();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeComponents);
} else {
    initializeComponents();
}
