/* ============================================================
   JAMESTHEW.COM — main.js  (ONE FILE — ALL PAGES)
   Navbar | Hamburger | Arc Wheel | Reveals | Counters |
   Home page loaders | About page loaders | Contact form
   ============================================================ */

'use strict';


/* ═══════════════════════════════════════════════════════════════
   1. NAVBAR — Scroll | Hamburger | Dropdowns | Active Links
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const navbar     = document.getElementById('jtNavbar');
  const wave       = document.getElementById('jtWave');
  const hamburger  = document.getElementById('jtHamburger');
  const mobileMenu = document.getElementById('jtMobileMenu');

  /* ── Sticky on scroll ── */
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 50;
    navbar?.classList.toggle('scrolled', scrolled);
    wave?.classList.toggle('scrolled', scrolled);
  });

  /* ── Hamburger toggle ── */
  if (hamburger && mobileMenu) {

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.setAttribute('aria-label', isOpen ? 'Close Menu' : 'Open Menu');
    });

    /* Close on nav link click */
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (link.classList.contains('dropdown-toggle')) return;
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        hamburger.setAttribute('aria-label', 'Open Menu');
      });
    });

    /* Close on outside click */
    document.addEventListener('click', (e) => {
      if (
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target) &&
        mobileMenu.classList.contains('open')
      ) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      }
    });

    /* Close on resize to desktop */
    window.addEventListener('resize', () => {
      if (window.innerWidth > 991) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      }
    });
  }

  /* ── Active nav link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.jt-nav-links > li > a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || href === './' + currentPage) {
      link.classList.add('active');
    }
  });

  /* ── Profile dropdown — close outside ── */
  const profileWrapper = document.querySelector('.jt-profile-wrapper');
  if (profileWrapper) {
    document.addEventListener('click', (e) => {
      if (!profileWrapper.contains(e.target)) profileWrapper.classList.remove('active');
    });
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navbarHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')
        ) || 85;
        const top = target.getBoundingClientRect().top + window.scrollY - (navbarHeight + 20);
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Footer newsletter ── */
  const newsletterForm = document.querySelector('.footer-newsletter-form');
  if (newsletterForm) {
    const input      = newsletterForm.querySelector('input[type="email"]');
    const btn        = newsletterForm.querySelector('button');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubscribe = () => {
      const email = input.value.trim();
      if (!email) {
        input.style.outline = '1.5px solid #C0392B';
        input.placeholder   = 'Please enter your email';
        setTimeout(() => { input.style.outline = ''; input.placeholder = 'Your email address'; }, 2500);
        return;
      }
      if (!emailRegex.test(email)) {
        input.style.outline = '1.5px solid #C0392B';
        input.placeholder   = 'Invalid email format';
        input.value         = '';
        setTimeout(() => { input.style.outline = ''; input.placeholder = 'Your email address'; }, 2500);
        return;
      }
      input.value          = '';
      input.placeholder    = '✓ Subscribed! Thank you';
      input.style.color    = '#27AE60';
      input.style.outline  = '1.5px solid #27AE60';
      btn.textContent      = '✓';
      btn.style.background = '#27AE60';
      setTimeout(() => {
        input.placeholder    = 'Your email address';
        input.style.color    = '';
        input.style.outline  = '';
        btn.textContent      = 'Subscribe';
        btn.style.background = '';
      }, 3500);
    };

    btn.addEventListener('click', handleSubscribe);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSubscribe(); });
  }

  /* ── Desktop dropdown — close outside ── */
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.jt-nav-links > li').forEach(item => {
      if (!item.contains(e.target)) item.classList.remove('open');
    });
  });

  /* ── Boot page-specific modules ── */
  initReveal();
  initCounters();
  initHomePage();
  initAboutPage();

}); // end DOMContentLoaded


/* ═══════════════════════════════════════════════════════════════
   2. MOBILE RECIPES DROPDOWN
   ═══════════════════════════════════════════════════════════════ */

const mobileRecipesItem = document.querySelector('.jt-mobile-menu ul li a[href="recipes-list.html"]');

