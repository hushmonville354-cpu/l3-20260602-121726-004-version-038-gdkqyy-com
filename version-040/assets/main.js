document.addEventListener("DOMContentLoaded", function () {
  const navButton = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-main-nav]");

  if (navButton && nav) {
    navButton.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll(".hero-dots button"));

  if (slides.length > 0) {
    let current = 0;

    const showSlide = function (index) {
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });

      current = index;
    };

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });

    window.setInterval(function () {
      showSlide((current + 1) % slides.length);
    }, 5200);

    showSlide(0);
  }

  const filterPanel = document.querySelector("[data-filter-panel]");

  if (filterPanel) {
    const input = filterPanel.querySelector("[data-filter-input]");
    const yearSelect = filterPanel.querySelector("[data-filter-year]");
    const typeSelect = filterPanel.querySelector("[data-filter-type]");
    const cards = Array.from(document.querySelectorAll(".searchable-card"));
    const empty = document.querySelector("[data-empty-state]");

    const applyFilter = function () {
      const keyword = input ? input.value.trim().toLowerCase() : "";
      const year = yearSelect ? yearSelect.value : "";
      const type = typeSelect ? typeSelect.value : "";
      let visible = 0;

      cards.forEach(function (card) {
        const target = [
          card.dataset.title || "",
          card.dataset.year || "",
          card.dataset.region || "",
          card.dataset.genre || ""
        ].join(" ").toLowerCase();

        const matchKeyword = !keyword || target.includes(keyword);
        const matchYear = !year || (card.dataset.year || "") === year;
        const matchType = !type || target.includes(type.toLowerCase());
        const ok = matchKeyword && matchYear && matchType;

        card.style.display = ok ? "" : "none";

        if (ok) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    };

    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");

    if (query && input) {
      input.value = query;
    }

    [input, yearSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilter);
        control.addEventListener("change", applyFilter);
      }
    });

    applyFilter();
  }

  const player = document.querySelector("[data-player]");

  if (player) {
    const video = player.querySelector("video");
    const cover = player.querySelector(".player-cover");
    const trigger = player.querySelector("[data-play-trigger]");
    const stream = player.getAttribute("data-stream");
    let ready = false;
    let hls = null;

    const attach = function () {
      if (!video || !stream || ready) {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }

      ready = true;
    };

    const play = function () {
      attach();

      if (cover) {
        cover.classList.add("is-hidden");
      }

      if (video) {
        video.controls = true;
        const result = video.play();

        if (result && typeof result.catch === "function") {
          result.catch(function () {});
        }
      }
    };

    if (trigger) {
      trigger.addEventListener("click", play);
    }

    if (cover) {
      cover.addEventListener("click", play);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (!ready) {
          play();
        }
      });
    }

    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }
});
