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
  const milestones = [...timeline.querySelectorAll('.step-dot')];
  const thresholds = [0.10, 0.28, 0.46, 0.68, 0.86];
  const cornerClasses = ['dot-top-left', 'dot-top-right', 'dot-bottom-left', 'dot-bottom-right'];
  let revealStops = [...thresholds];
  let ticking = false;

  const getVisiblePath = () => progressPaths.find((path) => {
    return getComputedStyle(path.closest('svg')).display !== 'none';
  });

  const syncDotsWithRiver = () => {
    const width = window.innerWidth;
    const corners = width < 768
      ? ['dot-top-left', 'dot-top-right', 'dot-top-right', 'dot-top-left', 'dot-bottom-left']
      : width < 1024
        ? ['dot-bottom-right', 'dot-top-right', 'dot-bottom-right', 'dot-bottom-left', 'dot-bottom-left']
        : ['dot-bottom-right', 'dot-bottom-right', 'dot-bottom-right', 'dot-bottom-left', 'dot-bottom-right'];

    milestones.forEach((dot, index) => {
      dot.classList.remove(...cornerClasses);
      dot.classList.add(corners[index]);
    });

    const path = getVisiblePath();
    if (!path) return;
    const timelineRect = timeline.getBoundingClientRect();
    const viewBox = path.closest('svg').viewBox.baseVal;
    const pathLength = path.getTotalLength();
    let previousStop = 0;

    revealStops = milestones.map((dot, index) => {
      if (index === milestones.length - 1) return 1;
      const dotRect = dot.getBoundingClientRect();
      const dotX = dotRect.left + dotRect.width / 2 - timelineRect.left;
      const dotY = dotRect.top + dotRect.height / 2 - timelineRect.top;
      let nearestStop = previousStop;
      let nearestDistance = Infinity;

      for (let sample = 0; sample <= 600; sample += 1) {
        const fraction = sample / 600;
        if (fraction <= previousStop + 0.015) continue;
        const point = path.getPointAtLength(pathLength * fraction);
        const x = point.x / viewBox.width * timelineRect.width;
        const y = point.y / viewBox.height * timelineRect.height;
        const distance = Math.hypot(x - dotX, y - dotY);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestStop = fraction;
        }
      }

      previousStop = nearestStop;
      return nearestStop;
    });

    if (width >= 1024) {
      revealStops[3] = 0.8;
    }
  };

  const updateTimeline = () => {
    const viewportHeight = window.innerHeight;
    const activationLine = viewportHeight * 0.68;
    let activeIndex = -1;
    milestones.forEach((milestone, index) => {
      const dot = milestone.getBoundingClientRect();
      if (dot.top + dot.height / 2 <= activationLine) activeIndex = index;
    });
    // Khi tới mốc cuối, reveal toàn bộ ảnh thay vì dừng tại 86% path.
    const progress = activeIndex === thresholds.length - 1
      ? 1
      : activeIndex >= 0
        ? revealStops[activeIndex]
        : 0;

    timeline.style.setProperty('--timeline-progress', `${progress * 100}%`);
    timeline.dataset.activeStep = String(activeIndex + 1);
    progressPaths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length} ${length}`;
      path.style.strokeDashoffset = String(length * (1 - progress));
    });
    steps.forEach((step, index) => {
      const active = index <= activeIndex;
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

  syncDotsWithRiver();
  updateTimeline();
  window.addEventListener('scroll', requestTimelineUpdate, { passive: true });
  window.addEventListener('resize', () => {
    syncDotsWithRiver();
    requestTimelineUpdate();
  });
}
