// Interactive personality quiz + VIP fan pass canvas exporter
import { showToast } from './toast.js';
import { triggerConfetti } from './effects.js';

const QUESTIONS = [
    {
        question: '¿Cuál es tu estilo de moda favorito?',
        options: [
            { text: 'Chic y audaz (Chaqueta de cuero, botas negras y outfits de pasarela)', value: 'E' },
            { text: 'Streetwear moderno (Ropa urbana holgada, gorras y zapatillas exclusivas)', value: 'L' },
            { text: 'Boho-chic y artístico (Vestidos fluidos, tonos cálidos y accesorios de guitarra)', value: 'R' },
            { text: 'Elegante, floral y clásico (Vestidos sencillos, colores pastel y detalles sobrios)', value: 'J' }
        ]
    },
    {
        question: '¿Cómo pasas tu sábado ideal de descanso?',
        options: [
            { text: 'Jugando videojuegos, leyendo mangas o durmiendo cómodamente en casa', value: 'J' },
            { text: 'Bailando en un estudio, haciendo skate o viajando a un rincón inesperado', value: 'L' },
            { text: 'Tocando el piano/guitarra, componiendo o pintando en un lienzo', value: 'R' },
            { text: 'De compras en boutiques de lujo o cenando en un restaurante muy exclusivo', value: 'E' }
        ]
    },
    {
        question: 'Si pudieras tomar un vuelo hoy, tu destino preferido sería:',
        options: [
            { text: 'París, Francia (Capital de la moda, cafés refinados e historia del arte)', value: 'E' },
            { text: 'Hawái, EE.UU. (Playas paradisíacas, surf y pura aventura tropical)', value: 'L' },
            { text: 'Kioto, Japón (Templos tradicionales zen, paisajes calmos y cerezos en flor)', value: 'J' },
            { text: 'Londres, Inglaterra (Atmósfera musical indie, museos y tardes de café lluviosas)', value: 'R' }
        ]
    },
    {
        question: '¿Cuál es tu rol principal en tu grupo de amigos?',
        options: [
            { text: 'La persona astuta e ingeniosa que siempre los hace sonreír con sus chistes', value: 'J' },
            { text: 'La persona líder que propone las salidas y siempre luce impecable', value: 'E' },
            { text: 'La persona empática, sensible y consejera a la que le cuentan sus secretos', value: 'R' },
            { text: 'La persona hiperactiva, alegre y alma de la fiesta que contagia energía', value: 'L' }
        ]
    },
    {
        question: '¿Cuál es tu comida o postre favorito indiscutible?',
        options: [
            { text: 'Helado artesanal, repostería gourmet de fresas o comida fusión de autor', value: 'E' },
            { text: 'Ramen picante japonés, tacos al pastor o cocina tailandesa aromática', value: 'L' },
            { text: 'Tarta de chocolate oscuro, café americano y frutas frescas saludables', value: 'R' },
            { text: 'Brochetas tradicionales de carne, arroz frito o un gran postre dulce de queso', value: 'J' }
        ]
    }
];

const MEMBERS = {
    E: {
        name: 'Jennie', role: 'Main Rapper & Fashion Icon', img: 'img/jenny.webp',
        desc: 'Eres audaz, sumamente influyente y tienes un gusto exquisito. Eres un líder natural que establece tendencias en lugar de seguirlas. Tienes una presencia magnética y una confianza inquebrantable, ¡brillas con luz propia en cualquier lugar!',
        solo: 'https://www.youtube.com/watch?v=gQlMMD8auMs'
    },
    L: {
        name: 'Lisa', role: 'Main Dancer & Rapper', img: 'img/lisa.webp',
        desc: 'Eres dinamismo, risas y carisma puro. Tu personalidad magnética ilumina cualquier habitación. Destacas por tu perseverancia, una energía desbordante y una agilidad mental asombrosa. ¡Tienes el ritmo en las venas y amas la libertad!',
        solo: 'https://www.youtube.com/watch?v=dNCWe_6HAwM'
    },
    R: {
        name: 'Rosé', role: 'Main Vocalist', img: 'img/rose.webp',
        desc: 'Eres una persona con un alma profundamente artística, sensible y de sentimientos puros. Te expresas de forma genuina y profunda. Valoras la música, la naturaleza y los detalles más hermosos de la vida. ¡Tu empatía conecta al instante!',
        solo: 'https://www.youtube.com/watch?v=2_VLdL7alJU'
    },
    J: {
        name: 'Jisoo', role: 'Visual & Lead Vocalist', img: 'img/jisoo.webp',
        desc: 'Eres sumamente madura, sensata y el pilar fundamental que une a tus seres queridos. Posees un humor brillante, eres bondadosa e independiente. Detrás de tu naturaleza tranquila y adorable se esconde una voluntad de hierro impenetrable.',
        solo: 'https://www.youtube.com/watch?v=IKh3hHaJJPk'
    }
};

