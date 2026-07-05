document.querySelectorAll('input[name="name"]').forEach((input) => input.placeholder = 'Họ và tên *');
document.querySelectorAll('input[name="phone"]').forEach((input) => input.placeholder = 'Số điện thoại *');
document.querySelectorAll('input[name="email"]').forEach((input) => input.placeholder = 'Email');
document.querySelectorAll('input[name="company"]').forEach((input) => input.placeholder = 'Doanh nghiệp');
document.querySelectorAll('textarea[name="message"]').forEach((input) => input.placeholder = 'Nhu cầu của bạn');

document.getElementById('consult-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const status = event.currentTarget.querySelector('.form-status');
  status.textContent = 'Cảm ơn bạn! Yêu cầu tư vấn đã được ghi nhận.';
  event.currentTarget.reset();
});

const newsletterForm = document.querySelector('.newsletter form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    event.currentTarget.reset();
  });
}

const timeline = document.querySelector('.process-timeline');

if (timeline) {
  const steps = [...timeline.querySelectorAll('.process-step')];
  const progressPaths = [...timeline.querySelectorAll('.river-reveal-path')];
  const milestones = [...timeline.querySelectorAll('.river-milestones span')];
  const thresholds = [0.10, 0.28, 0.46, 0.68, 0.86];
  let ticking = false;

  const getVisiblePath = () => progressPaths.find((path) => {
    const svg = path.closest('svg');
    return window.getComputedStyle(svg).display !== 'none';
  });

  const positionMilestones = () => {
    const path = getVisiblePath();
    if (!path) return;
    const length = path.getTotalLength();
    const viewBox = path.closest('svg').viewBox.baseVal;
    milestones.forEach((milestone, index) => {
      const point = path.getPointAtLength(length * thresholds[index]);
      milestone.style.left = `${(point.x / viewBox.width) * 100}%`;
      milestone.style.top = `${(point.y / viewBox.height) * 100}%`;
    });
  };

  const updateTimeline = () => {
    const rect = timeline.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const animationDistance = rect.height + viewportHeight * 0.5;
    const travelled = viewportHeight * 0.75 - rect.top;
    const progress = Math.max(0, Math.min(1, travelled / animationDistance));

    timeline.style.setProperty('--timeline-progress', `${progress * 100}%`);
    progressPaths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length} ${length}`;
      path.style.strokeDashoffset = String(length * (1 - progress));
    });
    steps.forEach((step, index) => {
      const active = progress >= thresholds[index];
      step.classList.toggle('active', active);
      step.classList.toggle('is-active', active);
      milestones[index].classList.toggle('active', active);
    });
    ticking = false;
  };

  const requestTimelineUpdate = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateTimeline);
    }
  };

  positionMilestones();
  updateTimeline();
  window.addEventListener('scroll', requestTimelineUpdate, { passive: true });
  window.addEventListener('resize', () => {
    positionMilestones();
    requestTimelineUpdate();
  });
}
