(() => {
    'use strict';

    if (window.__tornadoFaviconInit) return;
    window.__tornadoFaviconInit = true;

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const CFG = Object.freeze({
        total: 250,
        spriteUrl: '/favicon-sprite',
        faviconFPS: reduceMotion ? 24 : 60,
        titleFPS: reduceMotion ? 6 : 12,
        size: 64,
        radius: 12,
        burstDuration: 5000,
        fadeInDuration: 400,
        fadeOutDuration: 600,
        minWait: 15000,
        maxWait: 30000,
        decodeChunkSize: 8
    });

    const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easeOutQuart   = t => 1 - Math.pow(1 - t, 4);

    const ensureFaviconLink = () => {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'shortcut icon';
            document.head.appendChild(link);
        }
        return link;
    };
    const favicon = ensureFaviconLink();

    const baseTitle = document.title.replace(/TORNADO/gi, '').replace(/^[\s|\\/-]+|[\s|\\/-]+$/g, '').trim();
    const BRAND = 'TORNADO';
    const staticTitle = baseTitle ? `${BRAND} | ${baseTitle}` : BRAND;

    const mulberry32 = seed => () => {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };

    const effects = [
        (s, rnd) => {
            const chars = '!?#@*&%';
            return BRAND.split('').map((c, i) => s % 15 > i ? c : chars[Math.floor(rnd() * chars.length)]).join('');
        },
        (s) => BRAND.split('').map((c, i) => (i + s) % 3 === 0 ? c.toUpperCase() : c.toLowerCase()).join(''),
        (s) => {
            const sym = ['◢', '◣', '◤', '◥'];
            return `${sym[s % 4]} ${BRAND} ${sym[(s + 2) % 4]}`;
        },
        (s, rnd) => BRAND.split('').map(c => rnd() > 0.9 ? '$' : c).join(''),
        (s) => {
            const shift = s % (BRAND.length + 1);
            return BRAND.slice(0, shift) + '_' + BRAND.slice(shift);
        },
        (s) => {
            const f = ['—', '\\', '|', '/'];
            return `${f[s % 4]} ${BRAND} ${f[s % 4]}`;
        },
        (s) => BRAND.split('').map(c => s % 2 === 0 ? c : ' ').join(''),
        (s) => BRAND.replace(/[AO]/g, s % 2 === 0 ? '0' : 'X')
    ];

    const frameUrls = new Array(CFG.total);
    let isReady = false;

    const hasOffscreen = typeof OffscreenCanvas !== 'undefined';
    const sliceCanvas = hasOffscreen
        ? new OffscreenCanvas(CFG.size, CFG.size)
        : Object.assign(document.createElement('canvas'), { width: CFG.size, height: CFG.size });
    const sliceCtx = sliceCanvas.getContext('2d');

    const roundPath = new Path2D();
    if (roundPath.roundRect) {
        roundPath.roundRect(0, 0, CFG.size, CFG.size, CFG.radius);
    } else {
        const r = CFG.radius, w = CFG.size, h = CFG.size;
        roundPath.moveTo(r, 0);
        roundPath.lineTo(w - r, 0); roundPath.quadraticCurveTo(w, 0, w, r);
        roundPath.lineTo(w, h - r); roundPath.quadraticCurveTo(w, h, w - r, h);
        roundPath.lineTo(r, h);     roundPath.quadraticCurveTo(0, h, 0, h - r);
        roundPath.lineTo(0, r);     roundPath.quadraticCurveTo(0, 0, r, 0);
    }

    const decodeAllFrames = async bitmap => {
        for (let i = 0; i < CFG.total; i++) {
            sliceCtx.clearRect(0, 0, CFG.size, CFG.size);
            sliceCtx.save();
            sliceCtx.clip(roundPath);
            sliceCtx.drawImage(bitmap, 0, i * CFG.size, CFG.size, CFG.size, 0, 0, CFG.size, CFG.size);
            sliceCtx.restore();

            const blob = hasOffscreen
                ? await sliceCanvas.convertToBlob({ type: 'image/webp', quality: 0.6 })
                : await new Promise(res => sliceCanvas.toBlob(res, 'image/webp', 0.6));

            if (frameUrls[i]) URL.revokeObjectURL(frameUrls[i]);
            frameUrls[i] = URL.createObjectURL(blob);

            if (i % 24 === 0) {
                await new Promise(r => (window.requestIdleCallback || window.setTimeout)(r, { timeout: 1 }));
            }
        }
        bitmap.close?.();
    };

    const loadSprite = async () => {
        try {
            const res = await fetch(CFG.spriteUrl);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const blob = await res.blob();
            const bitmap = await createImageBitmap(blob);
            await decodeAllFrames(bitmap);
            isReady = true;
        } catch (err) {
            console.warn('[tornado-favicon] sprite load failed:', err);
        }
    };

    let rafId = null;
    let scheduleTimeoutId = null;

    let burstState = 'idle';
    let burstStart = 0;
    let currentEffect = null;
    let rnd = Math.random;

    let lastFaviconTick = 0;
    let lastTitleTick = 0;
    let titleStep = 0;
    let faviconFrame = 0;

    const faviconInterval = 1000 / CFG.faviconFPS;
    const titleInterval   = 1000 / CFG.titleFPS;

    const tick = (now) => {
        rafId = requestAnimationFrame(tick);

        if (isReady && now - lastFaviconTick >= faviconInterval) {
            let speedMul = 1;
            if (burstState === 'fadeIn') {
                const p = Math.min(1, (now - burstStart) / CFG.fadeInDuration);
                speedMul = easeOutQuart(p);
            } else if (burstState === 'fadeOut') {
                const activeEnd = burstStart + CFG.fadeInDuration + CFG.burstDuration;
                const p = Math.min(1, (now - activeEnd) / CFG.fadeOutDuration);
                speedMul = 1 - easeInOutCubic(p);
            } else if (burstState === 'idle') {
                speedMul = 0.25;
            }

            const advance = Math.max(1, Math.round(speedMul * 2));
            faviconFrame = (faviconFrame + advance) % CFG.total;
            const url = frameUrls[faviconFrame];
            if (url) favicon.href = url;
            lastFaviconTick = now;
        }

        if (burstState === 'active' || burstState === 'fadeIn') {
            if (now - lastTitleTick >= titleInterval) {
                const animated = currentEffect(titleStep, rnd);
                document.title = baseTitle ? `${animated} | ${baseTitle}` : animated;
                titleStep++;
                lastTitleTick = now;
            }
        }

        if (burstState === 'fadeIn' && now - burstStart >= CFG.fadeInDuration) {
            burstState = 'active';
        } else if (burstState === 'active' && now - burstStart >= CFG.fadeInDuration + CFG.burstDuration) {
            burstState = 'fadeOut';
        } else if (burstState === 'fadeOut' && now - burstStart >= CFG.fadeInDuration + CFG.burstDuration + CFG.fadeOutDuration) {
            burstState = 'idle';
            document.title = staticTitle;
            scheduleNext();
        }
    };

    const triggerBurst = () => {
        if (document.hidden) { scheduleNext(); return; }
        const seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0;
        rnd = mulberry32(seed);
        currentEffect = effects[Math.floor(rnd() * effects.length)];
        titleStep = 0;
        burstStart = performance.now();
        burstState = 'fadeIn';
    };

    const scheduleNext = () => {
        clearTimeout(scheduleTimeoutId);
        const delay = Math.floor(Math.random() * (CFG.maxWait - CFG.minWait)) + CFG.minWait;
        scheduleTimeoutId = setTimeout(triggerBurst, delay);
    };

    const onVisibility = () => {
        if (document.hidden) {
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        } else if (isReady && !rafId) {
            lastFaviconTick = lastTitleTick = 0;
            rafId = requestAnimationFrame(tick);
        }
    };
    document.addEventListener('visibilitychange', onVisibility);

    window.addEventListener('beforeunload', () => {
        if (rafId) cancelAnimationFrame(rafId);
        clearTimeout(scheduleTimeoutId);
        frameUrls.forEach(u => u && URL.revokeObjectURL(u));
        document.removeEventListener('visibilitychange', onVisibility);
    }, { once: true });

    document.title = staticTitle;

    loadSprite().then(() => {
        if (!document.hidden) rafId = requestAnimationFrame(tick);
        scheduleNext();
    });
})();