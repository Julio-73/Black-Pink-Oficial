// Entry point — initializes all modules and wires the action dispatcher.
import './toast.js';
import * as nav      from './nav.js';
import * as modals   from './modals.js';
import * as videos   from './videos.js';
import * as cart     from './cart.js';
import * as forms    from './forms.js';
import * as countdown from './countdown.js';
import * as map      from './map.js';
import * as effects  from './effects.js';
import * as player   from './player.js';
import * as quiz     from './quiz.js';

// Consolidate data-action handlers from all modules.
const actions = Object.assign(
    {},
    nav.actions || {},
    modals.actions || {},
    videos.actions || {},
    cart.actions || {},
    forms.actions || {}
);

function bootstrap() {
    nav.init();
    modals.init();
    videos.init();
    cart.init();
    forms.init();
    countdown.init();
    map.init();
    effects.init();
    player.init();
    quiz.init();

    // Single delegated click listener for the entire page.
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        const name = target.dataset.action;
        const handler = actions[name];
        if (handler) handler(target, e);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
    bootstrap();
}

// Register service worker (PWA offline support).
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
}
