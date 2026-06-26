/* =============================================
   HANZ DEE DALMINO — PORTFOLIO SCRIPTS
   ============================================= */

/* ---------- TYPEWRITER EFFECT ---------- */
const roles = [
  'Web Developer',
  'System Engineer',
  'UI Designer',
  'Full Stack Dev',
  'Problem Solver'
];

let roleIndex = 0;
let charIndex  = 0;
let isDeleting = false;
const typedEl  = document.getElementById('typedRole');

function typeWriter() {
  if (!typedEl) return;

  const currentRole = roles[roleIndex];

  if (isDeleting) {
    typedEl.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === currentRole.length) {
    delay = 1800; // pause before deleting
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex  = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  setTimeout(typeWriter, delay);
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(typeWriter, 800);
});


/* ---------- GREETING BUTTON ---------- */
const greetings = [
  '"Code is poetry. Let\'s write something beautiful together."',
  '"Hello! I turn coffee and curiosity into working software."',
  '"Mabuhay! Ready to build something great?"',
  '"From Cebu with clean code and creative design."',
  '"Full stack, fully committed — let\'s talk!"',
  '"Great design is invisible. Great code is the same."',
  '"Hardware or software — I speak both languages."',
  '"Let\'s collaborate and ship something worth showing off."'
];

const greetBtn     = document.getElementById('greetBtn');
const greetingBox  = document.getElementById('greetingBox');
let lastGreeting   = -1;

function showGreeting() {
  if (!greetingBox) return;
  
  let idx;
  do { idx = Math.floor(Math.random() * greetings.length); }
  while (idx === lastGreeting && greetings.length > 1);
  lastGreeting = idx;

  greetingBox.style.opacity = '0';
  setTimeout(() => {
    greetingBox.textContent = greetings[idx];
    greetingBox.style.opacity = '1';
  }, 200);
}

if (greetBtn) {
  greetBtn.addEventListener('click', showGreeting);
}


/* ---------- NAVIGATION: SCROLL & MOBILE ---------- */
const nav        = document.getElementById('nav');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');

// Scrolled state
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// Mobile toggle
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu on link click
  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  // Close menu on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    }
  });
}


/* ---------- INTERSECTION OBSERVER (REVEAL) ---------- */
// This is now optional since we made everything visible by default in CSS
// But we keep it for smooth animations when elements do become visible
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Staggered delay for grouped elements
      const delay = parseInt(entry.target.dataset.delay) || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe timeline items (staggered)
document.querySelectorAll('.timeline__item').forEach((el, i) => {
  el.dataset.delay = i * 120;
  observer.observe(el);
});

// Observe edu cards (staggered)
document.querySelectorAll('.edu-card').forEach((el, i) => {
  el.dataset.delay = i * 80;
  observer.observe(el);
});

// Generic reveal elements
document.querySelectorAll('.reveal').forEach(el => {
  observer.observe(el);
});

// Force visibility for any elements that might have been missed
// This ensures everything shows even if Intersection Observer fails
setTimeout(() => {
  document.querySelectorAll('.timeline__item, .edu-card, .reveal').forEach(el => {
    el.classList.add('visible');
  });
}, 100);


/* ---------- ACTIVE NAV LINK HIGHLIGHT ---------- */
const sections = document.querySelectorAll('section[id]');
const links    = document.querySelectorAll('.nav__link');

if (sections.length && links.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(sec => sectionObserver.observe(sec));
}

// Add active style dynamically (already in CSS, but keep as fallback)
const style = document.createElement('style');
style.textContent = `.nav__link.active { color: var(--coral) !important; }`;
document.head.appendChild(style);


/* ---------- SKILL TAG HOVER RIPPLE ---------- */
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('mouseenter', function () {
    this.style.transition = 'transform 0.18s cubic-bezier(0.4,0,0.2,1), box-shadow 0.18s, background 0.18s, color 0.18s';
  });
});


/* ---------- FALLBACK: Ensure Experience & Education are visible ---------- */
// Additional safety net to ensure sections are visible
document.addEventListener('DOMContentLoaded', function() {
  // Force visibility of all timeline items and edu cards
  document.querySelectorAll('.timeline__item, .edu-card').forEach(el => {
    el.classList.add('visible');
  });
});

// Also run after a short delay to catch any dynamically added content
setTimeout(() => {
  document.querySelectorAll('.timeline__item, .edu-card').forEach(el => {
    if (!el.classList.contains('visible')) {
      el.classList.add('visible');
    }
  });
}, 500);
