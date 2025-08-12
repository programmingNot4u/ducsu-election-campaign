// Main JavaScript functionality
class JisanVaiWebsite {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeComponents();
    this.handleLoading();
    this.setupScrollEffects();
    this.initializeTheme();
    this.setupNavigation();
    this.setupVideoHandling();
    this.setupLazyLoading();
  }

  setupEventListeners() {
    // DOM Content Loaded
    document.addEventListener('DOMContentLoaded', () => {
      this.initializeAOS();
    });

    // Window events
    window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
    window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
    window.addEventListener('load', this.handleWindowLoad.bind(this));
  }

  initializeComponents() {
    // Initialize all interactive components
    this.setupFilterTabs();
    this.setupAccordions();
    this.setupModals();
    this.setupDropdowns();
    this.setupTooltips();
  }

  handleLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    const progressBar = document.querySelector('.loading-progress');
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          loadingScreen.classList.add('hidden');
        }, 500);
      }
      progressBar.style.width = `${progress}%`;
    }, 100);
  }

  initializeAOS() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100,
        delay: 0,
      });
    }
  }

  setupScrollEffects() {
    // Header hide/show on scroll
    let lastScrollTop = 0;
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        header.classList.add('hidden');
      } else {
        // Scrolling up
        header.classList.remove('hidden');
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Parallax effect for hero video
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroVideo.style.transform = `translateY(${rate}px)`;
      });
    }
  }

  initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    this.updateThemeIcon(currentTheme);
    
    // Theme toggle handler
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      this.updateThemeIcon(newTheme);
      
      // Add transition class for smooth theme change
      document.body.classList.add('theme-transition');
      setTimeout(() => {
        document.body.classList.remove('theme-transition');
      }, 300);
    });
  }

  updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('.material-icons');
    icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
  }

  setupNavigation() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerHeight = document.getElementById('header').offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update active navigation
          this.updateActiveNavigation(targetId);
        }
      });
    });

    // Update active navigation on scroll
    window.addEventListener('scroll', this.throttle(() => {
      this.updateActiveNavigationOnScroll();
    }, 100));
  }

  updateActiveNavigation(activeId) {
    // Update desktop navigation
    const desktopNavLinks = document.querySelectorAll('.nav-desktop .nav-link');
    desktopNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === activeId) {
        link.classList.add('active');
      }
    });

    // Update bottom navigation
    const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');
    bottomNavItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === activeId) {
        item.classList.add('active');
      }
    });
  }

  updateActiveNavigationOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const headerHeight = document.getElementById('header').offsetHeight;
    
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerHeight - 100;
      const sectionHeight = section.offsetHeight;
      
      if (window.pageYOffset >= sectionTop && 
          window.pageYOffset < sectionTop + sectionHeight) {
        currentSection = '#' + section.getAttribute('id');
      }
    });
    
    if (currentSection) {
      this.updateActiveNavigation(currentSection);
    }
  }

  setupVideoHandling() {
    // Video modal functionality
    const videoModal = document.getElementById('video-modal');
    const modalVideo = document.getElementById('modal-video');
    const modalClose = document.querySelector('.video-modal-close');
    const playButtons = document.querySelectorAll('.play-button');

    playButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const card = button.closest('.movement-card');
        const videoSrc = this.getVideoSource(card);
        
        if (videoSrc) {
          modalVideo.src = videoSrc;
          videoModal.classList.add('active');
          modalVideo.play();
        }
      });
    });

    // Close modal
    modalClose.addEventListener('click', () => {
      videoModal.classList.remove('active');
      modalVideo.pause();
      modalVideo.src = '';
    });

    // Close on backdrop click
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        videoModal.classList.remove('active');
        modalVideo.pause();
        modalVideo.src = '';
      }
    });

    // Hero video optimization
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
      // Pause video when not in viewport
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            heroVideo.play();
          } else {
            heroVideo.pause();
          }
        });
      });
      observer.observe(heroVideo);
    }
  }

  getVideoSource(card) {
    // This would normally get the video source from data attributes
    // For demo purposes, return a placeholder
    return '/placeholder.mp4';
  }

  setupLazyLoading() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  setupFilterTabs() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const movementCards = document.querySelectorAll('.movement-card');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter cards
        movementCards.forEach(card => {
          const category = card.getAttribute('data-category');
          
          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            card.classList.add('animate-fadeInUp');
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  setupAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const accordionItem = header.parentElement;
        const isActive = accordionItem.classList.contains('active');
        
        // Close all accordion items
        document.querySelectorAll('.accordion-item').forEach(item => {
          item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
          accordionItem.classList.add('active');
        }
      });
    });
  }

  setupModals() {
    // Generic modal functionality
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal-close');
    
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });
    
    modalCloses.forEach(close => {
      close.addEventListener('click', () => {
        const modal = close.closest('.modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    
    // Close on backdrop click
    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
  }

  setupDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.dropdown-trigger');
      
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          dropdown.classList.toggle('active');
        });
      }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('active');
        });
      }
    });
  }

  setupTooltips() {
    // Tooltip functionality is handled via CSS
    // This is for any additional JavaScript-based tooltip logic
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(tooltip => {
      tooltip.addEventListener('mouseenter', () => {
        // Additional tooltip logic if needed
      });
    });
  }

  handleScroll() {
    // Handle scroll-based animations and effects
    const scrollTop = window.pageYOffset;
    
    // Update scroll progress indicator if exists
    const scrollIndicator = document.querySelector('.scroll-progress');
    if (scrollIndicator) {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / windowHeight) * 100;
      scrollIndicator.style.width = `${scrolled}%`;
    }
  }

  handleResize() {
    // Handle responsive adjustments
    this.updateVideoAspectRatio();
    this.adjustTimelineLayout();
  }

  handleWindowLoad() {
    // Final setup after everything is loaded
    this.optimizePerformance();
    this.setupServiceWorker();
  }

  updateVideoAspectRatio() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      // Maintain aspect ratio on resize
      const aspectRatio = video.videoWidth / video.videoHeight;
      const containerWidth = video.parentElement.offsetWidth;
      video.style.height = `${containerWidth / aspectRatio}px`;
    });
  }

  adjustTimelineLayout() {
    // Adjust timeline layout for mobile
    const timeline = document.querySelector('.timeline');
    if (timeline && window.innerWidth < 768) {
      timeline.classList.add('mobile-layout');
    } else if (timeline) {
      timeline.classList.remove('mobile-layout');
    }
  }

  optimizePerformance() {
    // Performance optimizations
    this.preloadCriticalResources();
    this.setupIntersectionObservers();
  }

  preloadCriticalResources() {
    // Preload next section images when user scrolls
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const nextSection = entry.target.nextElementSibling;
          if (nextSection) {
            const images = nextSection.querySelectorAll('img[data-src]');
            images.forEach(img => {
              img.src = img.getAttribute('data-src');
              img.removeAttribute('data-src');
            });
          }
        }
      });
    }, { rootMargin: '100px' });

    sections.forEach(section => observer.observe(section));
  }

  setupIntersectionObservers() {
    // Setup observers for various scroll-based animations
    const animatedElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => revealObserver.observe(el));
  }

  setupServiceWorker() {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }

  // Utility functions
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  debounce(func, wait, immediate) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  // Public methods for external access
  showSnackbar(message, type = 'info', duration = 3000) {
    const snackbar = document.createElement('div');
    snackbar.className = `snackbar snackbar-${type}`;
    snackbar.textContent = message;
    
    document.body.appendChild(snackbar);
    
    setTimeout(() => {
      snackbar.classList.add('active');
    }, 100);
    
    setTimeout(() => {
      snackbar.classList.remove('active');
      setTimeout(() => {
        document.body.removeChild(snackbar);
      }, 300);
    }, duration);
  }

  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerHeight = document.getElementById('header').offsetHeight;
      const targetPosition = section.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
}

// Initialize the website
const website = new JisanVaiWebsite();

// Make website instance globally available
window.JisanVaiWebsite = website;
