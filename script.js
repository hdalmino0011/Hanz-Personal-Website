/* =============================================
   HANZ DEE DALMINO — PORTFOLIO SCRIPTS
   Enhanced edition
   ============================================= */

/* =============================================
   PAGE FLIP ENGINE
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
  if (currentPageEl) currentPageEl.textContent = index + 1;

  const chapterTitle = pages[index].dataset.chapter || '';
  if (chapterTitleEl) chapterTitleEl.textContent = index > 0 ? chapterTitle : '';

  getDots().forEach((d, i) => d.classList.toggle('active', i === index));

  document.querySelectorAll('.drawer__link').forEach((l, i) => {
    l.classList.toggle('active', i === index);
  });

  /* Update all next-page buttons */
  document.querySelectorAll('[data-next]').forEach(btn => {
    btn.style.display = (index === totalPages - 1) ? 'none' : 'flex';
  });
}

function goToPage(targetIndex) {
  if (isAnimating || targetIndex === currentIndex) return;
  if (targetIndex < 0 || targetIndex >= totalPages) return;

  isAnimating = true;

  const goingForward = targetIndex > currentIndex;
  const current = pages[currentIndex];
  const target  = pages[targetIndex];

  /* Set target start position */
  target.classList.remove('is-active', 'is-leaving-up');
  target.style.transition = 'none';
  target.style.transform  = goingForward ? 'translateY(100%)' : 'translateY(-100%)';
  target.style.opacity    = '0';

  target.getBoundingClientRect(); /* force reflow */

  target.style.transition = '';
  target.style.transform  = '';
  target.style.opacity    = '';
  target.classList.add('is-active');

  /* Exit current */
  current.classList.remove('is-active');
  current.style.transform = goingForward ? 'translateY(-100%)' : 'translateY(100%)';
  current.style.opacity   = '0';

  currentIndex = targetIndex;
  updateUI(currentIndex);

  setTimeout(() => {
    current.style.transform = '';
    current.style.opacity   = '';
    isAnimating = false;
    /* Reset scroll of entered page */
    const scrollArea = target.querySelector('.page__scroll-area');
    if (scrollArea) scrollArea.scrollTop = 0;
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

/* ---- Next buttons (data-next) ---- */
document.addEventListener('click', function(e) {
  if (e.target.closest('[data-next]')) {
    goToPage(currentIndex + 1);
  }
});

/* ---- Data-page links ---- */
document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', e => {
    const idx = parseInt(el.dataset.page);
    if (!isNaN(idx)) {
      goToPage(idx);
      closeDrawer();
    }
  });
});

/* ---- Scroll hint ---- */
const scrollHint = document.getElementById('scrollHint');
if (scrollHint) scrollHint.addEventListener('click', () => goToPage(1));

/* ---- Logo ---- */
const logoEl = document.querySelector('.nav__logo');
if (logoEl) {
  logoEl.addEventListener('click', e => {
    e.preventDefault();
    goToPage(0);
  });
}

/* ---- Nav shadow on page scroll ---- */
const navEl = document.getElementById('nav');
pages.forEach(p => {
  const scrollArea = p.querySelector('.page__scroll-area');
  if (scrollArea) {
    scrollArea.addEventListener('scroll', () => {
      navEl.classList.toggle('scrolled', scrollArea.scrollTop > 10);
    }, { passive: true });
  }
});

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

if (hamburger) hamburger.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
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

let roleIndex  = 0;
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

  let delay = isDeleting ? 58 : 98;

  if (!isDeleting && charIndex === currentRole.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex  = (roleIndex + 1) % roles.length;
    delay = 380;
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
    greetingBox.classList.add('visible');
    greetingBox.style.opacity = '1';
  }, 200);
}

if (greetBtn) greetBtn.addEventListener('click', showGreeting);

/* =============================================
   SKILL POPUP / MODAL SYSTEM
   ============================================= */
