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

  // Pricing Toggle Logic
  const btnMonthly = document.getElementById('btn-monthly');
  const btnQuarterly = document.getElementById('btn-quarterly');
  const toggleBg = document.getElementById('toggle-bg');
  const pricingAmounts = document.querySelectorAll('.pricing-amount');
  const billingTexts = document.querySelectorAll('.pricing-billing');
  
  if (btnMonthly && btnQuarterly && toggleBg) {
    let pricingData = null;

    // Default fallback data in case fetch fails
    const defaultData = {
      starter: { monthly: { price: "9.99", billingText: "Billed $9.99 monthly" }, quarterly: { price: "7.99", billingText: "Billed $19 every 3 months" } },
      pro: { monthly: { price: "18.99", billingText: "Billed $18.99 monthly" }, quarterly: { price: "14.99", billingText: "Billed $39 every 3 months" } },
      accelerator: { monthly: { price: "39", billingText: "Billed $39 monthly" }, quarterly: { price: "29", billingText: "Billed $69 every 3 months" } }
    };

    const updatePrices = (period) => {
      const dataToUse = pricingData || defaultData;
      pricingAmounts.forEach(el => {
        const plan = el.dataset.plan;
        if (dataToUse[plan] && dataToUse[plan][period]) {
          el.textContent = dataToUse[plan][period].price;
        }
      });
      billingTexts.forEach(el => {
        const plan = el.dataset.plan;
        if (dataToUse[plan] && dataToUse[plan][period]) {
          el.textContent = dataToUse[plan][period].billingText;
        }
      });
    };

    fetch('pricing.json')
      .then(res => res.json())
      .then(data => {
        pricingData = data;
        const activePeriod = btnQuarterly.classList.contains('active') ? 'quarterly' : 'monthly';
        updatePrices(activePeriod);
      })
      .catch(err => {
        console.warn('Could not load pricing.json (likely due to CORS on file://). Using default prices.', err);
      });

    const updateBgTracker = (btn) => {
      toggleBg.style.width = btn.offsetWidth + 'px';
      toggleBg.style.left = btn.offsetLeft + 'px';
    };

    // Remove any transform from previous logic
    toggleBg.style.transform = 'none';

    btnMonthly.addEventListener('click', () => {
      btnMonthly.classList.add('active');
      btnQuarterly.classList.remove('active');
      
      updateBgTracker(btnMonthly);
      updatePrices('monthly');
    });

    btnQuarterly.addEventListener('click', () => {
      btnQuarterly.classList.add('active');
      btnMonthly.classList.remove('active');
      
      updateBgTracker(btnQuarterly);
      updatePrices('quarterly');
    });

    // Set initial state
    setTimeout(() => {
      updateBgTracker(btnQuarterly);
    }, 100);
    
    // Update on resize
    window.addEventListener('resize', () => {
      const activeBtn = btnQuarterly.classList.contains('active') ? btnQuarterly : btnMonthly;
      updateBgTracker(activeBtn);
    });
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
