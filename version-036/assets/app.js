(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.main-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  if (slides.length > 1) {
    var current = 0;
    var showSlide = function (index) {
      slides[current].classList.remove('active');
      if (dots[current]) {
        dots[current].classList.remove('active');
      }
      current = index;
      slides[current].classList.add('active');
      if (dots[current]) {
        dots[current].classList.add('active');
      }
    };
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });
    setInterval(function () {
      showSlide((current + 1) % slides.length);
    }, 5200);
  }

  var searchInput = document.querySelector('[data-filter-input]');
  var yearSelect = document.querySelector('[data-filter-year]');
  var regionSelect = document.querySelector('[data-filter-region]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.filter-card'));
  var empty = document.querySelector('.empty-result');
  var applyFilter = function () {
    if (!cards.length) {
      return;
    }
    var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var year = yearSelect ? yearSelect.value : '';
    var region = regionSelect ? regionSelect.value : '';
    var visible = 0;
    cards.forEach(function (card) {
      var haystack = [card.dataset.title, card.dataset.genre, card.dataset.tags, card.dataset.region, card.dataset.year].join(' ').toLowerCase();
      var okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var okYear = !year || card.dataset.year === year;
      var okRegion = !region || card.dataset.region === region;
      var ok = okKeyword && okYear && okRegion;
      card.style.display = ok ? '' : 'none';
      if (ok) {
        visible += 1;
      }
    });
    if (empty) {
      empty.style.display = visible ? 'none' : 'block';
    }
  };
  [searchInput, yearSelect, regionSelect].forEach(function (item) {
    if (item) {
      item.addEventListener('input', applyFilter);
      item.addEventListener('change', applyFilter);
    }
  });

  window.setupPlayer = function (source) {
    var video = document.getElementById('moviePlayer');
    var overlay = document.querySelector('.video-overlay');
    var play = document.querySelector('.big-play');
    if (!video || !source) {
      return;
    }
    var attach = function () {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls();
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    };
    var start = function () {
      attach();
      if (overlay) {
        overlay.classList.add('hidden');
      }
      var result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {});
      }
    };
    if (play) {
      play.addEventListener('click', start);
    }
    if (overlay) {
      overlay.addEventListener('click', start);
    }
  };
})();
