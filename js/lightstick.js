// BLINK Interactive Lightstick Controller
// Features manual LED control, concert audio visualizer sync, and synth audio squeak
import { showToast } from './toast.js';

let widgetContainer, toggleBtn, closeBtn, panel, visualEl, glowEl;
let currentMode = 'off'; // 'off' | 'on' | 'pulse' | 'concert'
let currentColor = '#ff2e93';
let _rafId = null;

function playSqueakSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        // Squeak 1: High frequency pitch chirp
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(900, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.08);
        
        gain1.gain.setValueAtTime(0.08, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        
        // Squeak 2: Sub-chirp for rubber toy squeak fullness
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(450, ctx.currentTime);
        osc2.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.08);
        
        gain2.gain.setValueAtTime(0.04, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.1);
        osc2.stop(ctx.currentTime + 0.1);
    } catch (e) {
        // AudioContext could be blocked by browser policy until gesture
    }
}

function triggerChirp(heartEl) {
    if (!heartEl) return;
    
    // Play the synthesized audio
    playSqueakSound();
    
    // Visual reaction class
    heartEl.classList.add('chirp-active');
    
    // Create shockwave ring
    const ring = document.createElement('span');
    ring.className = 'chirp-ring';
    heartEl.appendChild(ring);
    
    setTimeout(() => {
        heartEl.classList.remove('chirp-active');
        ring.remove();
    }, 400);
}

function setMode(mode) {
    currentMode = mode;
    
    // Update active UI state on mode buttons
    document.querySelectorAll('[data-action="set-lightstick-mode"]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    if (visualEl) {
        // Reset classes
        visualEl.className = 'lightstick-visual';
        
        // Apply target classes based on mode
        if (mode === 'off') {
            visualEl.classList.add('off');
        } else if (mode === 'on') {
            visualEl.classList.add('on');
        } else if (mode === 'pulse') {
            visualEl.classList.add('pulse');
        } else if (mode === 'concert') {
            visualEl.classList.add('concert');
            showToast('Concert Mode Activado! Reproduce música y mira el Lightstick brillar.', 'info');
        }
    }
    
    // Toggle body class for concert crowd visual effect if concert mode is active
    document.body.classList.toggle('concert-mode-active', mode === 'concert');
}

function setColor(color) {
    currentColor = color;
    
    // Update active UI state on color buttons
    document.querySelectorAll('[data-action="set-lightstick-color"]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.color === color);
    });
    
    if (widgetContainer) {
        widgetContainer.style.setProperty('--lightstick-color', color);
    }
}

function togglePanel(show) {
    const isVisible = show !== undefined ? show : panel.getAttribute('aria-hidden') === 'true';
    panel.setAttribute('aria-hidden', !isVisible ? 'true' : 'false');
    widgetContainer.classList.toggle('panel-open', isVisible);
    
    if (isVisible) {
        // Let it auto focus to panel header for A11y
        panel.querySelector('.lightstick-header h4')?.focus();
    }
}

// Lightstick animation / audio sync loop
function animationLoop() {
    _rafId = requestAnimationFrame(animationLoop);
    
    if (currentMode === 'concert' && glowEl) {
        const intensity = window.bpBassIntensity || 0; // 0 to 1
        
        // Sync neon glow size and opacity to bass intensity
        const scale = 1.0 + intensity * 0.35;
        const opacity = 0.35 + intensity * 0.65;
        glowEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
        glowEl.style.opacity = opacity;
        
        if (visualEl) {
            visualEl.style.filter = `drop-shadow(0 0 ${12 + intensity * 28}px var(--lightstick-color, #ff2e93))`;
        }
        
        // Update document variable for concert marea pulsing
        document.documentElement.style.setProperty('--concert-bass-scale', `${1 + intensity * 0.12}`);
    } else if (glowEl) {
        // Reset styles for manual mode
        glowEl.style.transform = '';
        glowEl.style.opacity = '';
        if (visualEl) {
            visualEl.style.filter = '';
        }
    }
}

export function init() {
    widgetContainer = document.getElementById('floating-lightstick-widget');
    toggleBtn = document.getElementById('lightstick-toggle-btn');
    closeBtn = document.getElementById('lightstick-close-btn');
    panel = document.getElementById('lightstick-panel');
    visualEl = document.getElementById('lightstick-visual');
    glowEl = panel?.querySelector('.lightstick-glow-effect');
    
    if (!widgetContainer) return;
    
    // Set default color pink
    widgetContainer.style.setProperty('--lightstick-color', '#ff2e93');
    
    toggleBtn?.addEventListener('click', () => togglePanel());
    closeBtn?.addEventListener('click', () => togglePanel(false));
    
    // Heart click squeaks
    panel?.querySelectorAll('.lightstick-head .heart').forEach(heart => {
        heart.addEventListener('click', (e) => {
            e.stopPropagation();
            triggerChirp(heart);
        });
    });
    
    // Start loop
    animationLoop();
}

export const actions = {
    'set-lightstick-mode': (btn) => setMode(btn.dataset.mode),
    'set-lightstick-color': (btn) => setColor(btn.dataset.color)
};

export function destroy() {
    if (_rafId) cancelAnimationFrame(_rafId);
    document.body.classList.remove('concert-mode-active');
}
