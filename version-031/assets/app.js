var MovieSite = (function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function setupMenu() {
        var button = document.querySelector(".menu-toggle");
        var menu = document.querySelector(".mobile-nav");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            menu.classList.toggle("open");
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer = null;
        function show(index) {
            current = index;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("active", i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("active", i === current);
            });
        }
        function next() {
            show((current + 1) % slides.length);
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                if (timer) {
                    window.clearInterval(timer);
                }
                timer = window.setInterval(next, 5200);
            });
        });
        timer = window.setInterval(next, 5200);
    }

    function setupFiltering() {
        var search = document.querySelector(".movie-search");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
        var pills = Array.prototype.slice.call(document.querySelectorAll(".filter-pill"));
        if (!cards.length) {
            return;
        }
        var activeFilter = "all";
        function apply() {
            var keyword = search ? search.value.trim().toLowerCase() : "";
            cards.forEach(function (card) {
                var text = (card.getAttribute("data-search") || "").toLowerCase();
                var category = card.getAttribute("data-category") || "";
                var matchText = !keyword || text.indexOf(keyword) !== -1;
                var matchCategory = activeFilter === "all" || category === activeFilter;
                card.classList.toggle("hidden-card", !(matchText && matchCategory));
            });
        }
        if (search) {
            search.addEventListener("input", apply);
        }
        pills.forEach(function (pill) {
            pill.addEventListener("click", function () {
                activeFilter = pill.getAttribute("data-filter") || "all";
                pills.forEach(function (item) {
                    item.classList.toggle("active", item === pill);
                });
                apply();
            });
        });
    }

    function initPlayer(url) {
        ready(function () {
            var video = document.getElementById("moviePlayer");
            var button = document.getElementById("playerStart");
            if (!video || !url) {
                return;
            }
            var started = false;
            function attach() {
                if (started) {
                    return;
                }
                started = true;
                if (button) {
                    button.classList.add("hidden");
                }
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = url;
                    video.play().catch(function () {});
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls();
                    hls.loadSource(url);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        video.play().catch(function () {});
                    });
                    return;
                }
                video.src = url;
                video.play().catch(function () {});
            }
            if (button) {
                button.addEventListener("click", attach);
            }
            video.addEventListener("click", function () {
                if (!started) {
                    attach();
                }
            });
        });
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupFiltering();
    });

    return {
        initPlayer: initPlayer
    };
})();
