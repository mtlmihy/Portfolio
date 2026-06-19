/**
 * Matrix Background Effect - canvas rain animation
 * Triggered by Konami code on default theme.
 */
(function () {
  "use strict";

  const FONT_SIZE = 16;
  const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+-/<>=[]{}@^~ù*$ù£µ:.,;!?|§";

  let canvas = null;
  let ctx = null;
  let columns = 0;
  let drops = [];
  let animationId = null;
  let active = false;
  let lastFrameTime = 0;

  function randomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function init() {
    canvas = document.createElement("canvas");
    canvas.id = "matrix-bg-canvas";
    document.body.appendChild(canvas);
    //Test push

    ctx = canvas.getContext("2d");
    ctx.font = FONT_SIZE + "px 'Share Tech Mono', monospace";

    resize();
    window.addEventListener("resize", resize);
  }

  function resize() {
    if (!canvas || !ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    columns = Math.floor(canvas.width / FONT_SIZE);
    drops = new Array(columns).fill(0).map(function () {
      return randomInt(Math.floor(canvas.height / FONT_SIZE));
    });
  }

  function drawFrame() {
    ctx.fillStyle = "rgba(2, 8, 18, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < columns; i++) {
      const char = CHARSET.charAt(randomInt(CHARSET.length));
      const x = i * FONT_SIZE;
      const y = drops[i] * FONT_SIZE;

      const glow = 140 + randomInt(100);
      ctx.fillStyle = "rgb(0, " + glow + ", 70)";
      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      } else {
        drops[i]++;
      }
    }
  }

  function animate(timestamp) {
    if (!active) return;

    if (!lastFrameTime || timestamp - lastFrameTime > 42) {
      drawFrame();
      lastFrameTime = timestamp;
    }

    animationId = window.requestAnimationFrame(animate);
  }

  function start() {
    if (active) return;
    if (!canvas) init();

    active = true;
    lastFrameTime = 0;
    canvas.classList.add("active");
    document.body.classList.add("matrix-bg-active");

    animationId = window.requestAnimationFrame(animate);
  }

  function stop() {
    active = false;

    if (animationId) {
      window.cancelAnimationFrame(animationId);
      animationId = null;
    }

    if (canvas) {
      canvas.classList.remove("active");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    document.body.classList.remove("matrix-bg-active");
  }

  function toggle() {
    if (active) {
      stop();
    } else {
      start();
    }

    return active;
  }

  function isActive() {
    return active;
  }

  window.matrixBackground = {
    start: start,
    stop: stop,
    toggle: toggle,
    isActive: isActive,
  };
})();
