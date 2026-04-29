// static/js/login.js

(function () {
    const SVG_EYE = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    const SVG_EYE_OFF = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';

    function initEyeToggle(inputId, btnId) {
        const input = document.getElementById(inputId);
        const btn   = document.getElementById(btnId);
        btn.innerHTML = SVG_EYE;
        btn.addEventListener('click', function () {
            const visible = input.type === 'text';
            input.type        = visible ? 'password' : 'text';
            btn.innerHTML     = visible ? SVG_EYE : SVG_EYE_OFF;
            btn.ariaLabel     = visible ? 'Mostrar contraseña' : 'Ocultar contraseña';
        });
    }

    const form     = document.getElementById('login-form');
    const email    = document.getElementById('email');
    const password = document.getElementById('password');

    initEyeToggle('password', 'toggle-password');

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

    email.addEventListener('input', function () {
        if (this.value.trim() === '' || isValidEmail(this.value)) {
            clearError(this, 'email-error');
        }
    });

    password.addEventListener('input', function () {
        if (this.value.trim() !== '') {
            clearError(this, 'password-error');
        }
    });

    form.addEventListener('submit', function (e) {
        let valid = true;

        if (!isValidEmail(email.value)) {
            showError(email, 'email-error');
            valid = false;
        } else {
            clearError(email, 'email-error');
        }

        if (password.value.trim() === '') {
            showError(password, 'password-error');
            valid = false;
        } else {
            clearError(password, 'password-error');
        }

        if (!valid) {
            e.preventDefault();
        }
    });
}());
