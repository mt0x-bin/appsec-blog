// Mobile menu
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.classList.toggle('open');
  });
}

// Active TOC highlight on scroll
const tocLinks = document.querySelectorAll('.toc-sticky nav a');
const headings = document.querySelectorAll('.post-content h2, .post-content h3');

if (tocLinks.length && headings.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.toc-sticky nav a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  headings.forEach(h => { if (h.id) observer.observe(h); });
}

// Animate cards on scroll
const cards = document.querySelectorAll('.post-card, .phase');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeUp .5s ease forwards';
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

cards.forEach(c => {
  c.style.opacity = '0';
  cardObserver.observe(c);
});

// Add IDs to headings for TOC linking
document.querySelectorAll('.post-content h2, .post-content h3').forEach(el => {
  if (!el.id) {
    el.id = el.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
});

// TOC active style
const style = document.createElement('style');
style.textContent = '.toc-sticky nav a.active { color: var(--green) !important; }';
document.head.appendChild(style);
