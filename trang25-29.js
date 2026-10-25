function createDefaultDevices() {
  const devices = [
    { id: 'TB-001', name: 'Máy lạnh Daikin 2HP', type: 'Điện lạnh', loc: 'P.101 - Tòa A', status: 'Bảo trì', date: '05/2023', warranty: 'Còn 4 tháng', views: 0 },
    { id: 'TB-002', name: 'Router Cisco AX', type: 'Mạng', loc: 'P.201 - Tòa B', status: 'Hoạt động', date: '03/2023', warranty: 'Hết hạn', views: 1 },
    { id: 'TB-003', name: 'Máy chiếu Epson', type: 'Trình chiếu', loc: 'Hội trường', status: 'Hoạt động', date: '03/2023', warranty: 'Hết hạn', views: 0 },
    { id: 'TB-004', name: 'Máy in HP Laser', type: 'Văn phòng', loc: 'Phòng Giám đốc', status: 'Hoạt động', date: '04/2023', warranty: 'Còn 4 tháng', views: 3 },
    { id: 'TB-005', name: 'Camera Hikvision', type: 'An ninh', loc: 'Sân sau', status: 'Bảo trì', date: '05/2023', warranty: 'Hết hạn', views: 4 },
    { id: 'TB-006', name: 'Máy lạnh Daikin 2HP', type: 'Điện lạnh', loc: 'P.101 - Tòa A', status: 'Bảo trì', date: '07/2023', warranty: 'Hết hạn', views: 5 },
    { id: 'TB-007', name: 'Router Cisco AX', type: 'Mạng', loc: 'P.201 - Tòa B', status: 'Hoạt động', date: '07/2023', warranty: 'Còn 3 tháng', views: 0 },
    { id: 'TB-008', name: 'Máy chiếu Epson', type: 'Trình chiếu', loc: 'Hội trường', status: 'Hoạt động', date: '08/2023', warranty: 'Hết hạn', views: 1 },
    { id: 'TB-009', name: 'Máy in HP Laser', type: 'Văn phòng', loc: 'Phòng Giám đốc', status: 'Bảo trì', date: '01/2023', warranty: 'Hết hạn', views: 2 },
    { id: 'TB-010', name: 'Camera Hikvision', type: 'An ninh', loc: 'Sân sau', status: 'Hoạt động', date: '02/2023', warranty: 'Còn 4 tháng', views: 3 },
    { id: 'TB-011', name: 'Máy lạnh Daikin 2HP', type: 'Điện lạnh', loc: 'P.101 - Tòa A', status: 'Hoạt động', date: '03/2023', warranty: 'Hết hạn', views: 0 }
  ];
  const inventory = [
    { name: 'Máy lạnh Daikin 2HP', type: 'Điện lạnh' }, { name: 'Router Cisco AX', type: 'Mạng' },
    { name: 'Máy chiếu Epson', type: 'Trình chiếu' }, { name: 'Máy in HP Laser', type: 'Văn phòng' },
    { name: 'Camera Hikvision', type: 'An ninh' }, { name: 'Máy tính Dell OptiPlex', type: 'Văn phòng' },
    { name: 'Switch Cisco Catalyst', type: 'Mạng' }, { name: 'Màn hình Samsung', type: 'Văn phòng' },
    { name: 'Bộ lưu điện APC', type: 'Điện lạnh' }, { name: 'Máy quét Canon', type: 'Văn phòng' }
  ];
  const locations = ['P.101 - Tòa A', 'P.201 - Tòa B', 'Hội trường', 'Phòng Giám đốc', 'Sân sau'];
  const statuses = ['Hoạt động', 'Hoạt động', 'Bảo trì', 'Hoạt động', 'Hoạt động', 'Bảo trì', 'Ngừng hoạt động'];
  const warranties = ['Hết hạn', 'Còn 4 tháng', 'Còn 3 tháng', 'Còn bảo hành'];
  for (let id = 12; id <= 89; id += 1) {
    const index = id - 12;
    const item = inventory[index % inventory.length];
    devices.push({
      id: `TB-${String(id).padStart(3, '0')}`,
      name: `${item.name} ${String.fromCharCode(65 + Math.floor(index / inventory.length))}`,
      type: item.type,
      loc: locations[index % locations.length],
      status: statuses[index % statuses.length],
      date: `${String(index % 12 + 1).padStart(2, '0')}/${2022 + index % 5}`,
      warranty: warranties[index % warranties.length],
      views: index % 6
    });
  }
  return devices;
}

