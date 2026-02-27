// Scroll Effects
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Intersection Observer for Scroll Animations
const observeElements = (selector) => {
  const elements = document.querySelectorAll(selector);
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Add a slight delay if specified via data attribute
        const delay = entry.target.getAttribute('data-delay');
        if (delay) {
          entry.target.style.transitionDelay = `${delay}ms`;
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  elements.forEach(el => observer.observe(el));
};

// Initialize animations once DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  observeElements('.reveal-up');
  observeElements('.reveal-left');
  observeElements('.reveal-right');

  // Set current year in footer
  const yearElement = document.querySelector('#current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

// Glowing Cards Hover Effect
const cards = document.querySelectorAll('.hover-glow');

cards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const glow = card.querySelector('.card-glow');
    if (!glow) return;
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    glow.style.left = `${x}px`;
    glow.style.top = `${y}px`;
  });
  
  card.addEventListener('mouseleave', () => {
    const glow = card.querySelector('.card-glow');
    if (!glow) return;
    
    // Smooth reset not strictly needed since opacity transitions out, 
    // but ensures glow stays centered generally when hidden.
    setTimeout(() => {
      glow.style.left = '50%';
      glow.style.top = '50%';
    }, 300);
  });
});
