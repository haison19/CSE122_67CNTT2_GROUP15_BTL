const pages = {
    login: '2',
    register: '3',
    forgot: '4',
    dashboard: '20',
    dispatch: '21',
    sla: '22',
    analysis: '23',
    tickets: '24',
    'not-found': '9'
};

const pageByFile = Object.fromEntries(
    Object.entries(pages).map(([route, file]) => [`${file}.html`, route])
);
pageByFile['index.html'] = 'dashboard';

const loadedScripts = new Map();
let renderVersion = 0;

function currentRoute() {
    const route = window.location.hash.slice(1).split('/')[0];
    return pages[route] ? route : 'login';
}

function navigate(route, anchor = '') {
    if (!pages[route]) return;
    const hash = `#${route}${anchor ? `/${anchor}` : ''}`;
    window.history.pushState({}, '', hash);
    renderPage(route, anchor);
}

function loadScript(source) {
    if (!loadedScripts.has(source)) {
        const promise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = source;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Không thể tải ${source}`));
            document.head.appendChild(script);
        });
        loadedScripts.set(source, promise);
    }
    return loadedScripts.get(source);
}

async function renderPage(route, anchor = '') {
    const version = ++renderVersion;
    const file = pages[route];

    try {
        const response = await fetch(`${file}.html`);
        if (!response.ok) throw new Error(`Không tải được ${file}.html`);

        const source = new DOMParser().parseFromString(await response.text(), 'text/html');
        if (version !== renderVersion) return;

        document.title = source.title || 'FixFlow';
        document.body.className = source.body.className;

        const stylesheet = [...source.querySelectorAll('link[rel="stylesheet"]')]
            .find((link) => link.getAttribute('href') === `${file}.css`);
        document.getElementById('page-stylesheet').href = stylesheet?.getAttribute('href') || '';

        const scriptSources = [...source.querySelectorAll('script[src]')]
            .map((script) => script.getAttribute('src'))
            .filter((script) => script && !script.includes('tailwindcss') && !script.includes('font-awesome'));
        const app = document.getElementById('app');
        app.className = 'contents';
        app.replaceChildren(...[...source.body.childNodes]
            .filter((node) => node.nodeName !== 'SCRIPT')
            .map((node) => document.importNode(node, true)));

        await Promise.all(scriptSources.map(loadScript));
        if (version !== renderVersion) return;

        document.dispatchEvent(new CustomEvent('app:viewloaded', { detail: { route } }));
        if (anchor) {
            document.getElementById(anchor)?.scrollIntoView();
        } else {
            document.querySelector('main')?.scrollTo(0, 0);
        }
    } catch (error) {
        if (version !== renderVersion) return;
        document.title = 'FixFlow';
        document.body.className = 'bg-slate-50 text-slate-800 antialiased';
        const app = document.getElementById('app');
        app.className = 'min-h-screen grid place-items-center p-6 text-sm text-rose-700';
        app.textContent = `${error.message}. Hãy mở website qua máy chủ web cục bộ.`;
    }
}

window.fixflowNavigate = navigate;

document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.getAttribute('href') === '#') return;

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin) return;

    const route = pageByFile[destination.pathname.split('/').pop()];
    if (!route) return;

    event.preventDefault();
    navigate(route, destination.hash.slice(1));
});

window.addEventListener('popstate', () => renderPage(currentRoute(), window.location.hash.split('/')[1] || ''));
window.addEventListener('hashchange', () => renderPage(currentRoute(), window.location.hash.split('/')[1] || ''));

if (!window.location.hash) {
    window.history.replaceState({}, '', '#login');
}
renderPage(currentRoute(), window.location.hash.split('/')[1] || '');