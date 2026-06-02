// Join BLINK form + language selector with full a11y
import { showToast } from './toast.js';

function selectLang(btn) {
    document.querySelectorAll('.lang-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
}

function validateField(input) {
    if (!input.checkValidity()) {
        input.setAttribute('aria-invalid', 'true');
        return false;
    }
    input.removeAttribute('aria-invalid');
    return true;
}

function handleJoinSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const fields = form.querySelectorAll('input, select');
    let firstInvalid = null;
    fields.forEach(f => {
        if (!validateField(f) && !firstInvalid) firstInvalid = f;
    });
    if (firstInvalid) {
        firstInvalid.focus();
        showToast('Revisa los campos marcados', 'error');
        return;
    }

    const nameInput = form.querySelector('input[type="text"]');
    const name = (nameInput?.value || 'BLINK').trim();
    const successMessage = document.getElementById('successMessage');
    const userNameSpan = document.getElementById('user-name');
    const blinkNumberSpan = document.getElementById('blink-number');

    const randomBlinkNum = Math.floor(Math.random() * 90000) + 10000;
    if (userNameSpan) userNameSpan.textContent = name;
    if (blinkNumberSpan) blinkNumberSpan.textContent = randomBlinkNum;

    if (successMessage) {
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    form.reset();
    fields.forEach(f => f.removeAttribute('aria-invalid'));

    setTimeout(() => {
        if (successMessage) successMessage.style.display = 'none';
    }, 8000);

    showToast(`¡Bienvenida ${name}! Eres BLINK #${randomBlinkNum}`, 'success');
}

export function init() {
    const form = document.querySelector('.join-form');
    if (form) {
        form.addEventListener('submit', handleJoinSubmit);
        form.addEventListener('input', (e) => {
            if (e.target.matches('input, select')) validateField(e.target);
        });
    }

    document.querySelectorAll('.lang-btn').forEach(b => {
        b.setAttribute('aria-pressed', b.classList.contains('active') ? 'true' : 'false');
    });
}

export const actions = {
    'select-lang': (el) => selectLang(el)
};
