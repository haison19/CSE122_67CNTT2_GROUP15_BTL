function getRoleClass(role) {
  if (role === 'Quản trị viên') return 'vai-tro-quan-tri-vien';
  if (role === 'Kỹ thuật viên') return 'vai-tro-ky-thuat-vien';
  return 'vai-tro-nhan-vien';
}

function appendTextCell(row, text, className = '') {
  const cell = document.createElement('td');
  if (className) {
    const value = document.createElement('span');
    value.className = className;
    value.textContent = text;
    cell.appendChild(value);
  } else {
    cell.textContent = text;
  }
  row.appendChild(cell);
}

function createUserField(labelText, control) {
  const label = document.createElement('label');
  label.append(document.createTextNode(labelText), control);
  return label;
}

export function initUsers({ loadData, saveData, recordActivity }) {
  const users = loadData('users');
  const userModal = document.getElementById('recordModal');
  const userForm = document.getElementById('recordForm');
  let editingUser = null;

  function renderUsers() {
    const query = document.getElementById('userSearch').value.trim().toLowerCase();
    const role = document.getElementById('userRoleFilter').value;
    const status = document.getElementById('userStatusFilter').value;
    const visibleUsers = users.filter(user =>
      `${user.name} ${user.email}`.toLowerCase().includes(query) &&
      (!role || user.role === role) && (!status || user.status === status)
    );
    const rows = document.getElementById('userRows');
    rows.replaceChildren();
    visibleUsers.forEach(user => {
      const row = document.createElement('tr');
      const identity = document.createElement('td');
      const name = document.createElement('span');
      name.className = 'ban-ghi-chinh';
      name.textContent = user.name;
      const initials = document.createElement('span');
      initials.className = 'ban-ghi-phu';
      initials.textContent = `${user.initials} · ID ${String(user.id).padStart(3, '0')}`;
      identity.append(name, initials);
      row.appendChild(identity);
      appendTextCell(row, user.email);
      const roleCell = document.createElement('td');
      const roleBadge = document.createElement('span');
      roleBadge.className = `vai-tro-nhan ${getRoleClass(user.role)}`;
      roleBadge.textContent = user.role;
      roleCell.appendChild(roleBadge);
      row.appendChild(roleCell);
      appendTextCell(row, user.joined);
      const statusCell = document.createElement('td');
      const statusBadge = document.createElement('span');
      statusBadge.className = `trang-thai-nhan ${user.status === 'active' ? 'trang-thai-hoat-dong' : 'trang-thai-khong-hoat-dong'}`;
      statusBadge.textContent = user.status === 'active' ? 'Hoạt động' : 'Đã khóa';
      statusCell.appendChild(statusBadge);
      row.appendChild(statusCell);
      const actionsCell = document.createElement('td');
      const actions = document.createElement('div');
      actions.className = 'cac-thao-tac-hang';
      [['Sửa', 'edit'], [user.status === 'active' ? 'Khóa' : 'Mở khóa', 'toggle']].forEach(([label, action]) => {
        const button = document.createElement('button');
        button.className = 'thao-tac-hang';
        button.type = 'button';
        button.dataset.action = action;
        button.dataset.id = user.id;
        button.textContent = label;
        actions.appendChild(button);
      });
      actionsCell.appendChild(actions);
      row.appendChild(actionsCell);
      rows.appendChild(row);
    });
    document.getElementById('userEmpty').hidden = visibleUsers.length > 0;
    document.getElementById('userTotal').textContent = users.length;
    document.getElementById('userActive').textContent =
      users.filter(user => user.status === 'active').length;
    document.getElementById('technicianTotal').textContent =
      users.filter(user => user.role === 'Kỹ thuật viên').length;
  }

  function openUserEditor(user = null) {
    editingUser = user;
    document.getElementById('recordModalTitle').textContent =
      user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng';
    const fields = document.createElement('div');
    fields.className = 'luoi-bieu-mau-ban-ghi';
    const nameInput = document.createElement('input');
    nameInput.name = 'name';
    nameInput.maxLength = 70;
    nameInput.required = true;
    nameInput.placeholder = 'Nhập họ và tên';
    const emailInput = document.createElement('input');
    emailInput.name = 'email';
    emailInput.type = 'email';
    emailInput.maxLength = 120;
    emailInput.required = true;
    emailInput.placeholder = 'name@company.vn';
    const roleSelect = document.createElement('select');
    roleSelect.name = 'role';
    ['Quản trị viên', 'Kỹ thuật viên', 'Nhân viên'].forEach(role => {
      const option = document.createElement('option');
      option.value = role;
      option.textContent = role;
      roleSelect.appendChild(option);
    });
    const statusSelect = document.createElement('select');
    statusSelect.name = 'status';
    [['active', 'Hoạt động'], ['inactive', 'Đã khóa']].forEach(([value, label]) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = label;
      statusSelect.appendChild(option);
    });
    fields.append(
      createUserField('Họ và tên', nameInput),
      createUserField('Email', emailInput),
      createUserField('Vai trò', roleSelect),
      createUserField('Trạng thái', statusSelect)
    );
    const actions = document.createElement('div');
    actions.className = 'cum-nut-hop-thoai';
    const cancelButton = document.createElement('button');
    cancelButton.className = 'nut-huy';
    cancelButton.type = 'button';
    cancelButton.dataset.close = '';
    cancelButton.textContent = 'Hủy';
    const saveButton = document.createElement('button');
    saveButton.className = 'nut-luu';
    saveButton.type = 'submit';
    saveButton.textContent = user ? 'Cập nhật' : 'Tạo tài khoản';
    actions.append(cancelButton, saveButton);
    userForm.replaceChildren(fields, actions);
    userForm.elements.name.value = user?.name || '';
    userForm.elements.email.value = user?.email || '';
    userForm.elements.role.value = user?.role || 'Kỹ thuật viên';
    userForm.elements.status.value = user?.status || 'active';
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
    if (button.dataset.action === 'edit') {
      openUserEditor(user);
      return;
    }
    user.status = user.status === 'active' ? 'inactive' : 'active';
    saveData('users', users);
    recordActivity(
      `${user.status === 'active' ? 'Đã mở khóa' : 'Đã khóa'} tài khoản ${user.name}`,
      user.role
    );
    renderUsers();
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
    else users.push({
      id: Math.max(0, ...users.map(user => user.id)) + 1,
      joined: new Date().toLocaleDateString('vi-VN'),
      ...data
    });
    saveData('users', users);
    recordActivity(
      editingUser ? `Đã cập nhật người dùng ${name}` : `Đã thêm người dùng ${name}`,
      data.role
    );
    closeUserEditor();
    renderUsers();
  });
  renderUsers();
}
