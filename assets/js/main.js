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







// <!-- ============================================================
//        JAVASCRIPT — minimal, only essential UI logic
//        No backend calls here. Add your C# .NET submit where noted.
//        ============================================================ -->
  
    'use strict';

    const JTAuth = {

      /* Open login modal — call this from your navbar Login button */
      openLogin() {
        document.getElementById('registerOverlay').classList.remove('active');
        document.getElementById('loginOverlay').classList.add('active');
        document.body.style.overflow = 'hidden'; // lock background scroll
      },

      /* Open register modal — call this from your navbar Register button */
      openRegister() {
        document.getElementById('loginOverlay').classList.remove('active');
        document.getElementById('registerOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
      },

      /* Close modal by overlay element ID */
      close(overlayId) {
        document.getElementById(overlayId).classList.remove('active');
        document.body.style.overflow = ''; // unlock scroll
      },

      /* Switch between forms without closing */
      switchToRegister() { this.close('loginOverlay'); this.openRegister(); },
      switchToLogin()     { this.close('registerOverlay'); this.openLogin(); },

      /* Toggle password field between hidden and visible */
      togglePw(inputId, btn) {
        const input   = document.getElementById(inputId);
        const showEye = btn.querySelector('.icon-eye-show');
        const hideEye = btn.querySelector('.icon-eye-hide');
        const hidden  = input.type === 'password';
        input.type            = hidden ? 'text'     : 'password';
        showEye.style.display = hidden ? 'none'     : '';
        hideEye.style.display = hidden ? ''         : 'none';
      },

      /* Helper: apply or clear error state on a field */
      setError(inputId, errId, hasError) {
        const input = document.getElementById(inputId);
        const err   = document.getElementById(errId);
        if (!input || !err) return hasError;
        input.classList.toggle('error', hasError);
        err.classList.toggle('visible', hasError);
        return hasError;
      },

      /* ── Login UI validation ──
         TODO (.NET): Replace console.log with form.submit() or fetch('/Account/Login')
      */
      validateLogin() {
        const email    = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        let valid      = true;

        if (!email)    valid = !this.setError('loginEmail',    'loginEmailErr',    true)  && valid;
        else                   this.setError('loginEmail',    'loginEmailErr',    false);
        if (!password) valid = !this.setError('loginPassword', 'loginPasswordErr', true)  && valid;
        else                   this.setError('loginPassword', 'loginPasswordErr', false);

        if (valid) {
          /* ── TODO: Replace with your C# .NET backend call ──
             Example 1 — standard form submit:
               document.getElementById('loginForm').submit();

             Example 2 — AJAX fetch:
               const form = document.getElementById('loginForm');
               fetch('/Account/Login', { method: 'POST', body: new FormData(form) })
                 .then(res => res.json())
                 .then(data => { if (data.success) window.location.href = '/member/dashboard'; })
          */
          console.log('✅ Login ready to submit:', { email });
        }
      },

      /* ── Register UI validation ──
         TODO (.NET): Replace console.log with form.submit() or fetch('/Account/Register')
      */
      validateRegister() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let valid        = true;
        const v          = (id, errId, condition) => {
          if (condition) { this.setError(id, errId, true);  valid = false; }
          else             this.setError(id, errId, false);
        };

        const fullName  = document.getElementById('regFullName').value.trim();
        const username  = document.getElementById('regUsername').value.trim();
        const email     = document.getElementById('regEmail').value.trim();
        const phone     = document.getElementById('regPhone').value.trim();
        const password  = document.getElementById('regPassword').value;
        const confirm   = document.getElementById('regConfirmPassword').value;
        const address   = document.getElementById('regAddress').value.trim();
        const method    = document.getElementById('regPaymentMethod').value;
        const txn       = document.getElementById('regTransactionId').value.trim();
        const terms     = document.getElementById('regTerms').checked;

        v('regFullName',        'regFullNameErr',        !fullName);
        v('regUsername',        'regUsernameErr',        !username);
        v('regEmail',           'regEmailErr',           !email || !emailRegex.test(email));
        v('regPhone',           'regPhoneErr',           !phone);
        v('regPassword',        'regPasswordErr',        password.length < 8);
        v('regConfirmPassword', 'regConfirmPasswordErr', !confirm || confirm !== password);
        v('regAddress',         'regAddressErr',         !address);
        v('regPaymentMethod',   'regPaymentMethodErr',   !method);
        v('regTransactionId',   'regTransactionIdErr',   !txn);

        // Terms checkbox
        const termsErr = document.getElementById('regTermsErr');
        if (!terms) { termsErr.classList.add('visible'); valid = false; }
        else          termsErr.classList.remove('visible');

        if (valid) {
          /* ── TODO: Replace with your C# .NET backend call ──
             Example 1 — standard form submit:
               document.getElementById('registerForm').submit();

             Example 2 — AJAX fetch:
               const form = document.getElementById('registerForm');
               fetch('/Account/Register', { method: 'POST', body: new FormData(form) })
                 .then(res => res.json())
                 .then(data => { if (data.success) window.location.href = '/member/dashboard'; })
          */
          console.log('✅ Register ready to submit:', { fullName, username, email });
        }
      }
    };

    /* Close when clicking dark background outside the modal box */
    document.getElementById('loginOverlay').addEventListener('click', function(e) {
      if (e.target === this) JTAuth.close('loginOverlay');
    });
    document.getElementById('registerOverlay').addEventListener('click', function(e) {
      if (e.target === this) JTAuth.close('registerOverlay');
    });

    /* Close on Escape key */
    document.addEventListener('keydown', function(e) {
      if (e.key !== 'Escape') return;
      JTAuth.close('loginOverlay');
      JTAuth.close('registerOverlay');
    });

    /*
      ════════════════════════════════════════════════════════
      HOW TO WIRE YOUR EXISTING NAVBAR BUTTONS (real project)
      ════════════════════════════════════════════════════════
      Find your Login and Register anchor tags in your navbar HTML
      and add onclick attributes like this:

      Login button:
        <a href="login.html" class="btn-jt-login"
           onclick="event.preventDefault(); JTAuth.openLogin()">Login</a>

      Register button:
        <a href="register.html" class="btn-jt-register"
           onclick="event.preventDefault(); JTAuth.openRegister()">Register</a>

      Make sure this script runs AFTER the navbar HTML in the DOM,
      or wrap it in DOMContentLoaded.
      ════════════════════════════════════════════════════════
    */
  
      // ------------tips js started--------
      /**
 * tips-page.js — JamesThew Tips Page UI Controller
 * All classes prefixed "tips-" to avoid conflicts with other pages.
 *
 * This file handles:
 *  - Skeleton → real card transitions (once backend injects data)
 *  - Client-side filter / search / sort (operates on rendered cards)
 *  - Pagination UI
 *  - Tip detail modal (free tips)
 *  - Premium lock modal (premium tips for non-members)
 *  - Save/bookmark toggle UI
 *
 * ════════════════════════════════════════════════════════════════
 * BACKEND INTEGRATION POINTS are marked with:
 *   // ⬇ BACKEND HOOK
 * Replace those sections with your actual fetch() / Axios calls.
 * ════════════════════════════════════════════════════════════════
 */

