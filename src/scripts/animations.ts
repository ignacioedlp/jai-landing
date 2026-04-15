import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Elements animated individually — skip from generic loop
const SKIP = new Set<Element>();

export function initAnimations() {
  if ((window as Window & { __jaiAnimationsInit?: boolean }).__jaiAnimationsInit) {
    return;
  }
  (window as Window & { __jaiAnimationsInit?: boolean }).__jaiAnimationsInit = true;

  const ease = 'power3.out';
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  ScrollTrigger.config({ ignoreMobileResize: true });

  if (reduceMotion) {
    gsap.set('[data-reveal]', { clearProps: 'all', opacity: 1 });
    return;
  }

  // ── Nav ──────────────────────────────────────────
  const nav = document.querySelector('.nav-header');
  if (nav) {
    SKIP.add(nav);
    gsap.fromTo(nav,
      { opacity: 0, y: -24 },
      { opacity: 1, y: 0, duration: 0.8, ease, delay: 0.1 }
    );
  }

  // ── Hero ─────────────────────────────────────────
  const heroTitle = document.querySelector('.hero-title');
  const heroSub = document.querySelector('.hero-subtitle');
  const heroCta = document.querySelector('.hero-cta');
  [heroTitle, heroSub, heroCta].forEach(el => el && SKIP.add(el));

  if (heroTitle) {
    gsap.fromTo(
      [heroTitle, heroSub, heroCta].filter(Boolean),
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease, delay: 0.25 }
    );
  }

  // ── Hero parallax ────────────────────────────────
  const heroBg = document.querySelector<HTMLElement>('.hero-img');
  if (heroBg && !isMobile) {
    gsap.to(heroBg, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      },
    });
  }

  // ── Stats count-up ───────────────────────────────
  document.querySelectorAll<HTMLElement>('.stat-value').forEach((el) => {
    SKIP.add(el);
    const raw = el.textContent ?? '';
    const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
    const prefix = raw.startsWith('$') ? '$' : '';
    const suffix = raw.endsWith('+') ? '+' : raw.includes('M') ? 'M' : '';
    if (isNaN(num)) return;
    const obj = { val: 0 };
    gsap.fromTo(obj,
      { val: 0 },
      {
        val: num,
        duration: 1.8,
        ease: 'power2.out',
        snap: { val: 1 },
        onUpdate() { el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`; },
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }
    );
  });

  // ── Big section titles ───────────────────────────
  document.querySelectorAll<HTMLElement>(
    '.works-title, .services-title, .process-title, .insights-title'
  ).forEach((el) => {
    SKIP.add(el);
    gsap.fromTo(el,
      { opacity: 0, y: 70 },
      {
        opacity: 1, y: 0, duration: 1.1, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      }
    );
  });

  // ── Service cards — single stagger batch ─────────
  const serviceCards = gsap.utils.toArray<HTMLElement>('.service-card');
  serviceCards.forEach(el => SKIP.add(el));
  if (serviceCards.length) {
    gsap.fromTo(serviceCards,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.75, ease,
        stagger: 0.1,
        scrollTrigger: { trigger: '.services', start: 'top 75%', once: true },
      }
    );
  }

  // ── Process rows — alternate slide ───────────────
  document.querySelectorAll<HTMLElement>('.step-row').forEach((row, i) => {
    SKIP.add(row);
    gsap.fromTo(row,
      isMobile
        ? { opacity: 0, y: 38 }
        : { opacity: 0, x: i % 2 === 0 ? -70 : 70 },
      isMobile
        ? {
          opacity: 1, y: 0, duration: 0.9, ease,
          scrollTrigger: { trigger: row, start: 'top 85%', once: true }
        }
        : {
          opacity: 1, x: 0, duration: 0.9, ease,
          scrollTrigger: { trigger: row, start: 'top 85%', once: true }
        }
    );
  });

  // ── Testimonial ──────────────────────────────────
  const portrait = document.querySelector('.testimonial-portrait');
  const tContent = document.querySelector('.testimonial-content');
  if (portrait) {
    SKIP.add(portrait);
    gsap.fromTo(
      portrait,
      isMobile ? { opacity: 0, y: 34 } : { opacity: 0, x: -60 },
      isMobile
        ? {
          opacity: 1, y: 0, duration: 1, ease,
          scrollTrigger: { trigger: portrait, start: 'top 85%', once: true }
        }
        : {
          opacity: 1, x: 0, duration: 1, ease,
          scrollTrigger: { trigger: portrait, start: 'top 85%', once: true }
        });

  }
  if (tContent) {
    SKIP.add(tContent);
    gsap.fromTo(
      tContent,
      isMobile ? { opacity: 0, y: 34 } : { opacity: 0, x: 60 },
      isMobile
        ? {
          opacity: 1, y: 0, duration: 1, ease, delay: 0.1,
          scrollTrigger: { trigger: tContent, start: 'top 85%', once: true }
        }
        : {
          opacity: 1, x: 0, duration: 1, ease, delay: 0.15,
          scrollTrigger: { trigger: tContent, start: 'top 85%', once: true }
        }
    );
  }

  // ── Footer logo ──────────────────────────────────
  const footerLogo = document.querySelector('.footer-logo');
  if (footerLogo) {
    SKIP.add(footerLogo);
    gsap.fromTo(footerLogo,
      { opacity: 0, scale: 0.7 },
      {
        opacity: 1, scale: 1, duration: 1.2, ease: 'elastic.out(1,0.5)',
        scrollTrigger: { trigger: footerLogo, start: 'top 90%', once: true }
      }
    );
  }

  // ── Generic [data-reveal] — skip already handled ─
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    if (SKIP.has(el)) return;

    const type = el.getAttribute('data-reveal') ?? 'up';
    const delay = parseFloat(el.getAttribute('data-delay') ?? '0') / 1000;

    const from: gsap.TweenVars = { opacity: 0 };
    const to: gsap.TweenVars = {
      opacity: 1, duration: 0.85, ease, delay,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    };

    if (type === 'up') { from.y = 45; to.y = 0; }
    if (type === 'left') {
      if (isMobile) { from.y = 34; to.y = 0; }
      else { from.x = -55; to.x = 0; }
    }
    if (type === 'right') {
      if (isMobile) { from.y = 34; to.y = 0; }
      else { from.x = 55; to.x = 0; }
    }
    if (type === 'scale') { from.scale = 0.93; from.y = 20; to.scale = 1; to.y = 0; }
    if (type === 'line') {
      from.scaleX = 0; from.transformOrigin = 'left center';
      to.scaleX = 1; to.duration = 0.9;
    }

    gsap.fromTo(el, from, to);
  });
}
