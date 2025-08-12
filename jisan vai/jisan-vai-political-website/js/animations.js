// Advanced animations and effects
class AnimationController {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupHoverEffects();
    this.setupTextAnimations();
    this.setupParticleEffects();
    this.setupGlitchEffects();
  }

  setupScrollAnimations() {
    // Custom scroll-triggered animations
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animation = element.getAttribute('data-animate');
          const delay = element.getAttribute('data-delay') || 0;
          
          setTimeout(() => {
            element.classList.add(`animate-${animation}`);
          }, delay);
          
          observer.unobserve(element);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  }

  setupHoverEffects() {
    // Enhanced hover effects for cards
    const cards = document.querySelectorAll('.movement-card, .vision-card, .poetry-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        this.createRippleEffect(e);
        card.style.transform = 'translateY(-10px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  createRippleEffect(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  setupTextAnimations() {
    // Typewriter effect for hero quote
    const heroQuote = document.querySelector('.hero-quote');
    if (heroQuote) {
      this.typewriterEffect(heroQuote, 50);
    }

    // Text reveal animations
    const textElements = document.querySelectorAll('[data-text-animate]');
    textElements.forEach(element => {
      this.setupTextReveal(element);
    });
  }

  typewriterEffect(element, speed = 50) {
    const text = element.textContent;
    element.textContent = '';
    element.style.borderRight = '2px solid';
    
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
        element.style.borderRight = 'none';
      }
    }, speed);
  }

  setupTextReveal(element) {
    const text = element.textContent;
    const words = text.split(' ');
    element.innerHTML = '';
    
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.textContent = word + ' ';
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      span.style.transition = `all 0.5s ease ${index * 0.1}s`;
      element.appendChild(span);
    });
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const spans = entry.target.querySelectorAll('span');
          spans.forEach(span => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
          });
        }
      });
    });
    
    observer.observe(element);
  }

  setupParticleEffects() {
    // Floating particles for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      this.createFloatingParticles(heroSection);
    }
  }

  createFloatingParticles(container) {
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        pointer-events: none;
        animation: float ${5 + Math.random() * 10}s infinite linear;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 5}s;
      `;
      
      container.appendChild(particle);
    }
    
    // Add CSS animation for floating particles
    if (!document.querySelector('#particle-styles')) {
      const style = document.createElement('style');
      style.id = 'particle-styles';
      style.textContent = `
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  setupGlitchEffects() {
    // Glitch effect for special text elements
    const glitchElements = document.querySelectorAll('[data-glitch]');
    
    glitchElements.forEach(element => {
      element.setAttribute('data-text', element.textContent);
      element.addEventListener('mouseenter', () => {
        element.classList.add('glitch');
        setTimeout(() => {
          element.classList.remove('glitch');
        }, 1000);
      });
    });
  }

  // Parallax scrolling effect
  setupParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-parallax') || 0.5;
        const yPos = -(scrollTop * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  // Magnetic effect for buttons
  setupMagneticEffect() {
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    
    magneticElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0, 0)';
      });
    });
  }

  // Smooth page transitions
  setupPageTransitions() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Add transition overlay
          const overlay = document.createElement('div');
          overlay.className = 'page-transition-overlay';
          overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--primary-color);
            z-index: 9999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
          `;
          
          document.body.appendChild(overlay);
          
          // Trigger transition
          requestAnimationFrame(() => {
            overlay.style.opacity = '0.8';
            
            setTimeout(() => {
              // Scroll to target
              const headerHeight = document.getElementById('header').offsetHeight;
              const targetPosition = targetElement.offsetTop - headerHeight - 20;
              
              window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
              });
              
              // Remove overlay
              setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                  document.body.removeChild(overlay);
                }, 300);
              }, 500);
            }, 200);
          });
        }
      });
    });
  }

  // Stagger animation for lists
  staggerAnimation(elements, delay = 100) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('animate-fadeInUp');
      }, index * delay);
    });
  }

  // Morphing shapes animation
  setupMorphingShapes() {
    const shapes = document.querySelectorAll('[data-morph]');
    
    shapes.forEach(shape => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            shape.style.animation = 'morph 3s ease-in-out infinite';
          }
        });
      });
      
      observer.observe(shape);
    });
    
    // Add morphing keyframes
    if (!document.querySelector('#morph-styles')) {
      const style = document.createElement('style');
      style.id = 'morph-styles';
      style.textContent = `
        @keyframes morph {
          0%, 100% { border-radius: 50% 50% 50% 50%; }
          25% { border-radius: 60% 40% 30% 70%; }
          50% { border-radius: 30% 60% 70% 40%; }
          75% { border-radius: 40% 30% 60% 50%; }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Initialize animation controller
const animationController = new AnimationController();
