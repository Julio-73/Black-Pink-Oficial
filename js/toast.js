// Toast notification system
let container;

function ensureContainer() {
    if (!container) {
        container = document.getElementById('bp-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'bp-toast-container';
            container.className = 'bp-toast-container';
            document.body.appendChild(container);
        }
    }
    return container;
}

export function showToast(message, type = 'info', duration = 3500) {
    const c = ensureContainer();
    const toast = document.createElement('div');
    toast.className = `bp-toast bp-toast-${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;
    c.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Expose globally for legacy code paths
window.showToast = showToast;
