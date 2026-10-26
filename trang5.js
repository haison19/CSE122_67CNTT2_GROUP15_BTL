const profileTabs = [...document.querySelectorAll('.profile-tab')];
const profilePanels = [...document.querySelectorAll('[data-panel]')];

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

const PROFILE_STORAGE_KEY = 'fixflow_nguoi_yeu_cau_ho_so_v1';
const detailsForm = document.getElementById('detailsPanel');

function readSavedProfile() {
  try {
    const profile = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || 'null');
    return profile && typeof profile === 'object' ? profile : {};
  } catch {
    return {};
  }
}

function renderProfile(profile) {
  const name = String(profile.ten || detailsForm.elements.name.value).trim();
  const email = String(profile.email || detailsForm.elements.email.value).trim();
  const department = String(profile.department || detailsForm.elements.department.value).trim();
  document.getElementById('profileDisplayName').textContent = name;
  document.getElementById('profileDisplayDepartment').textContent = department;
  document.getElementById('profileDisplayEmail').textContent = email;
  document.getElementById('profileAvatar').textContent = name.split(/\s+/).filter(Boolean).map(part => part[0]).slice(-2).join('').toUpperCase();
}

const savedProfile = readSavedProfile();
if (savedProfile.ten) detailsForm.elements.name.value = savedProfile.ten;
if (savedProfile.email) detailsForm.elements.email.value = savedProfile.email;
if (savedProfile.department) detailsForm.elements.department.value = savedProfile.department;
if (savedProfile.phone) detailsForm.elements.phone.value = savedProfile.phone;
renderProfile(savedProfile);

detailsForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const profile = {
    ...readSavedProfile(),
    ten: String(data.get('name')).trim(),
    email: String(data.get('email')).trim(),
    phone: String(data.get('phone')).trim(),
    department: String(data.get('department')).trim()
  };
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    renderProfile(profile);
    document.getElementById('profileFeedback').textContent = 'Thông tin hồ sơ đã được lưu và đồng bộ.';
  } catch {
    document.getElementById('profileFeedback').textContent = 'Không thể lưu hồ sơ trong bộ nhớ trình duyệt.';
  }
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