if (mobileRecipesItem) {
  mobileRecipesItem.classList.add('dropdown-toggle');

  const subMenu = document.createElement('ul');
  subMenu.style.cssText = `
    list-style:none; padding:0; margin:0;
    max-height:0; overflow:hidden;
    transition:max-height 0.35s ease;
    background:rgba(0,0,0,0.15); border-radius:8px;
  `;

  const subItems = [
    { href: 'recipes-list.html',             icon: '🍽️', label: 'All Recipes'    },
    { href: 'recipes-list.html?cat=veg',     icon: '🥗', label: 'Vegetarian'     },
    { href: 'recipes-list.html?cat=nonveg',  icon: '🍗', label: 'Non-Vegetarian' },
    { href: 'recipes-list.html?cat=italian', icon: '🍕', label: 'Italian'        },
    { href: 'recipes-list.html?cat=juice',   icon: '🥤', label: 'Juices'         },
  ];

  subItems.forEach(item => {
    const li = document.createElement('li');
    const a  = document.createElement('a');
    a.href          = item.href;
    a.textContent   = `${item.icon}  ${item.label}`;
    a.style.cssText = `
      display:block; padding:0.6rem 1rem 0.6rem 1.5rem;
      color:rgba(255,255,255,0.75); font-size:0.82rem;
      text-decoration:none; border-bottom:1px solid rgba(255,255,255,0.05);
      transition:all 0.3s ease;
    `;
    a.addEventListener('mouseenter', () => a.style.color = '#C9A84C');
    a.addEventListener('mouseleave', () => a.style.color = 'rgba(255,255,255,0.75)');
    li.appendChild(a);
    subMenu.appendChild(li);
  });

  const recipesLi = mobileRecipesItem.closest('li');
  recipesLi.appendChild(subMenu);

  const arrow = document.createElement('span');
  arrow.textContent   = ' ▾';
  arrow.style.cssText = 'display:inline-block; transition:transform 0.3s ease;';
  mobileRecipesItem.appendChild(arrow);

  let subOpen = false;
  mobileRecipesItem.addEventListener('click', (e) => {
    e.preventDefault();
    subOpen                 = !subOpen;
    subMenu.style.maxHeight = subOpen ? subMenu.scrollHeight + 'px' : '0';
    arrow.style.transform   = subOpen ? 'rotate(180deg)' : 'rotate(0deg)';
  });
}


/* ═══════════════════════════════════════════════════════════════
   3. ARC WHEEL  (hero food icon animation)
   ═══════════════════════════════════════════════════════════════ */

const ARC_CONFIG = {
  leftIcons:  ['🍕','🍝','🥤','🥩','🍲','🥗','🍷','🥖'],
  rightIcons: ['🍜','🍮','🥭','🍓','🍚','☕','🫒','🍨'],
  speed:    0.005,
  radiusX:  450,
  radiusY:  280,
  iconSize: 75,
};

class ArcWheel {
  constructor(containerId, icons, side) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.icons    = icons;
    this.side     = side;
    this.elements = [];
    this.angles   = icons.map((_, i) => i * (Math.PI * 2 / icons.length));
    this.init();
  }
  init() {
    this.icons.forEach(emoji => {
      const el       = document.createElement('div');
      el.className   = 'icon-bubble';
      el.textContent = emoji;
      this.container.appendChild(el);
      this.elements.push(el);
    });
    this.animate();
  }
  animate() {
    const update = () => {
      const W       = this.container.offsetWidth;
      const H       = this.container.offsetHeight;
      const centerX = this.side === 'left' ? W + 50 : -50;
      const centerY = H / 2;

      this.angles.forEach((angle, i) => {
        this.angles[i] += ARC_CONFIG.speed * (this.side === 'left' ? 1 : -1);
        const x          = centerX + ARC_CONFIG.radiusX * Math.cos(this.angles[i]);
        const y          = centerY + ARC_CONFIG.radiusY * Math.sin(this.angles[i]);
        const cos        = Math.cos(this.angles[i]);
        const visibility = this.side === 'left' ? -cos : cos;
        const opacity    = Math.max(0, visibility * 1.5);
        const scale      = 0.6 + opacity * 0.4;
        const el         = this.elements[i];
        el.style.left       = `${x - ARC_CONFIG.iconSize / 2}px`;
        el.style.top        = `${y - ARC_CONFIG.iconSize / 2}px`;
        el.style.opacity    = opacity.toFixed(2);
        el.style.transform  = `scale(${scale.toFixed(2)})`;
        el.style.zIndex     = Math.round(opacity * 10);
        el.style.visibility = opacity < 0.1 ? 'hidden' : 'visible';
      });
      requestAnimationFrame(update);
    };
    update();
  }
}

if (document.getElementById('leftArc'))  new ArcWheel('leftArc',  ARC_CONFIG.leftIcons,  'left');
if (document.getElementById('rightArc')) new ArcWheel('rightArc', ARC_CONFIG.rightIcons, 'right');


/* ═══════════════════════════════════════════════════════════════
   4. SHARED UTILITIES  (declared ONCE — used everywhere)
   ═══════════════════════════════════════════════════════════════ */

/* ── Scroll Reveal ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add('revealed'), delay);
      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.10, rootMargin: '0px 0px -40px 0px' }
);

function initReveal() {
  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
}

/* ── Stat Counter ── */
function animateCount(el, target, duration = 1800) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.floor(eased * target);
    el.textContent = current >= 1000 ? Math.floor(current / 1000) + 'K+' : current + '+';
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target >= 1000 ? Math.floor(target / 1000) + 'K+' : target + '+';
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target, parseInt(entry.target.dataset.count, 10));
      statsObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.5 }
);