const unifiedDefaults = {
  devices: createDefaultDevices(),
  categories: [
    { id: 1, name: 'Mạng & kết nối', code: 'NET', description: 'Sự cố mạng nội bộ, Wi-Fi và đường truyền.', tickets: 12, status: 'active', icon: '⌘', color: '#2563eb', autoClassify: true },
    { id: 2, name: 'Máy tính & phần mềm', code: 'PC', description: 'Lỗi máy trạm, hệ điều hành và phần mềm.', tickets: 8, status: 'active', icon: '▣', color: '#18a65e', autoClassify: true },
    { id: 3, name: 'Máy in & thiết bị văn phòng', code: 'OFFICE', description: 'Máy in, máy scan và thiết bị văn phòng.', tickets: 6, status: 'active', icon: '▣', color: '#f2a331', autoClassify: true },
    { id: 4, name: 'Điện & điều hòa', code: 'ELEC', description: 'Nguồn điện, chiếu sáng và hệ thống điều hòa.', tickets: 4, status: 'active', icon: '⚡', color: '#ef5b5b', autoClassify: true },
    { id: 5, name: 'Tài khoản & phân quyền', code: 'ACCOUNT', description: 'Tài khoản, mật khẩu và quyền truy cập.', tickets: 3, status: 'active', icon: '♙', color: '#8b5cf6', autoClassify: true },
    { id: 6, name: 'Khác', code: 'OTHER', description: 'Các yêu cầu chưa thuộc nhóm danh mục khác.', tickets: 1, status: 'inactive', icon: '◇', color: '#2563eb', autoClassify: false }
  ],
  users: [
    { id: 1, name: 'Ngọc Quỳnh', email: 'quynh.nguyen@fixflow.vn', role: 'Quản trị viên', joined: '12/01/2024', status: 'active', initials: 'NQ' },
    { id: 2, name: 'Minh Hoàng', email: 'hoang.minh@fixflow.vn', role: 'Kỹ thuật viên', joined: '18/02/2024', status: 'active', initials: 'MH' },
    { id: 3, name: 'Thanh Tùng', email: 'tung.thanh@fixflow.vn', role: 'Kỹ thuật viên', joined: '03/03/2024', status: 'active', initials: 'TT' },
    { id: 4, name: 'Hà Phương', email: 'phuong.ha@fixflow.vn', role: 'Nhân viên', joined: '19/03/2024', status: 'active', initials: 'HP' },
    { id: 5, name: 'Quốc Bảo', email: 'bao.quoc@fixflow.vn', role: 'Kỹ thuật viên', joined: '25/04/2024', status: 'active', initials: 'QB' },
    { id: 6, name: 'Linh Chi', email: 'chi.linh@fixflow.vn', role: 'Nhân viên', joined: '08/05/2024', status: 'active', initials: 'LC' },
    { id: 7, name: 'Anh Tuấn', email: 'tuan.anh@fixflow.vn', role: 'Kỹ thuật viên', joined: '16/06/2024', status: 'active', initials: 'AT' },
    { id: 8, name: 'Bảo Ngọc', email: 'ngoc.bao@fixflow.vn', role: 'Nhân viên', joined: '02/07/2024', status: 'inactive', initials: 'BN' }
  ]
};

function loadUnifiedData(name, fallback) {
  const key = `fixflow.unified.${name}`;
  let stored = localStorage.getItem(key);
  if (stored === null) stored = localStorage.getItem(`fixflow.${name}`);
  if (stored === null) {
    const source = fallback === undefined ? unifiedDefaults[name] : fallback;
    const value = JSON.parse(JSON.stringify(source));
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  }
  try {
    const value = JSON.parse(stored);
    if (name === 'devices' && Array.isArray(value) && value.length === 11 &&
        unifiedDefaults.devices.slice(0, 11).every((device, index) => value[index].id === device.id)) {
      value.push(...unifiedDefaults.devices.slice(11));
    }
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  } catch (error) {
    console.error(`Không thể đọc dữ liệu "${name}" đã lưu.`, error);
    throw error;
  }
}

function saveUnifiedData(name, value) {
  localStorage.setItem(`fixflow.unified.${name}`, JSON.stringify(value));
}

function recordUnifiedActivity(title, detail) {
  const activities = loadUnifiedData('activities', []);
  activities.unshift({ title, detail, timestamp: Date.now() });
  saveUnifiedData('activities', activities.slice(0, 10));
}

