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
import * as booking  from './booking.js';
import * as lightstick from './lightstick.js';

// Consolidate data-action handlers from all modules.
const actions = Object.assign(
    {},
    nav.actions || {},
    modals.actions || {},
    videos.actions || {},
    cart.actions || {},
    forms.actions || {},
    booking.actions || {},
    player.actions || {},
    lightstick.actions || {}
);

let _dispatcherHandler = null;

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
    booking.init();
    lightstick.init();

    // Single delegated click listener for the entire page.
    _dispatcherHandler = (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        const name = target.dataset.action;
        const handler = actions[name];
        if (handler) handler(target, e);
    };
    document.addEventListener('click', _dispatcherHandler);
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

// Cleanup: call destroy() on every module and remove global listeners
export function destroy() {
    if (_dispatcherHandler) document.removeEventListener('click', _dispatcherHandler);
    nav.destroy?.();
    modals.destroy?.();
    videos.destroy?.();
    cart.destroy?.();
    forms.destroy?.();
    countdown.destroy?.();
    map.destroy?.();
    effects.destroy?.();
    player.destroy?.();
    quiz.destroy?.();
    booking.destroy?.();
    lightstick.destroy?.();
}
