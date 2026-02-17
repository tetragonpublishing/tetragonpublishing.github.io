/* ==========================================================================
   Tetragon Publishing — common.js
   Vanilla JS. No frameworks.
   ========================================================================== */
(function() {
  'use strict';

  /* --- Utility: fade out an element ------------------------------------ */
  function fadeOut(el, duration, callback) {
    if (!el) { if (callback) callback(); return; }
    el.style.transition = 'opacity ' + duration + 'ms';
    el.style.opacity = '0';
    setTimeout(function() {
      el.style.display = 'none';
      el.style.transition = '';
      el.style.opacity = '';
      if (callback) callback();
    }, duration);
  }

  /* --- Utility: fade in an element ------------------------------------- */
  function fadeIn(el, duration, callback) {
    if (!el) { if (callback) callback(); return; }
    el.style.opacity = '0';
    el.style.display = '';
    el.offsetHeight; // force reflow
    el.style.transition = 'opacity ' + duration + 'ms';
    el.style.opacity = '1';
    setTimeout(function() {
      el.style.transition = '';
      el.style.opacity = '';
      if (callback) callback();
    }, duration);
  }

  /* --- Utility: slide toggle ------------------------------------------- */
  function slideToggle(el, duration) {
    duration = duration || 400;
    if (!el.offsetHeight || el.style.display === 'none') {
      // slide down
      el.style.display = '';
      el.style.overflow = 'hidden';
      var h = el.scrollHeight;
      el.style.maxHeight = '0';
      el.offsetHeight; // reflow
      el.style.transition = 'max-height ' + duration + 'ms ease';
      el.style.maxHeight = h + 'px';
      setTimeout(function() {
        el.style.maxHeight = '';
        el.style.overflow = '';
        el.style.transition = '';
      }, duration);
    } else {
      // slide up
      el.style.overflow = 'hidden';
      el.style.maxHeight = el.scrollHeight + 'px';
      el.offsetHeight; // reflow
      el.style.transition = 'max-height ' + duration + 'ms ease';
      el.style.maxHeight = '0';
      setTimeout(function() {
        el.style.display = 'none';
        el.style.maxHeight = '';
        el.style.overflow = '';
        el.style.transition = '';
      }, duration);
    }
  }

  /* --- Fading links (CSS transition, replaces jquery.color.js) --------- */
  function fadingLinks(elements, color, duration, ignoreClass) {
    color = color || '#ff8c00';
    duration = duration || 300;
    ignoreClass = ignoreClass || 'sel';
    if (typeof elements === 'string') {
      elements = document.querySelectorAll(elements);
    }
    elements.forEach(function(el) {
      el.style.transition = 'color ' + duration + 'ms';
      el.addEventListener('mouseenter', function() {
        if (!el.classList.contains(ignoreClass)) {
          el.style.cursor = 'pointer';
          el.style.color = color;
        } else {
          el.style.cursor = 'default';
        }
      });
      el.addEventListener('mouseleave', function() {
        if (!el.classList.contains(ignoreClass)) {
          el.style.color = '';
        }
      });
    });
  }

  /* --- Find last text node matching pattern (for article-end block) ---- */
  function findLast(element, pattern, callback) {
    for (var i = element.childNodes.length; i-- > 0;) {
      var child = element.childNodes[i];
      if (child.nodeType === 1) {
        findLast(child, pattern, callback);
      } else if (child.nodeType === 3) {
        var idx = child.data.lastIndexOf(pattern);
        if (idx !== -1) {
          callback(child, child.data.substr(idx, pattern.length));
        }
      }
    }
  }

  /* =====================================================================
     DROPCAPS + ARTICLE END BLOCKS
     ===================================================================== */
  document.querySelectorAll('.bodytext').forEach(function(bodytext) {
    // Dropcap on first paragraph
    var firstP = bodytext.querySelector('p');
    if (firstP) {
      var html = firstP.innerHTML.trim();
      if (html.charAt(0) === '<') {
        var firstChild = firstP.firstElementChild;
        if (firstChild) {
          firstChild.innerHTML = firstChild.innerHTML.replace(
            /[ ]*([A-Za-z?])(.*)/, "<span class='dropcap'>$1</span>$2"
          );
        }
      } else {
        firstP.innerHTML = firstP.innerHTML.replace(
          /[ ]*([A-Za-z?])(.*)/, "<span class='dropcap'>$1</span>$2"
        );
      }
    }

    // End-of-article block on last paragraph
    var ps = bodytext.querySelectorAll('p');
    var lastP = ps.length ? ps[ps.length - 1] : null;
    if (lastP) {
      var match = /.*[\s-](\S+)/.exec(lastP.textContent);
      if (match) {
        findLast(lastP, match[1], function(node, m) {
          var span = document.createElement('span');
          span.className = 'article-end';
          var textNode = node.splitText(node.data.lastIndexOf(m));
          span.appendChild(textNode);
          var block = document.createElement('span');
          block.className = 'article-end-block';
          span.appendChild(block);
          node.parentNode.insertBefore(span, node.nextSibling);
        });
      }
    }
  });

  /* =====================================================================
     EMAIL DEOBFUSCATION
     ===================================================================== */
  document.querySelectorAll('span.enc-mail').forEach(function(span) {
    var addr = span.textContent.replace(/ собачка /, '@').replace(/ точка /g, '.');
    var title = span.getAttribute('title') || '';
    var link = document.createElement('a');
    link.title = title;
    link.href = 'mailto:' + addr + '?Subject=' + title;
    link.textContent = addr;
    span.parentNode.replaceChild(link, span);
  });

  /* =====================================================================
     NAV FADING LINKS
     ===================================================================== */
  fadingLinks('#main-nav a', '#A01714', 300);

  /* =====================================================================
     SERVICES PAGE
     ===================================================================== */

  // Accordion: hide dropdowns, toggle on heading click
  document.querySelectorAll('article.services .dropdown').forEach(function(el) {
    el.style.display = 'none';
  });
  var serviceHeadings = document.querySelectorAll('article.services .services-list h2');
  fadingLinks(serviceHeadings, '#A01714', 300);
  serviceHeadings.forEach(function(h2) {
    h2.style.cursor = 'pointer';
    h2.addEventListener('click', function() {
      slideToggle(h2.nextElementSibling);
    });
  });

  // Pic grid opacity hover
  document.querySelectorAll('.pic-grid li').forEach(function(li) {
    li.style.transition = 'opacity 300ms';
    li.addEventListener('mouseenter', function() { li.style.opacity = '0.3'; });
    li.addEventListener('mouseleave', function() { li.style.opacity = '0.6'; });
  });

  // Modal sliders (vanilla JS, replaces Orbit + Reveal)
  (function() {
    function modalSlider(modalId, slidesId) {
      var modal = document.getElementById(modalId);
      if (!modal) return null;
      var track = document.getElementById(slidesId);
      var total = track.querySelectorAll('.modal-slide').length;
      var current = 0;

      function goTo(n) {
        current = ((n % total) + total) % total;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
      }
      function open(i) {
        goTo(i || 0);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      function close() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }

      modal.querySelector('.modal-prev').addEventListener('click', function() { goTo(current - 1); });
      modal.querySelector('.modal-next').addEventListener('click', function() { goTo(current + 1); });
      modal.querySelector('.modal-close').addEventListener('click', close);
      modal.addEventListener('click', function(e) { if (e.target === modal) close(); });

      return { open: open };
    }

    var pg = modalSlider('pic-grid-modal', 'pic-grid-slides');
    if (pg) {
      document.querySelectorAll('.pic-grid li').forEach(function(li, i) {
        li.addEventListener('click', function() { pg.open(i); });
      });
    }

    var eb = modalSlider('ebook-modal', 'ebook-slides');
    if (eb) {
      document.querySelectorAll('.start-ebook-slides').forEach(function(el) {
        el.addEventListener('click', function() { eb.open(0); });
      });
    }

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(function(m) {
          m.classList.remove('active');
          document.body.style.overflow = '';
        });
      }
    });
  })();

  /* =====================================================================
     CLIENTS PAGE
     ===================================================================== */
  (function() {
    var clientsList = document.querySelector('dl.clients-list');
    if (!clientsList) return;

    var working = false;

    // Hide all client sections and nav on load (so non-JS browsers still see content)
    clientsList.querySelectorAll('dd').forEach(function(dd) {
      var id = dd.dataset.client;
      var section = document.getElementById(id);
      var nav = document.getElementById('nav-' + id);
      if (section) section.style.display = 'none';
      if (nav) nav.style.display = 'none';
    });
    document.querySelectorAll('section [class^=page-]').forEach(function(el) {
      el.style.display = 'none';
    });

    // Swap tab page within a client section
    function swapToTabPage(dd, options) {
      var duration = (options && options.duration !== undefined) ? options.duration : 400;
      var affectWorking = (options && options.affectWorking !== undefined) ? options.affectWorking : true;
      var fade = (options && options.fade !== undefined) ? options.fade : true;

      var nav = dd.parentElement;
      var selDd = nav.querySelector('dd[class*="_sel"]');
      var outPage = selDd ? selDd.dataset.page : null;

      // Remove _sel from current
      if (selDd) {
        selDd.className = selDd.className.replace('_sel', '');
      }
      // Add _sel to clicked
      dd.className = dd.className.replace(/(nav-page-\d+)/, '$1_sel');

      var mainId = nav.id.replace(/^nav-/, '');
      var mainEl = document.getElementById(mainId);
      if (!mainEl) return;

      var inEl = mainEl.querySelector('.page-' + dd.dataset.page);

      if (fade && outPage) {
        var outEl = mainEl.querySelector('.page-' + outPage);
        fadeOut(outEl, duration, function() {
          fadeIn(inEl, duration, function() {
            if (affectWorking) working = false;
          });
        });
      } else {
        if (outPage) {
          var outEl = mainEl.querySelector('.page-' + outPage);
          if (outEl) outEl.style.display = 'none';
        }
        if (inEl) inEl.style.display = '';
      }
    }

    // Fade a client section back in
    function fadeBackIn(dd, duration) {
      var clientId = dd.dataset.client;
      var section = document.getElementById(clientId);
      var nav = document.getElementById('nav-' + clientId);
      var page1 = section ? section.querySelector('.page-1') : null;

      if (page1) page1.style.display = '';

      fadeIn(nav, duration);
      fadeIn(section, duration, function() {
        if (section) section.classList.add('active-page');
        if (nav) nav.classList.add('active-nav');
        working = false;
      });

      // Update selection in client list
      clientsList.querySelectorAll('dd.sel').forEach(function(el) {
        if (el !== dd) el.classList.remove('sel');
      });
      dd.classList.add('sel');
      dd.style.cursor = '';
    }

    // Activate a client page
    function activatePage(dd, duration) {
      duration = duration || 400;
      if (working || dd.classList.contains('sel')) return;
      working = true;

      // Deselect previous
      var prevSel = clientsList.querySelector('dd.sel');
      if (prevSel) {
        prevSel.style.color = '';
        prevSel.classList.remove('sel');
      }
      dd.classList.add('sel');

      // Fade out active nav
      var activeNav = document.querySelector('.active-nav');
      if (activeNav) {
        fadeOut(activeNav, duration, function() {
          activeNav.classList.remove('active-nav');
          // Reset all tab pages back to page 1
          document.querySelectorAll('dl.client-nav dd:first-child').forEach(function(firstDd) {
            swapToTabPage(firstDd, { duration: 0, affectWorking: false, fade: false });
          });
        });
      }

      // Fade out active page, then fade in new one
      var activePage = document.querySelector('.active-page');
      if (!activePage) {
        fadeBackIn(dd, duration);
      } else {
        fadeOut(activePage, duration, function() {
          activePage.classList.remove('active-page');
          fadeBackIn(dd, duration);
        });
      }
    }

    // Set up fading links on client names
    var clientDds = clientsList.querySelectorAll('dd');
    fadingLinks(clientDds, '#A01714', 300, 'sel');
    clientDds.forEach(function(dd) {
      dd.style.cursor = 'pointer';
      dd.addEventListener('click', function() {
        activatePage(dd);
      });
    });

    // Numbered tab handlers
    document.querySelectorAll('dl.client-nav dd').forEach(function(dd) {
      dd.addEventListener('click', function() {
        if (!working && !dd.className.match(/nav-page-\d+_sel/)) {
          working = true;
          swapToTabPage(dd);
        }
      });
    });

    // Activate first client on load
    var firstClient = clientsList.querySelector('dd');
    if (firstClient) activatePage(firstClient);
  })();

  /* =====================================================================
     HOME / ABOUT PAGE — image slider
     ===================================================================== */
  (function() {
    var slides = document.getElementById('home-slides');
    if (!slides) return;
    var total = slides.children.length;
    var current = 0;
    function goTo(n) {
      current = ((n % total) + total) % total;
      slides.style.transform = 'translateX(-' + (current * 25) + '%)';
    }
    var wrap = slides.parentNode;
    var prev = wrap.querySelector('.slide-prev');
    var next = wrap.querySelector('.slide-next');
    if (prev) prev.addEventListener('click', function() { goTo(current - 1); });
    if (next) next.addEventListener('click', function() { goTo(current + 1); });
  })();

  /* =====================================================================
     FOUC + MOBILE NAV
     ===================================================================== */
  document.documentElement.classList.remove('fouc');

  var navToggle = document.querySelector('.nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      navToggle.parentElement.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded',
        navToggle.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');
    });
  }

})();
