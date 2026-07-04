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

document.querySelector('.newsletter form').addEventListener('submit', (event) => {
  event.preventDefault();
  event.currentTarget.reset();
});
