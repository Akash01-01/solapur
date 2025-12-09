/* ===================================
   EVERGREEN SOLAR WORKS - MAIN JAVASCRIPT
   =================================== */

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functionality
  initializeHeroSlider();
  initializeNavigation();
  initializeAOS();
  initializeScrollEffects();
  initializeProjectFilters();
  initializeForms();
  initializeLazyLoading();
  initializeCounters();
  initializeScrollToTop();

  // Ensure Get Free Quote opens in same tab (normal navigation)
  var quoteBtn = document.querySelector('a[href="quote.html"].btn-primary');
  if (quoteBtn) {
    quoteBtn.addEventListener("click", function () {
      // let browser handle normal navigation in same tab
    });
  }
});

/* ===================================
   HERO SLIDER FUNCTIONALITY
   =================================== */

function initializeHeroSlider() {
  const slider = document.querySelector(".hero-slider");
  const slides = document.querySelectorAll(".hero-slide");
  const prevBtn = document.querySelector(".hero-prev");
  const nextBtn = document.querySelector(".hero-next");
  const indicators = document.querySelectorAll(".hero-indicator");

  if (!slider || slides.length === 0) return;

  let currentSlide = 0;
  let isTransitioning = false;
  let autoplayTimer;
  let touchStartX = 0;
  let touchEndX = 0;

  // Initialize slider
  function init() {
    showSlide(0);
    startAutoplay();
    addEventListeners();
  }

  // Show specific slide
  function showSlide(index, direction = "next") {
    if (isTransitioning) return;

    isTransitioning = true;

    // Remove active classes
    slides.forEach((slide) => {
      slide.classList.remove("active", "prev");
    });

    indicators.forEach((indicator) => {
      indicator.classList.remove("active");
    });

    // Add prev class to current slide for animation
    if (direction === "prev") {
      slides[currentSlide].classList.add("prev");
    }

    // Update current slide
    currentSlide = index;

    // Show new slide
    setTimeout(() => {
      slides[currentSlide].classList.add("active");
      indicators[currentSlide].classList.add("active");

      // Reset transition flag
      setTimeout(() => {
        isTransitioning = false;
      }, 800);
    }, 50);
  }

  // Next slide
  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next, "next");
    restartAutoplay();
  }

  // Previous slide
  function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev, "prev");
    restartAutoplay();
  }

  // Start autoplay
  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      if (!document.hidden && !isTransitioning) {
        nextSlide();
      }
    }, 12000); // Set to 12 seconds for better viewing duration
  }

  // Stop autoplay
  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
    }
  }

  // Restart autoplay
  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Handle touch events for swipe
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next slide
        nextSlide();
      } else {
        // Swipe right - previous slide
        prevSlide();
      }
    }
  }

  // Add event listeners
  function addEventListeners() {
    // Navigation buttons
    if (prevBtn) {
      prevBtn.addEventListener("click", prevSlide);
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", nextSlide);
    }

    // Indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        if (index !== currentSlide) {
          showSlide(index, index > currentSlide ? "next" : "prev");
          restartAutoplay();
        }
      });
    });

    // Touch events for mobile swipe
    slider.addEventListener("touchstart", handleTouchStart, { passive: true });
    slider.addEventListener("touchend", handleTouchEnd, { passive: true });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    });

    // Pause autoplay on hover
    // NOTE: autoplay intentionally continuous (no pause on hover/focus)
    // Keep autoplay running regardless of hover/focus to ensure automatic slideshow
    // Still respect page visibility to avoid running in background tabs
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
  }

  // Preload images
  function preloadImages() {
    slides.forEach((slide, index) => {
      const img = slide.querySelector(".hero-image");
      if (img && img.src) {
        const preloadImg = new Image();
        preloadImg.src = img.src;
      }
    });
  }

  // Initialize everything
  preloadImages();
  init();

  // Expose methods for external use
  window.heroSlider = {
    next: nextSlide,
    prev: prevSlide,
    goTo: showSlide,
    play: startAutoplay,
    pause: stopAutoplay,
  };
}

/* ===================================
   NAVIGATION FUNCTIONALITY
   =================================== */

