/* =================================================================
   HD DEV DISPATCH — SCRIPTS
   Single-scroll editorial layout
   ================================================================= */

/* =================================================================
   NAV PROGRESS BAR + SCROLLED STATE
   ================================================================= */
const navProgress = document.getElementById('navProgress');
const mastheadNav  = document.getElementById('mastheadNav');
const backToTop    = document.getElementById('backToTop');

function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (navProgress) navProgress.style.width = pct + '%';
  if (mastheadNav) mastheadNav.classList.toggle('scrolled', scrollTop > 10);
  if (backToTop) backToTop.classList.toggle('visible', scrollTop > 600);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* =================================================================
   SCROLL REVEAL — fade/rise sections into view
   ================================================================= */
const revealTargets = document.querySelectorAll(
  '.dept-head, .article-grid__main, .article-grid__rail, .index-group, ' +
  '.chronicle__entry, .ledger__row, .classifieds__entry'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealTargets.forEach(el => revealObserver.observe(el));

/* Stagger chronicle entries and ledger rows slightly for a nicer cascade */
document.querySelectorAll('.chronicle__entry').forEach((el, i) => {
  el.style.transitionDelay = (i * 0.08) + 's';
});
document.querySelectorAll('.ledger__row').forEach((el, i) => {
  el.style.transitionDelay = (i * 0.06) + 's';
});
document.querySelectorAll('.classifieds__entry').forEach((el, i) => {
  el.style.transitionDelay = (i * 0.08) + 's';
});

/* =================================================================
   MOBILE MENU
   ================================================================= */
const menuBtn      = document.getElementById('menuBtn');
const mobileMenu    = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');

function openMenu() {
  mobileMenu.classList.add('open');
  mobileOverlay.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  menuBtn.setAttribute('aria-expanded', 'true');
}
function closeMenu() {
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  menuBtn.setAttribute('aria-expanded', 'false');
}
if (menuBtn) menuBtn.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});
if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-menu nav a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* =================================================================
   SCROLL CUE (cover -> about)
   ================================================================= */
const scrollCue = document.getElementById('scrollCue');
if (scrollCue) {
  scrollCue.addEventListener('click', () => {
    const about = document.getElementById('about');
    if (about) about.scrollIntoView({ behavior: 'smooth' });
  });
}

/* =================================================================
   LIVE DATELINE (top-right of masthead)
   ================================================================= */
const datelineRight = document.getElementById('datelineRight');
function updateDateline() {
  if (!datelineRight) return;
  const now = new Date();
  const opts = { month: 'long', day: 'numeric', year: 'numeric' };
  datelineRight.textContent = now.toLocaleDateString('en-US', opts);
}
updateDateline();

/* =================================================================
   TYPEWRITER EFFECT
   ================================================================= */
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

  let delay = isDeleting ? 55 : 95;

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
setTimeout(typeWriter, 1100);

/* =================================================================
   GREETING BUTTON
   ================================================================= */
const greetings = [
  'Code is poetry. Let\u2019s write something beautiful together.',
  'Hello! I turn coffee and curiosity into working software.',
  'Mabuhay! Ready to build something great?',
  'From Cebu with clean code and creative design.',
  'Full stack, fully committed \u2014 let\u2019s talk!',
  'Great design is invisible. Great code is the same.',
  'Hardware or software \u2014 I speak both languages.',
  'Let\u2019s collaborate and ship something worth showing off.'
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

  greetingBox.classList.remove('visible');
  setTimeout(() => {
    greetingBox.textContent = '\u201C' + greetings[idx] + '\u201D';
    greetingBox.classList.add('visible');
  }, 150);
}
if (greetBtn) greetBtn.addEventListener('click', showGreeting);

/* =================================================================
   SKILL DEFINITION MODAL
   ================================================================= */
