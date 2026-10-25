export function initCategories({ loadData, saveData, recordActivity }) {
  const screen = document.querySelector('.man-hinh-trang27');
  if (!screen) return;
  const categories = loadData('categories');
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
  const createChildButton = category => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `muc-con-danh-muc${String(selectedId) === String(category.id) ? ' dang-chon' : ''}`;
    button.dataset.categoryId = category.id;
    const name = document.createElement('span');
    name.textContent = category.name;
    const count = document.createElement('span');
    count.textContent = category.tickets || 0;
    button.append(name, count);
    return button;
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
      matchingChildren.forEach(child => group.appendChild(createChildButton(child)));
      tree.appendChild(group);
    });
    if (query && visibleCount === 0) {
      categories.filter(category => getCategory(category.parentId) &&
        category.name.toLocaleLowerCase('vi').includes(query)).forEach(category => {
        visibleCount += 1;
        tree.appendChild(createChildButton(category));
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
    classifierMode.textContent = `${categories.filter(category =>
      category.status === 'active' && category.autoClassify !== false).length} danh mục đang bật phân loại tự động.`;
  };
  const persist = (title, detail) => {
    saveData('categories', categories);
    recordActivity(title, detail);
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
    if (categories.some(item => item.id !== category.id &&
        item.name.toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi'))) {
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
      code: name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-|-$/g, '').toUpperCase().slice(0, 12),
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
    const candidates = categories.filter(category =>
      category.status === 'active' && category.autoClassify !== false);
    const best = candidates.map(category => {
      const terms = `${category.name} ${category.description || ''}`.toLocaleLowerCase('vi')
        .split(/[^\p{L}\p{N}]+/u).filter(term => term.length > 2);
      return { category, score: terms.reduce((score, term) =>
        score + (description.includes(term) ? term.length : 0), 0) };
    }).sort((a, b) => b.score - a.score)[0];
    classifierResult.hidden = false;
    classifierResult.textContent = best?.score
      ? `Danh mục gợi ý: ${best.category.name}`
      : 'Chưa tìm thấy danh mục phù hợp. Hãy bổ sung mô tả hoặc tạo danh mục mới.';
  });
  refresh();
  syncWorkspace();
}