function initializeNavigation() {
  const header = document.getElementById("header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
      document.body.classList.toggle("nav-open");
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
        document.body.classList.remove("nav-open");
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
        document.body.classList.remove("nav-open");
      }
    });
  }

  // Header scroll effect with hide/show functionality
  let lastScrollY = window.scrollY;
  
  window.addEventListener("scroll", function () {
    const currentScrollY = window.scrollY;
    
    // Add scrolled class after 100px
    if (currentScrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    
    // Hide/show header based on scroll direction
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      // Scrolling down - hide header
      header.classList.add("hidden");
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up - show header
      header.classList.remove("hidden");
    }
    
    lastScrollY = currentScrollY;
  });

  // Active navigation link
  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (
        link.getAttribute("href") === currentPath ||
        (currentPath.includes(link.getAttribute("href").replace(".html", "")) &&
          link.getAttribute("href") !== "index.html")
      ) {
        link.classList.add("active");
      }
    });
  }
  setActiveNavLink();
}

/* ===================================
   AOS (ANIMATE ON SCROLL) INITIALIZATION
   =================================== */

function initializeAOS() {
  if (typeof AOS !== "undefined") {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    AOS.init({
      duration: prefersReducedMotion ? 0 : 600,
      easing: "ease-out-cubic",
      once: true,
      offset: 100,
      disable: prefersReducedMotion ? true : false,
    });

    // Custom AOS animations
    const customAnimations = {
      "slide-up": {
        in: function (el) {
          el.style.transform = "translate3d(0, 0, 0)";
          el.style.opacity = "1";
        },
        out: function (el) {
          el.style.transform = "translate3d(0, 30px, 0)";
          el.style.opacity = "0";
        },
      },
    };

    // Apply custom animations
    document.querySelectorAll('[data-aos="slide-up"]').forEach((el) => {
      if (!prefersReducedMotion) {
        customAnimations["slide-up"].out(el);
      }
    });
  }
}

/* ===================================
   SCROLL EFFECTS
   =================================== */

function initializeScrollEffects() {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerHeight = document.getElementById("header").offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Parallax disabled to avoid first-slide image shifting and revealing gap.
  // Removed JS transform on scroll so CSS-only transforms control visuals.
}

/* ===================================
   PROJECT FILTERS
   =================================== */

function initializeProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Filter projects
      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");

        if (filter === "all" || category === filter) {
          card.style.display = "block";
          card.style.animation = "fadeInUp 0.5s ease forwards";
        } else {
          card.style.display = "none";
        }
      });

      // Refresh AOS animations
      if (typeof AOS !== "undefined") {
        AOS.refresh();
      }
    });
  });
}

/* ===================================
   FORM HANDLING
   =================================== */

function initializeForms() {
  const quoteForm = document.getElementById("quoteForm");
  const contactForm = document.getElementById("contactForm");

  // Quote form submission
  if (quoteForm) {
    quoteForm.addEventListener("submit", handleQuoteSubmission);
  }

  // Contact form submission
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmission);
  }

  // Real-time validation
  const formInputs = document.querySelectorAll("input, select, textarea");
  formInputs.forEach((input) => {
    input.addEventListener("blur", validateField);
    input.addEventListener("input", clearFieldError);
  });
}

function handleQuoteSubmission(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const submitButton = form.querySelector('button[type="submit"]');

  // Validate form
  if (!validateForm(form)) {
    return;
  }

  // Show loading state
  submitButton.classList.add("loading");
  submitButton.textContent = "Sending...";
  submitButton.disabled = true;

  // Simulate form submission (replace with actual endpoint)
  setTimeout(() => {
    showSuccessMessage(
      "Thank you! Your request has been received. Our solar expert will contact you within 48 hours."
    );
    form.reset();

    // Reset button
    submitButton.classList.remove("loading");
    submitButton.textContent = "Request Free Quote";
    submitButton.disabled = false;
  }, 2000);
}

function handleContactSubmission(e) {
  e.preventDefault();

  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');

  if (!validateForm(form)) {
    return;
  }

  submitButton.classList.add("loading");
  submitButton.textContent = "Sending...";
  submitButton.disabled = true;

  setTimeout(() => {
    showSuccessMessage(
      "Thank you for your message! We will get back to you soon."
    );
    form.reset();

    submitButton.classList.remove("loading");
    submitButton.textContent = "Send Message";
    submitButton.disabled = false;
  }, 2000);
}

function validateForm(form) {
  const requiredFields = form.querySelectorAll("[required]");
  let isValid = true;

  requiredFields.forEach((field) => {
    if (!validateField({ target: field })) {
      isValid = false;
    }
  });

  return isValid;
}

