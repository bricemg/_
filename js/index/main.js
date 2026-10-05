(function () {
  // Main site renderer
  const { getContent } = window.storageUtils;
  const { buildPageHTML } = window.templates;
  const { CanvasAnimation } = window;

  function render() {
    const content = getContent();
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = buildPageHTML(content);
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
