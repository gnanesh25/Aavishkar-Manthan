(function () {
  'use strict';

  var DETAIL_PAGES = ['ideathon', 'elocution', 'walkathon', 'bonfire'];
  var homeView = document.getElementById('homeView');
  var nav = document.getElementById('siteNav');
  var hamburger = document.getElementById('hamburgerBtn');
  var mobilePanel = document.getElementById('mobilePanel');

  /* ---------------------------------------------------------------------
     Routing: hash-based "pages" for the four detail views. Everything
     else lives on the long-scroll home view.
     --------------------------------------------------------------------- */
  function currentTarget() {
    return (location.hash || '#home').replace('#', '');
  }

  function closeMobilePanel() {
    mobilePanel.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  function route(scroll) {
    var target = currentTarget();
    var isDetail = DETAIL_PAGES.indexOf(target) !== -1;

    document.querySelectorAll('.detail-page').forEach(function (p) {
      p.classList.remove('is-active');
    });

    if (isDetail) {
      var page = document.getElementById('page-' + target);
      if (page) {
        homeView.classList.add('hidden');
        page.classList.add('is-active');
        if (scroll !== false) window.scrollTo(0, 0);
      }
    } else {
      homeView.classList.remove('hidden');
      if (scroll !== false) {
        if (target && target !== 'home') {
          var section = document.getElementById(target);
          if (section) {
            requestAnimationFrame(function () {
              section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
          }
        } else {
          window.scrollTo(0, 0);
        }
      }
    }

    closeMobilePanel();
    updateActiveNav(isDetail ? null : target);
  }

  window.addEventListener('hashchange', function () { route(true); });
  document.addEventListener('DOMContentLoaded', function () { route(false); });

  /* ---------------------------------------------------------------------
     Nav active state
     --------------------------------------------------------------------- */
  function updateActiveNav(sectionId) {
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      var href = a.getAttribute('href').replace('#', '');
      a.classList.toggle('active', sectionId && href === sectionId);
    });
  }

  /* ---------------------------------------------------------------------
     Sticky nav background on scroll
     --------------------------------------------------------------------- */
  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------------
     Mobile menu
     --------------------------------------------------------------------- */
  hamburger.addEventListener('click', function () {
    var open = mobilePanel.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* ---------------------------------------------------------------------
     Scroll-spy for in-page sections (home view only)
     --------------------------------------------------------------------- */
  var spySections = ['home', 'events', 'schedule', 'register']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  var spyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !homeView.classList.contains('hidden')) {
        updateActiveNav(entry.target.id);
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  spySections.forEach(function (s) { spyObserver.observe(s); });

  /* ---------------------------------------------------------------------
     Reveal-on-scroll
     --------------------------------------------------------------------- */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  function observeReveals(root) {
    root.querySelectorAll('.reveal').forEach(function (el, i) {
      if (!el.style.getPropertyValue('--i')) el.style.setProperty('--i', i % 6);
      revealObserver.observe(el);
    });
  }
  observeReveals(document);

  /* ---------------------------------------------------------------------
     Schedule day toggle
     --------------------------------------------------------------------- */
  var dayButtons = document.querySelectorAll('.day-toggle button');
  var dayPanels = document.querySelectorAll('.t-day');
  dayButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var day = btn.getAttribute('data-day');
      dayButtons.forEach(function (b) {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      dayPanels.forEach(function (p) {
        p.classList.toggle('active', p.getAttribute('data-day') === day);
      });
    });
  });

  /* ---------------------------------------------------------------------
     Close mobile panel when a link inside it is clicked
     --------------------------------------------------------------------- */
  mobilePanel.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMobilePanel);
  });

  /* ---------------------------------------------------------------------
     Countdown timer — Sep 30, 2026 09:00 IST (UTC+5:30)
     --------------------------------------------------------------------- */
  var eventDate = new Date('2026-09-30T09:00:00+05:30');
  function updateCountdown() {
    var now = new Date();
    var diff = eventDate - now;
    var dEl = document.getElementById('cd-days');
    var hEl = document.getElementById('cd-hours');
    var mEl = document.getElementById('cd-mins');
    var sEl = document.getElementById('cd-secs');
    if (!dEl) return;
    if (diff <= 0) {
      dEl.textContent = '00'; hEl.textContent = '00';
      mEl.textContent = '00'; sEl.textContent = '00';
      return;
    }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    dEl.textContent = String(d).padStart(2, '0');
    hEl.textContent = String(h).padStart(2, '0');
    mEl.textContent = String(m).padStart(2, '0');
    sEl.textContent = String(s).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

}());
