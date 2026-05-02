import { initI18n } from './i18n.js';

document.addEventListener('DOMContentLoaded', () => {
  initI18n();

  // ── Mobile Menu ──────────────────────────────────────────────
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('mainNav');

  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => nav.classList.toggle('active'));
    nav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => nav.classList.remove('active'))
    );
  }

  // ── Video Autoplay-on-Scroll ──────────────────────────────────
  const video = document.getElementById('villageVideo');
  const overlay = document.getElementById('videoOverlay');

  if (video) {
    // Graceful fallback if village_video.mp4 hasn't been added yet
    video.addEventListener('error', () => {
      const wrapper = video.closest('.video-wrapper');
      if (wrapper && !wrapper.querySelector('.video-no-file')) {
        video.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
        const ph = document.createElement('div');
        ph.className = 'video-no-file';
        ph.innerHTML = `<div class="upload-icon">🎬</div>
          <strong>Village Development Video</strong>
          <p>Add your 1-minute village video as <code>src/assets/village_video.mp4</code> to display it here.</p>`;
        wrapper.appendChild(ph);
      }
    });

    // Auto-play when 50% visible; pause when scrolled away
    const videoObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          if (overlay) overlay.classList.add('hidden');
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.5 });

    videoObs.observe(video);

    // Manual click on overlay to play
    if (overlay) {
      overlay.addEventListener('click', () => {
        video.play().catch(() => {});
        overlay.classList.add('hidden');
      });
    }

    // Show overlay again when user manually pauses
    video.addEventListener('pause', () => {
      if (!video.seeking && overlay) overlay.classList.remove('hidden');
    });
  }

  // ── Scroll-Reveal Animations ─────────────────────────────────
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ── Active Nav Highlighting ───────────────────────────────────
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav a');

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => navObserver.observe(s));

  // ── Count-up Numbers ─────────────────────────────────────────
  const counters = document.querySelectorAll('.highlight-num');
  let counted = false;

  function countUp() {
    counters.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      if (!target) return;
      const duration = 1400;
      let start = null;
      function step(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + '+';
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + '+';
      }
      requestAnimationFrame(step);
    });
  }

  const highlightObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        countUp();
        highlightObs.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const highlights = document.querySelector('.highlights');
  if (highlights) highlightObs.observe(highlights);

  // ── Gallery Lightbox ─────────────────────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox?.querySelector('.lightbox-img');
  const lbClose = lightbox?.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-img').forEach(img => {
    img.addEventListener('click', () => {
      if (lbImg) lbImg.src = img.src;
      lightbox?.classList.add('active');
    });
  });

  lbClose?.addEventListener('click', () => lightbox?.classList.remove('active'));
  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });

  // Keyboard close lightbox
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') lightbox?.classList.remove('active');
  });

  // ── Grievance Form ────────────────────────────────────────────
  const form = document.getElementById('grievanceForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = '✅ Submitted!';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Submit Grievance';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
});

