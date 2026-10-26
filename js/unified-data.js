export async function fetchUnifiedDefaults() {
  const resources = [
    ['overview', 'overview'],
    ['devices', 'devices'],
    ['categories', 'issue-categories'],
    ['users', 'users'],
    ['sla', 'sla-settings']
  ];
  const entries = await Promise.all(resources.map(async ([name, file]) => {
    const response = await fetch(`assets/data/${file}.json`);
    if (!response.ok) throw new Error(`Không tải được dữ liệu ${name} (HTTP ${response.status}).`);
    const value = await response.json();
    if (['devices', 'categories', 'users'].includes(name) &&
        (!Array.isArray(value) || value.length < 15)) {
      throw new Error(`Tệp dữ liệu ${name} không đúng định dạng hoặc thiếu bản ghi.`);
    }
    if (name === 'sla' && (
      !Array.isArray(value.values) ||
      value.values.length !== 12 ||
      value.values.some(item => !Number.isInteger(item) || item < 1) ||
      typeof value.notifications !== 'boolean'
    )) {
      throw new Error('Tệp cấu hình SLA không đúng định dạng.');
    }
    if (name === 'overview' && (!value || typeof value !== 'object' || !value.deviceStatuses)) {
      throw new Error('Tệp dữ liệu tổng quan không đúng định dạng.');
    }
    return [name, value];
  }));
  return Object.fromEntries(entries);
}

export function createUnifiedDataStore(defaults) {
  const dataVersions = { devices: '3', categories: '1', users: '1' };

  function load(name, fallback) {
    const key = `fixflow.unified.${name}`;
    let stored = localStorage.getItem(key);
    if (stored === null) {
      stored = localStorage.getItem(`fixflow.${name}`);
      if (stored === null) {
        const pageKeys = {
          devices: 'fixflow.page26.devices',
          categories: 'fixflow.page27.categories',
          users: 'fixflow.page28.users',
          sla: 'fixflow.page29.sla'
        };
        const legacyKey = pageKeys[name];
        if (legacyKey) stored = localStorage.getItem(legacyKey);
      }
    }
    if (stored === null) {
      const source = fallback === undefined ? defaults[name] : fallback;
      if (source === undefined) throw new Error(`Không có dữ liệu mặc định cho "${name}".`);
      const value = JSON.parse(JSON.stringify(source));
      localStorage.setItem(key, JSON.stringify(value));
      if (dataVersions[name]) {
        localStorage.setItem(`${key}.dataVersion`, dataVersions[name]);
      }
      return value;
    }
    try {
      let value = JSON.parse(stored);
      if (['devices', 'categories', 'users', 'activities'].includes(name) && !Array.isArray(value)) {
        throw new Error(`Dữ liệu "${name}" đã lưu không hợp lệ.`);
      }
      if (name === 'sla' && (
        !Array.isArray(value.values) ||
        value.values.length !== 12 ||
        value.values.some(item => !Number.isInteger(item) || item < 1) ||
        typeof value.notifications !== 'boolean'
      )) {
        throw new Error('Cấu hình SLA đã lưu không hợp lệ.');
      }
      const legacySizes = { devices: 11, categories: 6, users: 8 };
      const legacySize = legacySizes[name];
      const legacyKeys = {
        devices: ['fixflow.devices', 'fixflow.page26.devices'],
        categories: ['fixflow.categories', 'fixflow.page27.categories'],
        users: ['fixflow.users', 'fixflow.page28.users'],
        sla: ['fixflow.sla', 'fixflow.page29.sla']
      };
      const legacyVersion = (legacyKeys[name] || [])
        .map(legacyKey => localStorage.getItem(`${legacyKey}.dataVersion`))
        .find(Boolean);
      const version = localStorage.getItem(`${key}.dataVersion`) ?? legacyVersion ?? null;
      if (legacySize && version === null && value.length === legacySize &&
          value.every((item, index) =>
            item.id === index + 1 ||
            (name === 'devices' && item.id === `TB-${String(index + 1).padStart(3, '0')}`))) {
        value = [...value, ...defaults[name].slice(legacySize)];
      }
      if (name === 'devices' && value.length > defaults.devices.length) {
        value = defaults.devices.map(device => ({ ...device }));
      }
      localStorage.setItem(key, JSON.stringify(value));
      if (dataVersions[name]) localStorage.setItem(`${key}.dataVersion`, dataVersions[name]);
      return value;
    } catch (error) {
      console.error(`Không thể đọc dữ liệu "${name}" đã lưu.`, error);
      throw error;
    }
  }

  function save(name, value) {
    localStorage.setItem(`fixflow.unified.${name}`, JSON.stringify(value));
  }

  return { load, save };
}
