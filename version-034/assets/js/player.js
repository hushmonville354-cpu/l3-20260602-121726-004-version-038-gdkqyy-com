(function () {
  function getHlsClass() {
    if (window.Hls && window.Hls.isSupported && window.Hls.isSupported()) {
      return window.Hls;
    }

    return null;
  }

  function attachSource(video, src) {
    return new Promise(function (resolve) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('loadedmetadata', resolve, { once: true });
        video.load();
        window.setTimeout(resolve, 500);
        return;
      }

      var HlsClass = getHlsClass();

      if (HlsClass) {
        var hls = new HlsClass({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(HlsClass.Events.MANIFEST_PARSED, resolve);
        video._hlsInstance = hls;
        window.setTimeout(resolve, 800);
        return;
      }

      video.src = src;
      video.load();
      window.setTimeout(resolve, 400);
    });
  }

  window.setupMoviePlayer = function (src) {
    var frame = document.querySelector('[data-player-frame]');
    var video = document.querySelector('[data-movie-video]');
    var overlay = document.querySelector('[data-play-overlay]');
    var loaded = false;

    if (!frame || !video || !overlay || !src) {
      return;
    }

    function start() {
      if (loaded) {
        overlay.classList.add('hidden');
        video.play().catch(function () {});
        return;
      }

      loaded = true;
      overlay.classList.add('hidden');
      attachSource(video, src).then(function () {
        video.play().catch(function () {});
      });
    }

    overlay.addEventListener('click', start);
    frame.addEventListener('click', function (event) {
      if (event.target === video && !loaded) {
        start();
      }
    });

    video.addEventListener('play', function () {
      overlay.classList.add('hidden');
    });
  };
})();
