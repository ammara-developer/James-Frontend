/* ============================================================
   JAMESTHEW.COM — main.js
   Navbar Scroll | Fork & Knife Hamburger | Dropdowns | Active Links
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Get Elements ── */
  const navbar      = document.getElementById('jtNavbar');
  const wave        = document.getElementById('jtWave');
  const hamburger   = document.getElementById('jtHamburger');
  const mobileMenu  = document.getElementById('jtMobileMenu');


  /* ==========================================================
     1. STICKY NAVBAR ON SCROLL
  ========================================================== */
  const SCROLL_THRESHOLD = 50;

  window.addEventListener('scroll', () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
      if (wave) wave.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
      if (wave) wave.classList.remove('scrolled');
    }
  });


  /* ==========================================================
     2. FORK & KNIFE HAMBURGER TOGGLE
  ========================================================== */
  if (hamburger && mobileMenu) {

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);

      /* Update aria for accessibility */
      hamburger.setAttribute('aria-expanded', isOpen);
      hamburger.setAttribute('aria-label', isOpen ? 'Close Menu' : 'Open Menu');
    });


    /* ==========================================================
       3. CLOSE MOBILE MENU ON LINK CLICK
    ========================================================== */
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (link.classList.contains('dropdown-toggle')) return;
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        hamburger.setAttribute('aria-label', 'Open Menu');
      });
    });


    /* ==========================================================
       4. CLOSE MOBILE MENU ON OUTSIDE CLICK
    ========================================================== */
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


    /* ==========================================================
       5. CLOSE MOBILE MENU ON WINDOW RESIZE TO DESKTOP
    ========================================================== */
    window.addEventListener('resize', () => {
      if (window.innerWidth > 991) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      }
    });

  }


  /* ==========================================================
     6. ACTIVE NAV LINK HIGHLIGHTER
     Automatically highlights the current page link
  ========================================================== */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks    = document.querySelectorAll('.jt-nav-links > li > a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || href === './' + currentPage) {
      link.classList.add('active');
    }
  });


  /* ==========================================================
     7. CLOSE PROFILE DROPDOWN ON OUTSIDE CLICK
  ========================================================== */
  const profileWrapper = document.querySelector('.jt-profile-wrapper');

  if (profileWrapper) {
    document.addEventListener('click', (e) => {
      if (!profileWrapper.contains(e.target)) {
        profileWrapper.classList.remove('active');
      }
    });
  }


  /* ==========================================================
     8. SMOOTH SCROLL FOR ANCHOR LINKS
     Accounts for fixed navbar height
  ========================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navbarHeight = parseInt(
          getComputedStyle(document.documentElement)
          .getPropertyValue('--navbar-height')
        ) || 85;
        const offset = navbarHeight + 20;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ==========================================================
     9. FOOTER NEWSLETTER FORM
  ========================================================== */
  const newsletterForm = document.querySelector('.footer-newsletter-form');

  if (newsletterForm) {
    const input = newsletterForm.querySelector('input[type="email"]');
    const btn   = newsletterForm.querySelector('button');

    const handleSubscribe = () => {
      const email = input.value.trim();

      /* Basic email validation */
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email) {
        input.style.outline = '1.5px solid #C0392B';
        input.placeholder   = 'Please enter your email';
        setTimeout(() => {
          input.style.outline = '';
          input.placeholder   = 'Your email address';
        }, 2500);
        return;
      }

      if (!emailRegex.test(email)) {
        input.style.outline = '1.5px solid #C0392B';
        input.placeholder   = 'Invalid email format';
        input.value         = '';
        setTimeout(() => {
          input.style.outline = '';
          input.placeholder   = 'Your email address';
        }, 2500);
        return;
      }

      /* Success state */
      input.value             = '';
      input.placeholder       = '✓ Subscribed! Thank you';
      input.style.color       = '#27AE60';
      input.style.outline     = '1.5px solid #27AE60';
      btn.textContent         = '✓';
      btn.style.background    = '#27AE60';

      setTimeout(() => {
        input.placeholder    = 'Your email address';
        input.style.color    = '';
        input.style.outline  = '';
        btn.textContent      = 'Subscribe';
        btn.style.background = '';
      }, 3500);
    };

    btn.addEventListener('click', handleSubscribe);

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSubscribe();
    });
  }


  /* ==========================================================
     10. NAVBAR DROPDOWN — Close on outside click (desktop)
  ========================================================== */
  const navDropdownItems = document.querySelectorAll('.jt-nav-links > li');

  document.addEventListener('click', (e) => {
    navDropdownItems.forEach(item => {
      if (!item.contains(e.target)) {
        item.classList.remove('open');
      }
    });
  });

});


/* ==========================================================
   11. MOBILE RECIPES DROPDOWN TOGGLE
   CSS hover doesn't work on mobile — handle with JS click
========================================================== */
const mobileDropdownLinks = document.querySelectorAll('.jt-mobile-menu ul li a');

// Add dropdown inside mobile menu for Recipes
const mobileRecipesItem = document.querySelector('.jt-mobile-menu ul li a[href="recipes-list.html"]');

