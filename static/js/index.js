// FunBCS project page: result tabs, and play videos only while they are on screen.
document.addEventListener('DOMContentLoaded', () => {
  // PDE tabs: show one panel, restart its video, pause the others
  const tabs = document.querySelectorAll('.pde-tab');
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    document.querySelectorAll('.pde-panel').forEach(p => {
      p.classList.remove('active');
      const v = p.querySelector('video');
      if (v) v.pause();
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const panel = document.getElementById(tab.dataset.target);
    panel.classList.add('active', 'switched');
    const v = panel.querySelector('video');
    if (v) {
      if (v.preload === 'none') { v.preload = 'auto'; v.load(); }
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  }));

  // autoplaying videos: pause off screen, resume on screen (saves CPU on long pages)
  const vis = new IntersectionObserver(entries => entries.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) {
      if (!v.closest('.pde-panel') || v.closest('.pde-panel.active')) v.play().catch(() => {});
    } else {
      v.pause();
    }
  }), { threshold: 0.2 });
  document.querySelectorAll('video[autoplay], .pde-panel video').forEach(v => vis.observe(v));
});
