function initializeLogin() {
    console.log("FixFlow Login module loaded successfully.");

    const form = document.getElementById('login-form');
    if (!form) return;
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const error = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        email.value = email.value.trim();

        if (!email.value) {
            showEmailError('Vui lòng nhập email.');
            email.focus();
            return;
        }
        if (!email.validity.valid) {
            showEmailError('Vui lòng nhập địa chỉ email hợp lệ.');
            email.focus();
            return;
        }
        if (!password.value.trim()) {
            passwordError.textContent = 'Vui lòng nhập mật khẩu.';
            password.setAttribute('aria-invalid', 'true');
            password.focus();
            return;
        }

        clearEmailError();
        passwordError.textContent = '';
        password.removeAttribute('aria-invalid');
        if (window.fixflowNavigate) window.fixflowNavigate('dashboard');
        else location.href = '20.html';
    });

    email.addEventListener('input', () => {
        if (email.classList.contains('is-invalid')) {
            if (email.value.trim() && email.validity.valid) clearEmailError();
            else if (!email.value.trim()) showEmailError('Vui lòng nhập email.');
            else showEmailError('Vui lòng nhập địa chỉ email hợp lệ.');
        }
    });
    password.addEventListener('input', () => {
        if (password.value.trim()) {
            passwordError.textContent = '';
            password.removeAttribute('aria-invalid');
        }
    });

    function showEmailError(message) {
        email.classList.add('is-invalid');
        email.setAttribute('aria-invalid', 'true');
        error.textContent = message;
    }

    function clearEmailError() {
        email.classList.remove('is-invalid');
        email.removeAttribute('aria-invalid');
        error.textContent = '';
    }
}

function initializeAuthViews() {
    const views = [...document.querySelectorAll('[data-auth-view]')];
    if (!views.length) return;

    function showView(name, updateHistory = true) {
        const selectedView = views.find((view) => view.dataset.authView === name) || views[0];
        views.forEach((view) => {
            view.hidden = view !== selectedView;
            view.setAttribute('aria-hidden', String(view !== selectedView));
        });
        document.title = selectedView.dataset.pageTitle;

        if (selectedView.dataset.authView === 'forgot') {
            const loginEmail = document.getElementById('email');
            const forgotEmail = document.getElementById('forgot-email');
            if (loginEmail?.value && !forgotEmail.value) forgotEmail.value = loginEmail.value;
        }

        if (updateHistory) {
            history.pushState({ authView: selectedView.dataset.authView }, '', `#${selectedView.dataset.authView}`);
        }
    }

    document.querySelectorAll('[data-auth-target]').forEach((button) => {
        if (button.dataset.authBound) return;
        button.dataset.authBound = 'true';
        button.addEventListener('click', () => showView(button.dataset.authTarget));
    });

    const forgotForm = document.getElementById('forgot-password-form');
    if (forgotForm && !forgotForm.dataset.authBound) {
        forgotForm.dataset.authBound = 'true';
        forgotForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const input = document.getElementById('forgot-email');
            const error = document.getElementById('forgot-error');
            const success = document.getElementById('forgot-success');
            const value = input.value.trim();

            if (!value || !input.validity.valid) {
                input.setAttribute('aria-invalid', 'true');
                error.textContent = value ? 'Vui lòng nhập địa chỉ email hợp lệ.' : 'Vui lòng nhập email.';
                success.hidden = true;
                input.focus();
                return;
            }

            input.removeAttribute('aria-invalid');
            error.textContent = '';
            success.hidden = false;
        });
        forgotForm.addEventListener('input', (event) => {
            if (event.target.id === 'forgot-email') {
                document.getElementById('forgot-error').textContent = '';
                document.getElementById('forgot-success').hidden = true;
                event.target.removeAttribute('aria-invalid');
            }
        });
    }

    window.addEventListener('popstate', () => showView(location.hash.slice(1), false));
    showView(location.hash.slice(1) || 'login', false);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeLogin();
        initializeAuthViews();
    }, { once: true });
} else {
    document.addEventListener('app:viewloaded', () => {
        initializeLogin();
        initializeAuthViews();
    });
}