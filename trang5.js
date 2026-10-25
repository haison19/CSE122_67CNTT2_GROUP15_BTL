const profileTabs = [...document.querySelectorAll('.profile-tab')];
const profilePanels = [...document.querySelectorAll('[data-panel]')];

document.querySelectorAll('.app-navigation a[href="#"]').forEach(link => {
  link.addEventListener('click', event => event.preventDefault());
});

function showProfileTab(name) {
  profileTabs.forEach(tab => {
    const selected = tab.dataset.tab === name;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });
  profilePanels.forEach(panel => {
    panel.hidden = panel.dataset.panel !== name;
  });
}

profileTabs.forEach(tab => tab.addEventListener('click', () => showProfileTab(tab.dataset.tab)));
document.querySelector('[data-open-activity]').addEventListener('click', event => {
  event.preventDefault();
  showProfileTab('activity');
});

document.getElementById('detailsPanel').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = String(data.get('name')).trim();
  const department = String(data.get('department')).trim();
  document.getElementById('profileDisplayName').textContent = name;
  document.getElementById('profileDisplayDepartment').textContent = department;
  document.getElementById('profileDisplayEmail').textContent = String(data.get('email')).trim();
  document.getElementById('profileAvatar').textContent = name.split(/\s+/).map(part => part[0]).slice(-2).join('').toUpperCase();
  document.getElementById('profileFeedback').textContent = 'Thông tin hồ sơ đã được cập nhật.';
});

document.getElementById('passwordPanel').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const feedback = document.getElementById('passwordFeedback');
  if (form.elements.newPassword.value !== form.elements.confirmPassword.value) {
    form.elements.confirmPassword.setCustomValidity('Mật khẩu nhập lại không khớp.');
    form.elements.confirmPassword.reportValidity();
    form.elements.confirmPassword.addEventListener('input', () => form.elements.confirmPassword.setCustomValidity(''), { once: true });
    return;
  }
  feedback.textContent = 'Mật khẩu đã được cập nhật.';
  form.reset();
});

document.getElementById('avatarUpload').addEventListener('change', event => {
  const file = event.currentTarget.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    event.currentTarget.value = '';
    return;
  }
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    const avatar = document.getElementById('profileAvatar');
    avatar.replaceChildren(Object.assign(document.createElement('img'), { src: reader.result, alt: 'Ảnh đại diện Nguyễn Văn A' }));
  });
  reader.readAsDataURL(file);
});