if (mobileRecipesItem) {
  // Add class to identify as dropdown toggle
  mobileRecipesItem.classList.add('dropdown-toggle');

  // Create sub-dropdown list
  const subMenu = document.createElement('ul');
  subMenu.style.cssText = `
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s ease;
    background: rgba(0,0,0,0.15);
    border-radius: 8px;
  `;

  // Sub menu items
  const subItems = [
    { href: 'recipes-list.html',          icon: '🍽️', label: 'All Recipes'     },
    { href: 'recipes-list.html?cat=veg',  icon: '🥗', label: 'Vegetarian'      },
    { href: 'recipes-list.html?cat=nonveg',icon: '🍗', label: 'Non-Vegetarian'  },
    { href: 'recipes-list.html?cat=italian',icon:'🍕', label: 'Italian'         },
    { href: 'recipes-list.html?cat=juice', icon: '🥤', label: 'Juices'          },
  ];

  subItems.forEach(item => {
    const li  = document.createElement('li');
    const a   = document.createElement('a');
    a.href        = item.href;
    a.textContent = `${item.icon}  ${item.label}`;
    a.style.cssText = `
      display: block;
      padding: 0.6rem 1rem 0.6rem 1.5rem;
      color: rgba(255,255,255,0.75);
      font-size: 0.82rem;
      text-decoration: none;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      transition: all 0.3s ease;
    `;
    a.addEventListener('mouseenter', () => a.style.color = '#C9A84C');
    a.addEventListener('mouseleave', () => a.style.color = 'rgba(255,255,255,0.75)');
    li.appendChild(a);
    subMenu.appendChild(li);
  });

  // Insert sub-menu after the recipes list item parent
  const recipesLi = mobileRecipesItem.closest('li');
  recipesLi.appendChild(subMenu);

  // Toggle on click
  let isOpen = false;

  mobileRecipesItem.addEventListener('click', (e) => {
    e.preventDefault();
    isOpen = !isOpen;

    if (isOpen) {
      subMenu.style.maxHeight = subMenu.scrollHeight + 'px';
      arrow.style.transform   = 'rotate(180deg)';
    } else {
      subMenu.style.maxHeight = '0';
      arrow.style.transform   = 'rotate(0deg)';
    }
  });
}


//  ================================
        // arc
  // ===========================
  const CONFIG = {
  leftIcons: ['🍕','🍝','🥤','🥩','🍲','🥗','🍷','🥖'],
  rightIcons: ['🍜','🍮','🥭','🍓','🍚','☕','🫒','🍨'],
  speed: 0.005, // Radiant speed
  radiusX: 450, // Huge horizontal radius for shallow arc
  radiusY: 280, // Vertical height of travel
  iconSize: 75
};

class ArcWheel {
  constructor(containerId, icons, side) {
    this.container = document.getElementById(containerId);
    this.icons = icons;
    this.side = side;
    this.elements = [];
    this.angles = icons.map((_, i) => (i * (Math.PI * 2 / icons.length)));
    this.init();
  }

  init() {
    this.icons.forEach(emoji => {
      const el = document.createElement('div');
      el.className = 'icon-bubble';
      el.textContent = emoji;
      this.container.appendChild(el);
      this.elements.push(el);
    });
    this.animate();
  }

  animate() {
    const update = () => {
      const W = this.container.offsetWidth;
      const H = this.container.offsetHeight;
      
      // Pivot center pushed far outside the container to create shallow "Health UI" arc
      const centerX = this.side === 'left' ? W + 50 : -50;
      const centerY = H / 2;

      this.angles.forEach((angle, i) => {
        this.angles[i] += CONFIG.speed * (this.side === 'left' ? 1 : -1);
        
        const x = centerX + CONFIG.radiusX * Math.cos(this.angles[i]);
        const y = centerY + CONFIG.radiusY * Math.sin(this.angles[i]);

        // Visibility Logic: Icons fade out as they move to the back or extreme top/bottom
        const cos = Math.cos(this.angles[i]);
        const visibility = this.side === 'left' ? -cos : cos;
        
        const opacity = Math.max(0, visibility * 1.5); // Sharp fade-off
        const scale = 0.6 + (opacity * 0.4);
        
        const el = this.elements[i];
        el.style.left = `${x - CONFIG.iconSize/2}px`;
        el.style.top = `${y - CONFIG.iconSize/2}px`;
        el.style.opacity = opacity.toFixed(2);
        el.style.transform = `scale(${scale.toFixed(2)})`;
        el.style.zIndex = Math.round(opacity * 10);
        
        // Hide if behind the "arc"
        el.style.visibility = opacity < 0.1 ? 'hidden' : 'visible';
      });
      requestAnimationFrame(update);
    };
    update();
  }
}

// Start Wheels
window.addEventListener('DOMContentLoaded', () => {
  new ArcWheel('wheelLeft', CONFIG.leftIcons, 'left');
  new ArcWheel('wheelRight', CONFIG.rightIcons, 'right');
});