function renderUnifiedOverview() {
  const overview = document.querySelector('.man-hinh-trang25 .tong-quan-man-hinh');
  if (!overview) return;
  const devices = loadUnifiedData('devices');
  const categories = loadUnifiedData('categories');
  const users = loadUnifiedData('users');
  const totals = {
    users: users.length,
    devices: devices.length,
    categories: categories.filter(category => category.status === 'active').length
  };
  overview.querySelectorAll('[data-overview-total]').forEach(element => {
    element.textContent = totals[element.dataset.overviewTotal];
  });
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
  const feed = overview.querySelector('.hoat-dong-bang-tin');
  feed.replaceChildren();
  const activities = loadUnifiedData('activities', []);
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

function initOverview() {
  const destinations = { user: 'trang28', device: 'trang26', category: 'trang27', sla: 'trang29' };
  renderUnifiedOverview();
  document.querySelectorAll('[data-shortcut]').forEach(button => {
    button.addEventListener('click', () => {
      const page = destinations[button.dataset.shortcut];
      if (!page) return;
      if (document.body.dataset.screen) window.location.href = `${page}.html`;
      else window.location.hash = page;
    });
  });
}

function initCategories() {
  initializeCategories(document.querySelector('.man-hinh-trang27'));
}

function initializeCategories(screen) {
  if (!screen) return;
  const categories = loadUnifiedData('categories');
  const workspace = screen.querySelector('.khu-vuc-danh-muc');
  const tree = screen.querySelector('#categoryTree');
  const search = screen.querySelector('#categorySearch');
  const emptyMessage = screen.querySelector('#categoryEmpty');
  const total = screen.querySelector('#categoryTotal');
  const summary = screen.querySelector('#categoryPageSummary');
  const editorPanel = screen.querySelector('.danh-muc-chinh-sua-bang-dieu-khien');
  const createPanel = screen.querySelector('.danh-muc-tao-bang-dieu-khien');
  const editForm = screen.querySelector('#categoryEditForm');
  const createForm = screen.querySelector('#categoryCreateForm');
  const editParent = screen.querySelector('#editCategoryParent');
  const createParent = createForm.elements.parentId;
  const editFeedback = screen.querySelector('#editCategoryFeedback');
  const createFeedback = screen.querySelector('#createCategoryFeedback');
  const selectedCategoryCount = screen.querySelector('#categoryTicketCount');
  const classifierForm = screen.querySelector('#ticketClassifierForm');
  const classifierMode = screen.querySelector('#categoryAiMode');
  const classifierResult = screen.querySelector('#categoryClassificationResult');
  let selectedId = categories.find(category => category.status === 'active')?.id ?? categories[0]?.id ?? null;

  const getCategory = id => categories.find(category => String(category.id) === String(id));
  const getChildren = id => categories.filter(category => String(category.parentId) === String(id));
  const getDescendantIds = id => {
    const descendants = new Set([String(id)]);
    let changed = true;
    while (changed) {
      changed = false;
      categories.forEach(category => {
        if (descendants.has(String(category.parentId)) && !descendants.has(String(category.id))) {
          descendants.add(String(category.id));
          changed = true;
        }
      });
    }
    return descendants;
  };
  const syncWorkspace = () => {
    workspace.classList.toggle('dang-chinh-sua', !editorPanel.hidden);
    workspace.classList.toggle('dang-tao', !createPanel.hidden);
  };
  const refreshParentOptions = (select, excludedIds) => {
    const previousValue = select.value;
    select.replaceChildren();
    const noParent = document.createElement('option');
    noParent.value = '';
    noParent.textContent = 'Không có';
    select.appendChild(noParent);
    categories.filter(category => !excludedIds?.has(String(category.id))).forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
    });
    if ([...select.options].some(option => option.value === previousValue)) select.value = previousValue;
  };
  const renderTree = () => {
    const query = search.value.trim().toLocaleLowerCase('vi');
    tree.replaceChildren();
    const roots = categories.filter(category => !getCategory(category.parentId));
    let visibleCount = 0;
    roots.forEach(category => {
      const children = getChildren(category.id);
      const matchesRoot = !query || category.name.toLocaleLowerCase('vi').includes(query);
      const matchingChildren = children.filter(child =>
        !query || child.name.toLocaleLowerCase('vi').includes(query) || matchesRoot
      );
      if (!matchesRoot && matchingChildren.length === 0) return;
      visibleCount += 1 + matchingChildren.length;
      const group = document.createElement('div');
      group.className = 'nhom-danh-muc';
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `muc-cay-danh-muc${String(selectedId) === String(category.id) ? ' dang-chon' : ''}`;
      button.dataset.categoryId = category.id;
      const icon = document.createElement('span');
      icon.className = 'bieu-tuong-danh-muc';
      icon.textContent = category.icon || '◇';
      const name = document.createElement('span');
      name.className = 'ten-danh-muc';
      name.textContent = category.name;
      const count = document.createElement('span');
      count.className = 'so-luong-danh-muc';
      count.textContent = category.tickets || 0;
      const arrow = document.createElement('span');
      arrow.className = 'mui-ten-danh-muc';
      arrow.textContent = '⌄';
      button.append(icon, name, count, arrow);
      group.appendChild(button);
      matchingChildren.forEach(child => {
        const childButton = document.createElement('button');
        childButton.type = 'button';
        childButton.className = `muc-con-danh-muc${String(selectedId) === String(child.id) ? ' dang-chon' : ''}`;
        childButton.dataset.categoryId = child.id;
        const childName = document.createElement('span');
        childName.textContent = child.name;
        const childCount = document.createElement('span');
        childCount.textContent = child.tickets || 0;
        childButton.append(childName, childCount);
        group.appendChild(childButton);
      });
      tree.appendChild(group);
    });
    if (query && visibleCount === 0) {
      categories.filter(category => getCategory(category.parentId) && category.name.toLocaleLowerCase('vi').includes(query))
        .forEach(child => {
          visibleCount += 1;
          const childButton = document.createElement('button');
          childButton.type = 'button';
          childButton.className = `muc-con-danh-muc${String(selectedId) === String(child.id) ? ' dang-chon' : ''}`;
          childButton.dataset.categoryId = child.id;
          const childName = document.createElement('span');
          childName.textContent = child.name;
          const childCount = document.createElement('span');
          childCount.textContent = child.tickets || 0;
          childButton.append(childName, childCount);
          tree.appendChild(childButton);
        });
    }
    emptyMessage.hidden = visibleCount > 0;
  };
  const renderEditor = () => {
    const category = getCategory(selectedId);
    if (!category) {
      editorPanel.hidden = true;
      syncWorkspace();
      return;
    }
    editForm.elements.name.value = category.name;
    editForm.elements.description.value = category.description || '';
    editForm.elements.icon.value = category.icon || '◇';
    editForm.elements.color.value = category.color || '#2563eb';
    editForm.elements.autoClassify.checked = category.autoClassify !== false;
    selectedCategoryCount.textContent = category.tickets || 0;
    refreshParentOptions(editParent, getDescendantIds(category.id));
    editParent.value = category.parentId ?? '';
    editFeedback.textContent = '';
    renderTree();
    syncWorkspace();
  };
  const refresh = () => {
    total.textContent = categories.length;
    summary.textContent = `${categories.length} danh mục để phân loại và xử lý ticket nhất quán.`;
    refreshParentOptions(createParent);
    renderEditor();
    classifierMode.textContent = `${categories.filter(category => category.status === 'active' && category.autoClassify !== false).length} danh mục đang bật phân loại tự động.`;
  };
  const persist = (activityTitle, activityDetail) => {
    saveUnifiedData('categories', categories);
    recordUnifiedActivity(activityTitle, activityDetail);
    refresh();
  };

  screen.querySelector('#addCategory').addEventListener('click', () => {
    editorPanel.hidden = true;
    createPanel.hidden = false;
    createForm.reset();
    createFeedback.textContent = '';
    syncWorkspace();
    createForm.elements.name.focus();
  });
  screen.querySelector('#closeCategoryCreate').addEventListener('click', () => {
    createPanel.hidden = true;
    syncWorkspace();
  });
  search.addEventListener('input', renderTree);
  tree.addEventListener('click', event => {
    const button = event.target.closest('[data-category-id]');
    if (!button) return;
    createPanel.hidden = true;
    editorPanel.hidden = false;
    selectedId = button.dataset.categoryId;
    renderEditor();
  });
  editForm.addEventListener('submit', event => {
    event.preventDefault();
    const category = getCategory(selectedId);
    if (!category) return;
    const name = editForm.elements.name.value.trim();
    if (categories.some(item => item.id !== category.id && item.name.toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi'))) {
      editFeedback.textContent = 'Tên danh mục này đã tồn tại.';
      editFeedback.style.color = '#c43e4c';
      return;
    }
    category.name = name;
    category.description = editForm.elements.description.value.trim();
    category.icon = editForm.elements.icon.value;
    category.color = editForm.elements.color.value;
    category.autoClassify = editForm.elements.autoClassify.checked;
    category.parentId = editParent.value ? Number(editParent.value) : null;
    persist(`Đã cập nhật danh mục ${name}`, 'Thông tin danh mục đã được lưu.');
    editFeedback.textContent = 'Đã lưu thay đổi.';
    editorPanel.hidden = true;
    syncWorkspace();
  });
  screen.querySelector('#deleteCategory').addEventListener('click', () => {
    const category = getCategory(selectedId);
    if (!category || !window.confirm(`Xóa danh mục "${category.name}" và các danh mục con?`)) return;
    const removeIds = getDescendantIds(category.id);
    for (let index = categories.length - 1; index >= 0; index -= 1) {
      if (removeIds.has(String(categories[index].id))) categories.splice(index, 1);
    }
    selectedId = categories.find(item => item.status === 'active')?.id ?? categories[0]?.id ?? null;
    persist(`Đã xóa danh mục ${category.name}`, 'Danh mục và các mục con đã được xóa.');
  });
  createForm.addEventListener('submit', event => {
    event.preventDefault();
    const values = new FormData(createForm);
    const name = String(values.get('name')).trim();
    if (categories.some(category => category.name.toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi'))) {
      createFeedback.textContent = 'Tên danh mục này đã tồn tại.';
      createFeedback.style.color = '#c43e4c';
      return;
    }
    const category = {
      id: Math.max(0, ...categories.map(item => Number(item.id) || 0)) + 1,
      name,
      code: name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toUpperCase().slice(0, 12),
      description: String(values.get('description')).trim(),
      tickets: 0,
      status: 'active',
      icon: String(values.get('icon')),
      color: String(values.get('color')),
      autoClassify: true,
      parentId: values.get('parentId') ? Number(values.get('parentId')) : null
    };
    categories.push(category);
    selectedId = category.id;
    persist(`Đã thêm danh mục ${name}`, 'Danh mục mới đã được tạo.');
    createForm.reset();
    createPanel.hidden = true;
    syncWorkspace();
  });
  classifierForm.addEventListener('submit', event => {
    event.preventDefault();
    const description = screen.querySelector('#ticketClassifierText').value.trim().toLocaleLowerCase('vi');
    const candidates = categories.filter(category => category.status === 'active' && category.autoClassify !== false);
    const best = candidates.map(category => {
      const terms = `${category.name} ${category.description || ''}`.toLocaleLowerCase('vi')
        .split(/[^\p{L}\p{N}]+/u).filter(term => term.length > 2);
      return { category, score: terms.reduce((score, term) => score + (description.includes(term) ? term.length : 0), 0) };
    }).sort((a, b) => b.score - a.score)[0];
    classifierResult.hidden = false;
    classifierResult.textContent = best?.score
      ? `Danh mục gợi ý: ${best.category.name}`
      : 'Chưa tìm thấy danh mục phù hợp. Hãy bổ sung mô tả hoặc tạo danh mục mới.';
  });
  refresh();
  syncWorkspace();
}

function initUsers() {
const users = loadUnifiedData('users');

const userModal = document.getElementById('recordModal');
const userForm = document.getElementById('recordForm');
let editingUser = null;

function escapeUserHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function getRoleClass(role) {
  if (role === 'Quản trị viên') return 'vai-tro-quan-tri-vien';
  if (role === 'Kỹ thuật viên') return 'vai-tro-ky-thuat-vien';
  return 'vai-tro-nhan-vien';
}

function renderUsers() {
  const query = document.getElementById('userSearch').value.trim().toLowerCase();
  const role = document.getElementById('userRoleFilter').value;
  const status = document.getElementById('userStatusFilter').value;
  const visibleUsers = users.filter(user =>
    `${user.name} ${user.email}`.toLowerCase().includes(query) &&
    (!role || user.role === role) && (!status || user.status === status)
  );
  document.getElementById('userRows').innerHTML = visibleUsers.map(user => `
    <tr>
      <td><span class="ban-ghi-chinh">${escapeUserHtml(user.name)}</span><span class="ban-ghi-phu">${escapeUserHtml(user.initials)} · ID ${String(user.id).padStart(3, '0')}</span></td>
      <td>${escapeUserHtml(user.email)}</td>
      <td><span class="vai-tro-nhan ${getRoleClass(user.role)}">${escapeUserHtml(user.role)}</span></td>
      <td>${escapeUserHtml(user.joined)}</td>
      <td><span class="trang-thai-nhan ${user.status === 'active' ? 'trang-thai-hoat-dong' : 'trang-thai-khong-hoat-dong'}">${user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}</span></td>
      <td><div class="cac-thao-tac-hang"><button class="thao-tac-hang" type="button" data-action="edit" data-id="${user.id}">Sửa</button><button class="thao-tac-hang" type="button" data-action="toggle" data-id="${user.id}">${user.status === 'active' ? 'Khóa' : 'Mở khóa'}</button></div></td>
    </tr>`).join('');
  document.getElementById('userEmpty').hidden = visibleUsers.length > 0;
  document.getElementById('userTotal').textContent = users.length;
  document.getElementById('userActive').textContent = users.filter(user => user.status === 'active').length;
  document.getElementById('technicianTotal').textContent = users.filter(user => user.role === 'Kỹ thuật viên').length;
}

function openUserEditor(user = null) {
  editingUser = user;
  document.getElementById('recordModalTitle').textContent = user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng';
  userForm.innerHTML = `
    <div class="luoi-bieu-mau-ban-ghi">
      <label>Họ và tên<input name="name" maxlength="70" required value="${escapeUserHtml(user?.name || '')}" placeholder="Nhập họ và tên"></label>
      <label>Email<input name="email" type="email" maxlength="120" required value="${escapeUserHtml(user?.email || '')}" placeholder="name@company.vn"></label>
      <label>Vai trò<select name="role"><option ${user?.role === 'Quản trị viên' ? 'selected' : ''}>Quản trị viên</option><option ${user?.role === 'Kỹ thuật viên' || !user ? 'selected' : ''}>Kỹ thuật viên</option><option ${user?.role === 'Nhân viên' ? 'selected' : ''}>Nhân viên</option></select></label>
      <label>Trạng thái<select name="status"><option value="active" ${user?.status !== 'inactive' ? 'selected' : ''}>Hoạt động</option><option value="inactive" ${user?.status === 'inactive' ? 'selected' : ''}>Đã khóa</option></select></label>
    </div>
    <div class="cum-nut-hop-thoai"><button class="nut-huy" type="button" data-close>Hủy</button><button class="nut-luu" type="submit">${user ? 'Cập nhật' : 'Tạo tài khoản'}</button></div>`;
  userModal.classList.add('hien-thi');
  userModal.setAttribute('aria-hidden', 'false');
  userForm.querySelector('input').focus();
}

function closeUserEditor() {
  userModal.classList.remove('hien-thi');
  userModal.setAttribute('aria-hidden', 'true');
  editingUser = null;
}

document.getElementById('userSearch').addEventListener('input', renderUsers);
document.getElementById('userRoleFilter').addEventListener('change', renderUsers);
document.getElementById('userStatusFilter').addEventListener('change', renderUsers);
document.getElementById('addUser').addEventListener('click', () => openUserEditor());
document.getElementById('recordModalClose').addEventListener('click', closeUserEditor);
userModal.addEventListener('click', event => {
  if (event.target === userModal) closeUserEditor();
});
document.getElementById('userRows').addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const user = users.find(item => item.id === Number(button.dataset.id));
  if (!user) return;
  if (button.dataset.action === 'edit') openUserEditor(user);
  else {
    user.status = user.status === 'active' ? 'inactive' : 'active';
    saveUnifiedData('users', users);
    recordUnifiedActivity(
      `${user.status === 'active' ? 'Đã mở khóa' : 'Đã khóa'} tài khoản ${user.name}`,
      user.role
    );
    renderUsers();
  }
});
userForm.addEventListener('click', event => {
  if (event.target.closest('[data-close]')) closeUserEditor();
});
userForm.addEventListener('submit', event => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(userForm));
  const duplicateEmail = users.some(user =>
    user.email.toLowerCase() === values.email.trim().toLowerCase() && user.id !== editingUser?.id
  );
  if (duplicateEmail) {
    const emailInput = userForm.elements.email;
    emailInput.setCustomValidity('Email này đã được sử dụng.');
    emailInput.reportValidity();
    emailInput.addEventListener('input', () => emailInput.setCustomValidity(''), { once: true });
    return;
  }
  const name = values.name.trim();
  const data = {
    name,
    email: values.email.trim(),
    role: values.role,
    status: values.status,
    initials: name.split(/\s+/).map(part => part[0]).slice(-2).join('').toUpperCase()
  };
  if (editingUser) Object.assign(editingUser, data);
  else users.push({ id: Math.max(0, ...users.map(user => user.id)) + 1, joined: new Date().toLocaleDateString('vi-VN'), ...data });
  saveUnifiedData('users', users);
  recordUnifiedActivity(
    editingUser ? `Đã cập nhật người dùng ${name}` : `Đã thêm người dùng ${name}`,
    data.role
  );
  closeUserEditor();
  renderUsers();
});