function initCounters() {
  document.querySelectorAll('[data-count]').forEach(el => statsObserver.observe(el));
}

/* ── Stats fetch (shared helper) ──────────────────────────────
 * FETCH FROM BACKEND: GET /api/stats
 * Response: { recipes, members, contests, studentsTotal, booksPublished, tvEpisodes }
 */
async function fetchStats(keyMap) {
  try {
    const res  = await fetch('/api/stats');
    const data = await res.json();
    Object.entries(keyMap).forEach(([selector, apiKey]) => {
      if (!data[apiKey]) return;
      const el = document.querySelector(selector);
      if (el) el.dataset.count = data[apiKey];
    });
  } catch { /* silently fall back to hardcoded data-count values */ }
}

/* ── Upcoming Classes (shared helper) ─────────────────────────
 * FETCH FROM BACKEND: GET /api/classes/upcoming
 * Response: [{ date: ISO string, topic: string, spots: number }]
 */
async function fetchUpcomingClasses(containerId, itemClass, titleSelector) {
  const container = document.getElementById(containerId);
  if (!container) return;
  try {
    const res     = await fetch('/api/classes/upcoming');
    const data    = await res.json();
    const titleEl = titleSelector ? container.querySelector(titleSelector) : null;
    container.innerHTML = '';
    if (titleEl) container.appendChild(titleEl);
    if (!data.length) {
      container.innerHTML += `<p class="no-data-note">No upcoming sessions yet. Enquire directly.</p>`;
      return;
    }
    data.slice(0, 4).forEach(cls => {
      const date = new Date(cls.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const item = document.createElement('div');
      item.className = itemClass;
      item.innerHTML = `
        <span class="${itemClass}__topic">${cls.topic}</span>
        <span class="${itemClass}__date">${date}</span>
        <span class="${itemClass}__spots">${cls.spots} spots left</span>`;
      container.appendChild(item);
    });
  } catch {
    const c = document.getElementById(containerId);
    if (!c) return;
    const titleEl = titleSelector ? c.querySelector(titleSelector) : null;
    c.innerHTML = '';
    if (titleEl) c.appendChild(titleEl);
    c.innerHTML += `<p class="no-data-note">Schedule loading soon. Call +1 (555) 123-4567.</p>`;
  }
}


/* ═══════════════════════════════════════════════════════════════
   5. HOME PAGE LOADERS
   Every function guards with if (!element) return —
   completely safe to run on pages that don't have these elements.
   ═══════════════════════════════════════════════════════════════ */

/* ─── Featured Recipes ─────────────────────────────────────────
 * FETCH FROM BACKEND: GET /api/recipes?featured=true&limit=6
 * Response: [{ id, title, category, image, isFree, rating, prepTime }]
 */
async function loadFeaturedRecipes() {
  const grid = document.getElementById('recipeGrid');
  if (!grid) return;
  try {
    const res  = await fetch('/api/recipes?featured=true&limit=6');
    const data = await res.json();
    grid.innerHTML = data.map(recipe => `
      <article class="recipe-card" data-reveal>
        <img class="recipe-card__img" src="${recipe.image}" alt="${recipe.title}"
             loading="lazy" onerror="this.style.background='#f0e8e2';this.src=''">
        <div class="recipe-card__body">
          <span class="recipe-card__badge recipe-card__badge--${recipe.isFree ? 'free' : 'paid'}">
            ${recipe.isFree ? 'Free' : 'Premium'}
          </span>
          <h3 class="recipe-card__title">${recipe.title}</h3>
          <div class="recipe-card__meta">
            <span>🏷️ ${recipe.category}</span>
            <span>⏱ ${recipe.prepTime}</span>
            <span>${'★'.repeat(Math.round(recipe.rating))} ${recipe.rating.toFixed(1)}</span>
          </div>
        </div>
      </article>`).join('');
    grid.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
  } catch {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--color-text-secondary);font-family:var(--font-body);">Unable to load recipes. <a href="recipes.html">Browse all →</a></p>`;
  }
}

/* ─── Tips ─────────────────────────────────────────────────────
 * FETCH FROM BACKEND: GET /api/tips?limit=4
 * Response: [{ id, title, excerpt, isFree, category }]
 */
async function loadTips() {
  const grid = document.getElementById('tipsGrid');
  if (!grid) return;
  try {
    const res  = await fetch('/api/tips?limit=4');
    const data = await res.json();
    grid.innerHTML = data.map(tip => `
      <article class="tip-card">
        <span class="tip-card__badge tip-card__badge--${tip.isFree ? 'free' : 'paid'}">
          ${tip.isFree ? 'Free' : 'Premium'}
        </span>
        <h4 class="tip-card__title">${tip.title}</h4>
        <p class="tip-card__excerpt">${tip.excerpt}</p>
      </article>`).join('');
  } catch {
    grid.innerHTML = `<p style="font-size:14px;color:var(--color-text-secondary);font-family:var(--font-body);">Tips unavailable. <a href="tips.html">View all →</a></p>`;
  }
}

