// Video gallery tabs
function showVideoTab(tabId, tabBtn) {
    document.querySelectorAll('.video-tab-content').forEach(c => {
        c.style.display = 'none';
        c.classList.remove('active');
    });
    document.querySelectorAll('.video-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
    });

    const targetContent = document.getElementById(tabId);
    if (targetContent) {
        targetContent.style.display = 'block';
        targetContent.classList.add('active');
    }
    if (tabBtn) {
        tabBtn.classList.add('active');
        tabBtn.setAttribute('aria-selected', 'true');
    }
}

export function init() {
    // Mark initial active tab for a11y
    document.querySelectorAll('.video-tab').forEach(t => {
        t.setAttribute('role', 'tab');
        t.setAttribute('aria-selected', t.classList.contains('active') ? 'true' : 'false');
    });
    document.querySelectorAll('.video-tab-content').forEach(c => {
        c.setAttribute('role', 'tabpanel');
    });
}

export const actions = {
    'show-video-tab': (el) => showVideoTab(el.dataset.tab, el)
};
