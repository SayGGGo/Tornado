(function() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) return;

    const CFG = {
        total: 250,
        spriteUrl: '/favicon-sprite',
        targetFPS: 120,
        size: 64,
        radius: 12,
        burstDuration: 5000,
        minWait: 15000,
        maxWait: 30000
    };

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { alpha: false });
    canvas.width = CFG.size;
    canvas.height = CFG.size;

    const favicon = document.querySelector("link[rel*='icon']") || document.createElement('link');
    favicon.rel = 'shortcut icon';
    document.head.appendChild(favicon);

    const frameCache = new Array(CFG.total);
    let isReady = false;
    let currentFrame = 0;
    const baseTitle = document.title.replace(/TORNADO/gi, '').replace(/^[\s|\\/-]+|[\s|\\/-]+$/g, '').trim();
    const brand = "TORNADO";

    let step = 0;
    let isBursting = false;
    let currentEffect = null;

    const effects = [
        (s) => brand.split('').map((c, i) => s % 15 > i ? c : "!?#@*&%"[Math.floor(Math.random() * 7)]).join(''),
        (s) => brand.split('').map((c, i) => (i + s) % 3 === 0 ? c.toUpperCase() : c.toLowerCase()).join(''),
        (s) => {
            const symbols = ["◢", "◣", "◤", "◥"];
            return `${symbols[s % 4]} ${brand} ${symbols[(s + 2) % 4]}`;
        },
        (s) => brand.split('').map(c => Math.random() > 0.9 ? "$" : c).join(''),
        (s) => {
            const shift = s % (brand.length + 1);
            return brand.slice(0, shift) + "_" + brand.slice(shift);
        },
        (s) => {
            const frames = ["—", "\\", "|", "/"];
            return `${frames[s % 4]} ${brand} ${frames[s % 4]}`;
        },
        (s) => brand.split('').reverse().join(''),
        (s) => brand.split('').map(c => s % 2 === 0 ? c : " ").join(''),
        (s) => brand.replace(/[AO]/g, s % 2 === 0 ? "0" : "X")
    ];

    const spriteImg = new Image();
    spriteImg.crossOrigin = "anonymous";
    spriteImg.src = CFG.spriteUrl;

    spriteImg.onload = () => {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = CFG.size;
        tempCanvas.height = CFG.size;

        for (let i = 0; i < CFG.total; i++) {
            tempCtx.clearRect(0, 0, CFG.size, CFG.size);
            tempCtx.save();
            tempCtx.beginPath();
            tempCtx.roundRect(0, 0, CFG.size, CFG.size, CFG.radius);
            tempCtx.clip();
            tempCtx.drawImage(spriteImg, 0, i * CFG.size, CFG.size, CFG.size, 0, 0, CFG.size, CFG.size);
            frameCache[i] = tempCanvas.toDataURL('image/webp', 0.5);
            tempCtx.restore();
        }
        isReady = true;
        requestAnimationFrame(renderFavicon);
    };

    let lastFaviconTime = 0;
    const faviconInterval = 1000 / CFG.targetFPS;

    function renderFavicon(timestamp) {
        if (!isReady) return;
        if (timestamp - lastFaviconTime >= faviconInterval) {
            favicon.href = frameCache[currentFrame];
            currentFrame = (currentFrame + 1) % CFG.total;
            lastFaviconTime = timestamp;
        }
        requestAnimationFrame(renderFavicon);
    }

    function triggerBurst() {
        isBursting = true;
        currentEffect = effects[Math.floor(Math.random() * effects.length)];
        step = 0;

        setTimeout(() => {
            isBursting = false;
            document.title = baseTitle ? `${brand} | ${baseTitle}` : brand;
            scheduleNext();
        }, CFG.burstDuration);
    }

    function scheduleNext() {
        const delay = Math.floor(Math.random() * (CFG.maxWait - CFG.minWait)) + CFG.minWait;
        setTimeout(triggerBurst, delay);
    }

    setInterval(() => {
        if (!isBursting) return;
        const animated = currentEffect(step);
        document.title = baseTitle ? `${animated} | ${baseTitle}` : animated;
        step++;
    }, 150);

    document.title = baseTitle ? `${brand} | ${baseTitle}` : brand;
    scheduleNext();
})();