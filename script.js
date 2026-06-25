/* =============================================
   HANZ DEE DALMINO — PORTFOLIO SCRIPTS
   Page-flip / article-chapter edition
   ============================================= */

/* =============================================
   PAGE FLIP ENGINE (MODIFIED)
   ============================================= */
const pages      = Array.from(document.querySelectorAll('.page'));
const totalPages = pages.length;
let currentIndex = 0;
let isAnimating  = false;

const currentPageEl  = document.getElementById('currentPage');
const totalPagesEl   = document.getElementById('totalPages');
const chapterTitleEl = document.getElementById('navChapterTitle');

if (totalPagesEl) totalPagesEl.textContent = totalPages;

/* ---- Build dot nav ---- */
const dotNavEl = document.getElementById('dotNav');
pages.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot-nav__dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', 'Go to page ' + (i + 1));
  dot.addEventListener('click', () => goToPage(i));
  dotNavEl.appendChild(dot);
});

function getDots() {
  return Array.from(dotNavEl.querySelectorAll('.dot-nav__dot'));
}

function updateUI(index) {
  currentPageEl.textContent = index + 1;

  const chapterTitle = pages[index].dataset.chapter || '';
  chapterTitleEl.textContent = index > 0 ? chapterTitle : '';

  getDots().forEach((d, i) => d.classList.toggle('active', i === index));

  /* Update drawer active link */
  document.querySelectorAll('.drawer__link').forEach((l, i) => {
    l.classList.toggle('active', i === index);
  });

  /* Update Next button visibility */
  const nextBtn = document.getElementById('nextPageBtn');
  if (nextBtn) {
    nextBtn.style.display = (index === totalPages - 1) ? 'none' : 'flex';
  }

  /* Update footer visibility - show on all pages */
  const footer = document.querySelector('.page__footer');
  if (footer) {
    footer.style.display = 'block';
  }
}

function goToPage(targetIndex) {
  if (isAnimating || targetIndex === currentIndex) return;
  if (targetIndex < 0 || targetIndex >= totalPages) return;

  isAnimating = true;

  const goingForward = targetIndex > currentIndex;
  const current = pages[currentIndex];
  const target  = pages[targetIndex];

  /* Position target ready to enter */
  target.classList.remove('is-active', 'is-leaving-up', 'is-entering-from-top');

  if (goingForward) {
    target.style.transform = 'translateY(100%)';
    target.style.opacity   = '0';
  } else {
    target.style.transform = 'translateY(-100%)';
    target.style.opacity   = '0';
  }

  target.getBoundingClientRect();

  target.style.transform = '';
  target.style.opacity   = '';
  target.classList.add('is-active');

  current.classList.remove('is-active');
  if (goingForward) {
    current.style.transform = 'translateY(-100%)';
    current.style.opacity   = '0';
  } else {
    current.style.transform = 'translateY(100%)';
    current.style.opacity   = '0';
  }

  currentIndex = targetIndex;
  updateUI(currentIndex);

  setTimeout(() => {
    current.style.transform = '';
    current.style.opacity   = '';
    isAnimating = false;
    target.scrollTop = 0;
  }, 700);
}

/* ---- Init: show page 0, hide rest ---- */
(function initPages() {
  pages.forEach((p, i) => {
    p.style.transition = 'none';
    if (i === 0) {
      p.classList.add('is-active');
      p.style.transform = 'translateY(0)';
      p.style.opacity   = '1';
    } else {
      p.style.transform = 'translateY(100%)';
      p.style.opacity   = '0';
    }
  });
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      pages.forEach(p => { p.style.transition = ''; });
    });
  });
  updateUI(0);
})();

/* ---- Next Page Button ---- */
document.addEventListener('DOMContentLoaded', function() {
  const nextBtn = document.getElementById('nextPageBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      goToPage(currentIndex + 1);
    });
  }
});

/* ---- Data-page links (any element with data-page="N") ---- */
document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', e => {
    const idx = parseInt(el.dataset.page);
    if (!isNaN(idx)) {
      goToPage(idx);
      closeDrawer();
    }
  });
});

/* ---- Scroll hint click ---- */
const scrollHint = document.getElementById('scrollHint');
if (scrollHint) {
  scrollHint.addEventListener('click', () => goToPage(1));
}

/* ---- Logo click → cover ---- */
const logo = document.querySelector('.nav__logo');
if (logo) {
  logo.addEventListener('click', e => {
    e.preventDefault();
    goToPage(0);
  });
}

/* =============================================
   REMOVED: Wheel navigation, Swipe navigation, Arrow buttons
   ============================================= */
/* All scroll/touch/wheel navigation has been removed as requested */


/* =============================================
   MOBILE DRAWER
   ============================================= */
const hamburger     = document.getElementById('hamburger');
const drawer        = document.getElementById('drawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const drawerClose   = document.getElementById('drawerClose');

function openDrawer() {
  drawer.classList.add('open');
  drawerOverlay.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  hamburger.setAttribute('aria-expanded', 'true');
}
function closeDrawer() {
  drawer.classList.remove('open');
  drawerOverlay.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  hamburger.setAttribute('aria-expanded', 'false');
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
}
if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);


/* =============================================
   TYPEWRITER EFFECT
   ============================================= */
const roles = [
  'Web Developer',
  'System Engineer',
  'UI Designer',
  'Full Stack Dev',
  'Problem Solver'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typedRole');

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
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  setTimeout(typeWriter, delay);
}

setTimeout(typeWriter, 900);


/* =============================================
   GREETING BUTTON
   ============================================= */
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

const greetBtn    = document.getElementById('greetBtn');
const greetingBox = document.getElementById('greetingBox');
let lastGreeting  = -1;

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

if (greetBtn) greetBtn.addEventListener('click', showGreeting);


/* =============================================
   SKILL POPUP / MODAL SYSTEM
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

  const description = skillDescriptions[skillName] || `${skillName} is a valuable skill in my toolkit.`;

  title.textContent = skillName;
  desc.textContent = description;

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

/* ---- Attach click events to skill tags ---- */
document.addEventListener('DOMContentLoaded', function() {
  const skillTags = document.querySelectorAll('.skill-tag');
  skillTags.forEach(tag => {
    tag.style.cursor = 'pointer';
    tag.addEventListener('click', function(e) {
      e.stopPropagation();
      const skillName = this.textContent.trim();
      showSkillPopup(skillName);
    });
  });
});

/* ---- Also handle dynamically added skill tags (if any) ---- */
const skillObserver = new MutationObserver(() => {
  document.querySelectorAll('.skill-tag:not([data-listener])').forEach(tag => {
    tag.setAttribute('data-listener', 'true');
    tag.style.cursor = 'pointer';
    tag.addEventListener('click', function(e) {
      e.stopPropagation();
      const skillName = this.textContent.trim();
      showSkillPopup(skillName);
    });
  });
});
skillObserver.observe(document.body, { childList: true, subtree: true });


/* =============================================
   NAV SCROLL SHADOW
   ============================================= */
const nav = document.getElementById('nav');
pages.forEach(p => {
  p.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', p.scrollTop > 10);
  }, { passive: true });
});


/* =============================================
   FOOTER VISIBILITY - Ensure footer shows on all pages
   ============================================= */
document.addEventListener('DOMContentLoaded', function() {
  const footer = document.querySelector('.page__footer');
  if (footer) {
    footer.style.display = 'block';
  }

  // Also ensure it shows when page changes
  const observer = new MutationObserver(() => {
    const footerEl = document.querySelector('.page__footer');
    if (footerEl) {
      footerEl.style.display = 'block';
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
