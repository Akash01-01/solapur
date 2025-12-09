// Contact Page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  initializeContactPage();
});

function initializeContactPage() {
  initializeFAQAccordion();
  initializeContactForms();
  initializeMapInteraction();
}

function initializeFAQAccordion() {
  // Use delegated event handling for robustness and to avoid duplicate listeners
  const faqGrid = document.querySelector(".faq-grid");
  if (!faqGrid) return;

  const faqItems = faqGrid.querySelectorAll(".faq-item");

  // Initialize states
  faqItems.forEach((item) => {
    const header = item.querySelector(".faq-question");
    const content = item.querySelector(".faq-answer");
    const icon = header ? header.querySelector("i") : null;
    if (header) header.setAttribute("aria-expanded", "false");
    if (content) content.style.maxHeight = null;
    if (icon) icon.style.transform = "rotate(0deg)";
  });

  // Delegated click handler on the grid
  faqGrid.addEventListener("click", (e) => {
    const header = e.target.closest(".faq-question");
    if (!header) return;

    const item = header.closest(".faq-item");
    if (!item) return;

    const content = item.querySelector(".faq-answer");
    const icon = header.querySelector("i");
    const isActive = item.classList.contains("active");

    // Close other items
    faqItems.forEach((other) => {
      if (other === item) return;
      other.classList.remove("active");
      const otherContent = other.querySelector(".faq-answer");
      const otherHeader = other.querySelector(".faq-question");
      const otherIcon = otherHeader ? otherHeader.querySelector("i") : null;
      if (otherContent) otherContent.style.maxHeight = null;
      if (otherIcon) otherIcon.style.transform = "rotate(0deg)";
      if (otherHeader) otherHeader.setAttribute("aria-expanded", "false");
    });

    if (isActive) {
      item.classList.remove("active");
      if (content) content.style.maxHeight = null;
      if (icon) icon.style.transform = "rotate(0deg)";
      header.setAttribute("aria-expanded", "false");
    } else {
      item.classList.add("active");
      if (content) content.style.maxHeight = content.scrollHeight + "px";
      if (icon) icon.style.transform = "rotate(180deg)";
      header.setAttribute("aria-expanded", "true");
    }
  });
}
// (Delegated FAQ handler moved into initializeFAQAccordion)

function initializeContactForms() {
  const forms = document.querySelectorAll(".contact-form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (validateContactForm(form)) {
        submitContactForm(form);
      }
    });

    // Real-time validation
    const inputs = form.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        validateField(this);
      });

      input.addEventListener("input", function () {
        if (this.classList.contains("error")) {
          validateField(this);
        }
      });
    });
  });
}

function validateContactForm(form) {
  const requiredFields = form.querySelectorAll("[required]");
  let isValid = true;

  // Clear previous errors
  form.querySelectorAll(".error-message").forEach((msg) => msg.remove());
  form
    .querySelectorAll(".error")
    .forEach((field) => field.classList.remove("error"));

  requiredFields.forEach((field) => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
}

function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = "";

  // Remove existing error
  field.classList.remove("error");
  const existingError = field.parentNode.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  if (field.hasAttribute("required") && !value) {
    errorMessage = "This field is required";
    isValid = false;
  } else if (field.type === "email" && value && !isValidEmail(value)) {
    errorMessage = "Please enter a valid email address";
    isValid = false;
  } else if (field.type === "tel" && value && !isValidPhone(value)) {
    errorMessage = "Please enter a valid phone number";
    isValid = false;
  } else if (field.name === "name" && value && value.length < 2) {
    errorMessage = "Name must be at least 2 characters long";
    isValid = false;
  } else if (
    field.type === "textarea" &&
    field.hasAttribute("required") &&
    value.length < 10
  ) {
    errorMessage = "Message must be at least 10 characters long";
    isValid = false;
  }

  if (!isValid) {
    showFieldError(field, errorMessage);
  }

  return isValid;
}

function showFieldError(field, message) {
  field.classList.add("error");
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  field.parentNode.appendChild(errorDiv);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

function submitContactForm(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  // Collect form data
  const formData = new FormData(form);
  const data = {};
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }

  // Simulate form submission (replace with actual submission logic)
  setTimeout(() => {
    console.log("Form submitted:", data);

    // Show success message
    showSuccessMessage(form);

    // Reset button
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;

    // Reset form
    form.reset();
  }, 2000);
}

function showSuccessMessage(form) {
  const successDiv = document.createElement("div");
  successDiv.className = "success-message";
  successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.</span>
    `;

  form.parentNode.insertBefore(successDiv, form);

  // Remove success message after 5 seconds
  setTimeout(() => {
    successDiv.remove();
  }, 5000);

  // Scroll to success message
  successDiv.scrollIntoView({ behavior: "smooth", block: "center" });
}

function initializeMapInteraction() {
  const mapContainer = document.querySelector(".map-container");
  if (!mapContainer) return;

  const mapOverlay = document.createElement("div");
  mapOverlay.className = "map-overlay";
  mapOverlay.innerHTML =
    '<p>Click to view map <i class="fas fa-external-link-alt"></i></p>';
  mapContainer.appendChild(mapOverlay);

  mapContainer.addEventListener("click", function () {
    // Remove overlay and enable map interaction
    mapOverlay.style.display = "none";

    // Add active class to enable interaction
    mapContainer.classList.add("active");
  });

  // Re-add overlay when clicking outside
  document.addEventListener("click", function (e) {
    if (!mapContainer.contains(e.target)) {
      mapOverlay.style.display = "flex";
      mapContainer.classList.remove("active");
    }
  });
}

// Phone number formatting
document.addEventListener("input", function (e) {
  if (e.target.type === "tel") {
    let value = e.target.value.replace(/\D/g, "");

    if (value.startsWith("91")) {
      value = value.substring(2);
    }

    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    // Format as: 98282 42598
    if (value.length > 5) {
      value = value.substring(0, 5) + " " + value.substring(5);
    }

    e.target.value = value;
  }
});

// Service area expansion
function initializeServiceAreas() {
  const showMoreBtn = document.querySelector(".show-more-areas");
  const hiddenAreas = document.querySelectorAll(".service-area.hidden");

  if (showMoreBtn && hiddenAreas.length > 0) {
    showMoreBtn.addEventListener("click", function () {
      hiddenAreas.forEach((area, index) => {
        setTimeout(() => {
          area.classList.remove("hidden");
          area.style.animation = "slideInUp 0.3s ease forwards";
        }, index * 100);
      });

      this.style.display = "none";
    });
  }
}

// Initialize service areas when page loads
document.addEventListener("DOMContentLoaded", initializeServiceAreas);

// Smooth scrolling for anchor links
document.addEventListener("click", function (e) {
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault();
    const targetId = e.target.getAttribute("href").substring(1);
    const target = document.getElementById(targetId);

    if (target) {
      const headerHeight = document.querySelector(".header").offsetHeight;
      const targetPosition = target.offsetTop - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  }
});

// Add click-to-call functionality
document.addEventListener("click", function (e) {
  if (e.target.matches('a[href^="tel:"]')) {
    // Add loading state
    const link = e.target;
    const originalText = link.innerHTML;

    link.innerHTML = '<i class="fas fa-phone fa-pulse"></i> Calling...';

    setTimeout(() => {
      link.innerHTML = originalText;
    }, 2000);
  }
});