renderUsers();
}

function initSla() {
  const fields = [...document.querySelectorAll('[data-sla-field]')];
  const notifications = document.getElementById('slaNotifications');
  const savedSla = loadUnifiedData('sla', {
    values: fields.map(field => Number(field.value)),
    notifications: notifications.checked
  });
  fields.forEach((field, index) => {
    field.value = savedSla.values[index] ?? field.value;
  });
  notifications.checked = savedSla.notifications;
document.getElementById('saveSla').addEventListener('click', () => {
  const feedback = document.getElementById('slaFeedback');
  const invalid = fields.find(input => !input.value || Number(input.value) < 1 || !Number.isInteger(Number(input.value)));
  if (invalid) {
    invalid.focus();
    invalid.setCustomValidity('Nhập số nguyên lớn hơn 0.');
    invalid.reportValidity();
    invalid.addEventListener('input', () => invalid.setCustomValidity(''), { once: true });
    feedback.textContent = 'Vui lòng nhập thời gian hợp lệ cho tất cả các mức độ ưu tiên.';
    feedback.style.color = '#c43e4c';
    return;
  }
  saveUnifiedData('sla', {
    values: fields.map(field => Number(field.value)),
    notifications: notifications.checked
  });
  recordUnifiedActivity('Đã cập nhật cấu hình SLA', 'Các thời hạn xử lý đã được lưu.');
  feedback.textContent = `Đã lưu cấu hình SLA lúc ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}.`;
  feedback.style.color = '';
});
}

