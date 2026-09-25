const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
const passScreen = document.getElementById('password-screen');
const passInput = document.getElementById('password-input');
const passBtn = document.getElementById('password-btn');
const passError = document.getElementById('password-error');

function checkPassword() {
    // Girilen değeri küçük harfe çevirip boşlukları temizler (Toleranslı doğrulama)
    const val = passInput.value.trim().toLowerCase();

    // Şifre kontrolü ("özlem" veya ingilizce klavye ihtimaline karşı "ozlem")
    if (val === 'özlem' || val === 'ozlem') {
        passScreen.classList.add('unlocked');

        // Kilit açılınca scroll'u serbest bırak
        setTimeout(() => {
            document.body.classList.remove('locked');
            updateScroll(); // Scroll hesaplamalarını yeniden tetikle
        }, 800);

    } else {
        // Yanlış şifre durumu
        passError.classList.add('show');
        passInput.value = '';
        passInput.focus();

        // Hata mesajını 2.5 saniye sonra gizle
        setTimeout(() => {
            passError.classList.remove('show');
        }, 2500);
    }
}

// Butona tıklandığında kontrol et
passBtn.addEventListener('click', checkPassword);

// Enter tuşuna basıldığında kontrol et
passInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkPassword();
});

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
});

// Sahneler ve Metinler
const t1 = document.getElementById('text-1');
const t2 = document.getElementById('text-2');
const t3 = document.getElementById('text-3');
const scene2 = document.getElementById('scene-2');
const scene3 = document.getElementById('scene-3');
const scene4 = document.getElementById('scene-4');
const scene5 = document.getElementById('scene-5');
const scene6 = document.getElementById('scene-6');
const scene7 = document.getElementById('scene-7');
const scene8 = document.getElementById('scene-8'); // 8. Sahne

const timelineProgress = document.getElementById('timeline-progress');
const letters = [
    document.getElementById('letter-1'),
    document.getElementById('letter-2'),
    document.getElementById('letter-3'),
    document.getElementById('letter-4')
];

// Flaş Efekti için Element Oluşturma
const flashEffect = document.createElement('div');
flashEffect.classList.add('flash-effect');
document.body.appendChild(flashEffect);

const stars = [];
const numStars = 800;
for (let i = 0; i < numStars; i++) {
    stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        pz: 0
    });
    stars[i].pz = stars[i].z;
}

let targetSpeed = 0.5;
let currentSpeed = 0.5;

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, 0, width, height);

    currentSpeed += (targetSpeed - currentSpeed) * 0.1;

    const cx = width / 2;
    const cy = height / 2;

    stars.forEach(star => {
        star.pz = star.z;
        star.z -= currentSpeed;

        if (star.z <= 1) {
            star.x = (Math.random() - 0.5) * width * 2;
            star.y = (Math.random() - 0.5) * height * 2;
            star.z = width;
            star.pz = width;
        }

        let sx = (star.x / star.z) * cx + cx;
        let sy = (star.y / star.z) * cy + cy;
        let px = (star.x / star.pz) * cx + cx;
        let py = (star.y / star.pz) * cy + cy;

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);

        let opacity = 1 - (star.z / width);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = Math.max(0.1, 3 - (star.z / width) * 3);
        ctx.stroke();
    });

    requestAnimationFrame(animate);
}
animate();

// --- SCROLL HİKAYESİ YÖNETİMİ ---
function updateScroll() {
    let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    let progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;

    [t1, t2, t3].forEach(t => t.classList.remove('active'));

    // 0-15% Arası: İlk Yazılar 
    if (progress >= 0 && progress < 3) t1.classList.add('active');
    else if (progress >= 6 && progress < 9) t2.classList.add('active');
    else if (progress >= 12 && progress < 15) t3.classList.add('active');

    // 18% Sonrası Işık Hızı
    if (progress > 18 && progress < 80) targetSpeed = 2 + (progress - 18) * 0.5;
    else targetSpeed = 0.5 + (progress * 0.1);

    // 25% Sonrası Arkaplan ve Yıldız Geçişi
    if (progress > 25 && progress < 82) {
        canvas.style.opacity = '0';
        if (!document.body.classList.contains('bg-proposal')) document.body.classList.add('bg-nebula');
    } else if (progress >= 82 && progress < 95) {
        document.body.classList.remove('bg-nebula');
        canvas.style.opacity = '0';
    } else {
        canvas.style.opacity = '1';
        document.body.classList.remove('bg-nebula');
    }

    // 26% - 35% Arası: Zaman Sayacı
    if (progress >= 26 && progress < 35) scene2.classList.add('active');
    else scene2.classList.remove('active');

    // 39% - 47% Arası: Neden Ben Sorusu
    if (progress >= 39 && progress < 47) scene3.classList.add('active');
    else scene3.classList.remove('active');

    // 51% - 61% Arası: Kartlar
    if (progress >= 51 && progress < 61) scene4.classList.add('active');
    else scene4.classList.remove('active');

    // 65% - 75% Arası: Timeline ve Mektuplar
    if (progress >= 65 && progress < 75) {
        scene5.classList.add('active');
        let innerProgress = ((progress - 65) / 10) * 100;
        if (innerProgress > 100) innerProgress = 100;
        timelineProgress.style.height = `${innerProgress}%`;

        if (innerProgress >= 15) letters[0].classList.add('opened'); else letters[0].classList.remove('opened');
        if (innerProgress >= 40) letters[1].classList.add('opened'); else letters[1].classList.remove('opened');
        if (innerProgress >= 65) letters[2].classList.add('opened'); else letters[2].classList.remove('opened');
        if (innerProgress >= 90) letters[3].classList.add('opened'); else letters[3].classList.remove('opened');
    } else {
        scene5.classList.remove('active');
        timelineProgress.style.height = '0%';
        letters.forEach(letter => letter.classList.remove('opened'));
    }

    // 78% - 85% Arası: Final Sahnesi (Özlem & Aziz Notu)
    if (progress >= 78 && progress < 85) scene6.classList.add('active');
    else scene6.classList.remove('active');

    // 88% - 94% Arası: Dilek Fenerleri
    if (progress >= 88 && progress < 94) scene7.classList.add('active');
    else scene7.classList.remove('active');

    // 97% - 100% Arası: Büyük Teklif (Kalp Ekranı)
    if (progress >= 97) scene8.classList.add('active');
    else scene8.classList.remove('active');
}

