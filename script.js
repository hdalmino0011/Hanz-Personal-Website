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


/* =============================================
   SKILL POPUP / MODAL SYSTEM (FIXED)
   ============================================= */

/* ---- Skill descriptions ---- */
const skillDescriptions = {
  'C#': 'C# (C-Sharp) is a modern, object-oriented programming language developed by Microsoft. It\'s widely used for building Windows desktop applications, web services, and games using the Unity game engine. I use C# to create robust backend services and cross-platform applications.',
  
  'C': 'C is a powerful low-level programming language that provides direct access to memory and hardware. It\'s the foundation of many operating systems and embedded systems. I work with C for system-level programming and understanding how computers work at a fundamental level.',
  
  'Java': 'Java is a versatile, object-oriented programming language known for its "write once, run anywhere" capability. It\'s extensively used for enterprise applications, Android development, and large-scale systems. I use Java to build scalable, platform-independent applications.',
  
  'HTML': 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It provides the structural foundation of every website. I use HTML to create semantic, accessible, and SEO-friendly web content.',
  
  'CSS': 'CSS (Cascading Style Sheets) is used to style and layout web pages. It controls colors, typography, spacing, and responsive design. I use CSS to create beautiful, responsive interfaces that work across all devices.',
  
  'JavaScript': 'JavaScript is a dynamic programming language that brings interactivity to websites. It powers the modern web and can be used for both frontend and backend development. I use JavaScript to build interactive, responsive, and engaging web applications.',
  
  'Python': 'Python is a high-level, interpreted programming language known for its readability and versatility. It\'s used in web development, data analysis, AI, and automation. I use Python for backend development, scripting, and data processing.',
  
  'SQL': 'SQL (Structured Query Language) is used to manage and manipulate relational databases. It\'s essential for storing, retrieving, and analyzing data. I use SQL to design efficient database schemas and write complex queries for data-driven applications.',
  
  'Full Stack Dev': 'Full Stack Development involves working on both the frontend (client-side) and backend (server-side) of web applications. It requires knowledge of databases, servers, APIs, and user interfaces. I bring together all layers of web development to create complete, functional products.',
  
  'Adobe Photoshop': 'Adobe Photoshop is a powerful image editing and design software used for photo manipulation, graphic design, and digital art. I use Photoshop for creating visual assets, editing images, and designing marketing materials.',
  
  'Adobe Illustrator': 'Adobe Illustrator is a vector graphics editor used for creating logos, icons, illustrations, and typography. I use Illustrator to design scalable graphics that maintain quality at any size.',
  
  'Adobe After Effects': 'Adobe After Effects is a digital visual effects and motion graphics software. I use it to create animations, transitions, and visual effects for web and video content.',
  
  'UI Design': 'UI (User Interface) Design focuses on creating visually appealing, intuitive, and user-friendly interfaces for digital products. I design interfaces that are both beautiful and functional, prioritizing user experience and accessibility.',
  
  'Hardware & Circuits': 'Understanding hardware and circuits gives me insight into how software interacts with physical systems. I work with microcontrollers, sensors, and basic electronics to create integrated hardware-software solutions.',
  
  'System Engineering': 'System Engineering involves designing, implementing, and maintaining complex systems that integrate hardware, software, and processes. I approach problems holistically, considering how all components work together.',
  
  'BPO / Customer Service': 'Business Process Outsourcing (BPO) and Customer Service involve managing customer interactions and business processes for other companies. My experience includes handling inquiries, resolving issues, and maintaining high customer satisfaction.',
  
  'Telecommunications': 'Telecommunications involves managing communication systems, networks, and services. My experience includes supporting customers with technical issues, billing questions, and service-related concerns in the telecom industry.',
  
  'Healthcare Support': 'Healthcare support involves assisting patients and providers with healthcare services, insurance, and medical information. I ensure patients receive the support they need while maintaining privacy and compliance.',
  
  'E-Commerce': 'E-Commerce involves managing online retail platforms, processing orders, and supporting digital transactions. I have experience across multiple platforms including Cartpanda, Buygoods, DigiStore, and Shopify.',
  
  'Persuasive Communication': 'Persuasive Communication is the art of presenting ideas clearly and convincingly to influence decisions. I use this skill to build consensus, negotiate effectively, and present technical concepts to non-technical audiences.',
  
  'MS Office Suite': 'Microsoft Office Suite includes Word, Excel, PowerPoint, and other productivity tools. I use these for documentation, data analysis, presentations, and professional communication.'
};

/* ---- Create Modal ---- */
function createSkillModal() {
  // Check if modal already exists
  if (document.getElementById('skillModal')) return;

  const modal = document.createElement('div');
  modal.id = 'skillModal';
  modal.className = 'skill-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.style.display = 'none';

  modal.innerHTML = `
    <div class="skill-modal__overlay" id="skillModalOverlay"></div>
    <div class="skill-modal__box">
      <button class="skill-modal__close" id="skillModalClose" aria-label="Close popup">&times;</button>
      <h3 class="skill-modal__title" id="skillModalTitle">Skill</h3>
      <p class="skill-modal__desc" id="skillModalDesc">Description goes here.</p>
    </div>
  `;

  document.body.appendChild(modal);

  // Close handlers
  const closeBtn = document.getElementById('skillModalClose');
  const overlay = document.getElementById('skillModalOverlay');

  function closeModal() {
    const modalEl = document.getElementById('skillModal');
    if (modalEl) modalEl.style.display = 'none';
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modalEl = document.getElementById('skillModal');
      if (modalEl && modalEl.style.display === 'block') closeModal();
    }
  });
}

/* ---- Show skill popup ---- */
function showSkillPopup(skillName) {
  createSkillModal();

  const modal = document.getElementById('skillModal');
  const title = document.getElementById('skillModalTitle');
  const desc  = document.getElementById('skillModalDesc');

  if (!modal || !title || !desc) return;

  // Find the description, or use a fallback
  const description = skillDescriptions[skillName] || `${skillName} is a valuable skill in my toolkit.`;

  title.textContent = skillName;
  desc.textContent = description;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

/* ---- SKILL CLICK HANDLERS (FIXED) ---- */
let skillHandlersSetup = false;

function setupSkillClickHandlers() {
  if (skillHandlersSetup) return;
  skillHandlersSetup = true;

  // Use a more robust approach: attach event listener directly on parent container (event delegation)
  // This avoids duplicate listeners and handles dynamically added tags automatically.
  const skillTagContainer = document.querySelector('.skills__groups');
  if (!skillTagContainer) return;

  skillTagContainer.addEventListener('click', function(e) {
    const tag = e.target.closest('.skill-tag');
    if (!tag) return;
    const skillName = tag.textContent.trim();
    showSkillPopup(skillName);
  });
}

/* ---- Initialize skill click handlers on DOM ready ---- */
document.addEventListener('DOMContentLoaded', function() {
  setupSkillClickHandlers();
});

/* ---- Also handle if skills are added later (though unlikely) ---- */
// We don't need a MutationObserver now because event delegation covers it.
// The observer is removed to prevent duplicate event listeners.
