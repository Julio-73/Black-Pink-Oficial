// Countdown comeback timer (dynamic +90 days, persisted)
const STORAGE_KEY = 'bp_comeback_target';
const DEFAULT_HORIZON_MS = 90 * 24 * 60 * 60 * 1000;

let intervalId = null;

function getTargetTime() {
    let target = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    if (!target || isNaN(target) || target < Date.now()) {
        target = Date.now() + DEFAULT_HORIZON_MS;
        try { localStorage.setItem(STORAGE_KEY, String(target)); } catch { /* ignore */ }
    }
    return target;
}

function pad(n) { return String(n).padStart(2, '0'); }

export function init() {
    const daysEl    = document.getElementById('days');
    const hoursEl   = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    const target = getTargetTime();

    function tick() {
        const dist = target - Date.now();
        if (dist <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            if (intervalId) clearInterval(intervalId);
            return;
        }
        const days = Math.floor(dist / 86400000);
        const hours = Math.floor((dist % 86400000) / 3600000);
        const minutes = Math.floor((dist % 3600000) / 60000);
        const seconds = Math.floor((dist % 60000) / 1000);
        daysEl.textContent = pad(days);
        hoursEl.textContent = pad(hours);
        minutesEl.textContent = pad(minutes);
        secondsEl.textContent = pad(seconds);
    }

    tick();
    intervalId = setInterval(tick, 1000);
}

export function destroy() {
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
}
