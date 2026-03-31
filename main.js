/* ─────────────────────────────────────────────────────────
   main.js — Illia Voitsekhovskyi portfolio
   ───────────────────────────────────────────────────────── */

/* ── 1. PARTICLES ──────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles');
  const hero   = canvas.parentElement;
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#C8DFFE', '#8BB8F0', '#E8F2FF'];

  const dots = Array.from({ length: 70 }, () => ({
    x:   Math.random() * canvas.width,
    y:   Math.random() * canvas.height,
    r:   0.6 + Math.random() * 2.8,
    vx:  (Math.random() - 0.5) * 0.28,
    vy:  (Math.random() - 0.5) * 0.28,
    a:   0.08 + Math.random() * 0.38,
    col: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dots.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > canvas.width)  d.vx *= -1;
      if (d.y < 0 || d.y > canvas.height) d.vy *= -1;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle   = d.col;
      ctx.globalAlpha = d.a;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  draw();
})();


/* ── 2. TYPING ANIMATION ───────────────────────────────── */
(function initTyping() {
  const el    = document.getElementById('typed-text');
  const lines = [
    'Software engineer.',
    'Photographer.',
    '6 languages.',
    'Always building.',
  ];

  let lineIndex  = 0;
  let charIndex  = 0;
  let deleting   = false;
  let waitFrames = 0;

  function tick() {
    if (waitFrames > 0) {
      waitFrames--;
      setTimeout(tick, 40);
      return;
    }

    const current = lines[lineIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        waitFrames = 55; // pause before deleting
        deleting = true;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting   = false;
        lineIndex  = (lineIndex + 1) % lines.length;
        waitFrames = 18;
      }
    }

    setTimeout(tick, deleting ? 38 : 52);
  }

  // Start after hero text has faded in
  setTimeout(tick, 1200);
})();


/* ── 3. NAVBAR SCROLL BEHAVIOUR ────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');

  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ── 4. SCROLL REVEAL ──────────────────────────────────── */
(function initReveal() {
  // Add .reveal class to elements we want to animate in
  const targets = [
    '.about-lead',
    '.about-body',
    '.stat-card',
    '.proj-card',
    '.skills-group',
    '.vol-card',
    '.lang-chips',
    '.contact-heading',
    '.contact-links',
  ];

  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Stagger stat cards and proj cards slightly
  document.querySelectorAll('.stat-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
  });
  document.querySelectorAll('.proj-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 100}ms`;
  });
  document.querySelectorAll('.skills-group').forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
  });
})();


/* ── 5. SMOOTH SCROLL FOR NAV LINKS ────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ── 6. PROJECT TAG MODAL + LANG EXPAND ─────────────────── */
(function initMoreInteractions() {
  const extraTechMap = {
    sheriff: ['HTML', 'CSS', 'JavaScript'],
    flight: ['HTML', 'CSS', 'JavaScript'],
  };
  const projectLinks = {
    sheriff: 'https://github.com/jxckzy/supercell-hackathon-2-26',
    flight: 'https://github.com/nikosilan/py_projekti',
  };

  const modalOverlay = document.getElementById('tech-modal-overlay');
  const modalCard = document.getElementById('tech-modal-card');
  const modalClose = document.querySelector('.tech-modal-close');

  if (modalOverlay && modalCard && modalClose) {
    const openModal = (sourceCard, tags, projectId) => {
      if (!sourceCard) return;
      const clonedCard = sourceCard.cloneNode(true);
      clonedCard.removeAttribute('onclick');
      const targetUrl = projectLinks[projectId];
      if (targetUrl) {
        clonedCard.style.cursor = 'pointer';
        clonedCard.setAttribute('role', 'link');
        clonedCard.setAttribute('tabindex', '0');
        clonedCard.addEventListener('click', () => {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        });
        clonedCard.addEventListener('keydown', (e) => {
          if (e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        });
      }

      const tagsContainer = clonedCard.querySelector('.proj-tags');
      if (tagsContainer) {
        const moreTag = tagsContainer.querySelector('.more-tech');
        if (moreTag) moreTag.remove();

        tags.forEach(tag => {
          const chip = document.createElement('span');
          chip.className = 'tag teal';
          chip.textContent = tag;
          tagsContainer.appendChild(chip);
        });
      }

      modalCard.innerHTML = '';
      modalCard.appendChild(clonedCard);
      modalOverlay.classList.add('open');
      modalOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modalOverlay.classList.remove('open');
      modalOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      modalCard.innerHTML = '';
    };

    document.querySelectorAll('.more-tech').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = el.closest('.proj-card');
        const projectId = el.dataset.project;
        const tags = extraTechMap[projectId] || ['HTML', 'CSS', 'JavaScript'];
        openModal(card, tags, projectId);
      });

      el.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        e.stopPropagation();
        const card = el.closest('.proj-card');
        const projectId = el.dataset.project;
        const tags = extraTechMap[projectId] || ['HTML', 'CSS', 'JavaScript'];
        openModal(card, tags, projectId);
      });
    });

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
    });
  }

  const moreLangChip = document.querySelector('.more-langs');
  if (moreLangChip) {
    const expandLanguages = () => {
      const parent = moreLangChip.parentElement;
      if (!parent || !parent.contains(moreLangChip)) return;

      moreLangChip.remove();

      const polish = document.createElement('span');
      polish.className = 'lang-chip';
      polish.textContent = 'Polish A1';

      const german = document.createElement('span');
      german.className = 'lang-chip';
      german.textContent = 'German A1';

      parent.appendChild(polish);
      parent.appendChild(german);
    };

    moreLangChip.addEventListener('click', expandLanguages);
    moreLangChip.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      expandLanguages();
    });
  }
})();
