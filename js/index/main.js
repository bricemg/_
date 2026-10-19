(function () {
  // Main site renderer
  const { getContent } = window.storageUtils;
  const { buildPageHTML } = window.templates;
  const { CanvasAnimation } = window;

  function applyTheme(content) {
    const theme = content.site.theme || {};
    const root = document.documentElement.style;
    if (theme.bg) root.setProperty('--bg', theme.bg);
    if (theme.cell) root.setProperty('--cell', theme.cell);
    if (theme.ink) root.setProperty('--ink', theme.ink);
    if (theme.accent) root.setProperty('--red', theme.accent);
    if (typeof theme.radius !== 'undefined') root.setProperty('--r', theme.radius + 'px');
    if (typeof theme.gap !== 'undefined') root.setProperty('--gap', theme.gap + 'px');
    if (theme.titleSize) root.setProperty('--title-size', theme.titleSize + 'px');
    if (theme.textSize) root.setProperty('--text-size', theme.textSize + 'px');

    // Add layout attribute to sheet after render
    const sheet = document.querySelector('.sheet');
    if (sheet && theme.layout) sheet.setAttribute('data-layout', theme.layout);
  }

  function render() {
    const content = getContent();
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = buildPageHTML(content);
    applyTheme(content);
  }

  function initAnimation() {
    const field = document.getElementById('field');
    if (!field) return;

    const canvas = field.querySelector('canvas');
    if (!canvas) return;

    try {
      const animation = new CanvasAnimation(canvas);
      animation.init(field);
    } catch (error) {
      console.error('Animation init error:', error);
    }
  }

  // Initialize
  render();
  requestAnimationFrame(() => {
    initAnimation();
  });
})();
