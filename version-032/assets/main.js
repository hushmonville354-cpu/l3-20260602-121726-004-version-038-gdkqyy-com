(function () {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    document.addEventListener('DOMContentLoaded', function () {
        selectAll('[data-menu-button]').forEach(function (button) {
            button.addEventListener('click', function () {
                var panel = document.querySelector('[data-menu-panel]');
                if (panel) {
                    panel.classList.toggle('is-open');
                }
            });
        });

        selectAll('[data-hero-carousel]').forEach(function (carousel) {
            var slides = selectAll('.hero-slide', carousel);
            var dots = selectAll('[data-hero-dot]', carousel);
            var index = 0;
            var show = function (next) {
                if (!slides.length) {
                    return;
                }
                index = (next + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle('is-active', i === index);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle('is-active', i === index);
                });
            };
            dots.forEach(function (dot, i) {
                dot.addEventListener('click', function () {
                    show(i);
                });
            });
            if (slides.length > 1) {
                window.setInterval(function () {
                    show(index + 1);
                }, 5200);
            }
        });

        var inputs = selectAll('[data-search-input]');
        var years = selectAll('[data-year-filter]');
        var runFilter = function () {
            var keyword = '';
            var year = '';
            inputs.forEach(function (input) {
                if (input.value.trim()) {
                    keyword = input.value.trim().toLowerCase();
                }
            });
            years.forEach(function (select) {
                if (select.value) {
                    year = select.value;
                }
            });
            selectAll('[data-filter-grid]').forEach(function (grid) {
                selectAll('.movie-card, .rank-item', grid).forEach(function (item) {
                    var text = [
                        item.getAttribute('data-title') || '',
                        item.getAttribute('data-year') || '',
                        item.getAttribute('data-type') || '',
                        item.getAttribute('data-genre') || '',
                        item.textContent || ''
                    ].join(' ').toLowerCase();
                    var itemYear = item.getAttribute('data-year') || '';
                    var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
                    var matchedYear = !year || itemYear.indexOf(year) !== -1;
                    item.classList.toggle('is-filter-hidden', !(matchedKeyword && matchedYear));
                });
            });
        };
        inputs.forEach(function (input) {
            input.addEventListener('input', runFilter);
        });
        years.forEach(function (select) {
            select.addEventListener('change', runFilter);
        });
    });

    window.initMoviePlayer = function (videoId, buttonId, source) {
        var video = document.getElementById(videoId);
        var button = document.getElementById(buttonId);
        if (!video || !button || !source) {
            return;
        }
        var started = false;
        var attach = function () {
            if (started) {
                return;
            }
            started = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    maxBufferLength: 30,
                    enableWorker: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                video._hls = hls;
            } else {
                video.src = source;
            }
            video.setAttribute('controls', 'controls');
            button.classList.add('is-hidden');
            var play = function () {
                var action = video.play();
                if (action && action.catch) {
                    action.catch(function () {});
                }
            };
            if (window.Hls && video._hls) {
                video._hls.on(window.Hls.Events.MANIFEST_PARSED, play);
            } else {
                play();
            }
        };
        button.addEventListener('click', attach);
        video.addEventListener('click', function () {
            if (!started) {
                attach();
            }
        });
    };
})();