function validateField(e) {
  const field = e.target;
  const value = field.value.trim();
  const fieldType = field.type;
  const isRequired = field.hasAttribute("required");

  // Clear previous error
  clearFieldError(e);

  // Check if required field is empty
  if (isRequired && !value) {
    showFieldError(field, "This field is required");
    return false;
  }

  // Email validation
  if (fieldType === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      showFieldError(field, "Please enter a valid email address");
      return false;
    }
  }

  // Phone validation
  if (fieldType === "tel" && value) {
    const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(value) || value.length < 10) {
      showFieldError(field, "Please enter a valid phone number");
      return false;
    }
  }

  return true;
}

function showFieldError(field, message) {
  field.classList.add("invalid");

  let errorElement = field.parentNode.querySelector(".error-message");
  if (!errorElement) {
    errorElement = document.createElement("div");
    errorElement.className = "error-message";
    field.parentNode.appendChild(errorElement);
  }

  errorElement.textContent = message;
}

function clearFieldError(e) {
  const field = e.target;
  field.classList.remove("invalid");

  const errorElement = field.parentNode.querySelector(".error-message");
  if (errorElement) {
    errorElement.remove();
  }
}

function showSuccessMessage(message) {
  // Create modal or use existing success display method
  const modal = document.createElement("div");
  modal.className = "success-modal";
  modal.innerHTML = `
        <div class="modal-content">
            <div class="success-icon">✓</div>
            <h3>Success!</h3>
            <p>${message}</p>
            <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">OK</button>
        </div>
    `;

  document.body.appendChild(modal);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (modal.parentElement) {
      modal.remove();
    }
  }, 5000);
}

/* ===================================
   LAZY LOADING
   =================================== */

function initializeLazyLoading() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove("lazy");
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => {
      img.classList.add("lazy");
      imageObserver.observe(img);
    });
  }
}

/* ===================================
   QUICK STATS COUNTER
   =================================== */
function initializeCounters() {
  // Target both quick-stats and the statistics strip
  const counters = document.querySelectorAll(".count-num, .stat-number");
  if (!counters || counters.length === 0) return;

  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const animateCount = (
    el,
    target,
    duration = 1500,
    prefix = "",
    suffix = ""
  ) => {
    if (prefersReducedMotion) {
      el.textContent =
        (prefix ? prefix : "") +
        Number(target).toLocaleString() +
        (suffix ? suffix : "");
      return;
    }

    target = Number(target);
    const start = performance.now();
    const initial = 0;

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * (target - initial) + initial);
      el.textContent =
        (prefix ? prefix : "") +
        value.toLocaleString() +
        (suffix ? suffix : "");

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent =
          (prefix ? prefix : "") +
          target.toLocaleString() +
          (suffix ? suffix : "");
      }
    };

    requestAnimationFrame(step);
  };

  const parseTargetAndAffixes = (raw) => {
    if (!raw) return { valid: false };
    raw = String(raw).trim();
    // Find first numeric sequence (allows commas and decimals)
    const m = raw.match(/[0-9][0-9,\.\s]*/);
    if (!m) return { valid: false };
    const numStr = m[0].replace(/\s+/g, "").replace(/,/g, "");
    const prefix = raw.slice(0, m.index).trim();
    const suffix = raw.slice(m.index + m[0].length).trim();
    return {
      valid: true,
      target: Number(numStr) || 0,
      prefix: prefix ? prefix : "",
      suffix: suffix ? suffix : "",
    };
  };

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            if (el.dataset.animated) return;
            // Use stored original value or data-target
            const raw =
              el.dataset.originalValue || el.getAttribute("data-target") || "";
            const parsed = parseTargetAndAffixes(raw);
            if (!parsed.valid) {
              // nothing to animate; leave text as-is
              el.dataset.animated = "true";
              observer.unobserve(el);
              return;
            }
            // Animate from 0 to target
            animateCount(el, parsed.target, 1500, parsed.prefix, parsed.suffix);
            el.dataset.animated = "true";
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach((c) => {
      const raw = c.getAttribute("data-target") || c.textContent || "";
      const parsed = parseTargetAndAffixes(raw);
      if (!parsed.valid) {
        // leave non-numeric content as-is
        io.observe(c);
        return;
      }
      // Store original value before changing to 0
      c.dataset.originalValue = raw;
      c.textContent =
        (parsed.prefix ? parsed.prefix : "") +
        "0" +
        (parsed.suffix ? parsed.suffix : "");
      io.observe(c);
    });

    // Fallback: Animate any counters that are already in viewport after a short delay
    setTimeout(() => {
      counters.forEach((c) => {
        if (c.dataset.animated) return; // Already animated

        const rect = c.getBoundingClientRect();
        const isInViewport =
          rect.top >= -100 && rect.top <= window.innerHeight + 100;

        if (isInViewport) {
          const raw =
            c.dataset.originalValue || c.getAttribute("data-target") || "";
          const parsed = parseTargetAndAffixes(raw);
          if (parsed.valid) {
            animateCount(c, parsed.target, 1500, parsed.prefix, parsed.suffix);
            c.dataset.animated = "true";
            io.unobserve(c);
          }
        }
      });
    }, 300);
  } else {
    // Fallback: animate immediately
    counters.forEach((c) => {
      const raw = c.getAttribute("data-target") || c.textContent || "";
      const parsed = parseTargetAndAffixes(raw);
      if (!parsed.valid) return;
      animateCount(c, parsed.target, 1500, parsed.prefix, parsed.suffix);
    });
  }
}

