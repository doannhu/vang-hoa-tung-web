// Mobile-specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Enable mobile features for all devices
    document.body.classList.add('ios-device');
    setupMobileFeatures();

    // Setup pull to refresh
    let touchStart = 0;
    let touchY = 0;
    const pullThreshold = 150;
    const indicator = document.getElementById('pull-to-refresh-indicator');

    // Touch event handlers
    const touchStartHandler = function(e) {
        touchStart = e.touches ? e.touches[0].pageY : e.pageY;
    };

    const touchMoveHandler = function(e) {
        touchY = e.touches ? e.touches[0].pageY : e.pageY;
        const pull = touchY - touchStart;
        
        if (window.scrollY === 0 && pull > 0 && pull < pullThreshold) {
            indicator.style.transform = `translateY(${pull}px)`;
            indicator.classList.remove('d-none');
            e.preventDefault();
        }
    };

    const touchEndHandler = function() {
        if (indicator.style.transform) {
            const pull = touchY - touchStart;
            if (pull > pullThreshold) {
                // Trigger refresh
                window.location.reload();
            }
            indicator.style.transform = '';
            indicator.classList.add('d-none');
        }
    };

    // Add touch and mouse event listeners
    document.addEventListener('touchstart', touchStartHandler, { passive: true });
    document.addEventListener('touchmove', touchMoveHandler, { passive: false });
    document.addEventListener('touchend', touchEndHandler);
    document.addEventListener('mousedown', touchStartHandler);
    document.addEventListener('mousemove', touchMoveHandler);
    document.addEventListener('mouseup', touchEndHandler);

    // Smooth scrolling for all devices
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle form inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            setTimeout(() => {
                window.scrollTo(0, window.scrollY + 1);
            }, 100);
        });
        
        input.addEventListener('blur', () => {
            window.scrollTo(0, window.scrollY);
        });
    });

    // Add touch feedback for all devices
    document.querySelectorAll('.btn, .nav-link, .dropdown-item').forEach(element => {
        const addFeedback = () => element.style.opacity = '0.5';
        const removeFeedback = () => element.style.opacity = '1';

        element.addEventListener('touchstart', addFeedback, { passive: true });
        element.addEventListener('touchend', removeFeedback, { passive: true });
        element.addEventListener('mousedown', addFeedback);
        element.addEventListener('mouseup', removeFeedback);
    });

    // Force mobile layout on resize
    window.addEventListener('resize', enforceMobileLayout);
    enforceMobileLayout();
});

function setupMobileFeatures() {
    const root = document.documentElement;
    
    // Set safe area insets
    root.style.setProperty('--safe-area-top', '20px');
    root.style.setProperty('--safe-area-bottom', '20px');
    
    // Handle navigation bar
    const navBar = document.querySelector('.navbar');
    if (navBar) {
        navBar.style.paddingTop = 'calc(var(--safe-area-top) + 0.5rem)';
    }

    // Disable zoom
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = Date.now();
        if (now - lastTouchEnd < 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });

    // Force offcanvas menu
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarToggler && navbarCollapse) {
        navbarCollapse.style.display = 'none';
        navbarToggler.style.display = 'block';
    }
}

function enforceMobileLayout() {
    // Force 375px width container
    const containers = document.querySelectorAll('.container, .container-fluid');
    containers.forEach(container => {
        container.style.maxWidth = '375px';
        container.style.margin = '0 auto';
    });

    // Adjust iframes
    document.querySelectorAll('iframe').forEach(iframe => {
        iframe.style.maxWidth = '100%';
        iframe.style.width = '100%';
    });
}

// Handle orientation changes
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        enforceMobileLayout();
        window.scrollTo(0, window.scrollY + 1);
        window.scrollTo(0, window.scrollY - 1);
    }, 300);
}); 