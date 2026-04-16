/**
 * Fire Background Effect - Self-contained pixel fire for Titanfall theme
 * Based on the classic DOOM fire algorithm
 */
(function () {
  'use strict';

  const FIRE_PALETTE = [
    '#070707', '#1F0707', '#2F0F07', '#470F07', '#571707', '#671F07',
    '#772707', '#8F2F07', '#9F2F07', '#AF3F07', '#BF4707', '#C74707',
    '#DF4F07', '#DF5707', '#DF5707', '#D75F07', '#D7670F', '#CF6F0F',
    '#CF770F', '#CF7F0F', '#CF8717', '#C78717', '#C78F17', '#C7971F',
    '#BF9F1F', '#BF9F1F', '#BFA727', '#BFA727', '#BFAF2F', '#B7AF2F',
    '#B7B72F', '#B7B737', '#CFCF6F', '#DFDF9F', '#EFEFC7', '#FFFFFF'
  ];

  const NOT_BURNING = 0;
  const BURNING = FIRE_PALETTE.length - 1;
  const PIXEL_SIZE = 5;

  let canvas, ctx, width, height, grid, frameBuffer;
  let animationId = null;
  let active = false;
  let frame = 0;
  let gustStrength = 0;
  let gustTarget = 0;

  function init() {
    canvas = document.createElement('canvas');
    canvas.id = 'fire-bg-canvas';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    width = Math.ceil(window.innerWidth / PIXEL_SIZE);
    height = Math.ceil(window.innerHeight / PIXEL_SIZE);
    canvas.width = width;
    canvas.height = height;
    createGrid();
    frameBuffer = ctx.createImageData(width, height);
  }

  function createGrid() {
    grid = new Uint8Array(width * height);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function igniteSource() {
    const start = (height - 1) * width;

    // Slowly vary horizontal wind to create breathing, living flames.
    if (Math.random() < 0.05) {
      gustTarget = (Math.random() * 2 - 1) * 1.4;
    }
    gustStrength += (gustTarget - gustStrength) * 0.05;

    for (let x = 0; x < width; x++) {
      const i = start + x;
      const waveA = Math.sin(x * 0.23 + frame * 0.08);
      const waveB = Math.sin(x * 0.07 - frame * 0.05) * 0.7;
      const randomBoost = Math.floor(Math.random() * 4);
      const burst = Math.random() < 0.025 ? 8 + Math.floor(Math.random() * 6) : 0;
      const heat = BURNING - randomBoost + Math.round((waveA + waveB) * 2.4) + burst;

      grid[i] = clamp(heat, BURNING - 5, BURNING);
    }
  }

  function spreadFire() {
    const pulse = (Math.sin(frame * 0.05) + 1) * 0.5;
    const baseDecay = 0.4 + pulse * 1.1;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const below = idx + width;
        if (below >= grid.length) continue;

        const turbulence = (Math.random() - 0.5) * 2;
        const decay = Math.floor(baseDecay + Math.random() * 1.3);
        const dx = Math.round((Math.random() * 2 - 1) + gustStrength + turbulence * 0.35);
        const destX = x + dx;
        if (destX < 0 || destX >= width) continue;

        const dest = y * width + destX;
        const value = grid[below] - decay;
        grid[dest] = value > 0 ? value : NOT_BURNING;

        // Rare ember streaks that jump higher make the motion feel less mechanical.
        if (value > BURNING - 8 && y > 3 && Math.random() < 0.008) {
          const emberRow = y - 2 - Math.floor(Math.random() * 2);
          const emberIdx = emberRow * width + destX;
          grid[emberIdx] = clamp(value + 1, 0, BURNING);
        }
      }
    }
  }

  function draw() {
    const data = frameBuffer.data;

    for (let i = 0; i < grid.length; i++) {
      const heat = grid[i];
      const color = FIRE_PALETTE[heat];
      const r = parseInt(color.substring(1, 3), 16);
      const g = parseInt(color.substring(3, 5), 16);
      const b = parseInt(color.substring(5, 7), 16);
      const y = Math.floor(i / width);
      const heightFactor = y / (height - 1 || 1);
      const alpha = Math.floor((80 + 255 * heightFactor) * (0.35 + 0.85 * (heat / BURNING)));

      const p = i * 4;
      data[p]     = r;
      data[p + 1] = g;
      data[p + 2] = b;
      data[p + 3] = clamp(alpha, 0, 255);
    }

    ctx.putImageData(frameBuffer, 0, 0);
  }

  function animate() {
    if (!active) return;
    frame++;
    igniteSource();
    spreadFire();
    spreadFire();
    draw();
    animationId = requestAnimationFrame(animate);
  }

  function start() {
    if (active) return;
    if (!canvas) init();
    canvas.classList.add('active');
    document.body.classList.add('fire-bg-active');
    active = true;
    animate();
  }

  function stop() {
    active = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    if (canvas) {
      canvas.classList.remove('active');
    }
    document.body.classList.remove('fire-bg-active');
  }

  function toggle() {
    if (active) {
      stop();
    } else {
      start();
    }
    return active;
  }

  // Expose globally for activateCheats()
  window.fireBackground = { start: start, stop: stop, toggle: toggle };
})();
