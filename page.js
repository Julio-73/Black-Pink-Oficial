document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 1. HEADER SCROLL EFFECT
    // ==========================================
    const header = document.getElementById('header');
    
    function handleHeaderScroll() {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    // ==========================================
    // 2. MOBILE MENU TOGGLE
    // ==========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    window.openMobileMenu = function() {
        if (mobileMenu) {
            mobileMenu.classList.add('active');
            if (menuToggle) menuToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };
    
    window.closeMobileMenu = function() {
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                window.closeMobileMenu();
            } else {
                window.openMobileMenu();
            }
        });
    }

    // ==========================================
    // 3. SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 64;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                window.closeMobileMenu();
            }
        });
    });

    // ==========================================
    // 4. REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    // ==========================================
    const revealElements = document.querySelectorAll('.members-grid, .music-container, .video-container, .subscribe-card, .section-title, .quiz-container');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
    
    // Member cards staggered reveal
    const memberCards = document.querySelectorAll('.member-card');
    memberCards.forEach((card, index) => {
        card.classList.add('reveal', `reveal-delay-${(index % 4) + 1}`);
        revealObserver.observe(card);
    });

    // ==========================================
    // 5. PARALLAX & PERSPECTIVE EFFECTS
    // ==========================================
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                const heroBg = document.querySelector('.hero-bg');
                const heroVideo = document.querySelector('.hero-video-bg');
                
                if (heroBg) {
                    heroBg.style.transform = `translateY(${scrolled * 0.15}px)`;
                }
                if (heroVideo) {
                    heroVideo.style.transform = `translateY(${scrolled * 0.12}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.addEventListener('mousemove', function(e) {
            const rect = heroContent.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            heroContent.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
        });
        
        heroContent.addEventListener('mouseleave', function() {
            heroContent.style.transform = 'translate(0, 0)';
        });
    }

    // Interactive button hover particles
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            createBtnParticles(this);
        });
    });
    
    function createBtnParticles(button) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('span');
            particle.style.cssText = `
                position: absolute;
                width: 5px;
                height: 5px;
                background: #ffcce0;
                border-radius: 50%;
                pointer-events: none;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                z-index: 10;
            `;
            
            const angle = (Math.random() * 360) * (Math.PI / 180);
            const velocity = 40 + Math.random() * 40;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            particle.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
            ], {
                duration: 650,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => particle.remove();
            
            button.appendChild(particle);
        }
    }

    // Scroll Progress bar
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #c94b7c, #ff6b9d);
            z-index: 9999;
            width: 0%;
            transition: width 0.08s linear;
        `;
        document.body.appendChild(progressBar);
    }
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${scrollPercent}%`;
    }, { passive: true });

    // ==========================================
    // 6. MEMBER MODALS
    // ==========================================
    window.openMemberModal = function(member) {
        const modal = document.getElementById(member + '-modal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    };
    
    window.closeMemberModal = function(member) {
        const modal = document.getElementById(member + '-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            
            // Stop modal video iframe if playing
            const iframe = modal.querySelector('iframe');
            if (iframe) {
                const src = iframe.src;
                iframe.src = '';
                iframe.src = src;
            }
        }
    };
    
    // Close modal when clicking outside content
    document.querySelectorAll('.modal-mobile').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                const memberId = this.id.replace('-modal', '');
                window.closeMemberModal(memberId);
            }
        });
    });

    // ==========================================
    // 7. VIDEO GALLERY CONTROLS & TABS
    // ==========================================
    window.showVideoTab = function(tabId, tabBtn) {
        document.querySelectorAll('.video-tab-content').forEach(c => {
            c.style.display = 'none';
            c.classList.remove('active');
        });
        document.querySelectorAll('.video-tab').forEach(t => t.classList.remove('active'));
        
        const targetContent = document.getElementById(tabId);
        if (targetContent) {
            targetContent.style.display = 'block';
            targetContent.classList.add('active');
        }
        
        if (tabBtn) {
            tabBtn.classList.add('active');
        }
    };

    window.openVideoModal = function(videoId) {
        const modal = document.getElementById('video-modal');
        const player = document.getElementById('youtube-player');
        const link = document.getElementById('youtube-link');
        
        if (modal && player) {
            player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            if (link) link.href = `https://www.youtube.com/watch?v=${videoId}`;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeVideoModal = function() {
        const modal = document.getElementById('video-modal');
        const player = document.getElementById('youtube-player');
        
        if (modal) {
            if (player) player.src = '';
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    const videoModalEl = document.getElementById('video-modal');
    if (videoModalEl) {
        videoModalEl.addEventListener('click', function(e) {
            if (e.target === this) {
                window.closeVideoModal();
            }
        });
    }

    // Escape Key Modal Handler
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-mobile').forEach(m => {
                const memberId = m.id.replace('-modal', '');
                window.closeMemberModal(memberId);
            });
            window.closeVideoModal();
            window.closeMobileMenu();
        }
    });

    // ==========================================
    // 8. MERCHANDISE SHOP & CART
    // ==========================================
    window.addToCart = function(product, price) {
        alert(`🛒 "${product}" ($${price}) se añadió al carrito (demo).`);
    };

    window.loadMoreProducts = function() {
        alert('🛍️ Más merch oficial estará disponible pronto.');
    };

    // ==========================================
    // 9. JOIN BLINK FORM & LANGUAGES
    // ==========================================
    window.selectLang = function(btn) {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    };

    window.handleJoinForm = function(e) {
        e.preventDefault();
        const form = e.target;
        const nameInput = form.querySelector('input[type="text"]');
        const name = nameInput ? nameInput.value : 'BLINK';
        const successMessage = document.getElementById('successMessage');
        const userNameSpan = document.getElementById('user-name');
        const blinkNumberSpan = document.getElementById('blink-number');
        
        const randomBlinkNum = Math.floor(Math.random() * 90000) + 10000;
        
        if (userNameSpan) userNameSpan.innerText = name;
        if (blinkNumberSpan) blinkNumberSpan.innerText = randomBlinkNum;
        
        if (successMessage) {
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        form.reset();
        
        setTimeout(() => {
            if (successMessage) successMessage.style.display = 'none';
        }, 8000);
    };

    // ==========================================
    // 10. COUNTDOWN COMEBACK TIMER
    // ==========================================
    const countdownDate = new Date("June 15, 2026 00:00:00").getTime();
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    
    if (daysEl && hoursEl && minutesEl && secondsEl) {
        setInterval(() => {
            const now = new Date().getTime();
            const distance = countdownDate - now;
            
            if (distance < 0) {
                daysEl.innerText = "00";
                hoursEl.innerText = "00";
                minutesEl.innerText = "00";
                secondsEl.innerText = "00";
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            daysEl.innerText = String(days).padStart(2, '0');
            hoursEl.innerText = String(hours).padStart(2, '0');
            minutesEl.innerText = String(minutes).padStart(2, '0');
            secondsEl.innerText = String(seconds).padStart(2, '0');
        }, 1000);
    }

    // ==========================================
    // 11. WORLD TOUR MAP (LEAFLET INITIALIZATION WITH RADAR ICONS)
    // ==========================================
    const mapContainer = document.getElementById('tour-map-leaflet');
    if (mapContainer && typeof L !== 'undefined') {
        const map = L.map('tour-map-leaflet').setView([22, 40], 2);
        
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            maxZoom: 18
        }).addTo(map);
        
        const cities = [
            { name: 'Seoul, South Korea', lat: 37.5665, lng: 126.978, desc: '🇰🇷 Oct 15-16, 2022 (50K BLINKs)' },
            { name: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018, desc: '🇹🇭 Jan 7-8, 2023' },
            { name: 'London, United Kingdom', lat: 51.5074, lng: -0.1278, desc: '🇬🇧 Dec 1, 2022' },
            { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, desc: '🇦🇺 Jun 10-11, 2023' },
            { name: 'Paris, France', lat: 48.8566, lng: 2.3522, desc: '🇫🇷 Dec 11-12, 2022' },
            { name: 'Atlanta, USA', lat: 33.749, lng: -84.388, desc: '🇺🇸 Nov 2-3, 2022' }
        ];
        
        // Custom Glowing Pulsar Marker Icon
        const radarHeartIcon = L.divIcon({
            className: 'leaflet-radar-marker',
            html: `
                <div class="radar-heart-wrapper">
                    <div class="radar-pulse-ring"></div>
                    <i class="bx bxs-heart radar-heart-icon"></i>
                </div>
            `,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        const seoulLatLng = [37.5665, 126.978];
        
        cities.forEach(city => {
            const marker = L.marker([city.lat, city.lng], { icon: radarHeartIcon }).addTo(map);
            marker.bindPopup(`<strong style="color:#ff6b9d; font-family:'Outfit', sans-serif;">${city.name}</strong><br><span style="font-size:0.8rem; color:#aaa;">${city.desc}</span>`);
            
            // Draw dynamic flight path curves from Seoul to other destinations
            if (city.name !== 'Seoul, South Korea') {
                const pathCoords = [seoulLatLng, [city.lat, city.lng]];
                L.polyline(pathCoords, {
                    color: '#ff6b9d',
                    weight: 2,
                    opacity: 0.6,
                    className: 'leaflet-flight-path'
                }).addTo(map);
            }
        });
    }

    // ==========================================
    // 12. PREMIUM INTERACTIVE MUSIC PLAYER
    // ==========================================
    const audioEl = document.getElementById('bp-audio');
    const playPauseBtn = document.getElementById('player-play-pause');
    const playPauseIcon = document.getElementById('play-pause-icon');
    const vinylEl = document.getElementById('player-vinyl');
    const vinylCoverEl = document.getElementById('player-vinyl-cover');
    const trackTitleEl = document.getElementById('player-track-title');
    const prevBtn = document.getElementById('player-prev');
    const nextBtn = document.getElementById('player-next');
    const progressBarContainer = document.getElementById('player-progress-bar');
    const progressFill = document.getElementById('player-progress-fill');
    const currentTimeEl = document.getElementById('player-current-time');
    const durationEl = document.getElementById('player-duration');
    const muteBtn = document.getElementById('player-mute');
    const muteIcon = document.getElementById('mute-icon');
    const volumeSlider = document.getElementById('player-volume-slider');
    const volumeFill = document.getElementById('player-volume-fill');
    
    // Play list configs
    const playlist = [
        {
            title: "DDu-Du DDu-Du",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            cover: "https://img.youtube.com/vi/bwmSjveZ3n8/hqdefault.jpg"
        },
        {
            title: "Kill This Love",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            cover: "https://img.youtube.com/vi/2S24-y0Y3pE/hqdefault.jpg"
        },
        {
            title: "How You Like That",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            cover: "https://img.youtube.com/vi/IHdVIe785wQ/hqdefault.jpg"
        },
        {
            title: "Lovesick Girls",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
            cover: "https://img.youtube.com/vi/dyRsYk0LyA8/hqdefault.jpg"
        },
        {
            title: "Shut Down",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
            cover: "https://img.youtube.com/vi/POe9SOEKotk/hqdefault.jpg"
        }
    ];

    let currentSongIndex = 0;
    let isMuted = false;
    let preMuteVolume = 0.8;

    function loadSong(index) {
        currentSongIndex = index;
        const song = playlist[index];
        if (audioEl) {
            audioEl.src = song.url;
            audioEl.load();
        }
        if (trackTitleEl) trackTitleEl.innerText = song.title;
        if (vinylCoverEl) vinylCoverEl.src = song.cover;
        
        // Highlight active track rows in HTML
        document.querySelectorAll('.song-item').forEach((row, i) => {
            row.classList.remove('playing-now');
            if (row.querySelector('.song-title')?.innerText.trim().toLowerCase() === song.title.toLowerCase()) {
                row.classList.add('playing-now');
            }
        });
    }

    function togglePlayPause() {
        if (!audioEl) return;
        
        if (audioEl.paused) {
            audioEl.play().catch(err => console.log("Play failed: ", err));
        } else {
            audioEl.pause();
        }
    }

    if (playPauseBtn && audioEl) {
        playPauseBtn.addEventListener('click', togglePlayPause);
        
        // Next & Prev
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                let nextIndex = (currentSongIndex + 1) % playlist.length;
                loadSong(nextIndex);
                audioEl.play().catch(err => console.log("Play failed: ", err));
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                let prevIndex = currentSongIndex - 1;
                if (prevIndex < 0) prevIndex = playlist.length - 1;
                loadSong(prevIndex);
                audioEl.play().catch(err => console.log("Play failed: ", err));
            });
        }

        // Native Play/Pause Event Sync
        audioEl.addEventListener('play', () => {
            if (playPauseIcon) {
                playPauseIcon.className = 'bx bx-pause';
            }
            if (vinylEl) vinylEl.classList.add('playing');
            const equalizerEl = document.getElementById('player-equalizer');
            if (equalizerEl) equalizerEl.classList.add('active');
        });

        audioEl.addEventListener('pause', () => {
            if (playPauseIcon) {
                playPauseIcon.className = 'bx bx-play';
            }
            if (vinylEl) vinylEl.classList.remove('playing');
            const equalizerEl = document.getElementById('player-equalizer');
            if (equalizerEl) equalizerEl.classList.remove('active');
        });

        // Time updates
        audioEl.addEventListener('timeupdate', () => {
            const currentTime = audioEl.currentTime;
            const duration = audioEl.duration;
            if (isNaN(duration)) return;
            
            const progressPercent = (currentTime / duration) * 100;
            if (progressFill) progressFill.style.width = `${progressPercent}%`;
            
            if (currentTimeEl) currentTimeEl.innerText = formatTime(currentTime);
            if (durationEl) durationEl.innerText = formatTime(duration);
        });

        // Track ended -> auto next
        audioEl.addEventListener('ended', () => {
            let nextIndex = (currentSongIndex + 1) % playlist.length;
            loadSong(nextIndex);
            audioEl.play().catch(err => console.log("Auto-play failed: ", err));
        });

        // Seek click in progress bar
        if (progressBarContainer) {
            progressBarContainer.addEventListener('click', (e) => {
                const width = progressBarContainer.clientWidth;
                const clickX = e.offsetX;
                const duration = audioEl.duration;
                if (isNaN(duration)) return;
                
                audioEl.currentTime = (clickX / width) * duration;
            });
        }

        // Volume control
        if (volumeSlider) {
            volumeSlider.addEventListener('click', (e) => {
                const width = volumeSlider.clientWidth;
                const clickX = e.offsetX;
                let vol = clickX / width;
                if (vol < 0) vol = 0;
                if (vol > 1) vol = 1;
                
                audioEl.volume = vol;
                if (volumeFill) volumeFill.style.width = `${vol * 100}%`;
                
                // update icon
                isMuted = vol === 0;
                updateVolumeIcon(vol);
            });
        }

        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                if (isMuted) {
                    audioEl.volume = preMuteVolume;
                    isMuted = false;
                    if (volumeFill) volumeFill.style.width = `${preMuteVolume * 100}%`;
                } else {
                    preMuteVolume = audioEl.volume;
                    audioEl.volume = 0;
                    isMuted = true;
                    if (volumeFill) volumeFill.style.width = `0%`;
                }
                updateVolumeIcon(audioEl.volume);
            });
        }
    }

    function formatTime(secs) {
        const minutes = Math.floor(secs / 60);
        const seconds = Math.floor(secs % 60);
        return `${minutes}:${String(seconds).padStart(2, '0')}`;
    }

    function updateVolumeIcon(vol) {
        if (!muteIcon) return;
        muteIcon.className = '';
        if (vol === 0) {
            muteIcon.className = 'bx bx-volume-mute';
        } else if (vol < 0.4) {
            muteIcon.className = 'bx bx-volume';
        } else {
            muteIcon.className = 'bx bx-volume-full';
        }
    }

    // Connect Top Songs clicking to load & play in player
    document.querySelectorAll('.song-row-link').forEach((link, idx) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const songTitle = this.querySelector('.song-title')?.innerText.trim();
            const playlistIndex = playlist.findIndex(song => song.title.toLowerCase() === songTitle?.toLowerCase());
            
            if (playlistIndex !== -1) {
                loadSong(playlistIndex);
                audioEl.play().catch(err => console.log("Play failed: ", err));
                
                // Smooth scroll to music player
                const playerPanel = document.querySelector('.music-player-panel');
                if (playerPanel) {
                    playerPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    });

    // Initialize with first song
    loadSong(0);

    // ==========================================
    // 13. BLINK INTERACTIVE QUIZ
    // ==========================================
    const quizStartBtn = document.getElementById('btn-start-quiz');
    const quizRestartBtn = document.getElementById('btn-restart-quiz');
    const quizIntroScreen = document.getElementById('quiz-screen-intro');
    const quizQuestionScreen = document.getElementById('quiz-screen-question');
    const quizResultScreen = document.getElementById('quiz-screen-result');
    const quizCurrentNumEl = document.getElementById('quiz-current-num');
    const quizPercentEl = document.getElementById('quiz-percent');
    const quizProgressFill = document.getElementById('quiz-progress-fill');
    const quizQuestionTextEl = document.getElementById('quiz-question-text');
    const quizOptionsGrid = document.getElementById('quiz-options-grid');
    
    const quizResultImg = document.getElementById('quiz-result-img');
    const quizResultMember = document.getElementById('quiz-result-member');
    const quizResultRole = document.getElementById('quiz-result-role');
    const quizResultDesc = document.getElementById('quiz-result-desc');
    const quizSoloLink = document.getElementById('btn-solo-link');
    const quizCardEl = document.getElementById('quiz-card');

    const quizQuestions = [
        {
            question: "¿Cuál es tu estilo de moda favorito?",
            options: [
                { text: "Chic y audaz (Chaqueta de cuero, botas negras y outfits de pasarela)", value: "E" }, // Jennie
                { text: "Streetwear moderno (Ropa urbana holgada, gorras y zapatillas exclusivas)", value: "L" }, // Lisa
                { text: "Boho-chic y artístico (Vestidos fluidos, tonos cálidos y accesorios de guitarra)", value: "R" }, // Rosé
                { text: "Elegante, floral y clásico (Vestidos sencillos, colores pastel y detalles sobrios)", value: "J" } // Jisoo
            ]
        },
        {
            question: "¿Cómo pasas tu sábado ideal de descanso?",
            options: [
                { text: "Jugando videojuegos, leyendo mangas o durmiendo cómodamente en casa", value: "J" }, // Jisoo
                { text: "Bailando en un estudio, haciendo skate o viajando a un rincón inesperado", value: "L" }, // Lisa
                { text: "Tocando el piano/guitarra, componiendo o pintando en un lienzo", value: "R" }, // Rosé
                { text: "De compras en boutiques de lujo o cenando en un restaurante muy exclusivo", value: "E" } // Jennie
            ]
        },
        {
            question: "Si pudieras tomar un vuelo hoy, tu destino preferido sería:",
            options: [
                { text: "París, Francia (Capital de la moda, cafés refinados e historia del arte)", value: "E" }, // Jennie
                { text: "Hawái, EE.UU. (Playas paradisíacas, surf y pura aventura tropical)", value: "L" }, // Lisa
                { text: "Kioto, Japón (Templos tradicionales zen, paisajes calmos y cerezos en flor)", value: "J" }, // Jisoo
                { text: "Londres, Inglaterra (Atmósfera musical indie, museos y tardes de café lluviosas)", value: "R" } // Rosé
            ]
        },
        {
            question: "¿Cuál es tu rol principal en tu grupo de amigos?",
            options: [
                { text: "La persona astuta e ingeniosa que siempre los hace sonreír con sus chistes", value: "J" }, // Jisoo
                { text: "La persona líder que propone las salidas y siempre luce impecable", value: "E" }, // Jennie
                { text: "La persona empática, sensible y consejera a la que le cuentan sus secretos", value: "R" }, // Rosé
                { text: "La persona hiperactiva, alegre y alma de la fiesta que contagia energía", value: "L" } // Lisa
            ]
        },
        {
            question: "¿Cuál es tu comida o postre favorito indiscutible?",
            options: [
                { text: "Helado artesanal, repostería gourmet de fresas o comida fusión de autor", value: "E" }, // Jennie
                { text: "Ramen picante japonés, tacos al pastor o cocina tailandesa aromática", value: "L" }, // Lisa
                { text: "Tarta de chocolate oscuro, café americano y frutas frescas saludables", value: "R" }, // Rosé
                { text: "Brochetas tradicionales de carne, arroz frito o un gran postre dulce de queso", value: "J" } // Jisoo
            ]
        }
    ];

    const quizMembersData = {
        E: {
            name: "Jennie",
            role: "Main Rapper & Fashion Icon",
            img: "jenny.png",
            desc: "Eres audaz, sumamente influyente y tienes un gusto exquisito. Eres un líder natural que establece tendencias en lugar de seguirlas. Tienes una presencia magnética y una confianza inquebrantable, ¡brillas con luz propia en cualquier lugar!",
            solo: "https://www.youtube.com/watch?v=gQlMMD8auMs"
        },
        L: {
            name: "Lisa",
            role: "Main Dancer & Rapper",
            img: "lisa.png",
            desc: "Eres dinamismo, risas y carisma puro. Tu personalidad magnética ilumina cualquier habitación. Destacas por tu perseverancia, una energía desbordante y una agilidad mental asombrosa. ¡Tienes el ritmo en las venas y amas la libertad!",
            solo: "https://www.youtube.com/watch?v=dNCWe_6HAwM"
        },
        R: {
            name: "Rosé",
            role: "Main Vocalist",
            img: "rose.png",
            desc: "Eres una persona con un alma profundamente artística, sensible y de sentimientos puros. Te expresas de forma genuina y profunda. Valoras la música, la naturaleza y los detalles más hermosos de la vida. ¡Tu empatía conecta al instante!",
            solo: "https://www.youtube.com/watch?v=2_VLdL7alJU"
        },
        J: {
            name: "Jisoo",
            role: "Visual & Lead Vocalist",
            img: "jisoo.png",
            desc: "Eres sumamente madura, sensata y el pilar fundamental que une a tus seres queridos. Posees un humor brillante, eres bondadosa e independiente. Detrás de tu naturaleza tranquila y adorable se esconde una voluntad de hierro impenetrable.",
            solo: "https://www.youtube.com/watch?v=IKh3hHaJJPk"
        }
    };

    let quizCurrentIndex = 0;
    let quizScores = { J: 0, E: 0, R: 0, L: 0 };

    function startQuiz() {
        quizCurrentIndex = 0;
        quizScores = { J: 0, E: 0, R: 0, L: 0 };
        
        quizIntroScreen.classList.remove('active');
        quizResultScreen.classList.remove('active');
        quizQuestionScreen.classList.add('active');
        
        showQuestion(0);
    }

    function showQuestion(index) {
        if (index >= quizQuestions.length) {
            calculateAndShowResult();
            return;
        }

        const q = quizQuestions[index];
        if (quizCurrentNumEl) quizCurrentNumEl.innerText = index + 1;
        
        const percent = Math.round(((index + 1) / quizQuestions.length) * 100);
        if (quizPercentEl) quizPercentEl.innerText = percent;
        if (quizProgressFill) quizProgressFill.style.width = `${percent}%`;
        
        if (quizQuestionTextEl) quizQuestionTextEl.innerText = q.question;
        
        if (quizOptionsGrid) {
            quizOptionsGrid.innerHTML = '';
            
            q.options.forEach((opt, optIdx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option';
                
                const letters = ['A', 'B', 'C', 'D'];
                btn.innerHTML = `
                    <span class="quiz-option-letter">${letters[optIdx]}</span>
                    <span>${opt.text}</span>
                `;
                
                btn.addEventListener('click', () => {
                    quizScores[opt.value]++;
                    quizCurrentIndex++;
                    
                    // Add micro-animation transition
                    quizCardEl.style.transform = 'scale(0.97)';
                    setTimeout(() => {
                        quizCardEl.style.transform = 'scale(1)';
                        showQuestion(quizCurrentIndex);
                    }, 250);
                });
                
                quizOptionsGrid.appendChild(btn);
            });
        }
    }

    function calculateAndShowResult() {
        quizQuestionScreen.classList.remove('active');
        quizResultScreen.classList.add('active');
        
        // Find member with maximum score
        let maxMember = 'J';
        let maxScore = -1;
        
        for (const [member, score] of Object.entries(quizScores)) {
            if (score > maxScore) {
                maxScore = score;
                maxMember = member;
            }
        }
        
        const result = quizMembersData[maxMember];
        
        if (quizResultImg) quizResultImg.src = result.img;
        if (quizResultMember) quizResultMember.innerText = result.name;
        if (quizResultRole) quizResultRole.innerText = result.role;
        if (quizResultDesc) quizResultDesc.innerText = result.desc;
        if (quizSoloLink) quizSoloLink.href = result.solo;
        
        // Trigger visual confetti celebration
        triggerNativeConfetti();
    }

    if (quizStartBtn) quizStartBtn.addEventListener('click', startQuiz);
    if (quizRestartBtn) quizRestartBtn.addEventListener('click', startQuiz);

    // High-performance CSS Confetti Particle Burst
    function triggerNativeConfetti() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        
        const colors = ['#ff6b9d', '#ffcce0', '#ffffff', '#ffd2e5', '#ff99c8'];
        const container = quizCardEl || document.body;
        
        for (let i = 0; i < 75; i++) {
            const particle = document.createElement('div');
            particle.className = 'confetti-particle';
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = 5 + Math.random() * 8;
            
            particle.style.background = color;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random horizontal/vertical position from card center
            const rect = container.getBoundingClientRect();
            const startX = rect.width / 2;
            const startY = rect.height / 2;
            
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            
            const angle = Math.random() * 360;
            const velocity = 80 + Math.random() * 200;
            const radians = angle * (Math.PI / 180);
            
            const tx = Math.cos(radians) * velocity;
            const ty = Math.sin(radians) * velocity - (50 + Math.random() * 50); // pull upward initially
            
            container.appendChild(particle);
            
            particle.animate([
                { 
                    transform: 'translate(-50%, -50%) rotate(0deg) scale(1)', 
                    opacity: 1 
                },
                { 
                    transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${Math.random() * 720}deg) scale(0.3)`, 
                    opacity: 0 
                }
            ], {
                duration: 1200 + Math.random() * 800,
                easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
            }).onfinish = () => particle.remove();
        }
    }

    // ==========================================
    // 14. INTERACTIVE HERO PARTICLES BACKGROUND
    // ==========================================
    const heroSec = document.getElementById('home');
    const pCanvas = document.getElementById('hero-particles-canvas');
    if (heroSec && pCanvas) {
        const pCtx = pCanvas.getContext('2d');
        let particles = [];
        let animationFrameId = null;

        function resizeCanvas() {
            pCanvas.width = heroSec.clientWidth;
            pCanvas.height = heroSec.clientHeight;
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 3.5 + 1.2;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 1.4 + 0.4;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed - 0.15; // subtle upward drift
                this.alpha = 1;
                this.decay = Math.random() * 0.018 + 0.007;
                this.color = Math.random() > 0.45 ? '#ff6b9d' : '#ffcce0'; // neon pink or star glow white-pink
                this.sparkle = Math.random() > 0.5;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;
                if (this.sparkle) {
                    this.size += (Math.random() - 0.5) * 0.4;
                    if (this.size < 0.4) this.size = 0.4;
                }
            }

            draw() {
                pCtx.save();
                pCtx.globalAlpha = this.alpha;
                pCtx.fillStyle = this.color;
                
                // Add soft neon bloom blur
                pCtx.shadowBlur = this.size * 2.2;
                pCtx.shadowColor = this.color;
                
                pCtx.beginPath();
                pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                pCtx.fill();
                pCtx.restore();
            }
        }

        function animateParticles() {
            pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.update();
                p.draw();
                
                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                    i--;
                }
            }
            
            if (particles.length > 0) {
                animationFrameId = requestAnimationFrame(animateParticles);
            } else {
                animationFrameId = null;
            }
        }

        heroSec.addEventListener('mousemove', function(e) {
            const rect = heroSec.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Spawn trailing particles on mouse slide
            for (let i = 0; i < 2; i++) {
                particles.push(new Particle(mouseX, mouseY));
            }
            
            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(animateParticles);
            }
        });
    }

    // ==========================================
    // 15. 3D HOVER TILT WITH GLARE REFLECTION
    // ==========================================
    const tiltCards = document.querySelectorAll('.member-card, .product-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            
            // Physical rotation angles based on cursor offset
            const rx = -((y - cy) / cy) * 15;
            const ry = ((x - cx) / cx) * 15;
            
            this.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03, 1.03, 1.03)`;
            
            // Calculate relative light position percentages for shifting glare
            const px = (x / rect.width) * 100;
            const py = (y / rect.height) * 100;
            
            this.style.setProperty('--glare-x', `${px}%`);
            this.style.setProperty('--glare-y', `${py}%`);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            this.style.setProperty('--glare-x', '50%');
            this.style.setProperty('--glare-y', '50%');
        });
    });

    // ==========================================
    // 16. WEB AUDIO API FREQUENCY SPECTRUM (PROCEDURAL NEON VISUALIZER)
    // ==========================================
    const visualizerCanvas = document.getElementById('player-visualizer-canvas');
    let visualizerAnimId = null;

    function initWebAudio() {
        // Initialize drawing loop directly to prevent CORS restrictions from muting sound
        drawVisualizer();
    }

    function drawVisualizer() {
        if (!visualizerCanvas) return;
        const vCtx = visualizerCanvas.getContext('2d');
        const width = visualizerCanvas.width;
        const height = visualizerCanvas.height;
        
        const bufferLength = 32;
        const dataArray = new Uint8Array(bufferLength);
        
        function renderLoop() {
            visualizerAnimId = requestAnimationFrame(renderLoop);
            
            if (audioEl && !audioEl.paused) {
                const time = Date.now() * 0.005;
                for (let i = 0; i < bufferLength; i++) {
                    // Pulsing waves mimicking bass, mid, and treble bands
                    const bassPulse = Math.sin(time * 0.85) * 0.4 + 0.6; // low frequency bass pulse
                    const midOsc = Math.cos(i * 0.28 - time * 0.55) * 0.5 + 0.5;
                    const highOsc = Math.sin(i * 0.6 + time * 1.15) * 0.3 + 0.3;
                    
                    let amp = 0;
                    if (i < 8) {
                        // Bass area (strong pulsing, deep movements)
                        amp = (bassPulse * 0.75 + midOsc * 0.25) * 190;
                    } else if (i < 20) {
                        // Mids area (smooth wave movements)
                        amp = (midOsc * 0.8 + highOsc * 0.2) * 140;
                    } else {
                        // Treble area (nervous active chatter)
                        amp = (highOsc * 0.85 + Math.random() * 0.15) * 90;
                    }
                    
                    // Apply index tapering (higher frequency = lower amplitude)
                    dataArray[i] = amp * (1 - (i / bufferLength) * 0.45);
                }
            } else {
                // Soft exponential decay to flatline on pause
                for (let i = 0; i < bufferLength; i++) {
                    dataArray[i] = Math.max(0, dataArray[i] - 5);
                }
            }
            
            vCtx.clearRect(0, 0, width, height);
            
            // Draw background glow
            vCtx.fillStyle = 'rgba(15, 15, 15, 0.1)';
            vCtx.fillRect(0, 0, width, height);
            
            const barWidth = (width / bufferLength) * 1.55;
            let barHeight;
            let x = 0;
            
            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * height * 0.85;
                if (barHeight < 3) barHeight = 3; // soft heartbeat breath
                
                const grad = vCtx.createLinearGradient(0, height, 0, height - barHeight);
                grad.addColorStop(0, '#a62e5b'); // rich velvet pink base
                grad.addColorStop(1, '#ff6b9d'); // luminous neon pink cap
                
                vCtx.fillStyle = grad;
                vCtx.shadowBlur = 5;
                vCtx.shadowColor = '#ff6b9d';
                
                const rx = x;
                const ry = height - barHeight;
                const rw = barWidth - 2;
                const rh = barHeight;
                
                vCtx.beginPath();
                if (vCtx.roundRect) {
                    vCtx.roundRect(rx, ry, rw, rh, [3, 3, 0, 0]);
                } else {
                    vCtx.rect(rx, ry, rw, rh);
                }
                vCtx.fill();
                
                x += barWidth;
            }
        }
        
        renderLoop();
    }

    if (audioEl) {
        audioEl.addEventListener('play', function() {
            initWebAudio();
        });
    }

    // ==========================================
    // 17. FLOATING MINI-PLAYER SYNC & SCROLL
    // ==========================================
    const miniPlayer = document.getElementById('mini-player-floating');
    const mainPlayerPanel = document.querySelector('.music-player-panel');
    const miniVinyl = document.getElementById('mini-vinyl');
    const miniVinylCover = document.getElementById('mini-vinyl-cover');
    const miniTrackTitle = document.getElementById('mini-track-title');
    const miniPlayPause = document.getElementById('mini-play-pause');
    const miniPlayPauseIcon = document.getElementById('mini-play-pause-icon');
    const miniNext = document.getElementById('mini-next');

    function syncMiniPlayerInfo() {
        if (!audioEl) return;
        const currentSong = playlist[currentSongIndex];
        if (miniTrackTitle) miniTrackTitle.innerText = currentSong.title;
        if (miniVinylCover) miniVinylCover.src = currentSong.cover;
    }

    if (miniPlayPause) {
        miniPlayPause.addEventListener('click', function(e) {
            e.stopPropagation();
            togglePlayPause();
        });
    }

    if (miniNext) {
        miniNext.addEventListener('click', function(e) {
            e.stopPropagation();
            if (nextBtn) nextBtn.click();
        });
    }

    // Listen to native audio state transitions
    if (audioEl) {
        audioEl.addEventListener('play', function() {
            if (miniPlayPauseIcon) miniPlayPauseIcon.className = 'bx bx-pause';
            if (miniVinyl) miniVinyl.classList.add('playing');
        });

        audioEl.addEventListener('pause', function() {
            if (miniPlayPauseIcon) miniPlayPauseIcon.className = 'bx bx-play';
            if (miniVinyl) miniVinyl.classList.remove('playing');
        });
        
        // Sync track changes
        audioEl.addEventListener('loadstart', syncMiniPlayerInfo);
    }

    // Scroll trigger display
    window.addEventListener('scroll', function() {
        if (!miniPlayer || !mainPlayerPanel) return;
        const rect = mainPlayerPanel.getBoundingClientRect();
        
        // Appear if main audio block scrolls fully out of the viewport
        const isMainPlayerHidden = (rect.bottom < 0 || rect.top > window.innerHeight);
        
        if (isMainPlayerHidden) {
            miniPlayer.classList.add('visible');
        } else {
            miniPlayer.classList.remove('visible');
        }
    }, { passive: true });

    syncMiniPlayerInfo();

    // ==========================================
    // 18. VIP FAN CARD GENERATOR LÓGICA
    // ==========================================
    function generateNewSerial() {
        const vipSerialNum = document.getElementById('vip-serial-number');
        if (vipSerialNum) {
            const randId = 'BP-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
            vipSerialNum.innerText = randId;
        }
    }
    
    // Wire up serial cycles
    generateNewSerial();
    if (quizStartBtn) quizStartBtn.addEventListener('click', generateNewSerial);
    if (quizRestartBtn) quizRestartBtn.addEventListener('click', generateNewSerial);

    // Dynamic glowing visual triggers
    const vipUserNameInput = document.getElementById('vip-user-name');
    const vipPassCard = document.getElementById('blink-vip-pass');
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

    // Canvas exporter
    function generateVIPPassPNG() {
        const userName = (vipUserNameInput ? vipUserNameInput.value.trim() : '') || 'OFFICIAL BLINK';
        const serialId = document.getElementById('vip-serial-number')?.innerText || 'BP-2026-99999';
        
        const memberName = quizResultMember?.innerText || 'Rosé';
        const memberRole = quizResultRole?.innerText || 'Main Vocalist';
        const memberImgEl = document.getElementById('quiz-result-img');
        const logoEl = document.querySelector('.vip-logo');

        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 860;
        const ctx = canvas.getContext('2d');

        // 1. Premium background linear gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, 860);
        bgGrad.addColorStop(0, '#160810'); // velvet wine black
        bgGrad.addColorStop(0.5, '#0a0a0a'); // absolute dark
        bgGrad.addColorStop(1, '#1b0b14'); // warm neon grape base
        ctx.fillStyle = bgGrad;
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

        // 2. Double border frame
        ctx.strokeStyle = '#ff6b9d';
        ctx.lineWidth = 4;
        ctx.strokeRect(18, 18, 564, 824);
        
        ctx.strokeStyle = 'rgba(255, 107, 157, 0.25)';
        ctx.lineWidth = 1;
        ctx.strokeRect(26, 26, 548, 808);

        // 3. Logo and Access Header
        if (logoEl && logoEl.complete) {
            ctx.drawImage(logoEl, 48, 48, 140, 32);
        } else {
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

        // 4. Portrait photo circular clipping with glowing ring
        if (memberImgEl && memberImgEl.complete) {
            const size = 260;
            const x = 170;
            const y = 165;

            // Halo gradient ring
            const radialGlow = ctx.createRadialGradient(300, 295, 70, 300, 295, 160);
            radialGlow.addColorStop(0, 'rgba(255, 107, 157, 0.28)');
            radialGlow.addColorStop(1, 'rgba(255, 107, 157, 0)');
            ctx.fillStyle = radialGlow;
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
        ctx.setLineDash([]); // Reset dash

        // 6. Pass Holder info
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = '11px "Outfit", Arial';
        ctx.fillText('PASS HOLDER', 60, 658);

        ctx.fillStyle = '#ffcce0';
        ctx.font = 'bold 24px "Outfit", Arial';
        ctx.fillText(userName.toUpperCase(), 60, 693);

        // Card serial
        ctx.textAlign = 'right';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = '11px "Outfit", Arial';
        ctx.fillText('CARD SERIAL', 540, 658);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px "Outfit", Arial';
        ctx.fillText(serialId, 540, 693);

        // 7. Procedural Barcode
        ctx.fillStyle = '#ffffff';
        const startBarX = 60;
        const barY = 735;
        const barH = 45;
        const maxBarW = 480;

        let curX = startBarX;
        let seedVal = 12948; // custom barcode pattern seed
        function prng() {
            let val = Math.sin(seedVal++) * 10000;
            return val - Math.floor(val);
        }

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

        // Export and Trigger download
        try {
            const dataUrl = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = `${userName.replace(/\s+/g, '_')}_BLINK_VIP_Pass.png`;
            downloadLink.href = dataUrl;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } catch (err) {
            console.error("Local sandbox/canvas image export error: ", err);
            alert("No se pudo descargar localmente el pase VIP debido a restricciones de seguridad del canvas en navegadores locales. Toma una captura de pantalla para guardarlo!");
        }
    }

    const downloadPassBtn = document.getElementById('btn-download-pass');
    if (downloadPassBtn) {
        downloadPassBtn.addEventListener('click', generateVIPPassPNG);
    }
});