let introScreen, questionScreen, resultScreen, cardEl;
let currentNumEl, percentEl, progressFill, questionTextEl, optionsGrid;
let resultImg, resultMember, resultRole, resultDesc, soloLink;
let vipUserNameInput, vipPassCard;

let currentIndex = 0;
let scores = { J: 0, E: 0, R: 0, L: 0 };

function generateNewSerial() {
    const el = document.getElementById('vip-serial-number');
    if (el) el.textContent = 'BP-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
}

function startQuiz() {
    currentIndex = 0;
    scores = { J: 0, E: 0, R: 0, L: 0 };
    introScreen?.classList.remove('active');
    resultScreen?.classList.remove('active');
    questionScreen?.classList.add('active');
    generateNewSerial();
    showQuestion(0);
}

function showQuestion(index) {
    if (index >= QUESTIONS.length) { calculateAndShowResult(); return; }
    const q = QUESTIONS[index];
    if (currentNumEl) currentNumEl.textContent = String(index + 1);
    const percent = Math.round(((index + 1) / QUESTIONS.length) * 100);
    if (percentEl) percentEl.textContent = String(percent);
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (questionTextEl) questionTextEl.textContent = q.question;

    if (!optionsGrid) return;
    optionsGrid.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.type = 'button';
        const letterEl = document.createElement('span');
        letterEl.className = 'quiz-option-letter';
        letterEl.textContent = letters[i];
        const textEl = document.createElement('span');
        textEl.textContent = opt.text;
        btn.appendChild(letterEl);
        btn.appendChild(textEl);
        btn.addEventListener('click', () => {
            scores[opt.value]++;
            currentIndex++;
            if (cardEl) {
                cardEl.style.transform = 'scale(0.97)';
                setTimeout(() => {
                    cardEl.style.transform = 'scale(1)';
                    showQuestion(currentIndex);
                }, 250);
            } else {
                showQuestion(currentIndex);
            }
        });
        optionsGrid.appendChild(btn);
    });
}

function calculateAndShowResult() {
    questionScreen?.classList.remove('active');
    resultScreen?.classList.add('active');

    let topMember = 'J';
    let topScore = -1;
    for (const [k, v] of Object.entries(scores)) {
        if (v > topScore) { topScore = v; topMember = k; }
    }
    const r = MEMBERS[topMember];
    if (resultImg) {
        resultImg.src = r.img;
        resultImg.alt = `Foto de ${r.name}`;
    }
    if (resultMember) resultMember.textContent = r.name;
    if (resultRole) resultRole.textContent = r.role;
    if (resultDesc) resultDesc.textContent = r.desc;
    if (soloLink) soloLink.href = r.solo;

    triggerConfetti(cardEl);

    if (resultMember) {
        resultMember.setAttribute('tabindex', '-1');
        resultMember.focus({ preventScroll: false });
        setTimeout(() => resultMember.removeAttribute('tabindex'), 1000);
    }
}

