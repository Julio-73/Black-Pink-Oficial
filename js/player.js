// Music player: main panel + mini player + procedural visualizer
// Uses YouTube Iframe API for real BLACKPINK audio
const PLAYLIST = [
    {
        title: 'DDu-Du DDu-Du',
        videoId: 'IHNzOHi8sJs',
        cover: 'https://img.youtube.com/vi/IHNzOHi8sJs/hqdefault.jpg',
        lyrics: [
            { time: 0, text: '[Instrumental Intro]' },
            { time: 5, text: 'BLACKPINK!' },
            { time: 7, text: 'Ah yeah, ah yeah!' },
            { time: 10, text: 'BLACKPINK IN YOUR AREA!' },
            { time: 15, text: '착한 얼굴에 그렇지 못한 태도' },
            { time: 19, text: '가녀린 몸매 속 가려진 double volume' },
            { time: 24, text: '거침없이 직진 굳이 보지 않지 눈치' },
            { time: 29, text: 'Black에서 Pink, 우린 예쁘장한 savage' },
            { time: 34, text: '원할 땐 대놓고 뺏지' },
            { time: 37, text: '넌 뭘 해도 칼로 물 베기' },
            { time: 40, text: '두 손엔 가득한 fat check' },
            { time: 43, text: '궁금하면 해봐 fact check' }
        ]
    },
    {
        title: 'Kill This Love',
        videoId: '2S24-y0Y3pE',
        cover: 'https://img.youtube.com/vi/2S24-y0Y3pE/hqdefault.jpg',
        lyrics: [
            { time: 0, text: '[Trumpet Intro]' },
            { time: 4, text: 'BLACKPINK in your area!' },
            { time: 8, text: '천사 같은 hi 끝엔 악마 같은 bye' },
            { time: 12, text: '매번 미칠듯한 high 뒤엔 뱉어야 하는 price' },
            { time: 17, text: '이건 답이 없는 test 매번 속더라도 yes' },
            { time: 21, text: '딱한 감정의 노예' },
            { time: 25, text: '얼어 죽을 사랑해' },
            { time: 29, text: "Let's kill this love! Yeah, yeah, yeah!" }
        ]
    },
    {
        title: 'How You Like That',
        videoId: 'ioNng23DkIM',
        cover: 'https://img.youtube.com/vi/ioNng23DkIM/hqdefault.jpg',
        lyrics: [
            { time: 0, text: '[Dramatic Intro]' },
            { time: 5, text: 'BLACKPINK in your area!' },
            { time: 8, text: '보란 듯이 무너졌어' },
            { time: 12, text: '바닥을 뚫고 저 지하까지' },
            { time: 16, text: '옷자락 잡겠다고' },
            { time: 20, text: '저 높i 두 손을 뻗어봐도' },
            { time: 24, text: '다시 캄캄한 이곳에 light up the sky' },
            { time: 29, text: "네 눈을 보며 I'll kiss you goodbye" },
            { time: 33, text: 'How you like that? (Uh!)' }
        ]
    },
    {
        title: 'Lovesick Girls',
        videoId: 'dyRsYk0LyA8',
        cover: 'https://img.youtube.com/vi/dyRsYk0LyA8/hqdefault.jpg',
        lyrics: [
            { time: 0, text: '[Acoustic Guitar Intro]' },
            { time: 5, text: '영원한 밤' },
            { time: 8, text: '창문 없는 방에 우릴 가둔 love' },
            { time: 12, text: 'What can we say?' },
            { time: 15, text: '매번 아파도 외치는 love' },
            { time: 20, text: '다치고 망가져도 나 뭘 믿고 버티는 거야' },
            { time: 25, text: '어차피 떠나면 상처뿐인 상태로' },
            { time: 30, text: 'We are the lovesick girls!' }
        ]
    },
    {
        title: 'Shut Down',
        videoId: 'POe9SOEKotk',
        cover: 'https://img.youtube.com/vi/POe9SOEKotk/hqdefault.jpg',
        lyrics: [
            { time: 0, text: '[La Campanella Violin Sample]' },
            { time: 5, text: 'BLACKPINK in your area!' },
            { time: 8, text: '컴백이 아냐 떠난 적 없으니까' },
            { time: 12, text: '머리 위 대들의 목이 꺾인 지 오래' },
            { time: 16, text: '가만히 있어도 알아서 기어' },
            { time: 20, text: '초록빛 분홍빛 불을 켜' },
            { time: 24, text: '가라앉지 않는 인기' },
            { time: 28, text: '휩쓸고 간 자리엔' },
            { time: 32, text: 'Keep watching me shut you down!' }
        ]
    }
];