const skillDescriptions = {
  'C#': 'C# (C-Sharp) is a modern, object-oriented language developed by Microsoft. It\u2019s used for Windows apps, web services, and games built on Unity. I use it to create robust backend services and cross-platform applications.',
  'C': 'C is a powerful low-level language that gives direct access to memory and hardware. It\u2019s the foundation of many operating systems. I use C for system-level programming and embedded logic.',
  'Java': 'Java is a versatile, object-oriented language known for its "write once, run anywhere" capability. I use Java to build scalable, platform-independent applications.',
  'HTML': 'HTML is the structural backbone of every web page. I write semantic, accessible, SEO-friendly markup that works as a solid foundation for any UI.',
  'CSS': 'CSS controls layout, typography, color, and responsiveness. I use it to craft polished, mobile-first interfaces that feel great on any device.',
  'JavaScript': 'JavaScript brings interactivity to the web and powers both frontend and backend via Node.js. I use it to build dynamic, engaging applications.',
  'Python': 'Python\u2019s readability and versatility make it great for web development, automation, and data work. I use it for scripting, APIs, and data processing.',
  'SQL': 'SQL is the language of relational databases. I write efficient schemas and complex queries to power data-driven applications.',
  'Full Stack Dev': 'Full Stack Development means owning both the frontend and backend. I connect the user interface to servers, databases, and APIs to deliver complete products.',
  'Adobe Photoshop': 'Photoshop is my go-to for photo editing, compositing, and raster graphic design \u2014 creating visual assets that look polished at every resolution.',
  'Adobe Illustrator': 'Illustrator handles vector graphics \u2014 logos, icons, and illustrations \u2014 so designs scale crisply from a favicon to a billboard.',
  'Adobe After Effects': 'After Effects lets me create motion graphics, animated transitions, and visual effects for web and video content.',
  'UI Design': 'UI Design is about making interfaces intuitive and beautiful. I design with both aesthetics and accessibility in mind, ensuring every screen serves its user.',
  'Hardware & Circuits': 'Understanding hardware gives me insight into how software talks to physical systems \u2014 from microcontrollers to sensors to integrated electronics.',
  'System Engineering': 'System Engineering is the holistic practice of designing and managing complex systems where hardware, software, and processes intersect.',
  'BPO / Customer Service': 'Three years in BPO sharpened my communication, empathy, and problem-solving \u2014 skills that directly inform how I think about user needs in my software.',
  'Telecommunications': 'Supporting telecom customers gave me hands-on knowledge of networking concepts, billing systems, and service workflows.',
  'Healthcare Support': 'Working in healthcare BPO taught me HIPAA-adjacent data sensitivity and the high stakes of clear, accurate patient communication.',
  'E-Commerce': 'I\u2019ve supported orders and disputes across Cartpanda, Buygoods, DigiStore, and Shopify \u2014 giving me practical insight into digital commerce flows.',
  'Persuasive Communication': 'Whether pitching a design, explaining a technical decision, or de-escalating a customer, clear and compelling communication is the skill that makes everything else land.',
  'MS Office Suite': 'Word for documentation, Excel for data analysis and reporting, PowerPoint for presentations \u2014 I use the Office suite efficiently for professional deliverables.'
};

const skillModal       = document.getElementById('skillModal');
const skillModalTitle  = document.getElementById('skillModalTitle');
const skillModalDesc   = document.getElementById('skillModalDesc');
const skillModalClose  = document.getElementById('skillModalClose');
const skillModalOverlay = document.getElementById('skillModalOverlay');

function openSkillModal(name) {
  if (!skillModal) return;
  skillModalTitle.textContent = name;
  skillModalDesc.textContent  = skillDescriptions[name] || (name + ' is a key part of my toolkit.');
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

document.querySelectorAll('.index-item').forEach(item => {
  item.addEventListener('click', () => {
    const name = item.getAttribute('data-skill') || item.querySelector('.index-item__name').textContent.trim();
    openSkillModal(name);
  });
});

/* =================================================================
   SMOOTH ANCHOR SCROLL OFFSET (account for sticky nav)
   ================================================================= */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