window.addEventListener('scroll', updateScroll);
updateScroll();

let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        let progress = (window.scrollY / maxScroll) * 100;
        if (progress <= 25) targetSpeed = 0.5;
    }, 150);
});

// --- ZAMAN SAYACI ---
const startDate = new Date('2026-08-25T22:30:00').getTime();

function updateTimer() {
    const now = new Date().getTime();
    const diff = now - startDate;
    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
    }
}
setInterval(updateTimer, 1000);
updateTimer();

// --- DİLEK FENERİ MANTIĞI ---
const wishBtn = document.getElementById('wish-btn');
const lanternContainer = document.getElementById('lantern-container');

wishBtn.addEventListener('click', () => {
    const lantern = document.createElement('div');
    lantern.classList.add('lantern');
    const randomLeft = Math.random() * 80 + 10;
    lantern.style.left = `${randomLeft}%`;
    const randomDuration = Math.random() * 5 + 7;
    lantern.style.animationDuration = `${randomDuration}s`;
    lanternContainer.appendChild(lantern);
    setTimeout(() => { lantern.remove(); }, randomDuration * 1000);
});

// --- FİNAL: BASILI TUTULAN KALP VE TEKLİF MANTIĞI ---
const intHeart = document.getElementById('interactive-heart');
const holdText = document.getElementById('hold-text');
const intPhase = document.getElementById('interactive-phase');
const propPhase = document.getElementById('proposal-phase');
const succPhase = document.getElementById('success-phase');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');

let holdTimer;
let heartScale = 1;
let isExploded = false;

// Dokunma / Basma Başlangıcı
function startHold(e) {
    if (isExploded) return;
    e.preventDefault();
    intHeart.style.animation = 'none'; // Titremeyi durdur

    holdTimer = setInterval(() => {
        heartScale += 0.3;
        intHeart.style.transform = `scale(${heartScale})`;

        if (heartScale > 3) {
            holdText.innerText = "Sakın Bırakma...";
            holdText.style.color = "#ff4d4d";
        }

        // Ekranı kaplayacak boyuta gelince patlat
        if (heartScale > 25) {
            triggerExplosion();
        }
    }, 50);
}

// Dokunma / Basma Bitişi
function endHold() {
    if (isExploded) return;
    clearInterval(holdTimer);
    heartScale = 1;
    intHeart.style.transform = `scale(${heartScale})`;
    intHeart.style.animation = 'pulse 2s infinite';
    holdText.innerText = "Basılı Tut...";
    holdText.style.color = "#fff";
}

intHeart.addEventListener('mousedown', startHold);
intHeart.addEventListener('touchstart', startHold);
window.addEventListener('mouseup', endHold);
window.addEventListener('touchend', endHold);

// Patlama ve Arkaplan Değişimi
function triggerExplosion() {
    isExploded = true;
    clearInterval(holdTimer);

    // Flaş Efekti
    flashEffect.classList.add('active');

    setTimeout(() => {
        intPhase.classList.add('hidden');
        propPhase.classList.remove('hidden');
        document.body.classList.add('bg-proposal'); // Şık arkaplana geçiş

        // Flaş bitişi
        setTimeout(() => {
            flashEffect.classList.remove('active');
        }, 300);
    }, 500);
}

// --- HAYIR BUTONU KAÇMA MANTIĞI ---
function evadeButton(e) {
    // Butonu absolute yaparak serbest bırakıyoruz
    if (btnNo.style.position !== 'fixed') {
        btnNo.style.position = 'fixed';
    }

    const maxX = window.innerWidth - btnNo.offsetWidth - 20;
    const maxY = window.innerHeight - btnNo.offsetHeight - 20;

    const randomX = Math.max(20, Math.random() * maxX);
    const randomY = Math.max(20, Math.random() * maxY);

    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
}

btnNo.addEventListener('mouseover', evadeButton);
btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Tıklanmasını kesin olarak engeller
    evadeButton();
});

// --- EVET BUTONU VE KONFETİ ---
btnYes.addEventListener('click', () => {
    propPhase.classList.add('hidden');
    succPhase.classList.remove('hidden');

    // Konfeti Yağmuru
    const colors = ['#ff4d4d', '#ffcc00', '#ffffff', '#d4af37', '#ff9999'];
    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.top = `-10px`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            const duration = Math.random() * 3 + 2;
            confetti.style.animationDuration = `${duration}s`;

            document.body.appendChild(confetti);
            setTimeout(() => { confetti.remove(); }, duration * 1000);
        }, i * 20); // Dalga dalga yağsın
    }
});