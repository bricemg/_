// Canvas animation controller

class CanvasAnimation {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) throw new Error('Canvas context not available');

    // Physics constants
    this.PULL = 0.20;
    this.DAMP_IDLE = 0.995;
    this.DAMP_PULL = 0.985;
    this.STEER = 0.012;
    this.VMIN = 0.16;
    this.VMAX = 0.85;
    this.VCAP = 6;
    this.EASE = 0.06;
    this.WALL = 0.98;
    this.BOUNCE = 0.85;

    // State
    this.w = 0;
    this.h = 0;
    this.bodies = [];
    this.raf = 0;
    this.last = 0;
    this.pointer = { x: 0, y: 0, on: false };
    this.FIELD = 150;

    this.INK = '#0a0a0a';
    this.PAPER = (getComputedStyle(document.documentElement)
      .getPropertyValue('--cell') || '#f0f0f0').trim() || '#f0f0f0';

    this.still = window.matchMedia('(prefers-reduced-motion: reduce)');
  }

  measure() {
    const r = this.canvas.parentElement.getBoundingClientRect();
    this.w = Math.max(1, Math.round(r.width));
    this.h = Math.max(1, Math.round(r.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.w * dpr);
    this.canvas.height = Math.round(this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.FIELD = Math.max(110, Math.min(230, (this.w + this.h) * 0.5));
  }

  idealCount() {
    return Math.max(22, Math.min(90, Math.round((this.w * this.h) / 1900)));
  }

  seed() {
    const n = this.idealCount();
    const big = Math.min(this.w, this.h) < 160 ? 6.5 : 8.5;
    this.bodies = [];
    for (let i = 0; i < n; i++) {
      const rad = 3 + Math.pow(Math.random(), 1.8) * big;
      const sp = this.VMIN + Math.random() * (this.VMAX - this.VMIN);
      const a = Math.random() * Math.PI * 2;
      this.bodies.push({
        x: rad + Math.random() * Math.max(1, this.w - rad * 2),
        y: rad + Math.random() * Math.max(1, this.h - rad * 2),
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        r: rad,
        m: rad * rad
      });
    }
  }

  step(dt) {
    const pulling = this.pointer.on;
    const damp = Math.pow(pulling ? this.DAMP_PULL : this.DAMP_IDLE, dt);

    for (let i = 0; i < this.bodies.length; i++) {
      const b = this.bodies[i];
      if (pulling) {
        const dx = this.pointer.x - b.x;
        const dy = this.pointer.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        if (d < this.FIELD) {
          const f = this.PULL * (1 - d / this.FIELD) * dt;
          b.vx += (dx / d) * f;
          b.vy += (dy / d) * f;
        }
      }

      b.vx += (Math.random() - 0.5) * this.STEER * dt;
      b.vy += (Math.random() - 0.5) * this.STEER * dt;
      b.vx *= damp;
      b.vy *= damp;

      const sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      if (sp < 0.0001) {
        b.vx = (Math.random() - 0.5) * this.VMIN * 2;
        b.vy = (Math.random() - 0.5) * this.VMIN * 2;
      } else if (pulling) {
        if (sp > this.VCAP) {
          b.vx *= this.VCAP / sp;
          b.vy *= this.VCAP / sp;
        }
      } else {
        const want = sp < this.VMIN ? this.VMIN : (sp > this.VMAX ? this.VMAX : sp);
        if (want !== sp) {
          const k = 1 + (want / sp - 1) * Math.min(1, this.EASE * dt);
          b.vx *= k;
          b.vy *= k;
        }
      }

      b.x += b.vx * dt;
      b.y += b.vy * dt;

      if (b.x - b.r < 0) {
        b.x = b.r;
        b.vx = Math.abs(b.vx) * this.WALL;
      } else if (b.x + b.r > this.w) {
        b.x = this.w - b.r;
        b.vx = -Math.abs(b.vx) * this.WALL;
      }

      if (b.y - b.r < 0) {
        b.y = b.r;
        b.vy = Math.abs(b.vy) * this.WALL;
      } else if (b.y + b.r > this.h) {
        b.y = this.h - b.r;
        b.vy = -Math.abs(b.vy) * this.WALL;
      }
    }

    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        this.collide(this.bodies[i], this.bodies[j]);
      }
    }
  }

  collide(a, c) {
    let ox = c.x - a.x;
    let oy = c.y - a.y;
    let dist = Math.sqrt(ox * ox + oy * oy);
    const min = a.r + c.r;
    if (dist === 0) {
      dist = 0.01;
      ox = 0.01;
      oy = 0;
    }
    if (dist >= min) return;

    const nx = ox / dist;
    const ny = oy / dist;
    const over = min - dist;
    const tm = a.m + c.m;
    a.x -= nx * over * (c.m / tm);
    a.y -= ny * over * (c.m / tm);
    c.x += nx * over * (a.m / tm);
    c.y += ny * over * (a.m / tm);

    const sep = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny;
    if (sep >= 0) return;
    const imp = -(1 + this.BOUNCE) * sep / (1 / a.m + 1 / c.m);
    a.vx -= (imp / a.m) * nx;
    a.vy -= (imp / a.m) * ny;
    c.vx += (imp / c.m) * nx;
    c.vy += (imp / c.m) * ny;
  }

  draw() {
    this.ctx.fillStyle = this.PAPER;
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.ctx.fillStyle = this.INK;

    for (let i = 0; i < this.bodies.length; i++) {
      const b = this.bodies[i];
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  frame = (now) => {
    const dt = this.last ? Math.min((now - this.last) / 16.667, 2.5) : 1;
    this.last = now;
    this.step(dt);
    this.draw();
    this.raf = requestAnimationFrame(this.frame);
  };

  start() {
    if (this.still.matches) return;
    if (!this.raf) {
      this.last = 0;
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  stop() {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  }

  init(element) {
    this.measure();
    this.seed();
    this.draw();

    element.addEventListener('pointermove', (e) => {
      const rect = element.getBoundingClientRect();
      this.pointer.x = e.clientX - rect.left;
      this.pointer.y = e.clientY - rect.top;
      this.pointer.on = true;
    });

    element.addEventListener('pointerleave', () => {
      this.pointer.on = false;
    });

    window.addEventListener('resize', () => {
      this.measure();
      this.seed();
      this.draw();
    });

    if (!this.still.matches) this.start();
  }
}

window.CanvasAnimation = CanvasAnimation;
