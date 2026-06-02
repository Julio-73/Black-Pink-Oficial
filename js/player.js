// Music player: main panel + mini player + procedural visualizer
const PLAYLIST = [
    { title: 'DDu-Du DDu-Du',     url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', cover: 'https://img.youtube.com/vi/bwmSjveZ3n8/hqdefault.jpg' },
    { title: 'Kill This Love',    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', cover: 'https://img.youtube.com/vi/2S24-y0Y3pE/hqdefault.jpg' },
    { title: 'How You Like That', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', cover: 'https://img.youtube.com/vi/IHdVIe785wQ/hqdefault.jpg' },
    { title: 'Lovesick Girls',    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', cover: 'https://img.youtube.com/vi/dyRsYk0LyA8/hqdefault.jpg' },
    { title: 'Shut Down',         url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', cover: 'https://img.youtube.com/vi/POe9SOEKotk/hqdefault.jpg' }
];

let audioEl, playPauseBtn, playPauseIcon, vinylEl, vinylCoverEl, trackTitleEl;
let prevBtn, nextBtn, progressBarContainer, progressFill, currentTimeEl, durationEl;
let muteBtn, muteIcon, volumeSlider, volumeFill;
let miniPlayer, mainPlayerPanel, miniVinyl, miniVinylCover, miniTrackTitle, miniPlayPause, miniPlayPauseIcon, miniNext;
let visualizerCanvas;

let currentSongIndex = 0;
let isMuted = false;
let preMuteVolume = 0.8;
let visualizerStarted = false;

function loadSong(index) {
    currentSongIndex = index;
    const song = PLAYLIST[index];
    if (audioEl) { audioEl.src = song.url; audioEl.load(); }
    if (trackTitleEl) trackTitleEl.textContent = song.title;
    if (vinylCoverEl) vinylCoverEl.src = song.cover;
    syncMiniPlayerInfo();

    document.querySelectorAll('.song-item').forEach(row => {
        row.classList.remove('playing-now');
        const t = row.querySelector('.song-title')?.textContent.trim().toLowerCase();
        if (t === song.title.toLowerCase()) row.classList.add('playing-now');
    });
}

function togglePlayPause() {
    if (!audioEl) return;
    if (audioEl.paused) audioEl.play().catch(() => {});
    else audioEl.pause();
}

function next() {
    loadSong((currentSongIndex + 1) % PLAYLIST.length);
    audioEl?.play().catch(() => {});
}

function prev() {
    let i = currentSongIndex - 1;
    if (i < 0) i = PLAYLIST.length - 1;
    loadSong(i);
    audioEl?.play().catch(() => {});
}

function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
}

function updateVolumeIcon(vol) {
    if (!muteIcon) return;
    if (vol === 0) muteIcon.className = 'bx bx-volume-mute';
    else if (vol < 0.4) muteIcon.className = 'bx bx-volume';
    else muteIcon.className = 'bx bx-volume-full';
}

function syncMiniPlayerInfo() {
    const song = PLAYLIST[currentSongIndex];
    if (miniTrackTitle) miniTrackTitle.textContent = song.title;
    if (miniVinylCover) miniVinylCover.src = song.cover;
}

function setupVisualizer() {
    if (!visualizerCanvas || visualizerStarted) return;
    visualizerStarted = true;

    const vCtx = visualizerCanvas.getContext('2d');
    const width = visualizerCanvas.width;
    const height = visualizerCanvas.height;
    const bufferLength = 32;
    const dataArray = new Uint8Array(bufferLength);

    function renderLoop() {
        requestAnimationFrame(renderLoop);

        if (audioEl && !audioEl.paused) {
            const t = Date.now() * 0.005;
            for (let i = 0; i < bufferLength; i++) {
                const bass = Math.sin(t * 0.85) * 0.4 + 0.6;
                const mid  = Math.cos(i * 0.28 - t * 0.55) * 0.5 + 0.5;
                const high = Math.sin(i * 0.6 + t * 1.15) * 0.3 + 0.3;
                let amp = 0;
                if (i < 8) amp = (bass * 0.75 + mid * 0.25) * 190;
                else if (i < 20) amp = (mid * 0.8 + high * 0.2) * 140;
                else amp = (high * 0.85 + Math.random() * 0.15) * 90;
                dataArray[i] = amp * (1 - (i / bufferLength) * 0.45);
            }
        } else {
            for (let i = 0; i < bufferLength; i++) {
                dataArray[i] = Math.max(0, dataArray[i] - 5);
            }
        }

        vCtx.clearRect(0, 0, width, height);
        vCtx.fillStyle = 'rgba(15, 15, 15, 0.1)';
        vCtx.fillRect(0, 0, width, height);

        const barWidth = (width / bufferLength) * 1.55;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
            let barHeight = (dataArray[i] / 255) * height * 0.85;
            if (barHeight < 3) barHeight = 3;
            const grad = vCtx.createLinearGradient(0, height, 0, height - barHeight);
            grad.addColorStop(0, '#a62e5b');
            grad.addColorStop(1, '#ff6b9d');
            vCtx.fillStyle = grad;
            vCtx.shadowBlur = 5;
            vCtx.shadowColor = '#ff6b9d';
            vCtx.beginPath();
            const rw = barWidth - 2;
            const ry = height - barHeight;
            if (vCtx.roundRect) vCtx.roundRect(x, ry, rw, barHeight, [3, 3, 0, 0]);
            else vCtx.rect(x, ry, rw, barHeight);
            vCtx.fill();
            x += barWidth;
        }
    }

    renderLoop();
}

export function init() {
    audioEl = document.getElementById('bp-audio');
    playPauseBtn = document.getElementById('player-play-pause');
    playPauseIcon = document.getElementById('play-pause-icon');
    vinylEl = document.getElementById('player-vinyl');
    vinylCoverEl = document.getElementById('player-vinyl-cover');
    trackTitleEl = document.getElementById('player-track-title');
    prevBtn = document.getElementById('player-prev');
    nextBtn = document.getElementById('player-next');
    progressBarContainer = document.getElementById('player-progress-bar');
    progressFill = document.getElementById('player-progress-fill');
    currentTimeEl = document.getElementById('player-current-time');
    durationEl = document.getElementById('player-duration');
    muteBtn = document.getElementById('player-mute');
    muteIcon = document.getElementById('mute-icon');
    volumeSlider = document.getElementById('player-volume-slider');
    volumeFill = document.getElementById('player-volume-fill');
    visualizerCanvas = document.getElementById('player-visualizer-canvas');

    miniPlayer = document.getElementById('mini-player-floating');
    mainPlayerPanel = document.querySelector('.music-player-panel');
    miniVinyl = document.getElementById('mini-vinyl');
    miniVinylCover = document.getElementById('mini-vinyl-cover');
    miniTrackTitle = document.getElementById('mini-track-title');
    miniPlayPause = document.getElementById('mini-play-pause');
    miniPlayPauseIcon = document.getElementById('mini-play-pause-icon');
    miniNext = document.getElementById('mini-next');

    if (!audioEl) return;

    playPauseBtn?.addEventListener('click', togglePlayPause);
    nextBtn?.addEventListener('click', next);
    prevBtn?.addEventListener('click', prev);

    audioEl.addEventListener('play', () => {
        if (playPauseIcon) playPauseIcon.className = 'bx bx-pause';
        vinylEl?.classList.add('playing');
        document.getElementById('player-equalizer')?.classList.add('active');
        if (miniPlayPauseIcon) miniPlayPauseIcon.className = 'bx bx-pause';
        miniVinyl?.classList.add('playing');
        setupVisualizer();
    });

    audioEl.addEventListener('pause', () => {
        if (playPauseIcon) playPauseIcon.className = 'bx bx-play';
        vinylEl?.classList.remove('playing');
        document.getElementById('player-equalizer')?.classList.remove('active');
        if (miniPlayPauseIcon) miniPlayPauseIcon.className = 'bx bx-play';
        miniVinyl?.classList.remove('playing');
    });

    audioEl.addEventListener('timeupdate', () => {
        const ct = audioEl.currentTime;
        const dur = audioEl.duration;
        if (isNaN(dur)) return;
        const pct = (ct / dur) * 100;
        if (progressFill) progressFill.style.width = `${pct}%`;
        if (currentTimeEl) currentTimeEl.textContent = formatTime(ct);
        if (durationEl) durationEl.textContent = formatTime(dur);
    });

    audioEl.addEventListener('ended', next);
    audioEl.addEventListener('loadstart', syncMiniPlayerInfo);

    progressBarContainer?.addEventListener('click', (e) => {
        const w = progressBarContainer.clientWidth;
        const dur = audioEl.duration;
        if (isNaN(dur)) return;
        audioEl.currentTime = (e.offsetX / w) * dur;
    });

    volumeSlider?.addEventListener('click', (e) => {
        const w = volumeSlider.clientWidth;
        let vol = e.offsetX / w;
        if (vol < 0) vol = 0;
        if (vol > 1) vol = 1;
        audioEl.volume = vol;
        if (volumeFill) volumeFill.style.width = `${vol * 100}%`;
        isMuted = vol === 0;
        updateVolumeIcon(vol);
    });

    muteBtn?.addEventListener('click', () => {
        if (isMuted) {
            audioEl.volume = preMuteVolume;
            isMuted = false;
            if (volumeFill) volumeFill.style.width = `${preMuteVolume * 100}%`;
        } else {
            preMuteVolume = audioEl.volume;
            audioEl.volume = 0;
            isMuted = true;
            if (volumeFill) volumeFill.style.width = '0%';
        }
        updateVolumeIcon(audioEl.volume);
    });

    // Top songs click → load + play
    document.querySelectorAll('.song-row-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const title = this.querySelector('.song-title')?.textContent.trim().toLowerCase();
            const idx = PLAYLIST.findIndex(s => s.title.toLowerCase() === title);
            if (idx !== -1) {
                loadSong(idx);
                audioEl.play().catch(() => {});
                mainPlayerPanel?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });

    // Mini player controls
    miniPlayPause?.addEventListener('click', (e) => { e.stopPropagation(); togglePlayPause(); });
    miniNext?.addEventListener('click', (e) => { e.stopPropagation(); next(); });

    // Show mini player only when main panel is out of viewport
    window.addEventListener('scroll', () => {
        if (!miniPlayer || !mainPlayerPanel) return;
        const r = mainPlayerPanel.getBoundingClientRect();
        const hidden = r.bottom < 0 || r.top > window.innerHeight;
        miniPlayer.classList.toggle('visible', hidden);
    }, { passive: true });

    // Init with first song
    loadSong(0);
}
