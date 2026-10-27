function initializeRegister() {
    console.log("FixFlow Register module loaded successfully.");

    const form = document.getElementById('register-form');
    if (!form) return;
    const password = document.getElementById('register-password');
    const confirmPassword = document.getElementById('confirm-password');
    const phone = document.getElementById('phone');
    const terms = document.getElementById('terms');
    const fields = [...form.querySelectorAll('.field-input[required]')];

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        let firstInvalid = null;

        fields.forEach((field) => {
            const message = getFieldError(field);
            setFieldError(field, message);
            if (message && !firstInvalid) firstInvalid = field;
        });

        const termsMessage = terms.checked ? '' : 'Vui lòng đồng ý với điều khoản và chính sách bảo mật.';
        setTermsError(termsMessage);
        if (termsMessage && !firstInvalid) firstInvalid = terms;

        if (firstInvalid) {
            firstInvalid.focus();
            return;
        }
        alert('Đăng ký thành công!');
    });

    fields.forEach((field) => {
        field.addEventListener('input', () => updateField(field));
        field.addEventListener('change', () => updateField(field));
    });
    phone.addEventListener('input', () => {
        if (phone.value.trim()) setFieldError(phone, getFieldError(phone));
    });
    terms.addEventListener('change', () => setTermsError(terms.checked ? '' : 'Vui lòng đồng ý với điều khoản và chính sách bảo mật.'));

    function getFieldError(field) {
        if (!field.value.trim()) return 'Vui lòng điền thông tin này.';
        if (field.type === 'email' && !field.validity.valid) return 'Vui lòng nhập địa chỉ email hợp lệ.';
        if (field === phone && !/^\d+$/.test(field.value.trim())) return 'Số điện thoại chỉ được chứa chữ số.';
        if (field === confirmPassword && field.value !== password.value) return 'Mật khẩu xác nhận không khớp.';
        return '';
    }

    function updateField(field) {
        if (field.classList.contains('is-invalid')) setFieldError(field, getFieldError(field));
        if (field === password && confirmPassword.classList.contains('is-invalid')) {
            setFieldError(confirmPassword, getFieldError(confirmPassword));
        }
    }

    function setFieldError(field, message) {
        let note = field.parentElement.querySelector('.field-error');
        if (message && !note) {
            note = document.createElement('small');
            note.className = 'field-error';
            note.setAttribute('aria-live', 'polite');
            field.insertAdjacentElement('afterend', note);
        }
        field.classList.toggle('is-invalid', Boolean(message));
        if (message) {
            field.setAttribute('aria-invalid', 'true');
            note.textContent = message;
        } else {
            field.removeAttribute('aria-invalid');
            note?.remove();
        }
    }

    function setTermsError(message) {
        let note = form.querySelector('.terms-error');
        if (message && !note) {
            note = document.createElement('small');
            note.className = 'field-error terms-error';
            note.setAttribute('aria-live', 'polite');
            form.querySelector('.terms-row').insertAdjacentElement('afterend', note);
        }
        terms.classList.toggle('is-invalid', Boolean(message));
        if (message) note.textContent = message;
        else note?.remove();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRegister, { once: true });
} else {
    document.addEventListener('app:viewloaded', initializeRegister);
}