/* ===================================
   SCROLL TO TOP
   =================================== */

function initializeScrollToTop() {
  // Create scroll to top button
  const scrollToTopBtn = document.createElement("button");
  scrollToTopBtn.innerHTML = "↑";
  scrollToTopBtn.className = "scroll-to-top";
  scrollToTopBtn.setAttribute("aria-label", "Scroll to top");
  document.body.appendChild(scrollToTopBtn);

  // Show/hide button based on scroll position
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }
  });

  // Scroll to top functionality
  scrollToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

/* ===================================
   UTILITY FUNCTIONS
   =================================== */

// Debounce function for performance
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction() {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Performance optimized scroll events
window.addEventListener(
  "scroll",
  throttle(function () {
    // Add any scroll-based functionality here
  }, 16)
); // ~60fps

/* ===================================
   ACCESSIBILITY ENHANCEMENTS
   =================================== */

// Keyboard navigation
document.addEventListener("keydown", function (e) {
  // ESC key to close mobile menu
  if (e.key === "Escape") {
    const navMenu = document.getElementById("nav-menu");
    const navToggle = document.getElementById("nav-toggle");

    if (navMenu && navMenu.classList.contains("active")) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
      document.body.classList.remove("nav-open");
    }
  }
});

// Focus management for mobile menu
function manageFocus() {
  const navMenu = document.getElementById("nav-menu");
  const focusableElements = navMenu.querySelectorAll("a, button");

  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }
}

/* ===================================
   PERFORMANCE MONITORING
   =================================== */

// Performance observer for Core Web Vitals
if ("PerformanceObserver" in window) {
  // Largest Contentful Paint
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log("LCP:", entry.startTime);
    }
  }).observe({ entryTypes: ["largest-contentful-paint"] });

  // First Input Delay
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log("FID:", entry.processingStart - entry.startTime);
    }
  }).observe({ entryTypes: ["first-input"] });

  // Cumulative Layout Shift
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        console.log("CLS:", entry.value);
      }
    }
  }).observe({ entryTypes: ["layout-shift"] });
}

/* ===================================
   ERROR HANDLING
   =================================== */

// Global error handler
window.addEventListener("error", function (e) {
  console.error("JavaScript Error:", e.error);
  // You could send this to an analytics service
});

// Unhandled promise rejection handler
window.addEventListener("unhandledrejection", function (e) {
  console.error("Unhandled Promise Rejection:", e.reason);
  e.preventDefault();
});

/* ===================================
   ADDITIONAL STYLING FOR JS COMPONENTS
   =================================== */

// Add CSS for scroll-to-top button and success modal
const additionalStyles = `
<style>
.scroll-to-top {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background-color: var(--primary-color);
    color: var(--text-light);
    border: none;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transform: translateY(20px);
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.scroll-to-top.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.scroll-to-top:hover {
    background-color: var(--accent-color);
    color: var(--text-dark);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.success-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
}

.modal-content {
    background-color: var(--text-light);
    padding: var(--spacing-xl);
    border-radius: 12px;
    text-align: center;
    max-width: 400px;
    width: 90%;
    animation: slideUp 0.3s ease;
}

.success-icon {
    width: 60px;
    height: 60px;
    background-color: var(--success-color);
    color: var(--text-light);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    margin: 0 auto var(--spacing-md);
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

.lazy {
    opacity: 0;
    transition: opacity 0.3s;
}

.lazy.loaded {
    opacity: 1;
}

@media (max-width: 768px) {
    .scroll-to-top {
        bottom: 20px;
        right: 20px;
        width: 45px;
        height: 45px;
        font-size: 18px;
    }
}
</style>
`;

document.head.insertAdjacentHTML("beforeend", additionalStyles);