'use strict';

const TipsPage = (() => {

  /* ── State ──────────────────────────────────────────────── */
  let _allCards   = [];   // all rendered .tips-card elements (NodeList → Array)
  let _filter     = 'all';
  let _sort       = 'newest';
  let _search     = '';
  let _searchTimer = null;
  let _currentPage = 1;
  let _totalPages  = 1;
  let _savedTips   = new Set(); // tip ids the user has saved (UI state only)

  /* ── DOM refs ───────────────────────────────────────────── */
  const grid       = () => document.getElementById('tipsGrid');
  const meta       = () => document.getElementById('tipsMeta');
  const emptyState = () => document.getElementById('tipsEmpty');
  const pagination = () => document.getElementById('tipsPagination');

  /* ══════════════════════════════════════════════════════════
     PUBLIC: renderCard(tip)
     Called by backend integration code for each tip returned.
     tip = { id, content, isFree, uploaderName, createdAt }

     Usage after fetch:
       const tips = await fetch('/api/tips').then(r => r.json());
       TipsPage.clearSkeletons();
       tips.forEach(tip => TipsPage.renderCard(tip));
       TipsPage.afterRender();
     ══════════════════════════════════════════════════════════ */
  function renderCard(tip) {
    const card = document.createElement('article');
    card.className = 'tips-card';
    card.dataset.id     = tip.id;
    card.dataset.free   = tip.isFree ? 'true' : 'false';
    card.dataset.date   = tip.createdAt || '';
    card.dataset.search = (tip.content || '').toLowerCase();

    const isFree    = tip.isFree;
    const badgeCls  = isFree ? 'tips-badge--free'    : 'tips-badge--premium';
    const badgeTxt  = isFree ? 'Free'                : 'Premium';
    const badgeIcon = isFree
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;

    // Preview — first 120 chars of content
    const preview = tip.content
      ? tip.content.length > 120
        ? tip.content.substring(0, 120).trim() + '…'
        : tip.content
      : '';

    // Format date
    const dateStr = tip.createdAt
      ? new Date(tip.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : '';

    card.innerHTML = `
      <div class="tips-card__top">
        <span class="tips-badge ${badgeCls}">
          ${badgeIcon}
          ${badgeTxt}
        </span>
        <div class="tips-card__quote-icon">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
        </div>
      </div>

      <div class="tips-card__body">
        <p class="tips-card__preview">${preview || '<em>No preview available.</em>'}</p>
      </div>

      <div class="tips-card__footer">
        <div class="tips-card__author">
          <span class="tips-card__author-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </span>
          <span class="tips-card__author-name">${tip.uploaderName || 'Chef James'}</span>
        </div>
        <div class="tips-card__meta">
          <span class="tips-card__date">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${dateStr}
          </span>
        </div>
      </div>

      <div class="tips-card__action">
        ${isFree
          ? `<button class="tips-card__btn tips-card__btn--read" onclick="TipsPage.openTip(${tip.id})" aria-label="Read tip">
               Read Tip
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
             </button>`
          : `<button class="tips-card__btn tips-card__btn--lock" onclick="TipsPage.openLock()" aria-label="Unlock premium tip">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
               Unlock Premium
             </button>`
        }
      </div>
    `;

    grid().appendChild(card);
  }

  /* Remove skeleton loaders after backend data loads */
  function clearSkeletons() {
    document.querySelectorAll('.tips-skeleton').forEach(s => s.remove());
  }

  /* Called after all cards are rendered — indexes them and updates UI */
  function afterRender() {
    _allCards = Array.from(document.querySelectorAll('.tips-card'));
    _applyFilters();
  }

  /* ══════════════════════════════════════════════════════════
     PUBLIC: setStats(total, free, premium)
     Call this after fetching count from backend.
     Example: TipsPage.setStats(48, 20, 28);
     ══════════════════════════════════════════════════════════ */
  function setStats(total, free, premium) {
    _animateCount('statTotal',   total);
    _animateCount('statFree',    free);
    _animateCount('statPremium', premium);
  }

  function _animateCount(id, target) {
    const el = document.getElementById(id);
    if (!el || isNaN(target)) return;
    let current = 0;
    const step  = Math.ceil(target / 30);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { el.textContent = target; clearInterval(timer); return; }
      el.textContent = current;
    }, 30);
  }


  /* ── FILTER / SEARCH / SORT ─────────────────────────────── */

  function setFilter(filter, btn) {
    _filter = filter;
    document.querySelectorAll('.tips-filter-btn').forEach(b => b.classList.remove('tips-filter-btn--active'));
    btn.classList.add('tips-filter-btn--active');
    _currentPage = 1;
    _applyFilters();
  }

  function onSearch(val) {
    clearTimeout(_searchTimer);
    _search = val.trim().toLowerCase();
    const clearBtn = document.getElementById('searchClearBtn');
    if (clearBtn) clearBtn.style.display = _search ? 'flex' : 'none';
    _searchTimer = setTimeout(() => {
      _currentPage = 1;
      _applyFilters();
    }, 280);
  }

  function clearSearch() {
    const input = document.getElementById('tipsSearchInput');
    if (input) input.value = '';
    const clearBtn = document.getElementById('searchClearBtn');
    if (clearBtn) clearBtn.style.display = 'none';
    _search = '';
    _currentPage = 1;
    _applyFilters();
  }

  function onSort(val) {
    _sort = val;
    _currentPage = 1;
    _applyFilters();
  }

  function resetAll() {
    clearSearch();
    _filter = 'all';
    _sort   = 'newest';
    document.querySelectorAll('.tips-filter-btn').forEach((b, i) => {
      b.classList.toggle('tips-filter-btn--active', i === 0);
    });
    const sel = document.getElementById('tipsSortSelect');
    if (sel) sel.value = 'newest';
    _applyFilters();
  }

  function _applyFilters() {
    if (!_allCards.length) return;

    // Step 1: filter
    let visible = _allCards.filter(card => {
      const isFree   = card.dataset.free === 'true';
      const content  = card.dataset.search || '';

      if (_filter === 'free'    && !isFree)  return false;
      if (_filter === 'premium' && isFree)   return false;
      if (_search && !content.includes(_search)) return false;
      return true;
    });

    // Step 2: sort
    visible.sort((a, b) => {
      const da = new Date(a.dataset.date || 0);
      const db = new Date(b.dataset.date || 0);
      const fa = a.dataset.free === 'true';
      const fb = b.dataset.free === 'true';

      if (_sort === 'newest')        return db - da;
      if (_sort === 'oldest')        return da - db;
      if (_sort === 'free-first')    return (fa === fb) ? 0 : fa ? -1 : 1;
      if (_sort === 'premium-first') return (fa === fb) ? 0 : fa ? 1 : -1;
      return 0;
    });

    // Step 3: hide all, show matching
    _allCards.forEach(c => { c.style.display = 'none'; c.classList.remove('tips-card--visible'); });

    // Pagination
    const perPage   = 9;
    _totalPages     = Math.max(1, Math.ceil(visible.length / perPage));
    _currentPage    = Math.min(_currentPage, _totalPages);
    const start     = (_currentPage - 1) * perPage;
    const pageCards = visible.slice(start, start + perPage);

    pageCards.forEach((c, i) => {
      c.style.display = '';
      setTimeout(() => c.classList.add('tips-card--visible'), i * 60);
    });

    // Meta text
    const metaEl = meta();
    if (metaEl) {
      metaEl.textContent = visible.length
        ? `Showing ${pageCards.length} of ${visible.length} tip${visible.length !== 1 ? 's' : ''}`
        : '';
    }

    // Empty state
    const emEl = emptyState();
    if (emEl) emEl.style.display = visible.length === 0 ? 'flex' : 'none';

    renderPagination(_currentPage, _totalPages, visible.length);
  }


  /* ── PAGINATION ─────────────────────────────────────────── */
  function renderPagination(current, total, totalItems) {
    const el = pagination();
    if (!el) return;

    if (total <= 1) { el.style.display = 'none'; return; }
    el.style.display = 'flex';
    el.innerHTML = '';

    // Prev
    const prev = _makePageBtn('‹', current > 1, () => { _currentPage = current - 1; _applyFilters(); });
    prev.classList.add('tips-page-btn--arrow');
    el.appendChild(prev);

    // Page numbers
    for (let i = 1; i <= total; i++) {
      if (total > 7 && i > 2 && i < total - 1 && Math.abs(i - current) > 1) {
        if (i === 3 || i === total - 2) {
          const dots = document.createElement('span');
          dots.className = 'tips-page-dots';
          dots.textContent = '…';
          el.appendChild(dots);
        }
        continue;
      }
      const btn = _makePageBtn(i, true, () => { _currentPage = i; _applyFilters(); });
      if (i === current) btn.classList.add('tips-page-btn--active');
      el.appendChild(btn);
    }

    // Next
    const next = _makePageBtn('›', current < total, () => { _currentPage = current + 1; _applyFilters(); });
    next.classList.add('tips-page-btn--arrow');
    el.appendChild(next);
  }

  function _makePageBtn(label, enabled, onClick) {
    const btn = document.createElement('button');
    btn.className = 'tips-page-btn';
    btn.textContent = label;
    btn.disabled = !enabled;
    if (enabled) btn.addEventListener('click', onClick);
    return btn;
  }


  /* ── TIP DETAIL MODAL (free tips) ───────────────────────── */
  function openTip(tipId) {
    /*
      ⬇ BACKEND HOOK:
      Fetch full tip detail: GET /api/tips/{tipId}
      Then populate the modal fields below.

      Example:
        fetch(`/api/tips/${tipId}`)
          .then(r => r.json())
          .then(tip => {
            _populateTipModal(tip);
            _openModal('tipModalOverlay');
          });

      For now the modal opens with whatever the card already has.
      Replace this block once your API is ready.
    */

    // Find the card element to get data from
    const card = document.querySelector(`.tips-card[data-id="${tipId}"]`);
    if (!card) return;

    const preview   = card.querySelector('.tips-card__preview')?.textContent || '';
    const author    = card.querySelector('.tips-card__author-name')?.textContent || 'Chef James';
    const dateStr   = card.querySelector('.tips-card__date')?.textContent?.trim() || '';

    document.getElementById('tipModalTitle').textContent   = 'Chef\'s Tip';
    document.getElementById('tipModalContent').textContent = preview;
    document.getElementById('tipModalBadge').innerHTML     = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg> Free Tip`;
    document.getElementById('tipModalBadge').className     = 'tips-modal__badge tips-badge--free';
    document.getElementById('tipModalMeta').innerHTML      = `
      <span class="tips-modal__meta-author">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        ${author}
      </span>
      <span class="tips-modal__meta-sep">·</span>
      <span class="tips-modal__meta-date">${dateStr}</span>
    `;
    document.getElementById('tipModalAuthor').innerHTML    = `
      <div class="tips-modal__author-avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>
      <div class="tips-modal__author-info">
        <span class="tips-modal__author-name">${author}</span>
        <span class="tips-modal__author-role">Head Chef &amp; Founder</span>
      </div>
    `;

    // Save button state
    const saveBtn = document.getElementById('tipModalSaveBtn');
    if (saveBtn) {
      saveBtn.dataset.tipId = tipId;
      const saved = _savedTips.has(tipId);
      saveBtn.classList.toggle('tips-modal__save-btn--saved', saved);
      saveBtn.querySelector('span').textContent = saved ? 'Saved!' : 'Save Tip';
    }

    _openModal('tipModalOverlay');
  }

  function closeModal() { _closeModal('tipModalOverlay'); }

  function openLock()   { _openModal('tipLockOverlay'); }
  function closeLock()  { _closeModal('tipLockOverlay'); }

  function _openModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('tips-modal-overlay--active');
    document.body.style.overflow = 'hidden';
  }

  function _closeModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('tips-modal-overlay--active');
    document.body.style.overflow = '';
  }

  function toggleSave(btn) {
    /*
      ⬇ BACKEND HOOK:
      POST /api/tips/{tipId}/save  → save
      DELETE /api/tips/{tipId}/save → unsave
    */
    const tipId = btn.dataset.tipId;
    if (!tipId) return;
    const id = parseInt(tipId);
    if (_savedTips.has(id)) {
      _savedTips.delete(id);
      btn.classList.remove('tips-modal__save-btn--saved');
      btn.querySelector('span').textContent = 'Save Tip';
    } else {
      _savedTips.add(id);
      btn.classList.add('tips-modal__save-btn--saved');
      btn.querySelector('span').textContent = 'Saved!';
    }
  }


  /* ── INIT ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {

    /* Close modals on overlay click or Escape */
    ['tipModalOverlay', 'tipLockOverlay'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('click', e => {
        if (e.target === el) id === 'tipModalOverlay' ? closeModal() : closeLock();
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      closeModal();
      closeLock();
    });

    /*
      ⬇ BACKEND HOOK — INITIAL DATA LOAD:
      Replace the block below with your actual API call.

      Example with fetch():
      ─────────────────────────────────────────────────────
      Promise.all([
        fetch('/api/tips/count').then(r => r.json()),
        fetch('/api/tips?sort=newest&page=1').then(r => r.json())
      ])
      .then(([counts, tips]) => {
        TipsPage.setStats(counts.total, counts.free, counts.premium);
        TipsPage.clearSkeletons();
        tips.forEach(tip => TipsPage.renderCard(tip));
        TipsPage.afterRender();
      })
      .catch(err => {
        console.error('Failed to load tips:', err);
        TipsPage.clearSkeletons();
        TipsPage.afterRender(); // will show empty state
      });
      ─────────────────────────────────────────────────────
      ⬆ END BACKEND HOOK
    */

  });


  /* ── PUBLIC API ─────────────────────────────────────────── */
  return {
    renderCard,
    clearSkeletons,
    afterRender,
    setStats,
    setFilter,
    onSearch,
    clearSearch,
    onSort,
    resetAll,
    openTip,
    closeModal,
    openLock,
    closeLock,
    toggleSave,
    renderPagination,
  };

})();
// ----------tips js end------------