// ==================== DATA ====================
const devices = loadUnifiedData('devices');

const deviceLocations = ['P.101 - Tòa A', 'P.201 - Tòa B', 'Hội trường', 'Phòng Giám đốc', 'Sân sau'];

let activeTabFilter = '';
let editingDeviceId = null;

function nextDeviceId() {
  const lastId = devices.reduce((max, device) => {
    const number = Number(device.id.slice(3));
    return Number.isNaN(number) ? max : Math.max(max, number);
  }, 0);
  return `TB-${String(lastId + 1).padStart(3, '0')}`;
}

function renderStatusCounts() {
  const statusCounts = devices.reduce((counts, device) => {
    counts[device.status] = (counts[device.status] || 0) + 1;
    return counts;
  }, {});

  document.querySelectorAll('.dem-trang-thai').forEach(count => {
    count.textContent = count.dataset.status === 'all'
      ? devices.length
      : statusCounts[count.dataset.status] || 0;
  });
  document.getElementById('totalDeviceCount').textContent = devices.length;
  const countByStatus = status => statusCounts[status] || 0;
  const overviewTotal = document.getElementById('overviewDeviceTotal');
  if (overviewTotal) {
    const activeCount = countByStatus('Hoạt động');
    const maintenanceCount = countByStatus('Bảo trì');
    const offlineCount = countByStatus('Ngừng hoạt động');
    const totalCount = devices.length;
    const activePercent = totalCount ? activeCount / totalCount * 100 : 0;
    const maintenancePercent = totalCount ? maintenanceCount / totalCount * 100 : 0;
    overviewTotal.textContent = totalCount;
    document.getElementById('overviewDonutTotal').textContent = totalCount;
    document.getElementById('overviewActiveDevices').textContent = activeCount;
    document.getElementById('overviewMaintenanceDevices').textContent = maintenanceCount;
    document.getElementById('overviewOfflineDevices').textContent = offlineCount;
    document.getElementById('overviewDeviceDonut').style.background =
      `conic-gradient(#18a65e 0 ${activePercent}%, #f2a331 ${activePercent}% ${activePercent + maintenancePercent}%, #dce4ef ${activePercent + maintenancePercent}% 100%)`;
  }
}

