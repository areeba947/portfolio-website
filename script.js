/* ===========================
   AREEBA PORTFOLIO — script.js
=========================== */

// ─── LOADER ───────────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger initial visible reveals
    revealOnScroll();
    triggerHeroAnimations();
  }, 1800);
});

// ─── HERO ENTRY ANIMATIONS ────────────────────────────
function triggerHeroAnimations() {
  const heroEls = document.querySelectorAll('.hero .fade-in, .hero .fade-in-delay');
  heroEls.forEach(el => el.classList.add('visible'));
}

// ─── STICKY NAVBAR ────────────────────────────────────
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  navbar.classList.toggle('scrolled', scrollY > 40);
  lastScroll = scrollY;
  updateActiveNav();
  toggleScrollTop();
  revealOnScroll();
}, { passive: true });

// ─── HAMBURGER MENU ───────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close on nav link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ─── ACTIVE NAV HIGHLIGHTING ──────────────────────────
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  let current   = '';

  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });

  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });
}

// ─── SCROLL TO TOP ────────────────────────────────────
const scrollTopBtn = document.getElementById('scrollTop');

function toggleScrollTop() {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── REVEAL ON SCROLL ─────────────────────────────────
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  const windowH = window.innerHeight;

  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < windowH - 80) el.classList.add('visible');
  });
}

// Init on page load (for above-fold elements)
document.addEventListener('DOMContentLoaded', () => {
  revealOnScroll();
});

// ─── PORTFOLIO FILTER ─────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const cards      = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    cards.forEach(card => {
      const category = card.getAttribute('data-category');
      const show = filter === 'all' || category === filter;

      if (show) {
        card.classList.remove('hidden');
        // Re-trigger animation
        card.classList.remove('visible');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => card.classList.add('visible'));
        });
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ─── CONTACT FORM ─────────────────────────────────────
const contactForm   = document.getElementById('contactForm');
const formSuccess   = document.getElementById('formSuccess');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Basic validation
  const fields = contactForm.querySelectorAll('input[required], textarea[required]');
  let valid = true;

  fields.forEach(field => {
    field.style.borderColor = '';
    if (!field.value.trim()) {
      field.style.borderColor = '#e07070';
      valid = false;
    }
    if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
      field.style.borderColor = '#e07070';
      valid = false;
    }
  });

  if (!valid) return;

  // Simulate send
  const btn = contactForm.querySelector('.btn-send');
  const sendText = btn.querySelector('.send-text');
  const origText = sendText.textContent;

  btn.disabled = true;
  sendText.textContent = 'Sending…';

  setTimeout(() => {
    btn.disabled = false;
    sendText.textContent = origText;
    formSuccess.classList.add('show');
    contactForm.reset();
    fields.forEach(f => f.style.borderColor = '');

    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1500);
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── SMOOTH SCROLL FOR ALL ANCHOR LINKS ───────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── SKILL CARD STAGGERED ENTRY ───────────────────────
function staggerSkillCards() {
  const skillSection = document.querySelector('.about');
  if (!skillSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.skill-card');
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 60);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  // Set initial state via JS for stagger
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  observer.observe(skillSection);
}

document.addEventListener('DOMContentLoaded', staggerSkillCards);

// ─── SERVICE CARD STAGGER ─────────────────────────────
function staggerServiceCards() {
  const serviceSection = document.querySelector('.services');
  if (!serviceSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.service-card');
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.classList.add('visible');
          }, i * 90);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(serviceSection);
}

document.addEventListener('DOMContentLoaded', staggerServiceCards);

// ─── RESIZE HANDLER ───────────────────────────────────
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    revealOnScroll();
    if (window.innerWidth > 768) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  }, 150);
});
