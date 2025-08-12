// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const themeToggle = document.getElementById('theme-toggle');
const navItems = document.querySelectorAll('.nav-item');
const heroVideo = document.getElementById('hero-video');
const joinMovementBtn = document.getElementById('join-movement');
const signupForm = document.getElementById('signup-form');
const videoCards = document.querySelectorAll('.video-card');
const struggleCards = document.querySelectorAll('.struggle-card');
const poetryCards = document.querySelectorAll('.poetry-card');
const voicePlayBtns = document.querySelectorAll('.voice-play-btn');
const testimonialSlider = document.getElementById('testimonial-slider');
const videoModal = document.getElementById('video-modal');
const modalVideo = document.getElementById('modal-video');
const videoClose = document.querySelector('.video-close');

// State Management
let currentTestimonial = 0;
let isVideoPlaying = false;
let captchaAnswer = 0;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 2000);

    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Setup event listeners
    setupEventListeners();
    
    // Initialize components
    initializeNavigation();
    initializeTheme();
    initializeCaptcha();
    initializeTestimonialSlider();
    initializeVideoEffects();
    
    // Setup smooth scrolling
    setupSmoothScrolling();
}

function setupEventListeners() {
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', handleNavigation);
    });
    
    // Join movement button
    joinMovementBtn.addEventListener('click', () => {
        document.getElementById('get-involved').scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    // Form submission
    signupForm.addEventListener('submit', handleFormSubmission);
    
    // Video cards
    videoCards.forEach(card => {
        card.addEventListener('click', handleVideoClick);
    });
    
    // Struggle cards
    struggleCards.forEach(card => {
        card.addEventListener('click', handleStruggleClick);
    });
    
    // Voice play buttons
    voicePlayBtns.forEach(btn => {
        btn.addEventListener('click', handleVoicePlay);
    });
    
    // Video modal close
    videoClose.addEventListener('click', closeVideoModal);
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });
    
    // Scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Resize events
    window.addEventListener('resize', handleResize);
    
    // Keyboard events
    document.addEventListener('keydown', handleKeyboard);
}

function initializeNavigation() {
    // Set active navigation item based on current section
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                updateActiveNavItem(sectionId);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

function updateActiveNavItem(sectionId) {
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionId) {
            item.classList.add('active');
        }
    });
}

function handleNavigation(e) {
    e.preventDefault();
    const targetSection = e.currentTarget.getAttribute('href');
    document.querySelector(targetSection).scrollIntoView({
        behavior: 'smooth'
    });
}

function initializeTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<span class="material-symbols-outlined">light_mode</span>';
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    // Update button icon
    themeToggle.innerHTML = isDark 
        ? '<span class="material-symbols-outlined">light_mode</span>'
        : '<span class="material-symbols-outlined">dark_mode</span>';
    
    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Add ripple effect
    createRippleEffect(themeToggle);
}

function initializeCaptcha() {
    generateCaptcha();
}

function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let question, answer;
    
    switch(operation) {
        case '+':
            question = `${num1} + ${num2} = ?`;
            answer = num1 + num2;
            break;
        case '-':
            const larger = Math.max(num1, num2);
            const smaller = Math.min(num1, num2);
            question = `${larger} - ${smaller} = ?`;
            answer = larger - smaller;
            break;
        case '×':
            question = `${num1} × ${num2} = ?`;
            answer = num1 * num2;
            break;
    }
    
    document.getElementById('captcha-question').textContent = question;
    captchaAnswer = answer;
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    // Validate form
    const formData = new FormData(signupForm);
    const userAnswer = parseInt(document.getElementById('captcha-answer').value);
    
    if (userAnswer !== captchaAnswer) {
        showNotification('ক্যাপচার উত্তর সঠিক নয়। আবার চেষ্টা করুন।', 'error');
        generateCaptcha();
        return;
    }
    
    // Simulate form submission
    const submitBtn = signupForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span> প্রক্রিয়াকরণ...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('সফলভাবে নিবন্ধিত হয়েছেন! আমরা শীঘ্রই যোগাযোগ করব।', 'success');
        signupForm.reset();
        generateCaptcha();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function handleVideoClick(e) {
    const videoCard = e.currentTarget;
    const videoSrc = '/placeholder.mp4?height=720&width=1280&query=political campaign video speech rally';
    
    modalVideo.src = videoSrc;
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add analytics tracking
    trackEvent('video_play', {
        video_title: videoCard.querySelector('h3').textContent
    });
}