const skillDescriptions = {
  'C#': 'C# (C-Sharp) is a modern, object-oriented language developed by Microsoft. It\'s used for Windows apps, web services, and games built on Unity. I use it to create robust backend services and cross-platform applications.',
  'C': 'C is a powerful low-level language that gives direct access to memory and hardware. It\'s the foundation of many operating systems. I use C for system-level programming and embedded logic.',
  'Java': 'Java is a versatile, object-oriented language known for its "write once, run anywhere" capability. I use Java to build scalable, platform-independent applications.',
  'HTML': 'HTML is the structural backbone of every web page. I write semantic, accessible, SEO-friendly markup that works as a solid foundation for any UI.',
  'CSS': 'CSS controls layout, typography, color, and responsiveness. I use it to craft polished, mobile-first interfaces that feel great on any device.',
  'JavaScript': 'JavaScript brings interactivity to the web and powers both frontend and backend via Node.js. I use it to build dynamic, engaging applications.',
  'Python': 'Python\'s readability and versatility make it great for web development, automation, and data work. I use it for scripting, APIs, and data processing.',
  'SQL': 'SQL is the language of relational databases. I write efficient schemas and complex queries to power data-driven applications.',
  'Full Stack Dev': 'Full Stack Development means owning both the frontend and backend. I connect the user interface to servers, databases, and APIs to deliver complete products.',
  'Adobe Photoshop': 'Photoshop is my go-to for photo editing, compositing, and raster graphic design — creating visual assets that look polished at every resolution.',
  'Adobe Illustrator': 'Illustrator handles vector graphics — logos, icons, and illustrations — so designs scale crisply from a favicon to a billboard.',
  'Adobe After Effects': 'After Effects lets me create motion graphics, animated transitions, and visual effects for web and video content.',
  'UI Design': 'UI Design is about making interfaces intuitive and beautiful. I design with both aesthetics and accessibility in mind, ensuring every screen serves its user.',
  'Hardware & Circuits': 'Understanding hardware gives me insight into how software talks to physical systems — from microcontrollers to sensors to integrated electronics.',
  'System Engineering': 'System Engineering is the holistic practice of designing and managing complex systems where hardware, software, and processes intersect.',
  'BPO / Customer Service': 'Three years in BPO sharpened my communication, empathy, and problem-solving — skills that directly inform how I think about user needs in my software.',
  'Telecommunications': 'Supporting telecom customers gave me hands-on knowledge of networking concepts, billing systems, and service workflows.',
  'Healthcare Support': 'Working in healthcare BPO taught me HIPAA-adjacent data sensitivity and the high stakes of clear, accurate patient communication.',
  'E-Commerce': 'I\'ve supported orders and disputes across Cartpanda, Buygoods, DigiStore, and Shopify — giving me practical insight into digital commerce flows.',
  'Persuasive Communication': 'Whether pitching a design, explaining a technical decision, or de-escalating a customer, clear and compelling communication is the skill that makes everything else land.',
  'MS Office Suite': 'Word for documentation, Excel for data analysis and reporting, PowerPoint for presentations — I use the Office suite efficiently for professional deliverables.'
};

const skillModal      = document.getElementById('skillModal');
const skillModalTitle = document.getElementById('skillModalTitle');
const skillModalDesc  = document.getElementById('skillModalDesc');
const skillModalClose = document.getElementById('skillModalClose');
const skillModalOverlay = document.getElementById('skillModalOverlay');

function openSkillModal(name) {
  if (!skillModal) return;
  skillModalTitle.textContent = name;
  skillModalDesc.textContent  = skillDescriptions[name] || `${name} is a key part of my toolkit.`;
  skillModal.classList.add('open');
  skillModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeSkillModal() {
  if (!skillModal) return;
  skillModal.classList.remove('open');
  skillModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (skillModalClose) skillModalClose.addEventListener('click', closeSkillModal);
if (skillModalOverlay) skillModalOverlay.addEventListener('click', closeSkillModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && skillModal && skillModal.classList.contains('open')) closeSkillModal();
});

/* Attach to all skill tags */
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('click', e => {
    e.stopPropagation();
    openSkillModal(tag.textContent.trim());
  });
});
