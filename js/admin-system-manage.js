import { createUnifiedDataStore, fetchUnifiedDefaults } from './unified-data.js';
import { initCategories } from './modules/issue-categories.js';
import { initDevices } from './modules/devices.js';
import { initOverview, renderOverview } from './modules/overview.js';
import { initSla } from './modules/sla-settings.js';
import { initUsers } from './modules/users.js';

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
const status = document.getElementById('appDataStatus');
const store = { defaults: null, data: null };
let currentScreen = '';
let applicationReady = false;

function loadData(name, fallback) {
  return store.data.load(name, fallback);
}

function saveData(name, value) {
  store.data.save(name, value);
}

function recordActivity(title, detail) {
  const activities = loadData('activities', []);
  activities.unshift({ title, detail, timestamp: Date.now() });
  saveData('activities', activities.slice(0, 10));
}

function navigate(page) {
  if (Object.prototype.hasOwnProperty.call(screenTemplates, page)) {
    window.location.hash = page;
  }
}

function getScreenInitializers() {
  const dependencies = { loadData, saveData, recordActivity };
  return {
    trang25: () => initOverview({ navigate }),
    trang26: () => initDevices(dependencies),
    trang27: () => initCategories(dependencies),
    trang28: () => initUsers(dependencies),
    trang29: () => initSla(dependencies)
  };
}

function initScrollReveal(screenElement) {
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('da-hien-thi-khi-cuon');
      activeObserver.unobserve(entry.target);
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

function showScreen() {
  if (!applicationReady) return;
  const requested = window.location.hash.slice(1);
  const screen = Object.prototype.hasOwnProperty.call(screenTemplates, requested) ? requested : 'trang25';
  navigationLinks.forEach(link => {
    const selected = link.dataset.page === screen;
    link.classList.toggle('dang-chon', selected);
    if (selected) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  if (screen === currentScreen) return;
  currentScreen = screen;
  if (cachedScreens.has(screen)) {
    screenHost.replaceChildren(cachedScreens.get(screen));
    if (screen === 'trang25') renderOverview({
      loadData,
      defaults: store.defaults.overview
    });
    initScrollReveal(screenHost.firstElementChild);
    applyGlobalSearch();
    return;
  }
  const screenElement = document.getElementById(screenTemplates[screen]).content.firstElementChild.cloneNode(true);
  cachedScreens.set(screen, screenElement);
  screenHost.replaceChildren(screenElement);
  if (screen === 'trang25') {
    renderOverview({ loadData, defaults: store.defaults.overview });
  }
  getScreenInitializers()[screen]();
  initScrollReveal(screenElement);
  applyGlobalSearch();
}

function initNavigation() {
  navigationLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      navigate(link.dataset.page);
    });
  });
  globalSearchInput.addEventListener('input', applyGlobalSearch);
  window.addEventListener('hashchange', showScreen);
  if (!Object.prototype.hasOwnProperty.call(screenTemplates, window.location.hash.slice(1))) {
    window.history.replaceState(null, '', '#trang25');
  }
}

async function startApplication() {
  try {
    store.defaults = await fetchUnifiedDefaults();
    store.data = createUnifiedDataStore(store.defaults);
    ['devices', 'categories', 'users', 'sla'].forEach(name => loadData(name));
    applicationReady = true;
    status.hidden = true;
    showScreen();
  } catch (error) {
    console.error('Không thể khởi tạo dữ liệu hệ thống.', error);
    status.textContent = 'Không thể tải dữ liệu hệ thống. Mở trang qua máy chủ cục bộ và kiểm tra các tệp JSON trong assets/data/.';
    status.style.color = '#c43e4c';
  } finally {
    document.documentElement.dataset.dataReady = 'true';
  }
}

initNavigation();
startApplication();
