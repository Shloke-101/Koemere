/**
 * KOEMERE — HOME BETWEEN VOICES
 * Interactive Experience Engine
 * Crafted for elegance, tactile physics, subtle ambient wave canvas,
 * and seamless Google Form integration.
 */

(function () {
  'use strict';

  // Check user preference for motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Google Form Action Endpoint
  const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeFncGggzUPI3f9Jwpm8C9W8Po_TueY7UuAnxcM-7MM8FkEcg/formResponse';

  /* ==========================================================================
     1. Ambient Wave Canvas (Organic Visual Voice Resonance)
     ========================================================================== */
  class AmbientWaveCanvas {
    constructor() {
      this.canvas = document.getElementById('ambient-wave-canvas');
      if (!this.canvas) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'ambient-wave-canvas';
        this.canvas.setAttribute('aria-hidden', 'true');
        document.body.prepend(this.canvas);
      }

      this.ctx = this.canvas.getContext('2d');
      this.width = 0;
      this.height = 0;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.time = 0;
      this.mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
      this.isRunning = false;
      this.animationId = null;

      // Organic color palette for ambient waves
      this.colors = [
        { r: 203, g: 161, b: 132, a: 0.12 }, // Rose
        { r: 150, g: 121, b: 95, a: 0.08 },  // Taupe
        { r: 78, g: 58, b: 46, a: 0.06 },    // Cocoa
        { r: 243, g: 231, b: 214, a: 0.15 }  // Cream deep
      ];

      this.init();
    }

    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize(), { passive: true });

      if (!prefersReducedMotion) {
        window.addEventListener('mousemove', (e) => {
          this.mouse.targetX = e.clientX / window.innerWidth;
          this.mouse.targetY = e.clientY / window.innerHeight;
        }, { passive: true });

        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            this.pause();
          } else {
            this.play();
          }
        });

        this.play();
      } else {
        this.drawStatic();
      }
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width * this.dpr;
      this.canvas.height = this.height * this.dpr;
      this.ctx.scale(this.dpr, this.dpr);
    }

    play() {
      if (!this.isRunning) {
        this.isRunning = true;
        this.loop();
      }
    }

    pause() {
      this.isRunning = false;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
    }

    loop() {
      if (!this.isRunning) return;

      // Mouse position smoothing (lerp)
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.04;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.04;

      this.time += 0.006;
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Render 3 organic flowing voice soundwaves
      const wavesCount = 3;
      for (let w = 0; w < wavesCount; w++) {
        const col = this.colors[w % this.colors.length];
        this.ctx.beginPath();

        const baseFreq = 0.0018 + w * 0.0006;
        const amplitude = (this.height * 0.08) * (1 + (w * 0.2) + (this.mouse.y * 0.3));
        const baseY = this.height * (0.35 + w * 0.2) + Math.sin(this.time * 0.8 + w) * 30;

        this.ctx.moveTo(0, baseY);

        const step = 20;
        for (let x = 0; x <= this.width + step; x += step) {
          const mouseDistFactor = 1 + Math.exp(-Math.pow((x / this.width - this.mouse.x) * 3, 2)) * 0.5;
          const y = baseY +
            Math.sin(x * baseFreq + this.time * (1.2 + w * 0.4) + w * 1.5) * (amplitude * mouseDistFactor) +
            Math.cos(x * 0.0009 - this.time * 0.7) * 20;

          this.ctx.lineTo(x, y);
        }

        this.ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${col.a})`;
        this.ctx.lineWidth = 1.6 + w * 0.4;
        this.ctx.stroke();
      }

      this.animationId = requestAnimationFrame(() => this.loop());
    }

    drawStatic() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      for (let w = 0; w < 3; w++) {
        const col = this.colors[w];
        this.ctx.beginPath();
        const baseY = this.height * (0.4 + w * 0.2);
        this.ctx.moveTo(0, baseY);
        for (let x = 0; x <= this.width; x += 30) {
          const y = baseY + Math.sin(x * 0.002 + w) * 40;
          this.ctx.lineTo(x, y);
        }
        this.ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${col.a})`;
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
      }
    }
  }

  /* ==========================================================================
     2. Custom Luxury Cursor Engine
     ========================================================================== */
  class CustomCursor {
    constructor() {
      if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

      this.cursor = document.createElement('div');
      this.cursor.className = 'custom-cursor';
      this.cursor.innerHTML = '<span class="custom-cursor-text"></span>';

      this.dot = document.createElement('div');
      this.dot.className = 'custom-cursor-dot';

      document.body.appendChild(this.cursor);
      document.body.appendChild(this.dot);

      this.textEl = this.cursor.querySelector('.custom-cursor-text');
      this.pos = { x: -100, y: -100, targetX: -100, targetY: -100 };
      this.dotPos = { x: -100, y: -100 };

      this.initEvents();
      this.loop();
    }

    initEvents() {
      window.addEventListener('mousemove', (e) => {
        this.pos.targetX = e.clientX;
        this.pos.targetY = e.clientY;
        this.dotPos.x = e.clientX;
        this.dotPos.y = e.clientY;

        this.cursor.style.opacity = '1';
        this.dot.style.opacity = '1';
      }, { passive: true });

      document.addEventListener('mouseleave', () => {
        this.cursor.style.opacity = '0';
        this.dot.style.opacity = '0';
      });

      // Interactive Link & Button Hover States
      const interactiveEls = document.querySelectorAll('a, button, .btn, .space-tab-btn, .form-chip-label, input, select, textarea');
      interactiveEls.forEach(el => {
        el.addEventListener('mouseenter', () => {
          this.cursor.classList.add('hovering-link');
        });
        el.addEventListener('mouseleave', () => {
          this.cursor.classList.remove('hovering-link');
        });
      });

      // Card Hover States with contextual cursor badge
      const cards = document.querySelectorAll('.explore-card, .clip, .space, .fw-panel, .spec-card');
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          this.cursor.classList.add('hovering-card');
          if (card.classList.contains('clip')) {
            this.textEl.textContent = 'Archive';
          } else if (card.classList.contains('space')) {
            this.textEl.textContent = 'Space';
          } else if (card.classList.contains('fw-panel')) {
            this.textEl.textContent = 'Apply';
          } else {
            this.textEl.textContent = 'Explore';
          }
        });
        card.addEventListener('mouseleave', () => {
          this.cursor.classList.remove('hovering-card');
          this.textEl.textContent = '';
        });
      });
    }

    loop() {
      // Smooth lerp follow
      this.pos.x += (this.pos.targetX - this.pos.x) * 0.18;
      this.pos.y += (this.pos.targetY - this.pos.y) * 0.18;

      this.cursor.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0) translate(-50%, -50%)`;
      this.dot.style.transform = `translate3d(${this.dotPos.x}px, ${this.dotPos.y}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(() => this.loop());
    }
  }

  /* ==========================================================================
     3. 3D Card Tilt & Dynamic Specular Sheen Physics
     ========================================================================== */
  function initCardPhysics() {
    if (prefersReducedMotion || window.innerWidth < 860) return;

    const cards = document.querySelectorAll('.explore-card, .space, .clip, .fw-panel, .timeline-card, .spec-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -3.2;
        const rotateY = ((x - centerX) / centerX) * 3.2;

        card.style.setProperty('--mx', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--my', `${(y / rect.height) * 100}%`);

        if (!card.classList.contains('fw-panel') && !card.classList.contains('timeline-card')) {
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('fw-panel') && !card.classList.contains('timeline-card')) {
          card.style.transform = '';
        }
      });
    });
  }

  /* ==========================================================================
     4. Split-Text Animation Engine
     ========================================================================== */
  function initSplitText() {
    const titles = document.querySelectorAll('.hero h1, .page-intro h1, .phil-quote-col blockquote');
    titles.forEach(title => {
      if (title.dataset.splitDone) return;
      title.dataset.splitDone = 'true';

      const nodes = Array.from(title.childNodes);
      const newContent = document.createDocumentFragment();

      nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          const words = node.textContent.split(/\s+/).filter(w => w.length > 0);
          words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'split-word';

            const innerSpan = document.createElement('span');
            innerSpan.className = 'split-word-inner';
            innerSpan.textContent = word;
            innerSpan.style.transitionDelay = `${index * 35}ms`;

            wordSpan.appendChild(innerSpan);
            newContent.appendChild(wordSpan);
            newContent.appendChild(document.createTextNode(' '));
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const elClone = node.cloneNode(true);
          const innerText = elClone.textContent;
          const words = innerText.split(/\s+/).filter(w => w.length > 0);

          elClone.innerHTML = '';
          words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'split-word';

            const innerSpan = document.createElement('span');
            innerSpan.className = 'split-word-inner';
            innerSpan.textContent = word;
            innerSpan.style.transitionDelay = `${(index + 3) * 35}ms`;

            wordSpan.appendChild(innerSpan);
            elClone.appendChild(wordSpan);
            elClone.appendChild(document.createTextNode(' '));
          });

          newContent.appendChild(elClone);
          newContent.appendChild(document.createTextNode(' '));
        }
      });

      title.innerHTML = '';
      title.appendChild(newContent);
    });
  }

  /* ==========================================================================
     5. Spaces View Switcher (Spaces Page)
     ========================================================================== */
  function initSpaceInteractive() {
    const spacesSection = document.querySelector('.spaces');
    if (!spacesSection) return;

    const spacesGrid = spacesSection.querySelector('.spaces-grid');
    if (!spacesGrid) return;

    const tabBtns = spacesSection.querySelectorAll('.space-tab-btn');
    const spaceA = spacesGrid.querySelector('.space.a');
    const spaceB = spacesGrid.querySelector('.space.b');

    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.dataset.filter;
        if (filter === 'all') {
          if (spaceA) {
            spaceA.style.display = 'flex';
            spaceA.style.opacity = '1';
          }
          if (spaceB) {
            spaceB.style.display = 'flex';
            spaceB.style.opacity = '1';
          }
          spacesGrid.style.gridTemplateColumns = window.innerWidth > 860 ? '1fr 1fr' : '1fr';
        } else if (filter === 'group') {
          if (spaceA) {
            spaceA.style.display = 'flex';
            spaceA.style.opacity = '1';
          }
          if (spaceB) {
            spaceB.style.display = 'none';
          }
          spacesGrid.style.gridTemplateColumns = '1fr';
        } else if (filter === 'public') {
          if (spaceA) {
            spaceA.style.display = 'none';
          }
          if (spaceB) {
            spaceB.style.display = 'flex';
            spaceB.style.opacity = '1';
          }
          spacesGrid.style.gridTemplateColumns = '1fr';
        }
      });
    });
  }

  /* ==========================================================================
     6. Scroll Dynamics, Progress Bar & Parallax
     ========================================================================== */
  function initScrollDynamics() {
    const header = document.querySelector('header');
    const progressBar = document.querySelector('.scroll-progress-bar');
    const backToTop = document.querySelector('.back-to-top');
    const parallaxEls = document.querySelectorAll(
      '.hero-watermark-wrap, .archive-watermark, .foot-watermark, .page-intro-watermark'
    );

    let ticking = false;

    function onScroll() {
      const y = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;

      // Header glassmorphism
      if (header) {
        if (y > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      // Top scroll progress bar
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }

      // Back to top floating pill
      if (backToTop) {
        if (y > 400) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      }

      // Parallax watermarks
      if (!prefersReducedMotion && parallaxEls.length) {
        parallaxEls.forEach(el => {
          el.style.transform = `translate3d(0, ${y * 0.04}px, 0)`;
        });
      }

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    onScroll();

    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ==========================================================================
     7. Responsive Mobile Navigation Drawer
     ========================================================================== */
  function initMobileNav() {
    const toggle = document.querySelector('.mobile-nav-toggle');
    const drawer = document.querySelector('.mobile-nav-drawer');
    if (!toggle || !drawer) return;

    function openDrawer() {
      toggle.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => closeDrawer());
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  /* ==========================================================================
     8. Intersection Observer for Smooth Scroll Reveals
     ========================================================================== */
  function initIntersectionObserver() {
    const revealEls = document.querySelectorAll('.reveal:not(.in)');
    if (!revealEls.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('in');
          }, i * 65);
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => io.observe(el));
  }

  /* ==========================================================================
     9. Google Form Background Submission & In-App Modal System
     ========================================================================== */
  function sendToGoogleForm(formData) {
    return new Promise((resolve) => {
      // 1. Primary method: fetch with no-cors
      const urlParams = new URLSearchParams();
      for (const [key, value] of formData.entries()) {
        urlParams.append(key, value);
      }

      fetch(GOOGLE_FORM_ACTION_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: urlParams.toString()
      }).then(() => {
        resolve(true);
      }).catch(() => {
        // Fetch catch (e.g. strict browser CSP), fallback to hidden iframe form submission
        submitViaHiddenIframe(formData);
        resolve(true);
      });

      // Also trigger hidden iframe as redundant backup guarantee
      submitViaHiddenIframe(formData);
    });
  }

  function submitViaHiddenIframe(formData) {
    let iframe = document.getElementById('gform-hidden-iframe');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'gform-hidden-iframe';
      iframe.name = 'gform-hidden-iframe';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }

    const tempForm = document.createElement('form');
    tempForm.method = 'POST';
    tempForm.action = GOOGLE_FORM_ACTION_URL;
    tempForm.target = 'gform-hidden-iframe';
    tempForm.style.display = 'none';

    for (const [key, value] of formData.entries()) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      tempForm.appendChild(input);
    }

    document.body.appendChild(tempForm);
    tempForm.submit();
    setTimeout(() => {
      tempForm.remove();
    }, 2000);
  }

  function initModalSystem() {
    // Inject modal into document body if not already present
    if (!document.getElementById('app-modal-overlay')) {
      const modalOverlay = document.createElement('div');
      modalOverlay.id = 'app-modal-overlay';
      modalOverlay.className = 'modal-overlay';
      modalOverlay.setAttribute('role', 'dialog');
      modalOverlay.setAttribute('aria-modal', 'true');
      modalOverlay.setAttribute('aria-label', 'Apply to the Manual Wave');

      modalOverlay.innerHTML = `
        <div class="modal-card">
          <button type="button" class="modal-close-btn" id="modal-close-btn" aria-label="Close dialog">&times;</button>
          
          <div class="modal-header">
            <span class="label">Founder Cohort 01 Application</span>
            <h2>Apply to the Manual Wave</h2>
            <p>Join our private first cohort. Your answers are submitted directly to our private registry and Google Form.</p>
          </div>

          <form class="app-form" id="modal-app-form">
            <div class="form-grid-2">
              <div class="form-group">
                <label for="m-name">1. Full Name or Pseudonym *</label>
                <input type="text" id="m-name" name="entry.795426311" required placeholder="e.g. Maya Lin" autocomplete="name">
              </div>

              <div class="form-group">
                <label for="m-email">2. Email Address *</label>
                <input type="email" id="m-email" name="entry.1636699489" required placeholder="maya@example.com" autocomplete="email">
              </div>
            </div>

            <div class="form-group">
              <label>3. Age Group *</label>
              <div class="form-chip-group">
                <label class="form-chip-label">
                  <input type="radio" name="entry.64478642" value="under 18">
                  <span class="form-chip-text">Under 18</span>
                </label>
                <label class="form-chip-label">
                  <input type="radio" name="entry.64478642" value="18-24" checked>
                  <span class="form-chip-text">18–24</span>
                </label>
                <label class="form-chip-label">
                  <input type="radio" name="entry.64478642" value="25-34">
                  <span class="form-chip-text">25–34</span>
                </label>
                <label class="form-chip-label">
                  <input type="radio" name="entry.64478642" value="35-44">
                  <span class="form-chip-text">35–44</span>
                </label>
                <label class="form-chip-label">
                  <input type="radio" name="entry.64478642" value="45+">
                  <span class="form-chip-text">45+</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label>4. What made you join the waitlist today? *</label>
              <div class="form-chip-group">
                <label class="form-chip-label">
                  <input type="radio" name="entry.215633984" value="I want a safer space to explain myself." checked>
                  <span class="form-chip-text">I want a safer space to explain myself</span>
                </label>
                <label class="form-chip-label">
                  <input type="radio" name="entry.215633984" value="I want deeper conversations.">
                  <span class="form-chip-text">I want deeper conversations</span>
                </label>
                <label class="form-chip-label">
                  <input type="radio" name="entry.215633984" value="I am curious about Koemere">
                  <span class="form-chip-text">I am curious about Koemere</span>
                </label>
                <label class="form-chip-label">
                  <input type="radio" name="entry.215633984" value="Someone shared it with me.">
                  <span class="form-chip-text">Someone shared it with me</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label>5. Which part of Koemere sounds most valuable to you? *</label>
              <div class="form-chip-group">
                <label class="form-chip-label">
                  <input type="radio" name="entry.536843190" value="Anonymous public venting" checked>
                  <span class="form-chip-text">Anonymous public venting</span>
                </label>
                <label class="form-chip-label">
                  <input type="radio" name="entry.536843190" value="Small support Groups">
                  <span class="form-chip-text">Small support Groups</span>
                </label>
                <label class="form-chip-label">
                  <input type="radio" name="entry.536843190" value="Feeling understood">
                  <span class="form-chip-text">Feeling understood</span>
                </label>
                <label class="form-chip-label">
                  <input type="radio" name="entry.536843190" value="Privacy-first Design">
                  <span class="form-chip-text">Privacy-first Design</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label>6. How did you hear about Koemere? *</label>
              <div class="form-chip-group">
                <label class="form-chip-label">
                  <input type="radio" name="entry.1606538711" value="LinkedIn" checked>
                  <span class="form-chip-text">LinkedIn</span>
                </label>
                <label class="form-chip-label">
                  <input type="radio" name="entry.1606538711" value="Instagram">
                  <span class="form-chip-text">Instagram</span>
                </label>
                <label class="form-chip-label">
                  <input type="radio" name="entry.1606538711" value="Reddit">
                  <span class="form-chip-text">Reddit</span>
                </label>
                <label class="form-chip-label">
                  <input type="radio" name="entry.1606538711" value="Friend">
                  <span class="form-chip-text">Friend</span>
                </label>
              </div>
            </div>

            <button type="submit" class="form-submit-btn" id="modal-submit-btn">
              <span>Submit Application to Wave 01 &rarr;</span>
            </button>
          </form>

          <div class="form-success-card" id="modal-form-success">
            <div class="success-stamp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <span class="label" style="color:var(--rose-deep);margin-bottom:8px;display:block;">Application Received</span>
            <h3>Welcome to Founder Cohort 01</h3>
            <p>Your response has been recorded into our private registry and Google Form. Our founding team reads every application personally and will reach out via email.</p>
            <button type="button" class="btn btn-solid" id="modal-success-close-btn" style="display:inline-flex;">
              <span>Done</span>
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modalOverlay);

      // Close events
      const closeBtn = document.getElementById('modal-close-btn');
      const successCloseBtn = document.getElementById('modal-success-close-btn');

      function closeModal() {
        modalOverlay.classList.remove('open');
        document.body.style.overflow = '';
      }

      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);

      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
          closeModal();
        }
      });
    }

    const overlay = document.getElementById('app-modal-overlay');

    // Attach trigger listeners to all application CTAs if requested
    document.querySelectorAll('[data-open-modal="true"]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        if (overlay) {
          overlay.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }

  function initFormSubmission() {
    // 1. Handle Inline Form on manual-wave.html
    const pageForm = document.getElementById('page-app-form');
    const pageSuccess = document.getElementById('page-form-success');

    if (pageForm) {
      pageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = pageForm.querySelector('.form-submit-btn');
        const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Recording your application...</span>';
        }

        const formData = new FormData(pageForm);
        await sendToGoogleForm(formData);

        // Smooth transition to confirmation state
        setTimeout(() => {
          pageForm.style.display = 'none';
          if (pageSuccess) {
            pageSuccess.classList.add('active');
            pageSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      });
    }

    // 2. Handle Modal Form
    const modalForm = document.getElementById('modal-app-form');
    const modalSuccess = document.getElementById('modal-form-success');

    if (modalForm) {
      modalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('modal-submit-btn');

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Recording your application...</span>';
        }

        const formData = new FormData(modalForm);
        await sendToGoogleForm(formData);

        setTimeout(() => {
          modalForm.style.display = 'none';
          if (modalSuccess) {
            modalSuccess.classList.add('active');
          }
        }, 500);
      });
    }
  }

  /* ==========================================================================
     10. Initialize Everything on DOM Ready
     ========================================================================== */
  function init() {
    // 1. Initialize Canvas Background
    new AmbientWaveCanvas();

    // 2. Initialize Custom Luxury Cursor
    new CustomCursor();

    // 3. Split Text Typography Animations
    initSplitText();

    // 4. Card 3D Tilt Physics
    initCardPhysics();

    // 5. Space View Interactive Switcher
    initSpaceInteractive();

    // 6. Scroll Dynamics & Progress Bar
    initScrollDynamics();

    // 7. Mobile Navigation Drawer
    initMobileNav();

    // 8. Scroll Reveal Observer
    initIntersectionObserver();

    // 9. Google Form Application Modal & Form Submission Handlers
    initModalSystem();
    initFormSubmission();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