/* ─── Active Contest ───────────────────────────────────────────
 * FETCH FROM BACKEND: GET /api/contests?active=true&limit=1
 * Response: { id, title, description, prize, deadline, entries }
 */
async function loadActiveContest() {
  const banner = document.getElementById('contestBanner');
  if (!banner) return;
  try {
    const res     = await fetch('/api/contests?active=true&limit=1');
    const data    = await res.json();
    const contest = Array.isArray(data) ? data[0] : data;
    if (!contest) { banner.style.display = 'none'; return; }
    const deadline = new Date(contest.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    document.getElementById('contestTitle').textContent    = contest.title;
    document.getElementById('contestDesc').textContent     = contest.description;
    document.getElementById('contestPrize').textContent    = contest.prize;
    document.getElementById('contestDeadline').textContent = `📅 Deadline: ${deadline}`;
    document.getElementById('contestEntries').textContent  = `✍️ ${contest.entries} entries`;
  } catch {
    document.getElementById('contestTitle').textContent    = 'Recipe Contest — Coming Soon!';
    document.getElementById('contestDesc').textContent     = 'James will soon be announcing an exciting contest. Stay tuned!';
    document.getElementById('contestPrize').textContent    = 'TBA';
    document.getElementById('contestDeadline').textContent = '📅 Date TBA';
    document.getElementById('contestEntries').textContent  = '✍️ Be the first to enter';
  }
}

/* ─── Announcements ────────────────────────────────────────────
 * FETCH FROM BACKEND: GET /api/announcements?limit=3
 * Response: [{ id, title, date, excerpt }]
 */
async function loadAnnouncements() {
  const list = document.getElementById('announcementsList');
  if (!list) return;
  try {
    const res  = await fetch('/api/announcements?limit=3');
    const data = await res.json();
    list.innerHTML = data.map(item => {
      const date = new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      return `
        <article class="announcement-card" data-reveal>
          <span class="announcement-card__date">${date}</span>
          <h3 class="announcement-card__title">${item.title}</h3>
          <p class="announcement-card__excerpt">${item.excerpt}</p>
        </article>`;
    }).join('');
    list.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
  } catch {
    list.innerHTML = `<p style="grid-column:1/-1;text-align:center;font-size:14px;color:var(--color-text-secondary);font-family:var(--font-body);">No announcements. <a href="announcements.html">View archive →</a></p>`;
  }
}

/* ─── Home Testimonials ────────────────────────────────────────
 * FETCH FROM BACKEND: GET /api/feedback?featured=true&limit=8
 * Response: [{ id, userName, userAvatar, rating, comment, recipeTitle }]
 */
async function loadHomeTestimonials() {
  const track = document.getElementById('testimonialsTrack');
  if (!track) return;
  try {
    const res  = await fetch('/api/feedback?featured=true&limit=8');
    const data = await res.json();
    track.innerHTML = data.map(t => {
      const initials = t.userName.split(' ').map(w => w[0]).join('').toUpperCase();
      return `
        <article class="testimonial-card">
          <span class="testimonial-card__stars">${'★'.repeat(Math.round(t.rating))}</span>
          <p class="testimonial-card__comment">"${t.comment}"</p>
          <div class="testimonial-card__user">
            <div class="testimonial-card__avatar">
              ${t.userAvatar ? `<img src="${t.userAvatar}" alt="${t.userName}">` : initials}
            </div>
            <div>
              <div class="testimonial-card__name">${t.userName}</div>
              <div class="testimonial-card__recipe">on "${t.recipeTitle}"</div>
            </div>
          </div>
        </article>`;
    }).join('');
  } catch {
    track.innerHTML = `<p style="font-size:14px;color:var(--color-text-secondary);font-family:var(--font-body);">Reviews loading soon.</p>`;
  }
}

/* ── Home Init ── */
function initHomePage() {
  if (!document.getElementById('recipeGrid') && !document.getElementById('heroStats')) return;
  fetchStats({ '[data-count="320"]': 'recipes', '[data-count="12000"]': 'members', '[data-count="48"]': 'contests' });
  loadFeaturedRecipes();
  loadTips();
  loadActiveContest();
  fetchUpcomingClasses('upcomingClasses', 'upcoming-item', '.classes__upcoming-title');
  loadAnnouncements();
  loadHomeTestimonials();
}


/* ═══════════════════════════════════════════════════════════════
   6. ABOUT PAGE LOADERS
   ═══════════════════════════════════════════════════════════════ */

let galleryImages        = [];
let currentLightboxIndex = 0;

/* ─── Gallery ──────────────────────────────────────────────────
 * FETCH FROM BACKEND: GET /api/chef/gallery
 * Response: [{ id, url, caption, size: 'normal'|'tall'|'wide' }]
 */
async function loadGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  try {
    const res  = await fetch('/api/chef/gallery');
    const data = await res.json();
    galleryImages = data;
    grid.innerHTML = data.map((img, i) => {
      const cls = img.size === 'tall' ? 'gallery__item--tall' : img.size === 'wide' ? 'gallery__item--wide' : '';
      return `
        <div class="gallery__item ${cls}" data-index="${i}">
          <img src="${img.url}" alt="${img.caption}" loading="lazy"
               onerror="this.parentElement.style.background='rgba(109,26,54,0.08)'">
          <div class="gallery__item-overlay">
            <span class="gallery__item-caption">${img.caption}</span>
          </div>
        </div>`;
    }).join('');
    grid.querySelectorAll('.gallery__item').forEach(item => {
      item.addEventListener('click', () => openLightbox(parseInt(item.dataset.index, 10)));
    });
  } catch {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;font-size:14px;color:var(--color-text-secondary);font-family:var(--font-body);">Gallery coming soon.</p>`;
  }
}

