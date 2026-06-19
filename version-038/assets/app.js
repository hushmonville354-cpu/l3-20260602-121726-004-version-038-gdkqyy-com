(function () {
  'use strict';

  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }

    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
      document.body.classList.toggle('menu-open', nav.classList.contains('is-open'));
    });
  }

  function getText(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function setupFilters() {
    var scopes = document.querySelectorAll('[data-filter-scope]');
    scopes.forEach(function (scope) {
      var input = scope.querySelector('[data-filter-input]');
      var year = scope.querySelector('[data-year-filter]');
      var region = scope.querySelector('[data-region-filter]');
      var type = scope.querySelector('[data-type-filter]');
      var category = scope.querySelector('[data-category-filter]');
      var count = scope.querySelector('[data-result-count]');
      var list = document.querySelector('[data-filter-list]');
      var cards = list ? Array.from(list.querySelectorAll('.movie-card')) : [];

      function applyFilters() {
        var keyword = getText(input && input.value);
        var selectedYear = getText(year && year.value);
        var selectedRegion = getText(region && region.value);
        var selectedType = getText(type && type.value);
        var selectedCategory = getText(category && category.value);
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = [
            card.dataset.title,
            card.dataset.genre,
            card.dataset.region,
            card.dataset.year,
            card.dataset.type,
            card.textContent
          ].map(getText).join(' ');
          var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var matchesYear = !selectedYear || getText(card.dataset.year) === selectedYear;
          var matchesRegion = !selectedRegion || getText(card.dataset.region) === selectedRegion;
          var matchesType = !selectedType || getText(card.dataset.type) === selectedType;
          var matchesCategory = !selectedCategory || getText(card.dataset.category) === selectedCategory;
          var show = matchesKeyword && matchesYear && matchesRegion && matchesType && matchesCategory;

          card.classList.toggle('is-hidden', !show);
          if (show) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = visible;
        }
      }

      [input, year, region, type, category].forEach(function (control) {
        if (control) {
          control.addEventListener('input', applyFilters);
          control.addEventListener('change', applyFilters);
        }
      });

      var params = new URLSearchParams(window.location.search);
      var query = params.get('q');
      if (query && input) {
        input.value = query;
      }

      applyFilters();
    });
  }

  function setupPlayers() {
    var players = document.querySelectorAll('[data-player]');
    players.forEach(function (player) {
      var video = player.querySelector('video[data-src]');
      var button = player.querySelector('[data-play]');
      if (!video || !button) {
        return;
      }

      function loadAndPlay() {
        var source = video.dataset.src;
        button.hidden = true;

        if (video.dataset.loaded !== 'true') {
          if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
          } else if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
              enableWorker: true,
              lowLatencyMode: false,
              backBufferLength: 90
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            video._hls = hls;
          } else {
            video.src = source;
          }
          video.dataset.loaded = 'true';
        }

        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {
            button.hidden = false;
          });
        }
      }

      button.addEventListener('click', loadAndPlay);
    });
  }

  ready(function () {
    setupMenu();
    setupFilters();
    setupPlayers();
  });
}());
