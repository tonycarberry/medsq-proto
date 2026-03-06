/**
 * Feature Band — cursor glyph trail
 *
 * Behaviour:
 *  • Icons spawn at the cursor, scattered slightly, random size + tilt
 *  • They carry a tiny burst of momentum in the cursor's travel direction,
 *    then smoothly decelerate to a stop (settle transition ~0.9s)
 *  • Stay fully opaque for ~2s, then snap-fade out in ~0.5s (ease-in)
 *  • Removed from the DOM once invisible
 */
(function () {
  'use strict';

  var GLYPHS = [
    'assets/glyphs/glyph-01.svg',
    'assets/glyphs/glyph-02.svg',
    'assets/glyphs/glyph-03.svg',
    'assets/glyphs/glyph-04.svg',
    'assets/glyphs/glyph-05.svg',
    'assets/glyphs/glyph-06.svg',
    'assets/glyphs/glyph-07.svg',
    'assets/glyphs/glyph-08.svg',
    'assets/glyphs/glyph-09.svg',
    'assets/glyphs/glyph-10.svg',
    'assets/glyphs/glyph-11.svg',
    'assets/glyphs/glyph-12.svg',
  ];

  // Brand colours (MSQ vibrant palette only)
  var BRAND_COLORS = [
    '#75D8FF', /* MSQ Blue */
    '#64D187', /* MSQ Green */
    '#F2FA7D', /* MSQ Yellow */
    '#9D78FE', /* MSQ Purple */
    '#FEA5E5', /* MSQ Pink */
    '#FEB236', /* MSQ Orange */
  ];

  // Pre-load so first hover is instant
  GLYPHS.forEach(function (src) {
    var img = new Image();
    img.src = src;
  });

  var section = document.querySelector('.feature-band');
  if (!section) return;

  // ── Tuning ────────────────────────────────────────────────────────────────
  var SPAWN_INTERVAL  = 70;    // ms between spawns (more icons on screen for organic feel)
  var SIZE_MIN        = 52;
  var SIZE_MAX        = 100;
  var SCATTER         = 44;    // ± px random offset from cursor centre
  var TILT_MAX        = 22;    // ± degrees random rotation

  // Momentum: drift distance = velocity × scale (clamped). Faster cursor = further travel.
  var DRIFT_SCALE     = 1.8;   // multiplier on velocity → pixels drifted
  var DRIFT_CAP       = 200;   // max drift distance (longer life = further travel at steady pace)

  // Long lifespan: steady linear motion, scale 100%→70% over full life
  var FADE_MS         = 400;   // ms for fade-out at end
  var TOTAL_LIFE      = 4200;  // longer life so many icons drift slowly at once
  var HOLD_MS         = TOTAL_LIFE - FADE_MS - 80;  // hold opacity until fade begins

  // ── State ─────────────────────────────────────────────────────────────────
  var lastSpawn = 0;
  var lastGlyph = -1;
  var lastColor = -1;

  // Smoothed cursor velocity (pixels per ~16ms frame equivalent)
  var vel = { x: 0, y: 0 };
  var lastMove = { x: 0, y: 0, t: 0 };

  // ── Helpers ───────────────────────────────────────────────────────────────
  function pickGlyph() {
    var idx;
    do { idx = Math.floor(Math.random() * GLYPHS.length); }
    while (idx === lastGlyph);
    lastGlyph = idx;
    return GLYPHS[idx];
  }

  function pickBrandColor() {
    var idx;
    do { idx = Math.floor(Math.random() * BRAND_COLORS.length); }
    while (idx === lastColor);
    lastColor = idx;
    return BRAND_COLORS[idx];
  }

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  // ── Spawn ─────────────────────────────────────────────────────────────────
  function spawnGlyph(x, y, vx, vy) {
    var glyphSrc = pickGlyph();
    var color    = pickBrandColor();
    var el       = document.createElement('div');
    el.setAttribute('aria-hidden', 'true');

    var size    = SIZE_MIN + Math.random() * (SIZE_MAX - SIZE_MIN);
    var offsetX = (Math.random() - 0.5) * SCATTER * 2;
    var offsetY = (Math.random() - 0.5) * SCATTER * 2;
    var tilt    = (Math.random() - 0.5) * TILT_MAX * 2;

    // Initial drift offset — in the direction the cursor is moving
    var driftX  = clamp(vx * DRIFT_SCALE, -DRIFT_CAP, DRIFT_CAP);
    var driftY  = clamp(vy * DRIFT_SCALE, -DRIFT_CAP, DRIFT_CAP);

    var left = x + offsetX - size / 2;
    var top  = y + offsetY - size / 2;

    // Use mask so the glyph SVG shapes the div; background-color provides the brand colour
    var maskUrl = 'url(' + glyphSrc + ')';
    // Start at the drift offset; will transition back to translate(0,0)
    el.style.cssText = [
      'position:absolute',
      'pointer-events:none',
      'z-index:20',
      'width:'     + size + 'px',
      'height:'    + size + 'px',
      'left:'      + left + 'px',
      'top:'       + top  + 'px',
      'background-color:' + color,
      'mask-image:' + maskUrl,
      'mask-size:contain',
      'mask-repeat:no-repeat',
      'mask-position:center',
      '-webkit-mask-image:' + maskUrl,
      '-webkit-mask-size:contain',
      '-webkit-mask-repeat:no-repeat',
      '-webkit-mask-position:center',
      'transform-origin:center center',
      // Steady linear motion: scale 100%→70%, drift to full over entire lifespan
      'transform:rotate(' + tilt + 'deg) translate(0px,0px) scale(1)',
      'opacity:1',
      'transition:' +
        'opacity ' + FADE_MS + 'ms ease-in ' + HOLD_MS + 'ms,' +
        'transform ' + TOTAL_LIFE + 'ms linear',
      'will-change:opacity,transform',
    ].join(';');

    section.appendChild(el);

    // Single phase: drift and scale over full lifespan (steady linear motion)
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.style.opacity = '0';
        el.style.transform = 'rotate(' + tilt + 'deg) translate(' + driftX + 'px,' + driftY + 'px) scale(0.7)';
      });
    });

    // Remove once invisible
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, TOTAL_LIFE);
  }

  // ── Mouse tracking ────────────────────────────────────────────────────────
  section.addEventListener('mousemove', function (e) {
    var now  = Date.now();
    var rect = section.getBoundingClientRect();

    // Position within the section's coordinate system.
    // getBoundingClientRect() is already viewport-relative, as are clientX/Y,
    // so the scroll offsets cancel out — this is correct even when scrolled.
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    // Update smoothed velocity
    if (lastMove.t > 0) {
      var dt  = Math.max(now - lastMove.t, 1);
      var rawVx = (x - lastMove.x) / dt * 16;
      var rawVy = (y - lastMove.y) / dt * 16;
      // Exponential smoothing
      vel.x = vel.x * 0.55 + rawVx * 0.45;
      vel.y = vel.y * 0.55 + rawVy * 0.45;
    }
    lastMove = { x: x, y: y, t: now };

    if (now - lastSpawn < SPAWN_INTERVAL) return;
    lastSpawn = now;

    spawnGlyph(x, y, vel.x, vel.y);
  });

})();
