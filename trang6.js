const settingsControls = [...document.querySelectorAll('[data-setting]')];
const languageSetting = document.getElementById('languageSetting');
const settingsFeedback = document.getElementById('settingsFeedback');

document.querySelectorAll('.app-navigation a[href="#"]').forEach(link => {
  link.addEventListener('click', event => event.preventDefault());
});

settingsControls.forEach(control => {
  const saved = localStorage.getItem(`fixflow.setting.${control.dataset.setting}`);
  if (saved !== null) control.checked = saved === 'true';
});
const savedLanguage = localStorage.getItem('fixflow.setting.language');
if (savedLanguage && [...languageSetting.options].some(option => option.value === savedLanguage)) {
  languageSetting.value = savedLanguage;
}

document.getElementById('saveSettings').addEventListener('click', () => {
  settingsControls.forEach(control => {
    localStorage.setItem(`fixflow.setting.${control.dataset.setting}`, String(control.checked));
  });
  localStorage.setItem('fixflow.setting.language', languageSetting.value);
  settingsFeedback.textContent = `Đã lưu cài đặt lúc ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}.`;
});
