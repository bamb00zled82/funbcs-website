// FunBCS project page: result tabs, scroll fade-in, and play videos only while they are on screen.
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
    panel.classList.add('active');
    const v = panel.querySelector('video');
    if (v) {
      if (v.preload === 'none') { v.preload = 'auto'; v.load(); }
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  }));

  // ?static (screenshots) or reduced motion: show everything at once
  if (new URLSearchParams(location.search).has('static') || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible', 'no-anim'));
  }

  // fade sections in as they scroll into view
  const fade = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); fade.unobserve(e.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.fade-in').forEach(el => fade.observe(el));

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
