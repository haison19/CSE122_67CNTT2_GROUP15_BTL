export function initSla({ loadData, saveData, recordActivity }) {
  const fields = [...document.querySelectorAll('[data-sla-field]')];
  const notifications = document.getElementById('slaNotifications');
  const savedSla = loadData('sla', {
    values: fields.map(field => Number(field.value)),
    notifications: notifications.checked
  });
  fields.forEach((field, index) => {
    field.value = savedSla.values[index] ?? field.value;
  });
  notifications.checked = savedSla.notifications;

  document.getElementById('saveSla').addEventListener('click', () => {
    const feedback = document.getElementById('slaFeedback');
    const invalid = fields.find(input =>
      !input.value || Number(input.value) < 1 || !Number.isInteger(Number(input.value)));
    if (invalid) {
      invalid.focus();
      invalid.setCustomValidity('Nhập số nguyên lớn hơn 0.');
      invalid.reportValidity();
      invalid.addEventListener('input', () => invalid.setCustomValidity(''), { once: true });
      feedback.textContent = 'Vui lòng nhập thời gian hợp lệ cho tất cả các mức độ ưu tiên.';
      feedback.style.color = '#c43e4c';
      return;
    }
    saveData('sla', {
      values: fields.map(field => Number(field.value)),
      notifications: notifications.checked
    });
    recordActivity('Đã cập nhật cấu hình SLA', 'Các thời hạn xử lý đã được lưu.');
    feedback.textContent =
      `Đã lưu cấu hình SLA lúc ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}.`;
    feedback.style.color = '';
  });
}
