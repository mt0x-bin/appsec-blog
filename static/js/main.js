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

// ── SEARCH ──
(function() {
  var overlay = document.getElementById('searchOverlay');
  var input = document.getElementById('searchInput');
  var resultsContainer = document.getElementById('searchResults');
  var searchEmpty = document.getElementById('searchEmpty');
  var toggleBtn = document.querySelector('.search-toggle');

  if (!overlay || !input) return;

  var fuse = null;
  var searchIndex = null;
  var activeIndex = -1;
  var results = [];

  function loadSearchIndex() {
    if (searchIndex) return;
    var url = window.__searchIndexURL;
    if (!url) return;
    fetch(url)
      .then(function(res) { return res.json(); })
      .then(function(data) {
        searchIndex = data;
        fuse = new Fuse(searchIndex, {
          keys: [
            { name: 'title', weight: 0.4 },
            { name: 'description', weight: 0.25 },
            { name: 'tags', weight: 0.2 },
            { name: 'content', weight: 0.15 }
          ],
          threshold: 0.3,
          includeMatches: true,
          minMatchCharLength: 2,
          ignoreLocation: true
        });
      })
      .catch(function(err) {
        console.error('[search] Failed to load index:', err);
      });
  }

  function openSearch() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    input.focus();
    loadSearchIndex();
  }

  function closeSearch() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    input.value = '';
    activeIndex = -1;
    results = [];
    renderEmpty();
  }

  function renderEmpty() {
    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(searchEmpty);
    searchEmpty.style.display = '';
  }

  function renderNoResults(query) {
    searchEmpty.style.display = 'none';
    resultsContainer.innerHTML =
      '<div class="search-no-results">' +
        '<span style="color:var(--green)">$</span> grep -r "' +
        escapeHTML(query) + '" .<br>' +
        '<span style="color:var(--red);">0 matches found</span>' +
      '</div>';
  }

  function renderResults(fuseResults) {
    searchEmpty.style.display = 'none';
    resultsContainer.innerHTML = '';
    fuseResults.forEach(function(result, i) {
      var item = result.item;
      var el = document.createElement('a');
      el.href = item.permalink;
      el.className = 'search-result' + (i === activeIndex ? ' active' : '');
      el.setAttribute('data-index', i);

      var tagsHTML = '';
      if (item.tags && item.tags.length) {
        tagsHTML = item.tags.slice(0, 3).map(function(t) {
          return '<span class="search-result-tag">' + escapeHTML(t) + '</span>';
        }).join('');
      }

      el.innerHTML =
        '<div class="search-result-title">' + highlightMatches(result, 'title', item.title) + '</div>' +
        '<div class="search-result-desc">' + escapeHTML(item.description || '') + '</div>' +
        '<div class="search-result-meta">' +
          '<span class="search-result-date">' + escapeHTML(item.date || '') + '</span>' +
          tagsHTML +
        '</div>';

      resultsContainer.appendChild(el);
    });
  }

  function highlightMatches(result, key, text) {
    if (!result.matches) return escapeHTML(text);
    var match = null;
    for (var i = 0; i < result.matches.length; i++) {
      if (result.matches[i].key === key) { match = result.matches[i]; break; }
    }
    if (!match || !match.indices || !match.indices.length) return escapeHTML(text);

    var pairs = match.indices.filter(function(p) { return p[1] - p[0] >= 1; });
    if (!pairs.length) return escapeHTML(text);

    pairs.sort(function(a, b) { return a[0] - b[0]; });

    var out = '';
    var last = 0;
    pairs.forEach(function(pair) {
      var start = pair[0], end = pair[1] + 1;
      if (start > last) out += escapeHTML(text.slice(last, start));
      out += '<mark>' + escapeHTML(text.slice(start, end)) + '</mark>';
      last = end;
    });
    if (last < text.length) out += escapeHTML(text.slice(last));
    return out;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function updateActive() {
    var items = resultsContainer.querySelectorAll('.search-result');
    items.forEach(function(el, i) {
      el.classList.toggle('active', i === activeIndex);
    });
    if (items[activeIndex]) {
      items[activeIndex].scrollIntoView({ block: 'nearest' });
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openSearch();
    });
  }

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeSearch();
  });

  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (overlay.classList.contains('active')) closeSearch();
      else openSearch();
      return;
    }

    if (e.key === '/' && !overlay.classList.contains('active')) {
      var tag = document.activeElement.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && !document.activeElement.isContentEditable) {
        e.preventDefault();
        openSearch();
        return;
      }
    }

    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      e.preventDefault();
      closeSearch();
      return;
    }

    if (!overlay.classList.contains('active')) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (results.length > 0) {
        activeIndex = (activeIndex + 1) % results.length;
        updateActive();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length > 0) {
        activeIndex = activeIndex <= 0 ? results.length - 1 : activeIndex - 1;
        updateActive();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      var items = resultsContainer.querySelectorAll('.search-result');
      if (items[activeIndex]) items[activeIndex].click();
    }
  });

  var debounceTimer;
  input.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    var query = input.value.trim();
    activeIndex = -1;

    if (!query) {
      results = [];
      renderEmpty();
      return;
    }

    debounceTimer = setTimeout(function() {
      if (!fuse) return;
      results = fuse.search(query, { limit: 8 });
      if (results.length === 0) renderNoResults(query);
      else renderResults(results);
    }, 150);
  });
})();
