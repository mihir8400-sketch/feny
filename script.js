document.addEventListener('DOMContentLoaded', function() {

    const authGate = document.getElementById('auth-gate');
    const appShell = document.getElementById('app-shell');
    const authForm = document.getElementById('auth-form');
    const authError = document.getElementById('auth-error');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const validUsername = 'mihir';
    const validPassword = '8400';

    const storageKey = 'birthday_private_access';

    // --- Background music ---
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIconPlay = document.getElementById('music-icon-play');
    const musicIconPause = document.getElementById('music-icon-pause');

    const startMusic = () => {
        if (!bgMusic) return;
        bgMusic.volume = 0.35;
        bgMusic.play().catch(() => {
            // Browsers block autoplay until user interaction.
        });
    };

    const updateMusicButton = () => {
        if (!bgMusic || !musicIconPlay || !musicIconPause) return;
        const isPlaying = !bgMusic.paused;
        musicIconPlay.classList.toggle('hidden', isPlaying);
        musicIconPause.classList.toggle('hidden', !isPlaying);
    };

    const unlockAccess = () => {
        if (authGate) authGate.classList.add('hidden');
        if (appShell) appShell.classList.remove('hidden');
        localStorage.setItem(storageKey, 'granted');

        const startAfterUnlock = () => {
            startMusic();
            updateMusicButton();
            document.removeEventListener('click', startAfterUnlock);
            document.removeEventListener('touchstart', startAfterUnlock);
        };

        document.addEventListener('click', startAfterUnlock, { once: true });
        document.addEventListener('touchstart', startAfterUnlock, { once: true });
        updateMusicButton();
    };

    const isUnlocked = () => localStorage.getItem(storageKey) === 'granted';

    if (!isUnlocked()) {
        if (appShell) appShell.classList.add('hidden');
        if (authGate) authGate.classList.remove('hidden');
    } else {
        unlockAccess();
    }

    if (authForm) {
        authForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (username === validUsername && password === validPassword) {
                unlockAccess();
            } else {
                if (authError) {
                    authError.textContent = 'Incorrect username or password.';
                }
                if (passwordInput) passwordInput.value = '';
                if (usernameInput) usernameInput.focus();
            }
        });
    }

    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
        bgMusic.addEventListener('play', updateMusicButton);
        bgMusic.addEventListener('pause', updateMusicButton);

        if (musicToggle) {
            musicToggle.addEventListener('click', () => {
                if (bgMusic.paused) {
                    bgMusic.play().catch(() => {});
                } else {
                    bgMusic.pause();
                }
            });
        }
    }

    if (isUnlocked()) {
        if (appShell) appShell.classList.remove('hidden');
        if (authGate) authGate.classList.add('hidden');
        updateMusicButton();
    }

    // --- Live Age Counter ---
    const birthDate = new Date('2000-10-05T00:00:00');
    const countdownElement = document.getElementById('countdown');

    function updateAge() {
        const now = new Date();

        let years = now.getFullYear() - birthDate.getFullYear();
        let months = now.getMonth() - birthDate.getMonth();
        let days = now.getDate() - birthDate.getDate();
        let hours = now.getHours() - birthDate.getHours();
        let minutes = now.getMinutes() - birthDate.getMinutes();
        let seconds = now.getSeconds() - birthDate.getSeconds();

        if (seconds < 0) { seconds += 60; minutes--; }
        if (minutes < 0) { minutes += 60; hours--; }
        if (hours < 0) { hours += 24; days--; }
        if (days < 0) {
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
            months--;
        }
        if (months < 0) { months += 12; years--; }

        countdownElement.innerHTML = `${years}y ${months}m ${days}d <br> ${hours}h ${minutes}m ${seconds}s`;
    }
    setInterval(updateAge, 1000);
    updateAge();

    // --- Initialize AOS (Animate on Scroll) ---
    AOS.init({
        duration: 800,
        once: true,
    });

    // --- Local image gallery from uploaded files ---
    const localGallery = document.getElementById('lightgallery');
    const localImages = [
        '1000607168.png',
        '20230527_143449.jpg',
        '20231228_110924.jpg',
        '20241220_114455.jpg',
        '20241220_122421.jpg',
        '20250804_151758.jpg',
        '20250830_132107.jpg',
        '20251004_142715.jpg',
        '20251024_153402.jpg',
        '20260110_153052.jpg',
        'IMG_1663.jpg',
        'IMG_2396.jpg',
        'IMG_2933.jpg',
        'IMG_2973.jpg',
        'IMG_2996.jpg',
        'IMG_3027.jpg',
        'IMG_3033.jpg',
        'IMG_3059.jpg',
        'IMG_3073.jpg',
        'IMG_3083.jpg',
        'IMG_6192.jpg',
        'IMG-20220628-WA0006.jpg',
        'IMG-20230502-WA0004.jpg',
        'IMG-20230506-WA0010.jpg',
        'IMG-20250930-WA0148.jpg',
        'IMG-20260212-WA0007.jpg',
        'IMG-20260213-WA0008.jpg',
        'wl1.jpg',
        'wl2.jpg',
        'wl3.jpg',
        'wl4.jpg',
        'wl5.jpg'
    ];

    const uniqueImages = [...new Set(localImages)];

    if (localGallery) {
        localGallery.innerHTML = uniqueImages.map((file, index) => `
            <a href="img/${file}" data-aos="zoom-in" data-aos-delay="${index * 50}" class="block w-full h-48 md:h-64">
                <img src="img/${file}" class="rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 w-full h-full photo-fit border-4 border-white" alt="Feny memory ${index + 1}">
            </a>
        `).join('');

        lightGallery(localGallery, {
            speed: 500,
            download: false
        });
    }

    // --- Hall of Fame Scroller ---
    const scroller = document.getElementById('hall-of-fame-scroller');
    const scrollLeftBtn = document.getElementById('scroll-left-btn');
    const scrollRightBtn = document.getElementById('scroll-right-btn');
    if (scroller && scrollLeftBtn && scrollRightBtn) {
        const card = scroller.querySelector('.snap-center');
        const cardWidth = card.offsetWidth + parseInt(getComputedStyle(card.parentElement).gap);

        scrollRightBtn.addEventListener('click', () => {
            scroller.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });
        scrollLeftBtn.addEventListener('click', () => {
            scroller.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });
    }

    // --- Video Uploader ---
    const videoUploadInput = document.getElementById('video-upload');
    const videoPlayer = document.getElementById('video-player');
    const videoUploadLabel = document.getElementById('video-upload-label');

    if(videoUploadInput && videoPlayer && videoUploadLabel) {
        videoUploadLabel.addEventListener('click', () => {
            videoUploadInput.click();
        });

        videoUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const videoURL = URL.createObjectURL(file);
                videoPlayer.src = videoURL;
                videoPlayer.classList.remove('hidden');
                videoUploadLabel.classList.add('hidden');
                videoPlayer.play();
            }
        });
    }


    // --- Sakura Petal Animation ---
    const canvas = document.getElementById('sakura-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let petals = [];
        const numPetals = 50;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function Petal() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height * 2 - canvas.height;
            this.w = 25 + Math.random() * 15;
            this.h = 20 + Math.random() * 10;
            this.opacity = this.w / 40;
            this.flip = Math.random();
            this.xSpeed = 1.5 + Math.random() * 2;
            this.ySpeed = 1 + Math.random() * 1;
            this.flipSpeed = Math.random() * 0.03;
        }

        Petal.prototype.draw = function() {
            if (this.y > canvas.height || this.x > canvas.width) {
                this.x = -this.w;
                this.y = Math.random() * canvas.height * 2 - canvas.height;
                this.xSpeed = 1.5 + Math.random() * 2;
                this.ySpeed = 1 + Math.random() * 1;
                this.flip = Math.random();
            }
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.bezierCurveTo(this.x + this.w / 2, this.y - this.h / 2, this.x + this.w, this.y, this.x + this.w / 2, this.y + this.h / 2);
            ctx.bezierCurveTo(this.x, this.y + this.h, this.x - this.w / 2, this.y, this.x, this.y);
            ctx.closePath();
            ctx.fillStyle = '#FFB7C5';
            ctx.fill();
        }

        Petal.prototype.update = function() {
            this.x += this.xSpeed;
            this.y += this.ySpeed;
            this.flip += this.flipSpeed;
            this.draw();
        }

        function createPetals() {
            petals = [];
            for (let i = 0; i < numPetals; i++) {
                petals.push(new Petal());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            petals.forEach(petal => {
                petal.update();
            });
            requestAnimationFrame(animate);
        }

        createPetals();
        animate();
    }
});

