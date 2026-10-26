document.addEventListener('DOMContentLoaded', () => {
    console.log("FixFlow Login module loaded successfully.");

    const form = document.getElementById('login-form');
    const email = document.getElementById('email');
    const error = document.getElementById('email-error');

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

        clearEmailError();
        location.href = '20.html';
    });

    email.addEventListener('input', () => {
        if (email.classList.contains('is-invalid')) {
            if (email.value.trim() && email.validity.valid) clearEmailError();
            else if (!email.value.trim()) showEmailError('Vui lòng nhập email.');
            else showEmailError('Vui lòng nhập địa chỉ email hợp lệ.');
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
});