function handleStruggleClick(e) {
    const card = e.currentTarget;
    const videoSrc = '/placeholder.mp4?height=720&width=1280&query=student protest movement rally march';
    
    modalVideo.src = videoSrc;
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add shake effect to simulate raw footage
    modalVideo.style.filter = 'contrast(1.1) saturate(1.2)';
    modalVideo.style.animation = 'shake 0.5s ease-in-out infinite alternate';
}

function closeVideoModal() {
    videoModal.classList.remove('active');
    modalVideo.pause();
    modalVideo.src = '';
    document.body.style.overflow = 'auto';
    modalVideo.style.filter = '';
    modalVideo.style.animation = '';
}

function handleVoicePlay(e) {
    const btn = e.currentTarget;
    const originalText = btn.innerHTML;
    
    if (isVideoPlaying) {
        return;
    }
    
    isVideoPlaying = true;
    btn.innerHTML = '<span class="material-symbols-outlined">pause</span> বন্ধ করুন';
    
    // Simulate audio playback
    setTimeout(() => {
        btn.innerHTML = originalText;
        isVideoPlaying = false;
        showNotification('কবিতা শেষ হয়েছে।', 'info');
    }, 5000);
    
    // Animate poetry lines
    const poetryCard = btn.closest('.poetry-card');
    const lines = poetryCard.querySelectorAll('.poetry-line');
    
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.style.background = 'linear-gradient(90deg, #1976d2, transparent)';
            line.style.backgroundSize = '100% 2px';
            line.style.backgroundRepeat = 'no-repeat';
            line.style.backgroundPosition = 'bottom';
            
            setTimeout(() => {
                line.style.background = '';
            }, 1000);
        }, index * 1000);
    });
}

function initializeTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    
    if (testimonials.length === 0) return;
    
    setInterval(() => {
        testimonials[currentTestimonial].classList.remove('active');
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial].classList.add('active');
    }, 4000);
}

function initializeVideoEffects() {
    // Add shaky effect to hero video
    if (heroVideo) {
        heroVideo.addEventListener('loadeddata', () => {
            heroVideo.style.filter = 'contrast(1.1) saturate(1.2)';
        });
    }
}

function handleScroll() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    // Parallax effect for hero section
    if (heroVideo) {
        heroVideo.style.transform = `translateY(${rate}px)`;
    }
    
    // Show/hide bottom navigation based on scroll direction
    const bottomNav = document.getElementById('bottom-nav');
    if (scrolled > 100) {
        bottomNav.style.transform = 'translateY(0)';
    }
}

function handleResize() {
    // Adjust video modal size
    const modalContent = document.querySelector('.video-modal-content');
    if (modalContent) {
        const maxWidth = window.innerWidth * 0.9;
        const maxHeight = window.innerHeight * 0.9;
        modalContent.style.maxWidth = `${maxWidth}px`;
        modalContent.style.maxHeight = `${maxHeight}px`;
    }
}

function handleKeyboard(e) {
    // Close video modal with Escape key
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeVideoModal();
    }
    
    // Navigation with arrow keys
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const sections = Array.from(document.querySelectorAll('.section'));
        const currentSection = sections.find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
        });
        
        if (currentSection) {
            const currentIndex = sections.indexOf(currentSection);
            let nextIndex;
            
            if (e.key === 'ArrowDown') {
                nextIndex = Math.min(currentIndex + 1, sections.length - 1);
            } else {
                nextIndex = Math.max(currentIndex - 1, 0);
            }
            
            sections[nextIndex].scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function setupSmoothScrolling() {
    // Enhanced smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add momentum scrolling for iOS
    document.body.style.webkitOverflowScrolling = 'touch';
}

function createRippleEffect(element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.pointerEvents = 'none';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="material-symbols-outlined">
            ${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}
        </span>
        <span>${message}</span>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: var(--font-family);
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

function trackEvent(eventName, parameters = {}) {
    // Analytics tracking (placeholder)
    console.log('Event tracked:', eventName, parameters);
    
    // In a real implementation, you would send this to your analytics service
    // Example: gtag('event', eventName, parameters);
}

// Performance optimizations
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// Accessibility enhancements
function enhanceAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroSection.setAttribute('id', 'main-content');
        heroSection.setAttribute('role', 'main');
    }
    
    // Enhance form accessibility
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label && input.hasAttribute('required')) {
            label.innerHTML += ' <span aria-label="required">*</span>';
        }
    });
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    showNotification('একটি ত্রুটি ঘটেছে। পৃষ্ঠা রিফ্রেশ করে আবার চেষ্টা করুন।', 'error');
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});
