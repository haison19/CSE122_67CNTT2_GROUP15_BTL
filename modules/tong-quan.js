export function renderOverview({ loadData, defaults }) {
  const overview = document.querySelector('.man-hinh-trang25 .tong-quan-man-hinh');
  if (!overview) return;
  const devices = loadData('devices');
  const categories = loadData('categories');
  const users = loadData('users');
  const totals = {
    users: users.length,
    devices: devices.length,
    categories: categories.filter(category => category.status === 'active').length
  };
  overview.querySelectorAll('[data-overview-total]').forEach(element => {
    element.textContent = totals[element.dataset.overviewTotal];
  });
  const ticketCard = overview.querySelector('.the-thong-ke-tong-quan:last-child');
  ticketCard.querySelector('strong').textContent = defaults.ticketThisMonth;
  ticketCard.querySelector('small').textContent = `↗ ${defaults.ticketGrowth}% so với tháng trước`;
  const roleCounts = users.reduce((counts, user) => {
    counts[user.role] = (counts[user.role] || 0) + 1;
    return counts;
  }, {});
  const maxRoleCount = Math.max(1, ...Object.values(roleCounts));
  overview.querySelectorAll('[data-overview-role]').forEach(row => {
    const count = roleCounts[row.dataset.overviewRole] || 0;
    row.querySelector('strong').textContent = count;
    row.querySelector('.vai-tro-duong i').style.width = `${count / maxRoleCount * 100}%`;
  });
  const deviceCounts = devices.reduce((counts, device) => {
    counts[device.status] = (counts[device.status] || 0) + 1;
    return counts;
  }, {});
  overview.querySelectorAll('[data-overview-device-status]').forEach(element => {
    element.textContent = deviceCounts[element.dataset.overviewDeviceStatus] || 0;
  });
  const activePercent = devices.length ? (deviceCounts['Hoạt động'] || 0) / devices.length * 100 : 0;
  const maintenancePercent = devices.length ? (deviceCounts['Bảo trì'] || 0) / devices.length * 100 : 0;
  const donut = overview.querySelector('.thiet-bi-bieu-do-vong');
  donut.style.background = `conic-gradient(#18a65e 0 ${activePercent}%, #f2a331 ${activePercent}% ${activePercent + maintenancePercent}%, #dce4ef ${activePercent + maintenancePercent}% 100%)`;
  donut.querySelector('strong').textContent = devices.length;
  renderActivityFeed(overview.querySelector('.hoat-dong-bang-tin'), loadData('activities', []));
}

function renderActivityFeed(feed, activities) {
  feed.replaceChildren();
  if (!activities.length) {
    const empty = document.createElement('p');
    empty.className = 'hoat-dong-trong';
    empty.textContent = 'Chưa có hoạt động gần đây.';
    feed.appendChild(empty);
    return;
  }
  activities.slice(0, 5).forEach(activity => {
    const entry = document.createElement('div');
    entry.className = 'hoat-dong-muc';
    const icon = document.createElement('span');
    icon.className = 'hoat-dong-bieu-tuong hoat-dong-nguoi-dung';
    icon.textContent = '↻';
    const content = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = activity.title;
    const detail = document.createElement('small');
    detail.textContent = activity.detail;
    content.append(title, detail);
    const time = document.createElement('time');
    const minutes = Math.floor((Date.now() - activity.timestamp) / 60000);
    time.textContent = minutes < 1 ? 'Vừa xong' : minutes < 60 ? `${minutes} phút trước` :
      minutes < 1440 ? `${Math.floor(minutes / 60)} giờ trước` : `${Math.floor(minutes / 1440)} ngày trước`;
    entry.append(icon, content, time);
    feed.appendChild(entry);
  });
}

export function initOverview({ navigate }) {
  const destinations = { user: 'trang28', device: 'trang26', category: 'trang27', sla: 'trang29' };
  document.querySelectorAll('[data-shortcut]').forEach(button => {
    button.addEventListener('click', () => {
      const page = destinations[button.dataset.shortcut];
      if (page) navigate(page);
    });
  });
}