function openLightbox(index) {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox || !galleryImages.length) return;
  currentLightboxIndex = index;
  const img = galleryImages[index];
  document.getElementById('lightboxImg').src             = img.url;
  document.getElementById('lightboxImg').alt             = img.caption;
  document.getElementById('lightboxCaption').textContent = img.caption;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  if (!galleryImages.length) return;
  currentLightboxIndex = (currentLightboxIndex + dir + galleryImages.length) % galleryImages.length;
  const img = galleryImages[currentLightboxIndex];
  document.getElementById('lightboxImg').src             = img.url;
  document.getElementById('lightboxImg').alt             = img.caption;
  document.getElementById('lightboxCaption').textContent = img.caption;
}

function initLightbox() {
  document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
  document.getElementById('lightboxPrev')?.addEventListener('click',  () => navigateLightbox(-1));
  document.getElementById('lightboxNext')?.addEventListener('click',  () => navigateLightbox(1));
  document.getElementById('lightbox')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('lightbox')?.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

/* ─── Books ────────────────────────────────────────────────────
 * FETCH FROM BACKEND: GET /api/chef/books
 * Response: [{ id, title, cover, year, desc }]
 */
async function loadBooks() {
  const track = document.getElementById('booksTrack');
  if (!track) return;
  try {
    const res  = await fetch('/api/chef/books');
    const data = await res.json();
    track.innerHTML = data.map(book => `
      <article class="book-card">
        <img class="book-card__cover" src="${book.cover}" alt="${book.title}"
             onerror="this.style.background='rgba(255,255,255,0.1)'">
        <span class="book-card__year">${book.year}</span>
        <h4 class="book-card__title">${book.title}</h4>
        <p class="book-card__desc">${book.desc}</p>
      </article>`).join('');
  } catch {
    track.innerHTML = `<p style="font-size:14px;color:rgba(255,255,255,0.5);font-family:var(--font-body);">Book catalogue coming soon.</p>`;
  }
}

/* ─── About Testimonials ───────────────────────────────────────
 * FETCH FROM BACKEND: GET /api/feedback?featured=true&limit=6
 * Response: [{ id, userName, userAvatar, rating, comment, recipeTitle }]
 */
async function loadAboutTestimonials() {
  const grid = document.getElementById('aboutTestimonialsGrid');
  if (!grid) return;
  try {
    const res  = await fetch('/api/feedback?featured=true&limit=6');
    const data = await res.json();
    grid.innerHTML = data.map(t => {
      const initials = t.userName.split(' ').map(w => w[0]).join('').toUpperCase();
      const stars    = '★'.repeat(Math.round(t.rating)) + '☆'.repeat(5 - Math.round(t.rating));
      return `
        <article class="about-tcard" data-reveal>
          <div class="about-tcard__quote">"</div>
          <div class="about-tcard__stars">${stars}</div>
          <p class="about-tcard__comment">"${t.comment}"</p>
          <div class="about-tcard__user">
            <div class="about-tcard__avatar">
              ${t.userAvatar ? `<img src="${t.userAvatar}" alt="${t.userName}">` : initials}
            </div>
            <div>
              <div class="about-tcard__name">${t.userName}</div>
              <div class="about-tcard__recipe">on "${t.recipeTitle}"</div>
            </div>
          </div>
        </article>`;
    }).join('');
    grid.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));
  } catch {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;font-size:14px;color:var(--color-text-secondary);font-family:var(--font-body);">Reviews coming soon.</p>`;
  }
}

