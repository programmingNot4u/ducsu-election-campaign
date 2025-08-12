// Form handling and validation
class FormController {
  constructor() {
    this.init();
  }

  init() {
    this.setupFormValidation();
    this.setupFormSubmission();
    this.setupSpamProtection();
  }

  setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, select, textarea');
      
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearFieldError(input));
      });
      
      form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Remove existing error
    this.clearFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'এই ক্ষেত্রটি আবশ্যক';
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'সঠিক ইমেইল ঠিকানা দিন';
      }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
      const phoneRegex = /^(\+88)?01[3-9]\d{8}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = 'সঠিক ফোন নম্বর দিন (যেমন: 01712345678)';
      }
    }

    // Name validation (Bengali/English)
    if (fieldName === 'name' && value) {
      const nameRegex = /^[\u0980-\u09FF\s]+$|^[a-zA-Z\s]+$/;
      if (!nameRegex.test(value)) {
        isValid = false;
        errorMessage = 'শুধুমাত্র বাংলা বা ইংরেজি অক্ষর ব্যবহার করুন';
      }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
      color: var(--error-color);
      font-size: var(--font-size-sm);
      margin-top: var(--spacing-xs);
      animation: fadeInUp 0.3s ease;
    `;
    
    field.parentElement.appendChild(errorElement);
  }

  clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate all fields
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    // Check honeypot for spam protection
    if (formData.get('website')) {
      console.log('Spam detected');
      return;
    }

    if (isFormValid) {
      this.submitForm(form, formData);
    } else {
      this.showFormError('দয়া করে সব ক্ষেত্র সঠিকভাবে পূরণ করুন');
    }
  }

  async submitForm(form, formData) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = `
      <span class="material-icons">hourglass_empty</span>
      জমা দেওয়া হচ্ছে...
    `;
    submitButton.disabled = true;

    try {
      // Convert FormData to object
      const data = {};
      formData.forEach((value, key) => {
        if (key !== 'website') { // Exclude honeypot
          data[key] = value;
        }
      });

      // Simulate API call (replace with actual endpoint)
      await this.simulateAPICall(data);
      
      // Success
      this.showFormSuccess('আপনার তথ্য সফলভাবে জমা দেওয়া হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।');
      form.reset();
      
      // Track form submission
      this.trackFormSubmission(form.id, data);
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.showFormError('দুঃখিত, একটি সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      // Restore button
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    }
  }

  simulateAPICall(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success/failure
        if (Math.random() > 0.1) {
          resolve({ success: true, message: 'Form submitted successfully' });
        } else {
          reject(new Error('Submission failed'));
        }
      }, 2000);
    });
  }

  showFormSuccess(message) {
    this.showSnackbar(message, 'success', 5000);
  }

  showFormError(message) {
    this.showSnackbar(message, 'error', 4000);
  }

  showSnackbar(message, type = 'info', duration = 3000) {
    // Remove existing snackbars
    const existingSnackbars = document.querySelectorAll('.snackbar');
    existingSnackbars.forEach(snackbar => snackbar.remove());

    const snackbar = document.createElement('div');
    snackbar.className = `snackbar snackbar-${type}`;
    snackbar.innerHTML = `
      <span class="material-icons">
        ${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}
      </span>
      <span>${message}</span>
    `;
    
    snackbar.style.cssText = `
      position: fixed;
      bottom: var(--spacing-lg);
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--error-color)' : 'var(--surface-color)'};
      color: ${type === 'success' || type === 'error' ? 'white' : 'var(--on-surface)'};
      padding: var(--spacing-md) var(--spacing-lg);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      z-index: var(--z-popover);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      max-width: 400px;
      min-width: 300px;
      opacity: 0;
      transition: all var(--transition-normal);
    `;
    
    document.body.appendChild(snackbar);
    
    // Show snackbar
    requestAnimationFrame(() => {
      snackbar.style.opacity = '1';
      snackbar.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    // Hide snackbar
    setTimeout(() => {
      snackbar.style.opacity = '0';
      snackbar.style.transform = 'translateX(-50%) translateY(100px)';
      setTimeout(() => {
        if (document.body.contains(snackbar)) {
          document.body.removeChild(snackbar);
        }
      }, 300);
    }, duration);
  }

  setupSpamProtection() {
    // Add honeypot fields to forms that don't have them
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      if (!form.querySelector('input[name="website"]')) {
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'website';
        honeypot.style.display = 'none';
        honeypot.tabIndex = -1;
        honeypot.autocomplete = 'off';
        form.appendChild(honeypot);
      }
    });

    // Rate limiting
    this.setupRateLimit();
  }

  setupRateLimit() {
    const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    // Clean old submissions
    const recentSubmissions = submissions.filter(time => now - time < oneHour);
    localStorage.setItem('formSubmissions', JSON.stringify(recentSubmissions));
    
    // Check rate limit
    if (recentSubmissions.length >= 5) {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = 'অনেক বেশি চেষ্টা। পরে আবার চেষ্টা করুন।';
        }
      });
    }
  }

  trackFormSubmission(formId, data) {
    // Track submission time
    const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    submissions.push(Date.now());
    localStorage.setItem('formSubmissions', JSON.stringify(submissions));
    
    // Analytics tracking (if available)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_submit', {
        form_id: formId,
        form_type: data.role || 'general'
      });
    }
  }

  // Quick action handlers
  setupQuickActions() {
    const actionButtons = document.querySelectorAll('[data-action]');
    
    actionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const action = button.getAttribute('data-action');
        this.handleQuickAction(action);
      });
    });
  }

  handleQuickAction(action) {
    switch (action) {
      case 'join-rally':
        this.showJoinRallyModal();
        break;
      case 'volunteer':
        this.scrollToVolunteerForm();
        break;
      case 'donate':
        this.showDonationModal();
        break;
      default:
        console.log('Unknown action:', action);
    }
  }

  showJoinRallyModal() {
    const modal = this.createModal('পরবর্তী মিছিলে যোগদান', `
      <div class="rally-info">
        <h4>আগামী শুক্রবার বিকেল ৩টায়</h4>
        <p><strong>স্থান:</strong> ঢাকা বিশ্ববিদ্যালয় কেন্দ্রীয় খেলার মাঠ</p>
        <p><strong>বিষয়:</strong> ছাত্রদের ন্যায্য দাবি আদায়</p>
        <div class="rally-actions">
          <button class="btn-primary" onclick="this.confirmRallyJoin()">
            <span class="material-icons">event_available</span>
            যোগদান নিশ্চিত করুন
          </button>
          <button class="btn-secondary" onclick="this.shareRally()">
            <span class="material-icons">share</span>
            শেয়ার করুন
          </button>
        </div>
      </div>
    `);
    
    document.body.appendChild(modal);
    modal.classList.add('active');
  }

  scrollToVolunteerForm() {
    const form = document.getElementById('volunteer-form');
    if (form) {
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Highlight form
      form.style.boxShadow = '0 0 20px var(--primary-color)';
      setTimeout(() => {
        form.style.boxShadow = '';
      }, 2000);
    }
  }

  showDonationModal() {
    const modal = this.createModal('অনুদান প্রদান', `
      <div class="donation-info">
        <p>আমাদের আন্দোলনকে এগিয়ে নিতে আপনার সহায়তা প্রয়োজন।</p>
        <div class="donation-methods">
          <div class="donation-method">
            <h4>বিকাশ</h4>
            <p>01712345678</p>
            <button class="btn-secondary" onclick="this.copyToClipboard('01712345678')">কপি করুন</button>
          </div>
          <div class="donation-method">
            <h4>নগদ</h4>
            <p>01812345678</p>
            <button class="btn-secondary" onclick="this.copyToClipboard('01812345678')">কপি করুন</button>
          </div>
        </div>
        <p class="donation-note">অনুদানের পর দয়া করে আমাদের জানান।</p>
      </div>
    `);
    
    document.body.appendChild(modal);
    modal.classList.add('active');
  }

  createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="modal-body">
          ${content}
        </div>
      </div>
    `;
    
    // Add close functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      setTimeout(() => {
        if (document.body.contains(modal)) {
          document.body.removeChild(modal);
        }
      }, 300);
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        setTimeout(() => {
          if (document.body.contains(modal)) {
            document.body.removeChild(modal);
          }
        }, 300);
      }
    });
    
    return modal;
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.showSnackbar('ক্লিপবোর্ডে কপি হয়েছে!', 'success', 2000);
    }).catch(() => {
      this.showSnackbar('কপি করতে সমস্যা হয়েছে', 'error', 2000);
    });
  }
}

// Initialize form controller
const formController = new FormController();
formController.setupQuickActions();

// FAB click handler
document.getElementById('join-movement').addEventListener('click', () => {
  formController.scrollToVolunteerForm();
});