function getFilteredDevices() {
  let data = devices;
  const search = document.getElementById('deviceSearch').value.toLowerCase().trim();
  const type = document.getElementById('filterType').value;
  const status = document.getElementById('filterStatus').value;
  const location = document.getElementById('filterLocation').value;

  if (activeTabFilter) data = data.filter(device => device.status === activeTabFilter);
  if (search) {
    data = data.filter(device =>
      device.name.toLowerCase().includes(search) || device.id.toLowerCase().includes(search)
    );
  }
  if (type) data = data.filter(device => device.type === type);
  if (status) data = data.filter(device => device.status === status);
  if (location) data = data.filter(device => device.loc === location);

  return data;
}

function renderDevices() {
  const data = getFilteredDevices();
  renderTable(data);
  renderCards(data);
  const emptyMessage = document.getElementById('deviceEmpty');
  if (emptyMessage) emptyMessage.hidden = data.length > 0;
  const resultCount = document.getElementById('deviceResultCount');
  if (resultCount) {
    resultCount.textContent = `Đang hiển thị ${data.length} / ${devices.length} thiết bị`;
  }
}

function renderTable(data) {
  const tbody = document.getElementById('tableBody');
  tbody.replaceChildren();
  data.forEach(device => {
    const badgeClass = device.status === 'Bảo trì' ? 'cam' :
      device.status === 'Ngừng hoạt động' ? 'do' : 'xanh';
    const row = document.createElement('tr');
    [`${device.id} · ${device.name}`, device.type, device.loc].forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    });
    const statusCell = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = `nhan-trang-thai ${badgeClass}`;
    badge.textContent = device.status;
    statusCell.appendChild(badge);
    row.appendChild(statusCell);
    [device.date, device.warranty, device.views].forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    });
    const actions = document.createElement('td');
    [['Sửa', 'edit'], ['Xóa', 'delete']].forEach(([label, action]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = action === 'delete' ? 'thiet-bi-hang-thao-tac thiet-bi-xoa-thao-tac' : 'thiet-bi-hang-thao-tac';
      button.textContent = label;
      button.setAttribute('aria-label', `${action === 'edit' ? 'Chỉnh sửa' : 'Xóa'} thiết bị ${device.id}`);
      button.dataset.deviceAction = action;
      button.dataset.deviceId = device.id;
      actions.appendChild(button);
    });
    row.appendChild(actions);
    tbody.appendChild(row);
  });
}

