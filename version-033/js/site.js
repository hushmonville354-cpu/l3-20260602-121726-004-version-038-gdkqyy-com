(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
      menuButton.addEventListener('click', function () {
        mobilePanel.classList.toggle('is-open');
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var poster = document.querySelector('[data-hero-poster]');
    var heroTitle = document.querySelector('[data-hero-title]');
    var heroText = document.querySelector('[data-hero-text]');
    var heroLink = document.querySelector('[data-hero-link]');
    var heroType = document.querySelector('[data-hero-type]');
    var heroYear = document.querySelector('[data-hero-year]');
    var activeIndex = 0;

    function activateHero(index) {
      if (!slides.length) {
        return;
      }
      activeIndex = index % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === activeIndex);
      });
      var current = slides[activeIndex];
      if (poster && current.dataset.cover) {
        poster.style.backgroundImage = current.dataset.cover;
      }
      if (heroTitle) {
        heroTitle.textContent = current.dataset.title || '';
      }
      if (heroText) {
        heroText.textContent = current.dataset.text || '';
      }
      if (heroLink) {
        heroLink.setAttribute('href', current.dataset.link || '#');
      }
      if (heroType) {
        heroType.textContent = current.dataset.type || '';
      }
      if (heroYear) {
        heroYear.textContent = current.dataset.year || '';
      }
    }

    if (slides.length > 1) {
      activateHero(0);
      window.setInterval(function () {
        activateHero(activeIndex + 1);
      }, 5200);
    }

    var globalSearch = document.querySelector('[data-global-search]');
    if (globalSearch) {
      globalSearch.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = globalSearch.querySelector('input');
        var q = input ? input.value.trim() : '';
        var prefix = globalSearch.getAttribute('data-prefix') || '';
        window.location.href = prefix + 'search.html' + (q ? '?q=' + encodeURIComponent(q) : '');
      });
    }

    var searchInput = document.querySelector('[data-search-input]');
    var yearSelect = document.querySelector('[data-year-filter]');
    var typeSelect = document.querySelector('[data-type-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var emptyState = document.querySelector('[data-empty-state]');

    function applyFilters() {
      var q = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var year = yearSelect ? yearSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.dataset.title,
          card.dataset.genre,
          card.dataset.tags,
          card.dataset.region,
          card.dataset.type,
          card.dataset.year
        ].join(' ').toLowerCase();
        var passQ = !q || haystack.indexOf(q) !== -1;
        var passYear = !year || card.dataset.year === year;
        var passType = !type || card.dataset.type === type;
        var shouldShow = passQ && passYear && passType;
        card.style.display = shouldShow ? '' : 'none';
        if (shouldShow) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.style.display = visible ? 'none' : 'block';
      }
    }

    if (searchInput && cards.length) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q) {
        searchInput.value = q;
      }
      searchInput.addEventListener('input', applyFilters);
      if (yearSelect) {
        yearSelect.addEventListener('change', applyFilters);
      }
      if (typeSelect) {
        typeSelect.addEventListener('change', applyFilters);
      }
      applyFilters();
    }

    var player = document.querySelector('[data-player]');
    if (player) {
      var video = player.querySelector('video');
      var playButton = player.querySelector('[data-play-button]');
      var playLayer = player.querySelector('[data-play-layer]');
      var source = player.getAttribute('data-hls');
      var hlsReady = false;

      function attachSource() {
        if (!video || !source || hlsReady) {
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls();
          hls.loadSource(source);
          hls.attachMedia(video);
          hlsReady = true;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
          hlsReady = true;
        } else {
          video.src = source;
          hlsReady = true;
        }
      }

      function startPlayback() {
        attachSource();
        if (playLayer) {
          playLayer.classList.add('is-hidden');
        }
        if (video) {
          var promise = video.play();
          if (promise && promise.catch) {
            promise.catch(function () {});
          }
        }
      }

      if (playButton) {
        playButton.addEventListener('click', startPlayback);
      }
      if (video) {
        video.addEventListener('click', function () {
          if (video.paused) {
            startPlayback();
          }
        });
      }
      attachSource();
    }
  });
})();
