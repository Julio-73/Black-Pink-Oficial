// Interactive tour date booking & procedural concert ticket generator
import { showToast } from './toast.js';

let bookingModal, modalTitle, detailsTitle, zoneNameEl, zonePriceEl, seatEl, guestNameInput, generateTicketBtn;

let selectedCity = '';
let selectedDate = '';
let selectedZone = '';
let selectedPrice = 0;
let assignedSeat = '';

function updateStagePreview(zoneName) {
    const previewEl = document.getElementById('booking-stage-preview');
    if (!previewEl) return;
    
    let viewDescription = '';
    let stageViewHTML = '';
    let glowColor = '';
    
    switch(zoneName) {
        case 'VIP Standing':
            glowColor = '#ff6b9d';
            viewDescription = '¡VISTA EXTREMA DESDE FRENTE DE ESCENARIO! Estarás a pocos metros de la mítica pasarela de BLACKPINK.';
            stageViewHTML = `
                <div class="stage-view-visual vip">
                    <div class="stage-light" style="background: linear-gradient(to top, rgba(255, 107, 157, 0.4), transparent);"></div>
                    <div class="stage-barrier">BARRA VIP</div>
                    <div class="stage-screen">BORN PINK MAIN STAGE</div>
                </div>
            `;
            break;
        case 'Platinum A':
        case 'Platinum B':
            glowColor = '#00f3ff';
            viewDescription = `Excelente vista panorámica lateral (${zoneName}). Excelente balance de audio y visibilidad directa al escenario secundario.`;
            stageViewHTML = `
                <div class="stage-view-visual platinum">
                    <div class="stage-light" style="background: linear-gradient(to top, rgba(0, 243, 255, 0.3), transparent); transform: rotate(${zoneName.includes('A') ? '-25deg' : '25deg'});"></div>
                    <div class="stage-screen-side">SIDE VIEW</div>
                    <div class="stage-screen">MAIN STAGE</div>
                </div>
            `;
            break;
        case 'Gold Seats':
            glowColor = '#d4af37';
            viewDescription = 'Vista frontal elevada con ángulo completo hacia las pantallas gigantes. Ideal para capturar toda la coreografía.';
            stageViewHTML = `
                <div class="stage-view-visual gold">
                    <div class="stage-light" style="background: linear-gradient(to top, rgba(212, 175, 55, 0.25), transparent);"></div>
                    <div class="stage-center-box">CONSOLA DE SONIDO</div>
                    <div class="stage-screen">MAIN STAGE</div>
                </div>
            `;
            break;
        case 'General Admission':
            glowColor = '#ffffff';
            viewDescription = 'Vista general del estadio entero. Disfruta de la atmósfera electrizante de la marea de lightsticks de BLINK.';
            stageViewHTML = `
                <div class="stage-view-visual general">
                    <div class="stage-stadium-glow">BLINK OCEAN WAVE</div>
                    <div class="stage-screen-far">MAIN STAGE</div>
                </div>
            `;
            break;
        default:
            viewDescription = 'Selecciona una zona en el mapa para ver tu vista al escenario.';
            stageViewHTML = `<div class="stage-preview-placeholder">Selecciona una zona para ver la vista del escenario</div>`;
    }
    
    previewEl.innerHTML = `
        <div class="stage-view-title" style="color: ${glowColor || '#fff'}">VISTA ESTIMADA: ${zoneName.toUpperCase()}</div>
        ${stageViewHTML}
        <div class="stage-view-desc">${viewDescription}</div>
    `;
    previewEl.style.borderColor = glowColor || 'rgba(255, 255, 255, 0.1)';
    if (glowColor) {
        previewEl.style.boxShadow = `0 0 15px ${glowColor}25`;
    } else {
        previewEl.style.boxShadow = 'none';
    }
}

function openBooking(el) {
    selectedCity = el.dataset.city || 'Seoul, South Korea';
    selectedDate = el.dataset.date || 'Oct 15-16, 2022';
    
    // Reset selection state
    selectedZone = '';
    selectedPrice = 0;
    assignedSeat = '';

    if (zoneNameEl) zoneNameEl.textContent = '(Selecciona en el mapa)';
    if (zonePriceEl) zonePriceEl.textContent = '$0';
    if (seatEl) seatEl.textContent = '-';
    if (guestNameInput) guestNameInput.value = '';
    if (generateTicketBtn) {
        generateTicketBtn.disabled = true;
        generateTicketBtn.style.opacity = '0.5';
        generateTicketBtn.style.cursor = 'not-allowed';
    }

    // Reset selected highlights inside the SVG Seating chart
    document.querySelectorAll('#arena-svg .arena-section').forEach(sec => {
        sec.classList.remove('selected');
    });

    updateStagePreview('');

    if (detailsTitle) detailsTitle.textContent = selectedCity.toUpperCase() + ' — ' + selectedDate.toUpperCase();
    if (bookingModal) {
        bookingModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // prevent scrolling behind modal
        
        // Accessibility focus trap setup
        bookingModal.setAttribute('tabindex', '-1');
        bookingModal.focus();
    }
}