// ==================== RENDER CARDS ====================
function renderCards(data) {
  const grid = document.getElementById('cardView');
  grid.innerHTML = '';

  data.forEach(d => {
    const badgeClass = d.status === 'Bảo trì' ? 'cam' :
      d.status === 'Ngừng hoạt động' ? 'do' : 'xanh';

    const card = document.createElement('div');
    card.className = 'the-thiet-bi';
    const cardTop = document.createElement('div');
    cardTop.className = 'dau-the-thiet-bi';
    const name = document.createElement('h4');
    name.textContent = d.name;
    const statusBadge = document.createElement('span');
    statusBadge.className = `nhan-trang-thai ${badgeClass}`;
    statusBadge.textContent = d.status;
    cardTop.append(name, statusBadge);

    const meta = document.createElement('p');
    meta.className = 'thong-tin-thiet-bi';
    meta.textContent = `${d.id} · ${d.loc.replace(' - ', ' · ')}`;
    const cardInfo = document.createElement('div');
    cardInfo.className = 'thiet-bi-the-thong-tin';
    [
      ['Loại:', d.type],
      ['Bảo hành:', d.warranty],
      ['Lượt xem:', d.views]
    ].forEach(([label, value]) => {
      const item = document.createElement('p');
      const itemLabel = document.createElement('span');
      itemLabel.textContent = label;
      const itemValue = document.createElement('strong');
      itemValue.textContent = value;
      item.append(itemLabel, itemValue);
      cardInfo.appendChild(item);
    });
    const cardActions = document.createElement('div');
    cardActions.className = 'thiet-bi-the-thao-tac';
    [['Sửa', 'edit'], ['Xóa', 'delete']].forEach(([label, action]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.className = action === 'delete' ? 'thiet-bi-hang-thao-tac thiet-bi-xoa-thao-tac' : 'thiet-bi-hang-thao-tac';
      button.dataset.deviceAction = action;
      button.dataset.deviceId = d.id;
      cardActions.appendChild(button);
    });
    card.append(cardTop, meta, cardInfo, cardActions);
    grid.appendChild(card);
  });
}

function initViewToggle() {
  const listButton = document.getElementById('btnList');
  const cardButton = document.getElementById('btnCard');
  const tableView = document.getElementById('tableView');
  const cardView = document.getElementById('cardView');

  function setView(view) {
    const showList = view === 'list';
    listButton.classList.toggle('dang-chon', showList);
    cardButton.classList.toggle('dang-chon', !showList);
    listButton.setAttribute('aria-pressed', String(showList));
    cardButton.setAttribute('aria-pressed', String(!showList));
    tableView.hidden = !showList;
    cardView.hidden = showList;
  }

  listButton.addEventListener('click', () => setView('list'));
  cardButton.addEventListener('click', () => setView('card'));
  setView('list');
}

// ==================== FILTER ====================
function initFilters() {
  document.getElementById('deviceSearch').addEventListener('input', renderDevices);
  document.getElementById('filterType').addEventListener('change', renderDevices);
  document.getElementById('filterStatus').addEventListener('change', renderDevices);
  document.getElementById('filterLocation').addEventListener('change', renderDevices);
  document.getElementById('applyDeviceFilters').addEventListener('click', renderDevices);
}

// ==================== STATUS TABS ====================
function initTabs() {
  document.querySelectorAll('.muc-the').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.muc-the').forEach(t => t.classList.remove('dang-chon'));
      tab.classList.add('dang-chon');
      activeTabFilter = tab.dataset.filter;
      renderDevices();
    });
  });
}

// ==================== MODAL ====================
function initModal() {
  const overlay  = document.getElementById('modalOverlay');
  const btnAdd   = document.getElementById('btnAdd');
  const btnClose = document.getElementById('modalClose');
  const btnCancel = overlay.querySelector('.nut-huy');
  const form = document.getElementById('deviceForm');
  const idInput = document.getElementById('deviceId');
  const purchaseDateInput = document.getElementById('devicePurchaseDate');
  const modalTitle = overlay.querySelector('.dau-hop-thoai h2');
  const saveButton = form.querySelector('.nut-luu');

  function closeModal() {
    overlay.classList.remove('hien-thi');
    overlay.setAttribute('aria-hidden', 'true');
    editingDeviceId = null;
  }

  function openEditModal(device) {
    editingDeviceId = device.id;
    idInput.value = device.id;
    document.getElementById('deviceName').value = device.name;
    document.getElementById('deviceType').value = device.type;
    document.getElementById('deviceLocation').value = device.loc;
    document.getElementById('deviceStatus').value = device.status;
    const [month, year] = device.date.split('/');
    purchaseDateInput.value = `${year}-${month.padStart(2, '0')}`;
    document.getElementById('deviceWarranty').value = device.warranty;
    modalTitle.textContent = 'Chỉnh sửa thiết bị';
    saveButton.textContent = 'Cập nhật';
    overlay.classList.add('hien-thi');
    overlay.setAttribute('aria-hidden', 'false');
    document.getElementById('deviceName').focus();
  }

  function handleDeviceAction(event) {
    const button = event.target.closest('[data-device-action]');
    if (!button) return;
    const device = devices.find(item => item.id === button.dataset.deviceId);
    if (!device) return;

    if (button.dataset.deviceAction === 'edit') {
      openEditModal(device);
    } else if (button.dataset.deviceAction === 'delete' &&
      window.confirm(`Bạn có chắc muốn xóa thiết bị "${device.name}" (${device.id})?`)) {
      devices.splice(devices.indexOf(device), 1);
      saveUnifiedData('devices', devices);
      recordUnifiedActivity(`Đã xóa thiết bị ${device.id}`, device.name);
      renderStatusCounts();
      renderDevices();
    }
  }

  btnAdd.addEventListener('click', () => {
    form.reset();
    editingDeviceId = null;
    idInput.value = nextDeviceId();
    purchaseDateInput.value = new Date().toISOString().slice(0, 7);
    modalTitle.textContent = 'Thêm thiết bị mới';
    saveButton.textContent = 'Lưu';
    overlay.classList.add('hien-thi');
    overlay.setAttribute('aria-hidden', 'false');
    document.getElementById('deviceName').focus();
  });
  document.getElementById('tableBody').addEventListener('click', handleDeviceAction);
  document.getElementById('cardView').addEventListener('click', handleDeviceAction);
  btnClose.addEventListener('click', closeModal);
  btnCancel.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && overlay.classList.contains('hien-thi')) closeModal();
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const [year, month] = purchaseDateInput.value.split('-');
    const status = document.getElementById('deviceStatus').value;
    const deviceData = {
      name: document.getElementById('deviceName').value.trim(),
      type: document.getElementById('deviceType').value,
      loc: document.getElementById('deviceLocation').value,
      status,
      date: `${month}/${year}`,
      warranty: document.getElementById('deviceWarranty').value
    };

    if (editingDeviceId) {
      const device = devices.find(item => item.id === editingDeviceId);
      if (!device) return;
      Object.assign(device, deviceData);
    } else {
      devices.push({
        id: idInput.value,
        ...deviceData,
        views: 0
      });
    }
    saveUnifiedData('devices', devices);
    recordUnifiedActivity(
      editingDeviceId ? `Đã cập nhật thiết bị ${editingDeviceId}` : `Đã thêm thiết bị ${idInput.value}`,
      deviceData.name
    );
    renderStatusCounts();
    renderDevices();
    form.reset();
    closeModal();
  });
}