/* ─── Contact Details ──────────────────────────────────────────
 * FETCH FROM BACKEND: GET /api/chef/contact
 * Response: { email: string, phone: string }
 */
async function loadContactDetails() {
  const emailEl = document.getElementById('contactEmail');
  if (!emailEl) return;
  try {
    const res  = await fetch('/api/chef/contact');
    const data = await res.json();
    if (data.email) emailEl.textContent = data.email;
  } catch { /* keep static HTML fallback */ }
}

/* ─── Contact Form Submit ──────────────────────────────────────
 * FETCH FROM BACKEND: POST /api/contact
 * Body:     { name, email, subject, message }
 * Response: { success: boolean, message?: string }
 */
async function submitContact(e) {
  e.preventDefault();
  const name    = document.getElementById('contactName')?.value.trim();
  const email   = document.getElementById('contactEmailInput')?.value.trim();
  const subject = document.getElementById('contactSubject')?.value.trim();
  const message = document.getElementById('contactMessage')?.value.trim();
  const msgEl   = document.getElementById('contactFormMsg');
  const btn     = document.getElementById('contactSubmitBtn');

  if (!name || !email || !message) {
    msgEl.textContent = 'Please fill in your name, email, and message.';
    msgEl.className   = 'connect__form-note error';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msgEl.textContent = 'Please enter a valid email address.';
    msgEl.className   = 'connect__form-note error';
    return;
  }
  btn.textContent   = 'Sending…';
  btn.disabled      = true;
  msgEl.textContent = '';
  try {
    const res  = await fetch('/api/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, subject, message })
    });
    const data = await res.json();
    if (data.success) {
      msgEl.textContent = '✓ Message sent! James will be in touch soon.';
      msgEl.className   = 'connect__form-note success';
      ['contactName','contactEmailInput','contactSubject','contactMessage']
        .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    } else {
      throw new Error(data.message || 'Something went wrong');
    }
  } catch (err) {
    msgEl.textContent = `✕ Couldn't send: ${err.message}. Please try calling directly.`;
    msgEl.className   = 'connect__form-note error';
  } finally {
    btn.textContent = 'Send Message';
    btn.disabled    = false;
  }
}
window.submitContact = submitContact; // expose for inline onclick in about HTML

/* ── About Init ── */
function initAboutPage() {
  if (!document.getElementById('galleryGrid') && !document.getElementById('booksTrack')) return;
  fetchStats({ '[data-count="320"]': 'recipes', '[data-count="12"]': 'booksPublished', '[data-count="48"]': 'tvEpisodes', '[data-count="5000"]': 'studentsTotal' });
  loadGallery();
  loadBooks();
  fetchUpcomingClasses('aboutUpcomingClasses', 'upcoming-card', '.upcoming-header');
  loadAboutTestimonials();
  loadContactDetails();
  initLightbox();
}


// ======================================================
// AUTH MODAL — paste this at the BOTTOM of your main.js
// replacing everything from "// -------- login and register"
// to the end of the file
// ======================================================

