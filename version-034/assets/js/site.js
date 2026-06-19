(function () {
  var mobileToggle = document.querySelector('[data-mobile-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var activeSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === activeSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === activeSlide);
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    window.setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  function normalize(value) {
    return (value || '').toString().toLowerCase().trim();
  }

  function bindSearchPanel(panel) {
    var scope = panel.getAttribute('data-search-scope') || 'body';
    var root = document.querySelector(scope) || document;
    var input = panel.querySelector('[data-search-input]');
    var buttons = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-value]'));
    var cards = Array.prototype.slice.call(root.querySelectorAll('[data-movie-card]'));
    var noResult = root.querySelector('[data-no-result]');
    var activeFilter = 'all';

    function update() {
      var keyword = normalize(input ? input.value : '');
      var visibleCount = 0;

      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-search'));
        var kind = normalize(card.getAttribute('data-kind'));
        var genre = normalize(card.getAttribute('data-genre'));
        var region = normalize(card.getAttribute('data-region'));
        var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchesFilter = activeFilter === 'all' || kind === activeFilter || genre.indexOf(activeFilter) !== -1 || region.indexOf(activeFilter) !== -1;
        var show = matchesKeyword && matchesFilter;

        card.style.display = show ? '' : 'none';

        if (show) {
          visibleCount += 1;
        }
      });

      if (noResult) {
        noResult.classList.toggle('show', visibleCount === 0);
      }
    }

    if (input) {
      input.addEventListener('input', update);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        buttons.forEach(function (item) {
          item.classList.remove('active');
        });
        button.classList.add('active');
        activeFilter = normalize(button.getAttribute('data-filter-value'));
        update();
      });
    });

    update();
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-search-panel]')).forEach(bindSearchPanel);
})();