let ytPlayer = null;
let ytReady = false;
let playPauseBtn, playPauseIcon, vinylEl, vinylCoverEl, trackTitleEl;
let prevBtn, nextBtn, progressBarContainer, progressFill, currentTimeEl, durationEl;
let muteBtn, muteIcon, volumeSlider, volumeFill;
let miniPlayer, mainPlayerPanel, miniVinyl, miniVinylCover, miniTrackTitle, miniPlayPause, miniPlayPauseIcon, miniNext;
let visualizerCanvas, tonearmEl;
let lyricsTitleEl, lyricsBoxEl;

let currentSongIndex = 0;
let isMuted = false;
let preMuteVolume = 80;
let visualizerStarted = false;
let _visualizerRaf = null;
let _scrollMiniHandler = null;
let _progressInterval = null;
let _isPlaying = false;
let _pendingSongIndex = -1;
let _pendingAutoPlay = false;

function renderLyrics(song) {
    if (!lyricsBoxEl) return;
    lyricsBoxEl.innerHTML = '';
    if (!song.lyrics || song.lyrics.length === 0) {
        lyricsBoxEl.innerHTML = '<p class="no-lyrics">No lyrics available</p>';
        return;
    }
    song.lyrics.forEach((line, i) => {
        const p = document.createElement('p');
        p.textContent = line.text;
        p.dataset.time = line.time;
        p.id = `lyric-line-${i}`;
        lyricsBoxEl.appendChild(p);
    });
    lyricsBoxEl.scrollTop = 0;
}

const SONG_THEMES = {
    'ddu-du ddu-du': 'square-up',
    'kill this love': 'kill-this-love',
    'how you like that': 'the-album',
    'lovesick girls': 'the-album',
    'shut down': 'born-pink'
};

export function changeTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
}

function applySongTheme(title) {
    const theme = SONG_THEMES[title.toLowerCase()] || 'born-pink';
    changeTheme(theme);
}

function loadSong(index, autoPlay) {
    currentSongIndex = index;
    const song = PLAYLIST[index];
    applySongTheme(song.title);
    if (ytReady && ytPlayer) {
        ytPlayer.loadVideoById(song.videoId);
        ytPlayer.seekTo(0);
        if (autoPlay) ytPlayer.playVideo();
    } else {
        _pendingSongIndex = index;
        _pendingAutoPlay = !!autoPlay;
    }
    if (trackTitleEl) trackTitleEl.textContent = song.title;
    if (vinylCoverEl) vinylCoverEl.src = song.cover;
    if (lyricsTitleEl) lyricsTitleEl.textContent = `${song.title} - BLACKPINK`;
    renderLyrics(song);
    syncMiniPlayerInfo();
    document.querySelectorAll('.song-item').forEach(row => {
        row.classList.remove('playing-now');
        const t = row.querySelector('.song-title')?.textContent.trim().toLowerCase();
        if (t === song.title.toLowerCase()) row.classList.add('playing-now');
    });
}

function setPlayUI(playing) {
    _isPlaying = playing;
    const icon = playing ? 'bx bx-pause' : 'bx bx-play';
    if (playPauseIcon) playPauseIcon.className = icon;
    if (miniPlayPauseIcon) miniPlayPauseIcon.className = icon;
    vinylEl?.classList.toggle('playing', playing);
    tonearmEl?.classList.toggle('playing', playing);
    miniVinyl?.classList.toggle('playing', playing);
    document.getElementById('player-equalizer')?.classList.toggle('active', playing);
}

function togglePlayPause() {
    if (!ytReady || !ytPlayer) return;
    if (_isPlaying) {
        ytPlayer.pauseVideo();
        setPlayUI(false);
    } else {
        ytPlayer.playVideo();
        setPlayUI(true);
        setupVisualizer();
    }
}

function next() {
    const idx = (currentSongIndex + 1) % PLAYLIST.length;
    loadSong(idx, _isPlaying);
}

