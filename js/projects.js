// Projects Page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  initializeProjectsPage();
});

function initializeProjectsPage() {
  initializeProjectFilter();
  initializeProjectModals();
  initializeLoadMore();
}

function initializeProjectFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      // Update active filter button
      filterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      // Filter projects with animation
      projectCards.forEach((card) => {
        card.style.transition = "all 0.3s ease";

        if (filter === "all" || card.getAttribute("data-category") === filter) {
          card.style.opacity = "0";
          card.style.transform = "scale(0.8)";

          setTimeout(() => {
            card.style.display = "block";
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "scale(1)";
            }, 10);
          }, 150);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.8)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });
    });
  });
}

function initializeProjectModals() {
  const viewButtons = document.querySelectorAll(".project-card .btn");
  const modals = document.querySelectorAll(".project-modal");
  const closeBtns = document.querySelectorAll(".modal-close");

  // Open modals
  viewButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const projectId = this.getAttribute("data-project");
      const modal = document.getElementById(projectId);

      if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";

        // Initialize modal gallery if it exists
        initializeModalGallery(modal);
      }
    });
  });

  // Close modals
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const modal = this.closest(".project-modal");
      closeModal(modal);
    });
  });

  // Close on backdrop click
  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeModal(this);
      }
    });
  });

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const activeModal = document.querySelector(".project-modal.active");
      if (activeModal) {
        closeModal(activeModal);
      }
    }
  });
}

function closeModal(modal) {
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

function initializeModalGallery(modal) {
  const gallery = modal.querySelector(".modal-gallery");
  if (!gallery) return;

  const images = gallery.querySelectorAll(".gallery-image");
  const prevBtn = gallery.querySelector(".gallery-prev");
  const nextBtn = gallery.querySelector(".gallery-next");
  const indicators = gallery.querySelectorAll(".gallery-indicator");

  let currentImage = 0;

  function showImage(index) {
    images.forEach((img, i) => {
      img.classList.remove("active");
      if (i === index) {
        img.classList.add("active");
      }
    });

    indicators.forEach((indicator, i) => {
      indicator.classList.remove("active");
      if (i === index) {
        indicator.classList.add("active");
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      currentImage = currentImage === 0 ? images.length - 1 : currentImage - 1;
      showImage(currentImage);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      currentImage = currentImage === images.length - 1 ? 0 : currentImage + 1;
      showImage(currentImage);
    });
  }

  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", function () {
      currentImage = index;
      showImage(currentImage);
    });
  });

  // Initialize first image
  showImage(0);
}

function initializeLoadMore() {
  const loadMoreBtn = document.querySelector(".load-more-btn");
  if (!loadMoreBtn) return;

  loadMoreBtn.addEventListener("click", function () {
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    this.disabled = true;

    // Simulate loading more projects
    setTimeout(() => {
      // Add more project cards here
      loadMoreProjects();

      this.innerHTML = "Load More Projects";
      this.disabled = false;
    }, 1500);
  });
}

function loadMoreProjects() {
  const projectsGrid = document.querySelector(".projects-grid");
  if (!projectsGrid) return;

  // Sample additional projects (replace with actual data)
  const additionalProjects = [
    {
      id: "project-7",
      title: "8 kW Industrial Setup",
      category: "industrial",
      location: "Pune Industrial Area",
      capacity: "8 kW",
      type: "Grid-Tied",
      image: "images/projects/project-7.jpg",
      description:
        "Large-scale industrial solar installation for manufacturing unit.",
    },
    {
      id: "project-8",
      title: "12 kW Commercial Complex",
      category: "commercial",
      location: "Solapur Business District",
      capacity: "12 kW",
      type: "Hybrid",
      image: "images/projects/project-8.jpg",
      description: "Commercial complex solar system with battery backup.",
    },
  ];

  additionalProjects.forEach((project) => {
    const projectCard = createProjectCard(project);
    projectsGrid.appendChild(projectCard);

    // Animate new cards
    setTimeout(() => {
      projectCard.style.opacity = "1";
      projectCard.style.transform = "translateY(0)";
    }, 100);
  });

  // Re-initialize filter for new cards
  initializeProjectFilter();
}

function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "project-card";
  card.setAttribute("data-category", project.category);
  card.style.opacity = "0";
  card.style.transform = "translateY(20px)";
  card.style.transition = "all 0.3s ease";

  card.innerHTML = `
        <div class="project-image">
            <img src="${project.image}" alt="${project.title}">
            <div class="project-overlay">
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p><i class="fas fa-map-marker-alt"></i> ${project.location}</p>
                    <div class="project-specs">
                        <span><i class="fas fa-solar-panel"></i> ${project.capacity}</span>
                        <span><i class="fas fa-plug"></i> ${project.type}</span>
                    </div>
                </div>
                <div class="project-actions">
                    <button class="btn btn-primary" data-project="${project.id}">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        </div>
    `;

  return card;
}

// Smooth scroll for internal links
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

// Add scroll animations for statistics
function animateCounters() {
  const counters = document.querySelectorAll(".counter");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute("data-target"));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60 FPS

        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.textContent = Math.floor(current);
        }, 16);

        observer.unobserve(counter);
      }
    });
  });

  counters.forEach((counter) => observer.observe(counter));
}

// Initialize counter animations when page loads
document.addEventListener("DOMContentLoaded", animateCounters);
