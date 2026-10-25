const notifications = [
  { id: 1, type: 'ticket', icon: '✓', title: 'Ticket của bạn đã được tiếp nhận', body: 'Ticket TK-2025-001 đã được chuyển đến nhóm kỹ thuật viên.', time: '5 phút trước', unread: true },
  { id: 2, type: 'ticket', icon: '↻', title: 'Ticket đang được xử lý', body: 'Minh Hoàng đã bắt đầu xử lý Ticket TK-2025-001.', time: '30 phút trước', unread: true },
  { id: 3, type: 'ticket', icon: '✉', title: 'Có phản hồi mới trong Ticket', body: 'Kỹ thuật viên đã gửi phản hồi cho Ticket TK-2024-083.', time: '2 giờ trước', unread: true },
  { id: 4, type: 'system', icon: '⚙', title: 'Cập nhật hệ thống', body: 'FixFlow đã được cập nhật để cải thiện trải nghiệm sử dụng.', time: 'Hôm qua, 16:40', unread: false },
  { id: 5, type: 'ticket', icon: '✓', title: 'Ticket đã hoàn tất', body: 'Ticket TK-2024-079 đã được giải quyết thành công.', time: 'Hôm qua, 10:12', unread: false }
];

document.querySelectorAll('.app-navigation a[href="#"]').forEach(link => {
  link.addEventListener('click', event => event.preventDefault());
});

const readNotificationIds = new Set(
  JSON.parse(localStorage.getItem('fixflow.readNotifications') || '[]')
);
notifications.forEach(item => {
  if (readNotificationIds.has(item.id)) item.unread = false;
});

let activeFilter = 'all';
const list = document.getElementById('notificationList');
const typeFilter = document.getElementById('typeFilter');

function saveReadNotifications() {
  const readIds = notifications.filter(item => !item.unread).map(item => item.id);
  localStorage.setItem('fixflow.readNotifications', JSON.stringify(readIds));
}

function renderNotifications() {
  const queryType = typeFilter.value;
  list.innerHTML = notifications.map(item => `
    <article class="notification-item ${item.unread ? 'unread' : ''}" data-id="${item.id}" data-type="${item.type}" ${activeFilter === 'unread' && !item.unread || queryType !== 'all' && item.type !== queryType ? 'hidden' : ''}>
      <span class="notification-icon ${item.type === 'system' ? 'system' : ''}" aria-hidden="true">${item.icon}</span>
      <div><h2>${item.title}</h2><p>${item.body}</p><time>${item.time}</time></div>
      <span class="notification-indicator" aria-label="${item.unread ? 'Chưa đọc' : 'Đã đọc'}"></span>
    </article>`).join('');
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
  const itemElement = event.target.closest('.notification-item');
  if (!itemElement) return;
  const item = notifications.find(notification => notification.id === Number(itemElement.dataset.id));
  if (!item) return;
  item.unread = false;
  saveReadNotifications();
  renderNotifications();
});

renderNotifications();
