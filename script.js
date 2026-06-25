/* =============================================
   HANZ DEE DALMINO — PORTFOLIO SCRIPTS
   Page-flip / article-chapter edition
   ============================================= */

/* =============================================
   PAGE FLIP ENGINE
   ============================================= */
const pages      = Array.from(document.querySelectorAll('.page'));
const totalPages = pages.length;
let currentIndex = 0;
let isAnimating  = false;

const prevBtn        = document.getElementById('prevBtn');
const nextBtn        = document.getElementById('nextBtn');
const dotNavEl       = document.getElementById('dotNav');
const currentPageEl  = document.getElementById('currentPage');
const totalPagesEl   = document.getElementById('totalPages');
const chapterTitleEl = document.getElementById('navChapterTitle');

if (totalPagesEl) totalPagesEl.textContent = totalPages;

/* ---- Build dot nav ---- */
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

  prevBtn.disabled = (index === 0);
  nextBtn.disabled = (index === totalPages - 1);

  /* Update drawer active link */
  document.querySelectorAll('.drawer__link').forEach((l, i) => {
    l.classList.toggle('active', i === index);
  });
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
    /* Target starts below → slides up */
    target.style.transform = 'translateY(100%)';
    target.style.opacity   = '0';
  } else {
    /* Target starts above → slides down */
    target.style.transform = 'translateY(-100%)';
    target.style.opacity   = '0';
  }

  /* Force reflow so the starting position registers */
  target.getBoundingClientRect();

  /* Activate target (CSS transition kicks in) */
  target.style.transform = '';
  target.style.opacity   = '';
  target.classList.add('is-active');

  /* Push current page out */
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

  /* Clean up after animation */
  setTimeout(() => {
    current.style.transform = '';
    current.style.opacity   = '';
    isAnimating = false;

    /* Scroll new page back to top */
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
  /* Re-enable transitions after a frame */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      pages.forEach(p => { p.style.transition = ''; });
    });
  });
  updateUI(0);
})();

/* ---- Arrow buttons ---- */
prevBtn.addEventListener('click', () => goToPage(currentIndex - 1));
nextBtn.addEventListener('click', () => goToPage(currentIndex + 1));

/* ---- Keyboard navigation ---- */
document.addEventListener('keydown', e => {
  if (['ArrowDown', 'PageDown'].includes(e.key)) { e.preventDefault(); goToPage(currentIndex + 1); }
  if (['ArrowUp',   'PageUp'  ].includes(e.key)) { e.preventDefault(); goToPage(currentIndex - 1); }
});

/* ---- Touch / swipe navigation ---- */
let touchStartY = 0;
let touchStartTime = 0;

document.addEventListener('touchstart', e => {
  touchStartY    = e.touches[0].clientY;
  touchStartTime = Date.now();
}, { passive: true });

document.addEventListener('touchend', e => {
  const deltaY    = touchStartY - e.changedTouches[0].clientY;
  const deltaTime = Date.now() - touchStartTime;
  const activePage = pages[currentIndex];

  /* Only trigger page flip if: fast swipe OR large movement AND page at scroll edge */
  const atTop    = activePage.scrollTop <= 0;
  const atBottom = activePage.scrollTop + activePage.clientHeight >= activePage.scrollHeight - 2;

  const isFastSwipe = Math.abs(deltaY) > 40 && deltaTime < 350;
  const isBigSwipe  = Math.abs(deltaY) > 120;

  if (isFastSwipe || isBigSwipe) {
    if (deltaY > 0 && atBottom) { goToPage(currentIndex + 1); }
    if (deltaY < 0 && atTop)    { goToPage(currentIndex - 1); }
  }
}, { passive: true });

/* ---- Mouse wheel navigation ---- */
let wheelCooldown = false;
document.addEventListener('wheel', e => {
  if (wheelCooldown || isAnimating) return;
  const activePage = pages[currentIndex];
  const atTop    = activePage.scrollTop <= 0;
  const atBottom = activePage.scrollTop + activePage.clientHeight >= activePage.scrollHeight - 2;

  if (e.deltaY > 30 && atBottom) {
    goToPage(currentIndex + 1);
    wheelCooldown = true;
    setTimeout(() => { wheelCooldown = false; }, 800);
  } else if (e.deltaY < -30 && atTop) {
    goToPage(currentIndex - 1);
    wheelCooldown = true;
    setTimeout(() => { wheelCooldown = false; }, 800);
  }
}, { passive: true });

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
document.querySelector('.nav__logo').addEventListener('click', e => {
  e.preventDefault();
  goToPage(0);
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

hamburger.addEventListener('click', () => {
  drawer.classList.contains('open') ? closeDrawer() : openDrawer();
});
drawerClose.addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);

/* Drawer links already handled by [data-page] above */


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
   NAV SCROLL SHADOW
   ============================================= */
const nav = document.getElementById('nav');
pages.forEach(p => {
  p.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', p.scrollTop > 10);
  }, { passive: true });
});