// ==================== SIDEBAR NAV ====================
function initSidebar() {
  document.querySelectorAll('.muc-dieu-huong').forEach(link => {
    link.addEventListener('click', e => {
      if (document.body.dataset.screen) return;
      e.preventDefault();
      document.querySelectorAll('.muc-dieu-huong').forEach(l => l.classList.remove('dang-chon'));
      link.classList.add('dang-chon');
      if (link.dataset.page) window.location.hash = link.dataset.page;
    });
  });
}

// ==================== INIT ====================
function initDevices() {
  renderStatusCounts();
  renderDevices();
  initViewToggle();
  initFilters();
  initTabs();
  initModal();
  initSidebar();
}


const screenTemplates = {
  trang25: 'template-trang25',
  trang26: 'template-trang26',
  trang27: 'template-trang27',
  trang28: 'template-trang28',
  trang29: 'template-trang29'
};
const screenHost = document.getElementById('screenHost');
const navigationLinks = document.querySelectorAll('.dieu-huong-chinh a[data-page]');
const cachedScreens = new Map();
const globalSearchInput = document.querySelector('.o-tim-kiem-chinh input');
const standaloneScreen = document.body.dataset.screen;
let currentScreen = '';

function initScrollReveal(screenElement) {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('da-hien-thi-khi-cuon');
        activeObserver.unobserve(entry.target);
      }
    });
  }, { root: screenHost, threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  screenElement.querySelectorAll('.man-hinh .noi-dung-chinh > *').forEach(element => {
    element.classList.add('cho-hieu-ung-cuon');
    observer.observe(element);
  });
}

function applyGlobalSearch() {
  const query = globalSearchInput.value.trim();
  const localSearchSelectors = {
    trang26: '#deviceSearch',
    trang27: '#categorySearch',
    trang28: '#userSearch'
  };
  const localSearchSelector = localSearchSelectors[currentScreen];
  const localSearch = localSearchSelector ? screenHost.querySelector(localSearchSelector) : null;
  if (localSearch) {
    if (localSearch.value !== query) {
      localSearch.value = query;
      localSearch.dispatchEvent(new Event('input', { bubbles: true }));
    }
    return;
  }

  const searchableItems = currentScreen === 'trang25'
    ? screenHost.querySelectorAll('.the-thong-ke-tong-quan, .tong-quan-bang-dieu-khien, .nhanh-truy-cap-nut')
    : currentScreen === 'trang29'
      ? screenHost.querySelectorAll('.sla-bang tbody tr, .thong-tin-sla')
      : [];
  const normalizedQuery = query.toLocaleLowerCase('vi');
  searchableItems.forEach(item => {
    item.hidden = Boolean(normalizedQuery) &&
      !item.textContent.toLocaleLowerCase('vi').includes(normalizedQuery);
  });
}

globalSearchInput.addEventListener('input', applyGlobalSearch);

function showScreen() {
  const requested = standaloneScreen || window.location.hash.slice(1);
  const screen = Object.prototype.hasOwnProperty.call(screenTemplates, requested) ? requested : 'trang25';
  navigationLinks.forEach(link => {
    const selected = link.dataset.page === screen;
    link.classList.toggle('dang-chon', selected);
    if (selected) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  if (screen === currentScreen) return;
  currentScreen = screen;
  if (standaloneScreen) {
    const initializers = { trang25: initOverview, trang26: initDevices, trang27: initCategories, trang28: initUsers, trang29: initSla };
    if (screen === 'trang25') renderUnifiedOverview();
    initializers[screen]();
    initScrollReveal(screenHost.firstElementChild);
    applyGlobalSearch();
    return;
  }
  screenHost.replaceChildren();
  if (cachedScreens.has(screen)) {
    screenHost.appendChild(cachedScreens.get(screen));
    if (screen === 'trang25') renderUnifiedOverview();
    initScrollReveal(screenHost.firstElementChild);
    applyGlobalSearch();
    return;
  }
  const screenElement = document.getElementById(screenTemplates[screen]).content.firstElementChild.cloneNode(true);
  cachedScreens.set(screen, screenElement);
  screenHost.appendChild(screenElement);
  if (screen === 'trang25') renderUnifiedOverview();
  const initializers = { trang25: initOverview, trang26: initDevices, trang27: initCategories, trang28: initUsers, trang29: initSla };
  initializers[screen]();
  initScrollReveal(screenElement);
  applyGlobalSearch();
}

if (!standaloneScreen) {
  navigationLinks.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    if (window.location.hash === link.hash) showScreen();
    else window.location.hash = link.hash;
  }));
}
window.addEventListener('hashchange', showScreen);
if (!standaloneScreen && !Object.prototype.hasOwnProperty.call(screenTemplates, window.location.hash.slice(1))) {
  window.history.replaceState(null, '', '#trang25');
}
showScreen();