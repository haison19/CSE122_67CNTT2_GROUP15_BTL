(() => {
  const PROFILE_KEY = 'fixflow_nguoi_yeu_cau_ho_so_v1';
  const NOTIFICATION_KEY = 'fixflow_nguoi_yeu_cau_thong_bao_v1';

  function readJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value === null ? fallback : value;
    } catch {
      return fallback;
    }
  }

  function syncSharedData() {
    const profile = readJSON(PROFILE_KEY, {});
    const name = String(profile.ten || 'Nguyễn Văn A').trim();
    const initials = name.split(/\s+/).filter(Boolean).map(part => part[0]).slice(-2).join('').toUpperCase();
    document.querySelectorAll('.sidebar-footer strong, .ten-nguoi-dung').forEach(element => {
      element.textContent = name;
    });
    document.querySelectorAll('.sidebar-avatar, .anh-dai-dien').forEach(element => {
      element.textContent = initials;
    });

    const notifications = readJSON(NOTIFICATION_KEY, []);
    const unread = Array.isArray(notifications) ? notifications.filter(item => item && !item.daDoc).length : 0;
    document.querySelectorAll('#unreadNavCount').forEach(element => {
      element.textContent = unread;
      element.hidden = unread === 0;
    });
  }

  syncSharedData();
  window.addEventListener('storage', syncSharedData);
})();
