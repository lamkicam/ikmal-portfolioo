(() => {
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── split each wordmark into per-letter spans so the entrance can
        stagger. Done in JS so the HTML stays plain readable text. ── */
  document.querySelectorAll('[data-split]').forEach(el => {
    const word = el.textContent.trim();
    el.textContent = '';
    el.setAttribute('aria-label', word);
    [...word].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'gl';
      s.style.setProperty('--i', i);
      s.setAttribute('aria-hidden', 'true');
      s.textContent = ch;
      el.appendChild(s);
    });
  });

  /* ── preloader ──
     Only the home page carries it. A chapter page opened directly has
     nothing to count up to, so it is simply ready the moment it parses. */
  const fill = document.getElementById('preFill');
  const num = document.getElementById('preNum');
  const txt = document.getElementById('preTxt');
  if (!fill) document.body.classList.add('ready');
  let p = 0;
  const tick = fill && setInterval(() => {
    p = Math.min(100, p + Math.random() * 16 + 6);
    const v = String(Math.round(p)).padStart(2, '0');
    fill.style.width = p + '%';
    num.textContent = v;
    txt.textContent = v;
    if (p >= 100) {
      clearInterval(tick);
      setTimeout(() => {
        document.getElementById('pre').classList.add('done');
        document.body.classList.add('ready');
      }, 260);
    }
  }, rm ? 30 : 140);

  /* ── spotlight on the glass ──
     The pointer only writes two CSS variables. There is no element chasing
     the cursor, so there is nothing that can visibly trail behind it. */
  const slab = document.querySelector('.slab');

  if (slab && !rm && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    let queued = null;

    const light = () => {
      const { x, y } = queued;
      queued = null;
      const r = slab.getBoundingClientRect();
      slab.style.setProperty('--mx', (x - r.left).toFixed(0) + 'px');
      slab.style.setProperty('--my', (y - r.top).toFixed(0) + 'px');
    };

    // listen on the window so the light keeps tracking just outside the panel
    addEventListener('pointermove', e => {
      const r = slab.getBoundingClientRect();
      const near = e.clientX > r.left - 160 && e.clientX < r.right + 160 &&
                   e.clientY > r.top - 160 && e.clientY < r.bottom + 160;
      slab.style.setProperty('--lit', near ? '1' : '0');
      if (!near) return;
      const first = queued === null;
      queued = { x: e.clientX, y: e.clientY };
      if (first) requestAnimationFrame(light);
    }, { passive: true });

    addEventListener('blur', () => slab.style.setProperty('--lit', '0'));
  }

  /* ── deck: bloom parallax + per-slot 3D tilt ──
     The tilt is written as CSS variables on the .face, never as an inline
     transform. CSS keeps full ownership of the transform, so the hover
     lift and the tilt can't overwrite each other — which is what used to
     make the cards jump. Reads are batched into one rAF frame. */
  const deck  = document.getElementById('deck');
  const bloom = document.getElementById('bloom');
  const slots = deck ? [...deck.querySelectorAll('.slot')] : [];
  const cards = deck ? [...deck.querySelectorAll('.card')] : [];

  if (deck && !rm && matchMedia('(pointer:fine)').matches) {
    let pending = null;

    const paint = () => {
      const { x, y } = pending;
      pending = null;

      const r = deck.getBoundingClientRect();
      const nx = (x - r.left) / r.width - 0.5;
      const ny = (y - r.top) / r.height - 0.5;
      bloom.style.transform =
        `translate(calc(-50% + ${(nx * 60).toFixed(1)}px), calc(-50% + ${(ny * 30).toFixed(1)}px))`;

      for (const slot of slots) {
        const face = slot.querySelector('.face');
        const b = slot.getBoundingClientRect();
        const inside = x >= b.left && x <= b.right && y >= b.top && y <= b.bottom;
        if (!inside) {
          face.style.setProperty('--rx', '0deg');
          face.style.setProperty('--ry', '0deg');
          continue;
        }
        // position within this slot, -0.5 … 0.5
        const sx = (x - b.left) / b.width - 0.5;
        const sy = (y - b.top) / b.height - 0.5;
        face.style.setProperty('--ry', (sx * 13).toFixed(2) + 'deg');
        face.style.setProperty('--rx', (-sy * 11).toFixed(2) + 'deg');
      }
    };

    deck.addEventListener('pointermove', e => {
      const first = pending === null;
      pending = { x: e.clientX, y: e.clientY };
      if (first) requestAnimationFrame(paint);
    }, { passive: true });

    // leaving the deck resets every face in one go
    deck.addEventListener('pointerleave', () => {
      pending = null;
      for (const slot of slots) {
        const face = slot.querySelector('.face');
        face.style.setProperty('--rx', '0deg');
        face.style.setProperty('--ry', '0deg');
      }
      bloom.style.transform = 'translate(-50%,-50%)';
    });
  }

  /* ── swipe dots ──
     Which card is "current" is read from the scroll container itself, so the
     dots stay right whether you swiped, tapped a dot, or tabbed to a card. */
  const scroller = document.querySelector('.deck-scroll');
  const dots = [...document.querySelectorAll('#dots button')];

  if (deck && scroller && dots.length) {
    const mark = i => dots.forEach((d, n) => d.classList.toggle('on', n === i));

    let raf = null;
    scroller.addEventListener('scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const step = scroller.scrollWidth / slots.length;
        // +half a card so the dot flips when the card is mostly in view
        mark(Math.min(slots.length - 1, Math.round(scroller.scrollLeft / step)));
      });
    }, { passive: true });

    dots.forEach((d, i) => d.addEventListener('click', () => {
      slots[i].scrollIntoView({
        behavior: rm ? 'auto' : 'smooth',
        inline: 'start',
        block: 'nearest'
      });
      mark(i);
    }));
  }

  /* ── reveal chapter content as it scrolls in ──
     Each element is unobserved once it has appeared, so nothing keeps
     running after the reveal is done. */
  const rvs = document.querySelectorAll('.rv');
  if (rm) {
    rvs.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e, n) => {
        if (!e.isIntersecting) return;
        e.target.style.transitionDelay = (n * 0.07).toFixed(2) + 's';
        e.target.classList.add('in');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    rvs.forEach(el => io.observe(el));
  }

  /* ── the light also plays across the bio card ── */
  const bio = document.querySelector('.bio');
  if (bio && !rm && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    let q = null;
    const paint = () => {
      const { x, y } = q; q = null;
      const r = bio.getBoundingClientRect();
      bio.style.setProperty('--mx', (x - r.left).toFixed(0) + 'px');
      bio.style.setProperty('--my', (y - r.top).toFixed(0) + 'px');
    };
    addEventListener('pointermove', e => {
      const r = bio.getBoundingClientRect();
      const near = e.clientX > r.left - 160 && e.clientX < r.right + 160 &&
                   e.clientY > r.top - 160 && e.clientY < r.bottom + 160;
      bio.style.setProperty('--lit', near ? '1' : '0');
      if (!near) return;
      const first = q === null;
      q = { x: e.clientX, y: e.clientY };
      if (first) requestAnimationFrame(paint);
    }, { passive: true });
  }

  /* ── the nav marks the page you are on ──
     Each file ships with the right link already flagged, so this only has
     to cover the case where the page is opened as a bare directory. ── */
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-mid a, .sheet a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === here) a.classList.add('on');
  });

  /* ── drawers ──
     Everything starts open in the CSS and is folded shut here, so if this
     script never runs the visitor still sees every piece of work. */
  const drawers = [...document.querySelectorAll('.drawer')];

  drawers.forEach(d => {
    const head = d.querySelector('.drawer-head');
    const body = d.querySelector('.drawer-body');

    d.classList.add('shut');
    head.setAttribute('aria-expanded', 'false');

    head.addEventListener('click', () => {
      const opening = d.classList.contains('shut');
      d.classList.toggle('shut', !opening);
      d.classList.toggle('open', opening);
      head.setAttribute('aria-expanded', String(opening));

      // closing a drawer stops whatever was playing inside it
      if (!opening) body.querySelectorAll('video').forEach(v => v.pause());

      // opening one asks its clips for a still frame — see thumb() below
      if (opening) body.querySelectorAll('video').forEach(thumb);
    });
  });

  /* ── stand-in thumbnails ──
     A clip with no poster file would sit black until it is played. Rather
     than that, ask the browser for the frame itself: load only the header,
     seek a little way in, and let it paint that frame. It costs a few
     hundred kilobytes instead of the whole file, and it only happens once
     the visitor has actually opened the drawer. */
  function thumb(v) {
    if (v.dataset.thumbed || v.getAttribute('poster')) return;
    v.dataset.thumbed = '1';
    v.preload = 'metadata';

    v.addEventListener('loadedmetadata', () => {
      const at = Math.min(2, (v.duration || 6) * 0.15);
      try { v.currentTime = at; v.dataset.parked = '1'; } catch (e) { /* seek refused */ }
    }, { once: true });

    v.load();
  }

  /* ── video tiles ──
     Nothing is downloaded until the visitor presses play. Anything that
     scrolls out of view pauses itself, so five clips never run at once. */
  const tiles = [...document.querySelectorAll('.shot video')];

  tiles.forEach(v => {
    const shot = v.closest('.shot');
    const btn  = shot.querySelector('.play');

    const toggle = () => {
      if (v.paused) {
        // first press is also what triggers the download
        if (v.preload !== 'auto') v.preload = 'auto';
        // if it is parked on its thumbnail frame, start from the top instead
        if (v.dataset.parked) { v.currentTime = 0; delete v.dataset.parked; }
        tiles.forEach(o => { if (o !== v) o.pause(); });
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    };

    btn.addEventListener('click', toggle);

    // On touch the overlay is hidden while the clip runs (see the
    // hover gate in style.css), so the clip itself has to be what you
    // tap to pause it. Harmless on desktop: the overlay sits on top
    // there and swallows the click before it reaches the video.
    v.addEventListener('click', toggle);

    v.addEventListener('play',  () => shot.classList.add('playing'));
    v.addEventListener('pause', () => shot.classList.remove('playing'));
  });

  if (tiles.length) {
    // pause whatever leaves the screen
    const vio = new IntersectionObserver(entries => {
      entries.forEach(e => { if (!e.isIntersecting) e.target.pause(); });
    }, { threshold: 0.25 });
    tiles.forEach(v => vio.observe(v));
  }

  /* ── ticker: duplicate for a seamless loop ── */
  const track = document.getElementById('track');
  if (track) track.innerHTML += track.innerHTML;

  /* ── mobile sheet ── */
  const burger = document.getElementById('burger'), sheet = document.getElementById('sheet');
  burger.addEventListener('click', () => {
    burger.classList.toggle('x');
    sheet.classList.toggle('open');
  });
  sheet.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('x'); sheet.classList.remove('open');
  }));

  /* ── keyboard: 1-4 opens a card ── */
  addEventListener('keydown', e => {
    const i = ['1', '2', '3', '4'].indexOf(e.key);
    if (i > -1 && cards[i]) cards[i].click();
  });
})();