function prev() {
    let i = currentSongIndex - 1;
    if (i < 0) i = PLAYLIST.length - 1;
    loadSong(i, _isPlaying);
}

function formatTime(secs) {
    if (isNaN(secs) || !isFinite(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
}

function updateVolumeIcon(vol) {
    if (!muteIcon) return;
    if (vol === 0) muteIcon.className = 'bx bx-volume-mute';
    else if (vol < 40) muteIcon.className = 'bx bx-volume';
    else muteIcon.className = 'bx bx-volume-full';
}

function syncMiniPlayerInfo() {
    const song = PLAYLIST[currentSongIndex];
    if (miniTrackTitle) miniTrackTitle.textContent = song.title;
    if (miniVinylCover) miniVinylCover.src = song.cover;
}

function startProgressPolling() {
    if (_progressInterval) return;
    _progressInterval = setInterval(() => {
        if (!ytReady || !ytPlayer || !_isPlaying) return;
        const ct = ytPlayer.getCurrentTime();
        const dur = ytPlayer.getDuration();
        if (dur && dur > 0) {
            const pct = (ct / dur) * 100;
            if (progressFill) progressFill.style.width = `${Math.min(pct, 100)}%`;
            if (currentTimeEl) currentTimeEl.textContent = formatTime(ct);
            if (durationEl) durationEl.textContent = formatTime(dur);
        }
        syncLyrics(ct);
    }, 250);
}

function syncLyrics(ct) {
    if (!lyricsBoxEl || !PLAYLIST[currentSongIndex].lyrics) return;
    const lyrics = PLAYLIST[currentSongIndex].lyrics;
    let activeIndex = -1;
    for (let i = 0; i < lyrics.length; i++) {
        if (ct >= lyrics[i].time) activeIndex = i;
        else break;
    }
    if (activeIndex !== -1) {
        const lines = lyricsBoxEl.querySelectorAll('p');
        lines.forEach((line, idx) => {
            line.className = idx === activeIndex ? 'lyrics-highlight' : '';
        });
        const active = lines[activeIndex];
        if (active) {
            const boxHeight = lyricsBoxEl.clientHeight;
            const lineTop = active.offsetTop;
            const lineHeight = active.clientHeight;
            lyricsBoxEl.scrollTo({
                top: lineTop - boxHeight / 2 + lineHeight / 2,
                behavior: 'smooth'
            });
        }
    }
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
        _visualizerRaf = requestAnimationFrame(renderLoop);
        if (_isPlaying) {
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
            let bassSum = 0;
            for (let i = 0; i < 8; i++) {
                bassSum += dataArray[i];
            }
            window.bpBassIntensity = bassSum / 8 / 190;
        } else {
            for (let i = 0; i < bufferLength; i++) {
                dataArray[i] = Math.max(0, dataArray[i] - 5);
            }
            window.bpBassIntensity = 0;
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

function initYouTube() {
    if (ytReady || !window.YT) return;
    ytPlayer = new YT.Player('bp-youtube-player', {
        height: 0,
        width: 0,
        videoId: PLAYLIST[0].videoId,
        playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0
        },
        events: {
            onReady: () => {
                ytReady = true;
                ytPlayer.setVolume(preMuteVolume);
                if (_pendingSongIndex !== -1) {
                    loadSong(_pendingSongIndex, _pendingAutoPlay);
                    _pendingSongIndex = -1;
                    _pendingAutoPlay = false;
                } else {
                    loadSong(0);
                }
                startProgressPolling();
            },
            onStateChange: (e) => {
                if (e.data === YT.PlayerState.PLAYING) {
                    setPlayUI(true);
                    setupVisualizer();
                } else if (e.data === YT.PlayerState.PAUSED) {
                    setPlayUI(false);
                } else if (e.data === YT.PlayerState.ENDED) {
                    setPlayUI(false);
                    next();
                } else if (e.data === YT.PlayerState.CUED) {
                    if (durationEl) durationEl.textContent = formatTime(ytPlayer.getDuration());
                }
            },
            onError: () => {
                setPlayUI(false);
            }
        }
    });
}

export function init() {
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
    tonearmEl = document.getElementById('player-tonearm');
    lyricsTitleEl = document.getElementById('lyrics-title');
    lyricsBoxEl = document.getElementById('lyrics-box');
    miniPlayer = document.getElementById('mini-player-floating');
    mainPlayerPanel = document.querySelector('.music-player-panel');
    miniVinyl = document.getElementById('mini-vinyl');
    miniVinylCover = document.getElementById('mini-vinyl-cover');
    miniTrackTitle = document.getElementById('mini-track-title');
    miniPlayPause = document.getElementById('mini-play-pause');
    miniPlayPauseIcon = document.getElementById('mini-play-pause-icon');
    miniNext = document.getElementById('mini-next');

    playPauseBtn?.addEventListener('click', togglePlayPause);
    nextBtn?.addEventListener('click', next);
    prevBtn?.addEventListener('click', prev);

    progressBarContainer?.addEventListener('click', (e) => {
        if (!ytReady || !ytPlayer) return;
        const w = progressBarContainer.clientWidth;
        const dur = ytPlayer.getDuration();
        if (isNaN(dur)) return;
        ytPlayer.seekTo((e.offsetX / w) * dur);
    });

    volumeSlider?.addEventListener('click', (e) => {
        if (!ytReady || !ytPlayer) return;
        const w = volumeSlider.clientWidth;
        let vol = Math.round((e.offsetX / w) * 100);
        vol = Math.max(0, Math.min(100, vol));
        ytPlayer.setVolume(vol);
        if (volumeFill) volumeFill.style.width = `${vol}%`;
        isMuted = vol === 0;
        updateVolumeIcon(vol);
    });

    muteBtn?.addEventListener('click', () => {
        if (!ytReady || !ytPlayer) return;
        if (isMuted) {
            ytPlayer.unMute();
            ytPlayer.setVolume(preMuteVolume);
            isMuted = false;
            if (volumeFill) volumeFill.style.width = `${preMuteVolume}%`;
            updateVolumeIcon(preMuteVolume);
        } else {
            preMuteVolume = ytPlayer.getVolume();
            ytPlayer.mute();
            isMuted = true;
            if (volumeFill) volumeFill.style.width = '0%';
            updateVolumeIcon(0);
        }
    });

    document.querySelectorAll('.song-row-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const title = this.querySelector('.song-title')?.textContent.trim().toLowerCase();
            const idx = PLAYLIST.findIndex(s => s.title.toLowerCase() === title);
            if (idx !== -1) {
                loadSong(idx, true);
                setPlayUI(true);
                mainPlayerPanel?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });

    miniPlayPause?.addEventListener('click', (e) => { e.stopPropagation(); togglePlayPause(); });
    miniNext?.addEventListener('click', (e) => { e.stopPropagation(); next(); });

    _scrollMiniHandler = () => {
        if (!miniPlayer || !mainPlayerPanel) return;
        const r = mainPlayerPanel.getBoundingClientRect();
        miniPlayer.classList.toggle('visible', r.bottom < 0 || r.top > window.innerHeight);
    };
    window.addEventListener('scroll', _scrollMiniHandler, { passive: true });

    // Init YouTube player if API ready, otherwise wait
    if (typeof YT !== 'undefined' && typeof YT.Player !== 'undefined') {
        initYouTube();
    } else {
        window.onYouTubeIframeAPIReady = initYouTube;
    }

    // Fallback: set initial track info
    if (vinylCoverEl) vinylCoverEl.src = PLAYLIST[0].cover;
    if (trackTitleEl) trackTitleEl.textContent = PLAYLIST[0].title;
    if (lyricsTitleEl) lyricsTitleEl.textContent = `${PLAYLIST[0].title} - BLACKPINK`;
    renderLyrics(PLAYLIST[0]);
    syncMiniPlayerInfo();
}

export function destroy() {
    if (_visualizerRaf) cancelAnimationFrame(_visualizerRaf);
    if (_progressInterval) clearInterval(_progressInterval);
    if (_scrollMiniHandler) window.removeEventListener('scroll', _scrollMiniHandler);
    if (ytPlayer && ytPlayer.destroy) ytPlayer.destroy();
    ytPlayer = null;
    ytReady = false;
    visualizerStarted = false;
}

export const actions = {
    'select-album': (el) => {
        const album = el.dataset.album;
        const songIndex = Number(el.dataset.songIndex);
        changeTheme(album);
        if (!isNaN(songIndex)) {
            loadSong(songIndex, true);
            setPlayUI(true);
            mainPlayerPanel?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
};
