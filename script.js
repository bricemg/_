(function () {
  var cell = document.getElementById('field');
  if (!cell) return;

  var host = cell.querySelector('.play');
  var canvas = host.querySelector('canvas');
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var INK = '#0a0a0a';
  var PAPER = (getComputedStyle(document.documentElement)
    .getPropertyValue('--cell') || '#f0f0f0').trim() || '#f0f0f0';
  var FIELD = 150;
  var PULL = 0.20;
  var DAMP_IDLE = 0.995;
  var DAMP_PULL = 0.985;
  var STEER = 0.012;
  var VMIN = 0.16;
  var VMAX = 0.85;
  var VCAP = 6;
  var EASE = 0.06;
  var WALL = 0.98;
  var BOUNCE = 0.85;

  var w = 0, h = 0, bodies = [], raf = 0, last = 0;
  var pointer = { x: 0, y: 0, on: false };
  var still = window.matchMedia('(prefers-reduced-motion: reduce)');

  function measure() {
    var r = host.getBoundingClientRect();
    w = Math.max(1, Math.round(r.width));
    h = Math.max(1, Math.round(r.height));
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    FIELD = Math.max(110, Math.min(230, (w + h) * 0.5));
  }

  function idealCount() {
    return Math.max(22, Math.min(90, Math.round((w * h) / 1900)));
  }

  function seed() {
    var n = idealCount();
    var big = Math.min(w, h) < 160 ? 6.5 : 8.5;
    bodies = [];
    for (var i = 0; i < n; i++) {
      var rad = 3 + Math.pow(Math.random(), 1.8) * big;
      var sp = VMIN + Math.random() * (VMAX - VMIN);
      var a = Math.random() * Math.PI * 2;
      bodies.push({
        x: rad + Math.random() * Math.max(1, w - rad * 2),
        y: rad + Math.random() * Math.max(1, h - rad * 2),
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        r: rad,
        m: rad * rad
      });
    }
  }

  function step(dt) {
    var pulling = pointer.on;
    var damp = Math.pow(pulling ? DAMP_PULL : DAMP_IDLE, dt);

    for (var i = 0; i < bodies.length; i++) {
      var b = bodies[i];
      if (pulling) {
        var dx = pointer.x - b.x;
        var dy = pointer.y - b.y;
        var d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        if (d < FIELD) {
          var f = PULL * (1 - d / FIELD) * dt;
          b.vx += (dx / d) * f;
          b.vy += (dy / d) * f;
        }
      }

      b.vx += (Math.random() - 0.5) * STEER * dt;
      b.vy += (Math.random() - 0.5) * STEER * dt;
      b.vx *= damp;
      b.vy *= damp;

      var sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      if (sp < 0.0001) {
        b.vx = (Math.random() - 0.5) * VMIN * 2;
        b.vy = (Math.random() - 0.5) * VMIN * 2;
      } else if (pulling) {
        if (sp > VCAP) {
          b.vx *= VCAP / sp;
          b.vy *= VCAP / sp;
        }
      } else {
        var want = sp < VMIN ? VMIN : (sp > VMAX ? VMAX : sp);
        if (want !== sp) {
          var k = 1 + (want / sp - 1) * Math.min(1, EASE * dt);
          b.vx *= k;
          b.vy *= k;
        }
      }

      b.x += b.vx * dt;
      b.y += b.vy * dt;

      if (b.x - b.r < 0) {
        b.x = b.r;
        b.vx = Math.abs(b.vx) * WALL;
      } else if (b.x + b.r > w) {
        b.x = w - b.r;
        b.vx = -Math.abs(b.vx) * WALL;
      }

      if (b.y - b.r < 0) {
        b.y = b.r;
        b.vy = Math.abs(b.vy) * WALL;
      } else if (b.y + b.r > h) {
        b.y = h - b.r;
        b.vy = -Math.abs(b.vy) * WALL;
      }
    }

    for (var j = 0; j < bodies.length; j++) {
      for (var k = j + 1; k < bodies.length; k++) {
        var a = bodies[j];
        var c = bodies[k];
        var ox = c.x - a.x;
        var oy = c.y - a.y;
        var dist = Math.sqrt(ox * ox + oy * oy);
        var min = a.r + c.r;
        if (dist === 0) {
          dist = 0.01;
          ox = 0.01;
          oy = 0;
        }
        if (dist >= min) continue;

        var nx = ox / dist;
        var ny = oy / dist;
        var over = min - dist;
        var tm = a.m + c.m;
        a.x -= nx * over * (c.m / tm);
        a.y -= ny * over * (c.m / tm);
        c.x += nx * over * (a.m / tm);
        c.y += ny * over * (a.m / tm);

        var sep = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
        if (sep >= 0) continue;
        var imp = -(1 + BOUNCE) * sep / (1 / a.m + 1 / c.m);
        a.vx -= (imp / a.m) * nx;
        a.vy -= (imp / a.m) * ny;
        c.vx += (imp / c.m) * nx;
        c.vy += (imp / c.m) * ny;
      }
    }
  }

  function draw() {
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = INK;

    for (var i = 0; i < bodies.length; i++) {
      var b = bodies[i];
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function frame(now) {
    var dt = last ? Math.min((now - last) / 16.667, 2.5) : 1;
    last = now;
    step(dt);
    draw();
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (still.matches) return;
    if (!raf) {
      last = 0;
      raf = requestAnimationFrame(frame);
    }
  }

  function stop() {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }

  function onPointerMove(event) {
    var rect = cell.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.on = true;
  }

  function onPointerLeave() {
    pointer.on = false;
  }

  function init() {
    measure();
    seed();
    draw();

    cell.addEventListener('pointermove', onPointerMove);
    cell.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('resize', function () {
      measure();
      seed();
      draw();
    });

    if (!still.matches) {
      start();
    }
  }

  init();
})();
