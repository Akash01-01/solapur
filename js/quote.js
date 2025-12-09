// Quote Form JavaScript
document.addEventListener("DOMContentLoaded", function () {
  initializeQuoteForm();
});

function initializeQuoteForm() {
  const form = document.getElementById("quoteForm");
  const steps = document.querySelectorAll(".form-step");
  const nextBtn = document.querySelector(".next-btn");
  const prevBtn = document.querySelector(".prev-btn");
  const submitBtn = document.querySelector(".submit-btn");
  const progressFill = document.querySelector(".progress-fill");
  const progressSteps = document.querySelectorAll(".progress-step");

  let currentStep = 1;
  const totalSteps = steps.length;

  // Initialize form
  updateProgress();

  // Next button click
  nextBtn.addEventListener("click", function () {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
        updateProgress();
      }
    }
  });

  // Previous button click
  prevBtn.addEventListener("click", function () {
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
      updateProgress();
    }
  });

  // Form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (validateStep(currentStep)) {
      submitForm();
    }
  });

  // File upload handling
  initializeFileUpload();

  // Input validations
  initializeInputValidations();

  function showStep(step) {
    steps.forEach((stepElement, index) => {
      stepElement.classList.remove("active");
      if (index + 1 === step) {
        stepElement.classList.add("active");
      }
    });
  }

  function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    progressFill.style.width = progress + "%";

    // Update progress steps
    progressSteps.forEach((step, index) => {
      step.classList.remove("active", "completed");
      if (index + 1 < currentStep) {
        step.classList.add("completed");
      } else if (index + 1 === currentStep) {
        step.classList.add("active");
      }
    });

    // Show/hide navigation buttons
    if (currentStep === 1) {
      prevBtn.style.display = "none";
    } else {
      prevBtn.style.display = "inline-block";
    }

    if (currentStep === totalSteps) {
      nextBtn.style.display = "none";
      submitBtn.style.display = "inline-block";
    } else {
      nextBtn.style.display = "inline-block";
      submitBtn.style.display = "none";
    }
  }

  function validateStep(step) {
    const currentStepElement = document.querySelector(`[data-step="${step}"]`);
    const requiredFields = currentStepElement.querySelectorAll("[required]");
    let isValid = true;

    // Remove previous error messages
    currentStepElement
      .querySelectorAll(".error-message")
      .forEach((msg) => msg.remove());
    currentStepElement
      .querySelectorAll(".error")
      .forEach((field) => field.classList.remove("error"));

    requiredFields.forEach((field) => {
      if (field.type === "radio") {
        const radioGroup = currentStepElement.querySelectorAll(
          `[name="${field.name}"]`
        );
        const isChecked = Array.from(radioGroup).some((radio) => radio.checked);
        if (!isChecked) {
          showFieldError(field, "Please select an option");
          isValid = false;
        }
      } else if (field.type === "checkbox") {
        // For checkbox groups, at least one should be selected if required
        const checkboxGroup = currentStepElement.querySelectorAll(
          `[name="${field.name}"]`
        );
        if (checkboxGroup.length > 1) {
          const isChecked = Array.from(checkboxGroup).some(
            (checkbox) => checkbox.checked
          );
          if (!isChecked && field.hasAttribute("required")) {
            showFieldError(field, "Please select at least one option");
            isValid = false;
          }
        } else if (!field.checked) {
          showFieldError(field, "This field is required");
          isValid = false;
        }
      } else if (!field.value.trim()) {
        showFieldError(field, "This field is required");
        isValid = false;
      } else if (field.type === "email" && !isValidEmail(field.value)) {
        showFieldError(field, "Please enter a valid email address");
        isValid = false;
      } else if (field.type === "tel" && !isValidPhone(field.value)) {
        showFieldError(field, "Please enter a valid mobile number");
        isValid = false;
      }
    });

    return isValid;
  }

  function showFieldError(field, message) {
    field.classList.add("error");
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;

    if (field.type === "radio" || field.type === "checkbox") {
      const fieldGroup = field.closest(".radio-group, .checkbox-group");
      if (fieldGroup) {
        fieldGroup.appendChild(errorDiv);
      }
    } else {
      field.parentNode.appendChild(errorDiv);
    }
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ""));
  }

  function initializeFileUpload() {
    const fileInput = document.getElementById("billUpload");
    const uploadArea = document.querySelector(".file-upload-area");

    if (fileInput && uploadArea) {
      // Click to upload
      uploadArea.addEventListener("click", () => {
        fileInput.click();
      });

      // Drag and drop
      uploadArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadArea.classList.add("drag-over");
      });

      uploadArea.addEventListener("dragleave", () => {
        uploadArea.classList.remove("drag-over");
      });

      uploadArea.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadArea.classList.remove("drag-over");

        const files = e.dataTransfer.files;
        if (files.length > 0) {
          fileInput.files = files;
          updateFileDisplay(files[0]);
        }
      });

      // File selection
      fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
          updateFileDisplay(e.target.files[0]);
        }
      });
    }
  }

  function updateFileDisplay(file) {
    const uploadArea = document.querySelector(".file-upload-area");
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSize) {
      alert("File size must be less than 5MB");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload only PDF, JPG, or PNG files");
      return;
    }

    uploadArea.innerHTML = `
            <i class="fas fa-check-circle" style="color: var(--success-color);"></i>
            <span>File uploaded: ${file.name}</span>
            <small>${(file.size / 1024 / 1024).toFixed(2)} MB</small>
        `;
  }

  function initializeInputValidations() {
    // Phone number formatting
    const phoneInput = document.getElementById("mobile");
    if (phoneInput) {
      phoneInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 10) {
          value = value.slice(0, 10);
        }
        e.target.value = value;
      });
    }

    // Numeric inputs
    const numericInputs = document.querySelectorAll('input[type="number"]');
    numericInputs.forEach((input) => {
      input.addEventListener("input", function (e) {
        if (e.target.value < 0) {
          e.target.value = 0;
        }
      });
    });

    // Real-time validation for email
    const emailInput = document.getElementById("email");
    if (emailInput) {
      emailInput.addEventListener("blur", function (e) {
        if (e.target.value && !isValidEmail(e.target.value)) {
          e.target.classList.add("error");
        } else {
          e.target.classList.remove("error");
        }
      });
    }
  }

  function collectFormData() {
    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      if (data[key]) {
        // Handle multiple values (checkboxes)
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }

    // Handle unchecked checkboxes
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      if (!checkbox.checked) {
        const name = checkbox.name;
        if (!data[name]) {
          data[name] = [];
        }
      }
    });

    return data;
  }

  function submitForm() {
    const formData = collectFormData();

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
      console.log("Form Data:", formData);

      // Show success message
      showSuccessMessage();

      // Reset form if needed
      // form.reset();
      // currentStep = 1;
      // showStep(1);
      // updateProgress();
    }, 2000);
  }

  function showSuccessMessage() {
    const formContainer = document.querySelector(".quote-form-container");

    formContainer.innerHTML = `
            <div class="success-message">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Thank You for Your Interest!</h2>
                <p>Your solar quote request has been successfully submitted. Our expert team will analyze your requirements and get back to you within 48 hours with a comprehensive solar proposal.</p>
                
                <div class="next-steps">
                    <h3>What happens next?</h3>
                    <div class="step-list">
                        <div class="step-item">
                            <span class="step-number">1</span>
                            <div>
                                <strong>Quote Analysis (24-48 hours)</strong>
                                <p>Our engineers will analyze your energy needs and design a custom solar solution</p>
                            </div>
                        </div>
                        <div class="step-item">
                            <span class="step-number">2</span>
                            <div>
                                <strong>Site Survey Scheduling</strong>
                                <p>We'll contact you to schedule a free site visit for accurate measurements</p>
                            </div>
                        </div>
                        <div class="step-item">
                            <span class="step-number">3</span>
                            <div>
                                <strong>Detailed Proposal</strong>
                                <p>Receive complete pricing, savings analysis, and financing options</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="contact-support">
                    <p>Have questions in the meantime?</p>
                    <div class="contact-buttons">
                        <a href="tel:+919028242598" class="btn btn-primary">
                            <i class="fas fa-phone"></i> Call Us Now
                        </a>
                        <a href="mailto:info@evergreensolarcorp.com" class="btn btn-outline">
                            <i class="fas fa-envelope"></i> Email Us
                        </a>
                    </div>
                </div>
                
                <div class="social-share">
                    <p>Follow us for solar tips and updates:</p>
                    <div class="social-links">
                        <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                        <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
            </div>
        `;
  }
}

// Smooth scrolling for anchor links
document.addEventListener("click", function (e) {
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
});

// Add loading states for buttons
document.addEventListener("click", function (e) {
  if (e.target.matches('.btn[href^="tel:"], .btn[href^="mailto:"]')) {
    const btn = e.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';

    setTimeout(() => {
      btn.innerHTML = originalText;
    }, 1000);
  }
});
