const NOTIFICATION_STORAGE_KEY = 'fixflow_nguoi_yeu_cau_thong_bao_v1';

function readStoredNotifications() {
  try {
    const items = JSON.parse(localStorage.getItem(NOTIFICATION_STORAGE_KEY) || '[]');
    return Array.isArray(items) ? items.filter(item => item && typeof item === 'object') : [];
  } catch {
    return [];
  }
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function formatNotificationTime(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Vừa cập nhật' : date.toLocaleString('vi-VN');
}

const storedNotifications = readStoredNotifications();
const notifications = storedNotifications.map((record, index) => {
  const isSystem = /hệ thống|cập nhật hệ thống/i.test(record.noiDung || '');
  return {
    id: index,
    type: isSystem ? 'system' : 'ticket',
    icon: isSystem ? '⚙' : '✓',
    title: record.noiDung || 'Cập nhật ticket',
    body: record.ticketId ? 'Ticket ' + record.ticketId : (record.moTa || ''),
    time: formatNotificationTime(record.thoiGian),
    unread: !record.daDoc
  };
});

let activeFilter = 'all';
const list = document.getElementById('notificationList');
const typeFilter = document.getElementById('typeFilter');

function saveReadNotifications() {
  notifications.forEach(item => {
    storedNotifications[item.id].daDoc = !item.unread;
  });
  localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(storedNotifications));
}

function renderNotifications() {
  const queryType = typeFilter.value;
  list.innerHTML = notifications.map(item => {
    const hidden = activeFilter === 'unread' && !item.unread || queryType !== 'all' && item.type !== queryType;
    return '<article class="notification-item ' + (item.unread ? 'unread' : '') + '" data-id="' + item.id + '" data-type="' + item.type + '"' + (hidden ? ' hidden' : '') + '>' +
      '<span class="notification-icon ' + (item.type === 'system' ? 'system' : '') + '" aria-hidden="true">' + item.icon + '</span>' +
      '<div><h2>' + escapeHTML(item.title) + '</h2>' + (item.body ? '<p>' + escapeHTML(item.body) + '</p>' : '') + '<time>' + escapeHTML(item.time) + '</time></div>' +
      '<span class="notification-indicator" aria-label="' + (item.unread ? 'Chưa đọc' : 'Đã đọc') + '"></span></article>';
  }).join('');
  const unread = notifications.filter(item => item.unread).length;
  document.getElementById('unreadCount').textContent = unread;
  document.getElementById('filterUnreadCount').textContent = unread;
  document.getElementById('allCount').textContent = notifications.length;
  const navCount = document.getElementById('unreadNavCount');
  navCount.textContent = unread;
  navCount.hidden = unread === 0;
  const visibleItems = [...list.children].some(item => !item.hidden);
  document.getElementById('notificationEmpty').hidden = visibleItems;
}

document.querySelectorAll('.notification-filter').forEach(button => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll('.notification-filter').forEach(filter => {
      const selected = filter === button;
      filter.classList.toggle('active', selected);
      filter.setAttribute('aria-selected', String(selected));
    });
    renderNotifications();
  });
});

typeFilter.addEventListener('change', renderNotifications);
document.getElementById('markAllRead').addEventListener('click', () => {
  notifications.forEach(item => { item.unread = false; });
  saveReadNotifications();
  renderNotifications();
});
list.addEventListener('click', event => {
  const element = event.target.closest('.notification-item');
  if (!element) return;
  const item = notifications.find(notification => notification.id === Number(element.dataset.id));
  if (!item) return;
  item.unread = false;
  saveReadNotifications();
  renderNotifications();
});

renderNotifications();
