// Member modals + video modal with focus trap and focus restoration
const FOCUSABLE = 'a[href], button:not([disabled]), iframe, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [role="button"], [role="tab"]';

let lastFocusedBeforeModal = null;

function getFocusable(modal) {
    return [...modal.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
}

function trapFocus(modal, e) {
    if (e.key !== 'Tab') return;
    const focusables = getFocusable(modal);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}

function openMemberModal(member) {
    const modal = document.getElementById(member + '-modal');
    if (!modal) return;
    lastFocusedBeforeModal = document.activeElement;
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('[data-action="close-member-modal"]');
    closeBtn?.focus();
    modal._trapHandler = (e) => trapFocus(modal, e);
    modal.addEventListener('keydown', modal._trapHandler);
}

function closeMemberModal(member) {
    const modal = document.getElementById(member + '-modal');
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (modal._trapHandler) {
        modal.removeEventListener('keydown', modal._trapHandler);
        modal._trapHandler = null;
    }
    const iframe = modal.querySelector('iframe');
    if (iframe) {
        const src = iframe.src;
        iframe.src = '';
        iframe.src = src;
    }
    if (lastFocusedBeforeModal && lastFocusedBeforeModal.focus) {
        lastFocusedBeforeModal.focus();
    }
}

function openVideoModal(videoId) {
    const modal = document.getElementById('video-modal');
    const player = document.getElementById('youtube-player');
    const link = document.getElementById('youtube-link');
    if (!modal || !player) return;
    lastFocusedBeforeModal = document.activeElement;
    player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    if (link) link.href = `https://www.youtube.com/watch?v=${videoId}`;
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('[data-action="close-video-modal"]');
    closeBtn?.focus();
    modal._trapHandler = (e) => trapFocus(modal, e);
    modal.addEventListener('keydown', modal._trapHandler);
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    const player = document.getElementById('youtube-player');
    if (!modal) return;
    if (player) player.src = '';
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (modal._trapHandler) {
        modal.removeEventListener('keydown', modal._trapHandler);
        modal._trapHandler = null;
    }
    if (lastFocusedBeforeModal && lastFocusedBeforeModal.focus) {
        lastFocusedBeforeModal.focus();
    }
    lastFocusedBeforeModal = null;
}

function closeAllMemberModals() {
    document.querySelectorAll('.modal-mobile').forEach(m => {
        const id = m.id.replace('-modal', '');
        if (m.style.display === 'block') closeMemberModal(id);
    });
}

export function init() {
    document.querySelectorAll('.modal-mobile').forEach(modal => {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-hidden', 'true');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                const id = modal.id.replace('-modal', '');
                closeMemberModal(id);
            }
        });
    });

    const videoModal = document.getElementById('video-modal');
    if (videoModal) {
        videoModal.setAttribute('aria-hidden', 'true');
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeVideoModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllMemberModals();
            if (videoModal && videoModal.style.display === 'block') {
                closeVideoModal();
            } else {
                lastFocusedBeforeModal = null;
            }
            const menu = document.getElementById('mobileMenu');
            if (menu?.classList.contains('active')) {
                menu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
}

export const actions = {
    'open-member-modal': (el) => openMemberModal(el.dataset.member),
    'close-member-modal': (el) => closeMemberModal(el.dataset.member),
    'open-video-modal': (el) => openVideoModal(el.dataset.videoId),
    'close-video-modal': () => closeVideoModal()
};