(function () {
  'use strict';

  /* ── 1. Inject modal HTML into every page automatically ── */
  if (!document.getElementById('modalOverlay')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="jt-modal-overlay" id="modalOverlay">

        <!-- LOGIN -->
        <div class="jt-modal" id="loginModal" role="dialog" aria-modal="true">
          <div class="jt-modal-panel">
            <div class="jt-panel-logo">James Thew</div>
            <p class="jt-panel-tagline">Welcome back to the kitchen.</p>
            <div class="jt-panel-divider"></div>
            <p class="jt-panel-sub">Sign in to access exclusive recipes, contests, and culinary tips curated just for you.</p>
            <div class="jt-panel-switch">
              <span>Don't have an account?</span>
              <button class="jt-switch-btn" id="switchToRegister">Create one →</button>
            </div>
          </div>
          <div class="jt-modal-form-wrap">
            <button class="jt-modal-close" id="closeLogin" aria-label="Close">
              <i class="fa fa-xmark"></i>
            </button>
            <div class="jt-form-header">
              <h2 class="jt-form-title">Sign In</h2>
              <p class="jt-form-subtitle">Enter your credentials to continue</p>
            </div>
            <form class="jt-form" id="loginForm" novalidate>

              <div class="jt-field">
                <label class="jt-label" for="loginEmail">Email Address</label>
                <div class="jt-input-wrap">
                  <span class="jt-input-icon"><i class="fa fa-envelope"></i></span>
                  <input type="email" id="loginEmail" class="jt-input" placeholder="you@example.com" autocomplete="email"/>
                </div>
              </div>

              <div class="jt-field">
                <label class="jt-label" for="loginPassword">Password</label>
                <div class="jt-input-wrap">
                  <span class="jt-input-icon"><i class="fa fa-lock"></i></span>
                  <input type="password" id="loginPassword" class="jt-input" placeholder="Enter your password" autocomplete="current-password"/>
                  <button type="button" class="jt-eye-btn" data-target="loginPassword">
                    <i class="fa fa-eye eye-open"></i>
                    <i class="fa fa-eye-slash eye-closed" style="display:none"></i>
                  </button>
                </div>
              </div>

              <div class="jt-row-between">
                <label class="jt-checkbox-wrap">
                  <input type="checkbox" id="rememberMe" class="jt-checkbox"/>
                  <span class="jt-checkbox-custom"></span>
                  <span class="jt-checkbox-label">Remember me</span>
                </label>
                <a href="#" class="jt-forgot">Forgot password?</a>
              </div>

              <button type="submit" class="jt-btn-submit">
                <i class="fa fa-right-to-bracket"></i> Sign In
              </button>

              <div class="jt-or-divider"><span>or continue with</span></div>

              <div class="jt-social-row">
                <button type="button" class="jt-social-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button type="button" class="jt-social-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </button>
              </div>

              <p class="jt-mobile-switch">
                Don't have an account?
                <button type="button" class="jt-switch-btn" id="switchToRegMob">Register</button>
              </p>

            </form>
          </div>
        </div>

        <!-- REGISTER -->
        <div class="jt-modal" id="registerModal" role="dialog" aria-modal="true" style="display:none">
          <div class="jt-modal-panel">
            <div class="jt-panel-logo">James Thew</div>
            <p class="jt-panel-tagline">Join the culinary journey.</p>
            <div class="jt-panel-divider"></div>
            <p class="jt-panel-sub">Create your free account and unlock a world of recipes, tips, and exclusive chef contests.</p>
            <div class="jt-panel-switch">
              <span>Already have an account?</span>
              <button class="jt-switch-btn" id="switchToLogin">Sign in →</button>
            </div>
          </div>
          <div class="jt-modal-form-wrap">
            <button class="jt-modal-close" id="closeRegister" aria-label="Close">
              <i class="fa fa-xmark"></i>
            </button>
            <div class="jt-form-header">
              <h2 class="jt-form-title">Create Account</h2>
              <p class="jt-form-subtitle">Fill in your details to get started</p>
            </div>
            <form class="jt-form" id="registerForm" novalidate>

              <div class="jt-fields-row">
                <div class="jt-field">
                  <label class="jt-label" for="regFirstName">First Name</label>
                  <div class="jt-input-wrap">
                    <span class="jt-input-icon"><i class="fa fa-user"></i></span>
                    <input type="text" id="regFirstName" class="jt-input" placeholder="James" autocomplete="given-name"/>
                  </div>
                </div>
                <div class="jt-field">
                  <label class="jt-label" for="regLastName">Last Name</label>
                  <div class="jt-input-wrap">
                    <span class="jt-input-icon"><i class="fa fa-user"></i></span>
                    <input type="text" id="regLastName" class="jt-input" placeholder="Thew" autocomplete="family-name"/>
                  </div>
                </div>
              </div>

              <div class="jt-field">
                <label class="jt-label" for="regUsername">Username</label>
                <div class="jt-input-wrap">
                  <span class="jt-input-icon"><i class="fa fa-at"></i></span>
                  <input type="text" id="regUsername" class="jt-input" placeholder="@chef_username" autocomplete="username"/>
                </div>
              </div>

              <div class="jt-field">
                <label class="jt-label" for="regEmail">Email Address</label>
                <div class="jt-input-wrap">
                  <span class="jt-input-icon"><i class="fa fa-envelope"></i></span>
                  <input type="email" id="regEmail" class="jt-input" placeholder="you@example.com" autocomplete="email"/>
                </div>
              </div>

              <div class="jt-field">
                <label class="jt-label" for="regPassword">Password</label>
                <div class="jt-input-wrap">
                  <span class="jt-input-icon"><i class="fa fa-lock"></i></span>
                  <input type="password" id="regPassword" class="jt-input" placeholder="Create a strong password" autocomplete="new-password"/>
                  <button type="button" class="jt-eye-btn" data-target="regPassword">
                    <i class="fa fa-eye eye-open"></i>
                    <i class="fa fa-eye-slash eye-closed" style="display:none"></i>
                  </button>
                </div>
              </div>

              <div class="jt-field">
                <label class="jt-label" for="regConfirm">Confirm Password</label>
                <div class="jt-input-wrap">
                  <span class="jt-input-icon"><i class="fa fa-shield-halved"></i></span>
                  <input type="password" id="regConfirm" class="jt-input" placeholder="Repeat your password" autocomplete="new-password"/>
                  <button type="button" class="jt-eye-btn" data-target="regConfirm">
                    <i class="fa fa-eye eye-open"></i>
                    <i class="fa fa-eye-slash eye-closed" style="display:none"></i>
                  </button>
                </div>
              </div>

              <div class="jt-field">
                <label class="jt-checkbox-wrap">
                  <input type="checkbox" id="agreeTerms" class="jt-checkbox"/>
                  <span class="jt-checkbox-custom"></span>
                  <span class="jt-checkbox-label">
                    I agree to the <a href="#" class="jt-link">Terms of Service</a> and <a href="#" class="jt-link">Privacy Policy</a>
                  </span>
                </label>
              </div>

              <button type="submit" class="jt-btn-submit">
                <i class="fa fa-user-plus"></i> Create Account
              </button>

              <p class="jt-mobile-switch">
                Already have an account?
                <button type="button" class="jt-switch-btn" id="switchToLogMob">Sign In</button>
              </p>

            </form>
          </div>
        </div>

      </div>
    `);
  }

  /* ── 2. Grab all elements AFTER injection ── */
  const overlay        = document.getElementById('modalOverlay');
  const loginModal     = document.getElementById('loginModal');
  const registerModal  = document.getElementById('registerModal');

  /* ── 3. Helpers ── */
  function openOverlay() {
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeAll() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () {
      loginModal.style.display    = 'none';
      registerModal.style.display = 'none';
    }, 280);
  }

  function show(which) {
    if (which === 'login') {
      registerModal.style.display = 'none';
      loginModal.style.display    = 'flex';
      focusFirst(loginModal);
    } else {
      loginModal.style.display    = 'none';
      registerModal.style.display = 'flex';
      focusFirst(registerModal);
    }
  }

  function focusFirst(modal) {
    setTimeout(function () {
      var first = modal.querySelector('.jt-input');
      if (first) first.focus();
    }, 300);
  }

  /* ── 4. Bind open buttons — runs AFTER DOMContentLoaded so navbar exists ── */
  function bindButtons() {

    /* Desktop navbar buttons */
    var btnLogin    = document.getElementById('openLogin');
    var btnRegister = document.getElementById('openRegister');

    /* Mobile navbar buttons */
    var btnLoginMob = document.getElementById('openLoginMob');
    var btnRegMob   = document.getElementById('openRegisterMob');

    btnLogin && btnLogin.addEventListener('click', function (e) {
      e.preventDefault();
      loginModal.style.display    = 'flex';
      registerModal.style.display = 'none';
      openOverlay();
      focusFirst(loginModal);
    });

    btnRegister && btnRegister.addEventListener('click', function (e) {
      e.preventDefault();
      registerModal.style.display = 'flex';
      loginModal.style.display    = 'none';
      openOverlay();
      focusFirst(registerModal);
    });

    btnLoginMob && btnLoginMob.addEventListener('click', function (e) {
      e.preventDefault();
      loginModal.style.display    = 'flex';
      registerModal.style.display = 'none';
      openOverlay();
      focusFirst(loginModal);
    });

    btnRegMob && btnRegMob.addEventListener('click', function (e) {
      e.preventDefault();
      registerModal.style.display = 'flex';
      loginModal.style.display    = 'none';
      openOverlay();
      focusFirst(registerModal);
    });
  }

  /* ── 5. Close ── */
  document.getElementById('closeLogin').addEventListener('click', closeAll);
  document.getElementById('closeRegister').addEventListener('click', closeAll);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeAll();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeAll();
  });

  /* ── 6. Switch Login ↔ Register ── */
  document.getElementById('switchToRegister').addEventListener('click', function () { show('register'); });
  document.getElementById('switchToLogin').addEventListener('click',    function () { show('login');    });
  document.getElementById('switchToRegMob').addEventListener('click',   function () { show('register'); });
  document.getElementById('switchToLogMob').addEventListener('click',   function () { show('login');    });

  /* ── 7. Password eye toggle ── */
  document.querySelectorAll('.jt-eye-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input     = document.getElementById(this.dataset.target);
      var eyeOpen   = this.querySelector('.eye-open');
      var eyeClosed = this.querySelector('.eye-closed');
      if (!input) return;
      var hidden    = input.type === 'password';
      input.type    = hidden ? 'text' : 'password';
      if (eyeOpen)   eyeOpen.style.display   = hidden ? 'none' : '';
      if (eyeClosed) eyeClosed.style.display = hidden ? ''     : 'none';
      input.focus();
    });
  });

  /* ── 8. Form submit — UI only ── */
  document.getElementById('loginForm').addEventListener('submit',    function (e) { e.preventDefault(); });
  document.getElementById('registerForm').addEventListener('submit', function (e) { e.preventDefault(); });

  /* ── 9. Bind navbar buttons after DOM is ready ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindButtons);
  } else {
    bindButtons();
  }

})();