// ----------- VIP pass canvas exporter -----------
function generateVIPPassPNG() {
    const userName = (vipUserNameInput?.value.trim()) || 'OFFICIAL BLINK';
    const serialId = document.getElementById('vip-serial-number')?.textContent || 'BP-2026-99999';
    const memberName = resultMember?.textContent || 'Rosé';
    const memberRole = resultRole?.textContent || 'Main Vocalist';
    const memberImgEl = document.getElementById('quiz-result-img');
    const logoEl = document.querySelector('.vip-logo');

    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 860;
    const ctx = canvas.getContext('2d');

    // 1. Background gradient
    const bg = ctx.createLinearGradient(0, 0, 0, 860);
    bg.addColorStop(0, '#160810');
    bg.addColorStop(0.5, '#0a0a0a');
    bg.addColorStop(1, '#1b0b14');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 600, 860);

    // Tech lines overlay
    ctx.strokeStyle = 'rgba(255, 107, 157, 0.035)';
    ctx.lineWidth = 1;
    for (let i = -200; i < 1500; i += 18) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i - 450, 860);
        ctx.stroke();
    }

    // 2. Borders
    ctx.strokeStyle = '#ff6b9d';
    ctx.lineWidth = 4;
    ctx.strokeRect(18, 18, 564, 824);
    ctx.strokeStyle = 'rgba(255, 107, 157, 0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(26, 26, 548, 808);

    // 3. Header
    if (logoEl && logoEl.complete) ctx.drawImage(logoEl, 48, 48, 140, 32);
    else {
        ctx.fillStyle = '#ff6b9d';
        ctx.font = 'bold 26px "Outfit", Arial';
        ctx.fillText('BLACKPINK', 48, 72);
    }
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Outfit", Arial';
    ctx.fillText('VIP FAN ACCESS', 552, 70);

    // Divider
    ctx.strokeStyle = 'rgba(255, 107, 157, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(35, 105);
    ctx.lineTo(565, 105);
    ctx.stroke();

    // 4. Portrait
    if (memberImgEl && memberImgEl.complete) {
        const size = 260, x = 170, y = 165;
        const halo = ctx.createRadialGradient(300, 295, 70, 300, 295, 160);
        halo.addColorStop(0, 'rgba(255, 107, 157, 0.28)');
        halo.addColorStop(1, 'rgba(255, 107, 157, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(300, 295, 160, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.arc(300, 295, 130, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(memberImgEl, x, y, size, size);
        ctx.restore();

        ctx.strokeStyle = '#ff6b9d';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(300, 295, 130, 0, Math.PI * 2);
        ctx.stroke();
    }

    // 5. Soulmate texts
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff6b9d';
    ctx.font = 'bold 13px "Outfit", Arial';
    ctx.fillText('YOUR BLINK SOULMATE', 300, 485);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px "Outfit", Arial';
    ctx.fillText(memberName.toUpperCase(), 300, 538);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
    ctx.font = '17px "Outfit", Arial';
    ctx.fillText(memberRole, 300, 574);

    // Dashed ticket cut
    ctx.strokeStyle = 'rgba(255, 107, 157, 0.22)';
    ctx.lineWidth = 1;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(50, 615);
    ctx.lineTo(550, 615);
    ctx.stroke();
    ctx.setLineDash([]);

    // 6. Pass info
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '11px "Outfit", Arial';
    ctx.fillText('PASS HOLDER', 60, 658);
    ctx.fillStyle = '#ffcce0';
    ctx.font = 'bold 24px "Outfit", Arial';
    ctx.fillText(userName.toUpperCase(), 60, 693);

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '11px "Outfit", Arial';
    ctx.fillText('CARD SERIAL', 540, 658);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px "Outfit", Arial';
    ctx.fillText(serialId, 540, 693);

    // 7. Procedural Barcode
    ctx.fillStyle = '#ffffff';
    const startBarX = 60, barY = 735, barH = 45, maxBarW = 480;
    let curX = startBarX;
    let seed = 12948;
    const prng = () => {
        const v = Math.sin(seed++) * 10000;
        return v - Math.floor(v);
    };
    while (curX < startBarX + maxBarW) {
        const w = Math.floor(prng() * 4) + 1;
        const s = Math.floor(prng() * 5) + 1;
        ctx.fillRect(curX, barY, w, barH);
        curX += w + s;
    }

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = '10px "Outfit", Arial';
    ctx.fillText('*' + serialId + '*', 300, 800);

    try {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${userName.replace(/\s+/g, '_')}_BLINK_VIP_Pass.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Tu VIP pass se descargó', 'success');
    } catch {
        showToast('No se pudo descargar el pase VIP. Toma una captura de pantalla para guardarlo', 'error');
    }
}

export function init() {
    introScreen     = document.getElementById('quiz-screen-intro');
    questionScreen  = document.getElementById('quiz-screen-question');
    resultScreen    = document.getElementById('quiz-screen-result');
    cardEl          = document.getElementById('quiz-card');
    currentNumEl    = document.getElementById('quiz-current-num');
    percentEl       = document.getElementById('quiz-percent');
    progressFill    = document.getElementById('quiz-progress-fill');
    questionTextEl  = document.getElementById('quiz-question-text');
    optionsGrid     = document.getElementById('quiz-options-grid');
    resultImg       = document.getElementById('quiz-result-img');
    resultMember    = document.getElementById('quiz-result-member');
    resultRole      = document.getElementById('quiz-result-role');
    resultDesc      = document.getElementById('quiz-result-desc');
    soloLink        = document.getElementById('btn-solo-link');
    vipUserNameInput = document.getElementById('vip-user-name');
    vipPassCard     = document.getElementById('blink-vip-pass');

    document.getElementById('btn-start-quiz')?.addEventListener('click', startQuiz);
    document.getElementById('btn-restart-quiz')?.addEventListener('click', startQuiz);
    document.getElementById('btn-download-pass')?.addEventListener('click', generateVIPPassPNG);

    generateNewSerial();

    if (vipUserNameInput && vipPassCard) {
        vipUserNameInput.addEventListener('focus', () => {
            vipPassCard.style.boxShadow = '0 20px 50px rgba(255, 107, 157, 0.35), 0 0 35px rgba(255, 107, 157, 0.25)';
            vipPassCard.style.borderColor = '#ff6b9d';
        });
        vipUserNameInput.addEventListener('blur', () => {
            vipPassCard.style.boxShadow = '';
            vipPassCard.style.borderColor = '';
        });
    }
}