function closeBooking() {
    if (bookingModal) {
        bookingModal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function selectZone(el) {
    // Remove previous selection highlights
    document.querySelectorAll('#arena-svg .arena-section').forEach(sec => {
        sec.classList.remove('selected');
    });
    
    el.classList.add('selected');

    selectedZone = el.dataset.zone || 'VIP Zone';
    selectedPrice = Number(el.dataset.price) || 0;
    
    // Generate random seat row and number
    const row = Math.floor(Math.random() * 18) + 1;
    const seat = Math.floor(Math.random() * 32) + 1;
    assignedSeat = `FILA ${row} - ASIENTO ${seat}`;

    if (zoneNameEl) zoneNameEl.textContent = selectedZone;
    if (zonePriceEl) zonePriceEl.textContent = `$${selectedPrice}`;
    if (seatEl) seatEl.textContent = assignedSeat;

    updateStagePreview(selectedZone);

    checkValidation();
}

function checkValidation() {
    const isNameFilled = guestNameInput && guestNameInput.value.trim().length > 0;
    const isZoneSelected = selectedZone !== '';

    if (generateTicketBtn) {
        if (isNameFilled && isZoneSelected) {
            generateTicketBtn.disabled = false;
            generateTicketBtn.style.opacity = '1';
            generateTicketBtn.style.cursor = 'pointer';
        } else {
            generateTicketBtn.disabled = true;
            generateTicketBtn.style.opacity = '0.5';
            generateTicketBtn.style.cursor = 'not-allowed';
        }
    }
}

async function generateTicket() {
    const guestName = (guestNameInput?.value.trim()) || 'OFFICIAL BLINK';
    const serialId = 'BP-TKT-' + Math.floor(100000 + Math.random() * 900000);
    
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');

    // 1. Draw card background gradient
    const grad = ctx.createLinearGradient(0, 0, 800, 0);
    grad.addColorStop(0, '#0a0a0c');
    grad.addColorStop(0.5, '#160711');
    grad.addColorStop(1, '#08080a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 320);

    // Tech lines overlay
    ctx.strokeStyle = 'rgba(255, 107, 157, 0.05)';
    ctx.lineWidth = 1;
    for (let i = -100; i < 1200; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i - 150, 320);
        ctx.stroke();
    }

    // 2. Ticket border
    ctx.strokeStyle = '#ff6b9d';
    ctx.lineWidth = 3;
    ctx.strokeRect(12, 12, 776, 296);

    ctx.strokeStyle = 'rgba(255, 107, 157, 0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(18, 18, 764, 284);

    // Ticket tear dashed line (Stub separator at x = 580)
    ctx.strokeStyle = 'rgba(255, 107, 157, 0.35)';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(580, 20);
    ctx.lineTo(580, 300);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3. Draw Brand logo & header texts
    ctx.fillStyle = '#ff6b9d';
    ctx.font = 'bold 24px "Outfit", Arial';
    ctx.textAlign = 'left';
    ctx.fillText('BORN PINK', 40, 55);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px "Outfit", Arial';
    ctx.fillText('WORLD TOUR OFFICIAL TICKET', 40, 75);

    // 4. Ticket content (Left main side)
    ctx.fillStyle = '#ffffff';
    ctx.font = '30px Arial'; // fallback safe
    ctx.fillText(selectedCity.toUpperCase(), 40, 130);

    ctx.fillStyle = '#ff6b9d';
    ctx.font = 'bold 13px "Outfit", Arial';
    ctx.fillText(selectedDate.toUpperCase(), 40, 160);

    // Seating labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px "Outfit", Arial';
    ctx.fillText('ZONA / SECTOR', 40, 200);
    ctx.fillText('ASIENTO / SEAT', 220, 200);
    ctx.fillText('BLINK HOLDER', 40, 250);

    // Seating values
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px "Outfit", Arial';
    ctx.fillText(selectedZone.toUpperCase(), 40, 220);
    ctx.fillText(assignedSeat, 220, 220);
    ctx.fillStyle = '#ffcce0';
    ctx.fillText(guestName.toUpperCase(), 40, 272);

    // Ticket pricing badge
    ctx.fillStyle = 'rgba(255, 107, 157, 0.12)';
    ctx.strokeStyle = '#ff6b9d';
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(400, 208, 140, 65, 8);
    else ctx.rect(400, 208, 140, 65);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '9px "Outfit", Arial';
    ctx.fillText('TICKET PRICE', 470, 226);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Outfit", Arial';
    ctx.fillText('$' + selectedPrice, 470, 256);

    // 5. Draw Right side stub (Ticket Stub details)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ff6b9d';
    ctx.font = 'bold 15px "Outfit", Arial';
    ctx.fillText('BORN PINK', 600, 55);

    ctx.fillStyle = '#ffffff';
    ctx.font = '9px "Outfit", Arial';
    ctx.fillText('STUB / COMPROBANTE', 600, 72);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px "Outfit", Arial';
    ctx.fillText(selectedZone.toUpperCase(), 600, 110);
    ctx.font = '12px "Outfit", Arial';
    ctx.fillText(assignedSeat, 600, 130);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '9px "Outfit", Arial';
    ctx.fillText('TICKET SERIAL', 600, 165);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px "Outfit", Arial';
    ctx.fillText(serialId, 600, 180);

    // Procedural Barcode on the stub
    ctx.fillStyle = '#ffffff';
    const startBarY = 205, barX = 600, barW = 160, barH = 35;
    let curX = barX;
    let seed = 28394;
    const prng = () => {
        const v = Math.sin(seed++) * 10000;
        return v - Math.floor(v);
    };
    while (curX < barX + barW) {
        const w = Math.floor(prng() * 3) + 1;
        const s = Math.floor(prng() * 4) + 1;
        ctx.fillRect(curX, startBarY, w, barH);
        curX += w + s;
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = '8px "Outfit", Arial';
    ctx.fillText(serialId, barX + barW / 2, startBarY + barH + 12);

    // 6. Holographic reflection sheen
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const sheen = ctx.createLinearGradient(0, 0, 800, 320);
    sheen.addColorStop(0, 'rgba(0, 243, 255, 0.08)');
    sheen.addColorStop(0.3, 'rgba(255, 107, 157, 0.05)');
    sheen.addColorStop(0.5, 'rgba(255, 255, 255, 0.12)');
    sheen.addColorStop(0.7, 'rgba(255, 107, 157, 0.05)');
    sheen.addColorStop(1, 'rgba(0, 243, 255, 0.08)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, 800, 320);
    ctx.restore();

    // 7. Save and trigger download
    try {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `BORN_PINK_TICKET_${selectedCity.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Trigger confetti!
        const effects = await import('./effects.js');
        effects.triggerConfetti(document.querySelector('.booking-modal-content'));

        showToast('¡Ticket descargado exitosamente!', 'success');
        closeBooking();
    } catch {
        showToast('No se pudo generar el ticket en PNG. Toma una captura de pantalla.', 'error');
    }
}

export function init() {
    bookingModal      = document.getElementById('booking-modal');
    detailsTitle      = document.getElementById('booking-details-title');
    zoneNameEl        = document.getElementById('selected-zone-name');
    zonePriceEl       = document.getElementById('selected-zone-price');
    seatEl            = document.getElementById('assigned-seat-number');
    guestNameInput    = document.getElementById('booking-guest-name');
    generateTicketBtn = document.getElementById('btn-generate-ticket');

    // Attach listeners inside booking modal
    _arenaListeners = [];
    document.querySelectorAll('#arena-svg .arena-section').forEach(sec => {
        const fn = (e) => selectZone(e.currentTarget);
        sec.addEventListener('click', fn);
        _arenaListeners.push({ el: sec, fn });
    });

    guestNameInput?.addEventListener('input', checkValidation);
    generateTicketBtn?.addEventListener('click', generateTicket);

    // Esc closes modal
    _escapeBookingHandler = (e) => {
        if (e.key === 'Escape' && bookingModal && bookingModal.style.display === 'block') {
            closeBooking();
        }
    };
    window.addEventListener('keydown', _escapeBookingHandler);
}

export const actions = {
    'open-booking': (el) => openBooking(el),
    'close-booking-modal': () => closeBooking()
};

let _arenaListeners = [];
let _escapeBookingHandler = null;

export function destroy() {
    if (_escapeBookingHandler) window.removeEventListener('keydown', _escapeBookingHandler);
    _arenaListeners.forEach(({ el, fn }) => el.removeEventListener('click', fn));
    _arenaListeners = [];
    if (guestNameInput) guestNameInput.removeEventListener('input', checkValidation);
    if (generateTicketBtn) generateTicketBtn.removeEventListener('click', generateTicket);
    if (bookingModal) { bookingModal.style.display = 'none'; document.body.style.overflow = ''; }
}
