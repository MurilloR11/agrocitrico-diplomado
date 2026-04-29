// static/js/register.js

(function () {
    const SVG_EYE = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    const SVG_EYE_OFF = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

    function initEyeToggle(inputId, btnId) {
        const input = document.getElementById(inputId);
        const btn   = document.getElementById(btnId);
        btn.innerHTML = SVG_EYE;
        btn.addEventListener('click', function () {
            const visible = input.type === 'text';
            input.type    = visible ? 'password' : 'text';
            btn.innerHTML = visible ? SVG_EYE : SVG_EYE_OFF;
            btn.ariaLabel = visible ? 'Mostrar contraseña' : 'Ocultar contraseña';
        });
    }

    const form            = document.getElementById('register-form');
    const fullname        = document.getElementById('fullname');
    const email           = document.getElementById('email');
    const password        = document.getElementById('password');
    const passwordConfirm = document.getElementById('password-confirm');

    initEyeToggle('password', 'toggle-password');
    initEyeToggle('password-confirm', 'toggle-password-confirm');

    function showError(input, errorId) {
        input.classList.add('is-error');
        document.getElementById(errorId).classList.add('is-visible');
    }

    function clearError(input, errorId) {
        input.classList.remove('is-error');
        document.getElementById(errorId).classList.remove('is-visible');
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    }

    fullname.addEventListener('input', function () {
        if (this.value.trim() !== '') clearError(this, 'fullname-error');
    });

    email.addEventListener('input', function () {
        if (this.value.trim() === '' || isValidEmail(this.value)) {
            clearError(this, 'email-error');
        }
    });

    password.addEventListener('input', function () {
        if (this.value.length >= 8) clearError(this, 'password-error');
        if (passwordConfirm.value !== '' && this.value === passwordConfirm.value) {
            clearError(passwordConfirm, 'password-confirm-error');
        }
    });

    passwordConfirm.addEventListener('input', function () {
        if (this.value === password.value) {
            clearError(this, 'password-confirm-error');
        }
    });

    form.addEventListener('submit', function (e) {
        let valid = true;

        if (fullname.value.trim() === '') {
            showError(fullname, 'fullname-error');
            valid = false;
        } else {
            clearError(fullname, 'fullname-error');
        }

        if (!isValidEmail(email.value)) {
            showError(email, 'email-error');
            valid = false;
        } else {
            clearError(email, 'email-error');
        }

        if (password.value.length < 8) {
            showError(password, 'password-error');
            valid = false;
        } else {
            clearError(password, 'password-error');
        }

        if (passwordConfirm.value !== password.value || passwordConfirm.value === '') {
            showError(passwordConfirm, 'password-confirm-error');
            valid = false;
        } else {
            clearError(passwordConfirm, 'password-confirm-error');
        }

        if (!valid) {
            e.preventDefault();
        }
    });
}());
