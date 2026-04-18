document.addEventListener('DOMContentLoaded', () => {

    const cardWindow = document.querySelector('.card-window');
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            cardWindow.classList.add('ready');
        });
    });

    const form          = document.getElementById('setupForm');
    const nextBtn       = document.getElementById('nextBtn');
    const dynamicFields = document.getElementById('dynamic-fields');
    const positionInput = document.getElementById('position_input');

    function showError(message) {
        let errDiv = document.getElementById('error-msg');
        if (!errDiv) {
            errDiv = document.createElement('div');
            errDiv.id = 'error-msg';
            errDiv.className = 'error-message';
            const actionRow = form.querySelector('.action-row');
            form.insertBefore(errDiv, actionRow);
        }
        errDiv.textContent = message;
        errDiv.style.display = 'block';
        errDiv.style.opacity  = '1';
        clearTimeout(errDiv._timeout);
        errDiv._timeout = setTimeout(() => {
            errDiv.style.opacity = '0';
            setTimeout(() => {
                errDiv.style.display = 'none';
                errDiv.style.opacity  = '1';
            }, 300);
        }, 3500);
    }

    nextBtn.addEventListener('click', async () => {
        if (nextBtn.classList.contains('locked')) return;

        const formData = new FormData(form);
        const data     = Object.fromEntries(formData.entries());

        const termsInput = form.querySelector('[name="terms"]');
        data.terms       = termsInput ? termsInput.checked : false;

        if (data.password !== data.password_retry) {
            showError('Пароли не совпадают');
            return;
        }

        const originalHTML = nextBtn.innerHTML;
        nextBtn.innerHTML  = '<span class="btn-text">Загрузка…</span>';
        nextBtn.classList.add('locked');

        try {
            const response = await fetch('/api/register', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                window.location.href = result.redirect;
            } else {
                showError(result.message);
                nextBtn.innerHTML = originalHTML;
                nextBtn.classList.remove('locked');

                if (window.turnstile) {
                    turnstile.reset();
                } else if (window.smartCaptcha) {
                    window.smartCaptcha.reset();
                }
            }
        } catch {
            showError('Ошибка соединения с сервером');
            nextBtn.innerHTML = originalHTML;
            nextBtn.classList.remove('locked');
        }
    });

    function validateForm() {
        const isDynamicVisible = dynamicFields.style.display !== 'none';
        let isValid = true;

        form.querySelectorAll('[required]').forEach(input => {
            if (!isDynamicVisible && dynamicFields.contains(input)) return;

            if (input.type === 'checkbox') {
                if (!input.checked) isValid = false;
            } else if (input.type === 'email') {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) isValid = false;
            } else {
                if (!input.value.trim()) isValid = false;
            }
        });

        nextBtn.disabled = !isValid;
        nextBtn.classList.toggle('locked', !isValid);
    }

    form.addEventListener('input', validateForm);

    function closeAllDropdowns() {
        document.querySelectorAll('.custom-select, .custom-multiselect').forEach(el => {
            el.classList.remove('active');
            const row = el.closest('.form-row, .select-row');
            if (row) row.style.zIndex = '';
        });
    }

    function openDropdown(el) {
        closeAllDropdowns();
        el.classList.add('active');
        const row = el.closest('.form-row');
        if (row) row.style.zIndex = '200';
    }

    document.querySelectorAll('.custom-select').forEach(cs => {
        const display     = cs.querySelector('.cs-display');
        const options     = cs.querySelectorAll('.cs-option');
        const placeholder = cs.querySelector('.cs-placeholder');
        const hiddenInput = cs.querySelector('input[type="hidden"]');

        display.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = cs.classList.contains('active');
            if (isActive) {
                cs.classList.remove('active');
                const row = cs.closest('.form-row');
                if (row) row.style.zIndex = '';
            } else {
                openDropdown(cs);
            }
        });

        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                options.forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');

                const value = option.getAttribute('data-value');
                const text  = option.textContent.trim();

                let valueSpan = display.querySelector('.cs-value');
                if (!valueSpan) {
                    valueSpan = document.createElement('span');
                    valueSpan.className = 'cs-value';
                    placeholder.insertAdjacentElement('afterend', valueSpan);
                }
                valueSpan.textContent    = text;
                placeholder.style.display = 'none';

                hiddenInput.value = value;

                cs.classList.remove('active');
                const row = cs.closest('.form-row');
                if (row) row.style.zIndex = '';

                if (hiddenInput.name === 'position' || hiddenInput.id === 'position_input') {
                    dynamicFields.style.display = 'flex';
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            dynamicFields.style.opacity = '1';
                        });
                    });
                }

                validateForm();
            });
        });
    });

    document.querySelectorAll('.custom-multiselect').forEach(ms => {
        const display       = ms.querySelector('.ms-display');
        const options       = ms.querySelectorAll('.ms-option');
        const tagsContainer = ms.querySelector('.ms-tags');
        const placeholder   = ms.querySelector('.ms-placeholder');
        const hiddenInput   = ms.querySelector('input[type="hidden"]');
        let selectedValues  = [];

        display.addEventListener('click', (e) => {
            if (e.target.closest('.ms-tag-remove')) return;
            e.stopPropagation();
            const isActive = ms.classList.contains('active');
            if (isActive) {
                ms.classList.remove('active');
                const row = ms.closest('.form-row');
                if (row) row.style.zIndex = '';
            } else {
                openDropdown(ms);
            }
        });

        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = option.getAttribute('data-value');
                const text  = option.textContent.trim();

                if (selectedValues.some(i => i.value === value)) {
                    selectedValues = selectedValues.filter(i => i.value !== value);
                    option.classList.remove('selected');
                } else {
                    selectedValues.push({ value, text });
                    option.classList.add('selected');
                }
                renderTags();
            });
        });

        function renderTags() {
            tagsContainer.innerHTML = '';
            if (selectedValues.length > 0) {
                placeholder.style.display = 'none';
                selectedValues.forEach(({ value, text }) => {
                    const tag = document.createElement('span');
                    tag.className = 'ms-tag';
                    tag.innerHTML = `${text}<span class="ms-tag-remove" data-value="${value}" aria-label="Удалить">×</span>`;
                    tagsContainer.appendChild(tag);
                });
            } else {
                placeholder.style.display = '';
            }

            hiddenInput.value = selectedValues.map(i => i.value).join(',');
            validateForm();

            tagsContainer.querySelectorAll('.ms-tag-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const val = btn.getAttribute('data-value');
                    selectedValues = selectedValues.filter(i => i.value !== val);
                    const opt = ms.querySelector(`.ms-option[data-value="${val}"]`);
                    if (opt) opt.classList.remove('selected');
                    renderTags();
                });
            });
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-select') && !e.target.closest('.custom-multiselect')) {
            closeAllDropdowns();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllDropdowns();
    });

    const MAX_TRAVEL = 244;
    const COLOR_OFF  = 0x111113;
    const COLOR_ON   = 0x34c759;
    const SCALE      = 0.24;

    let audioCtx;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playClickSound() {
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc  = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.06);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.06);
    }

    function lerpColor(colorA, colorB, t) {
        const rA = (colorA >> 16) & 0xff, gA = (colorA >> 8) & 0xff, bA = colorA & 0xff;
        const rB = (colorB >> 16) & 0xff, gB = (colorB >> 8) & 0xff, bB = colorB & 0xff;
        return `rgb(${Math.round(rA + t * (rB - rA))},${Math.round(gA + t * (gB - gA))},${Math.round(bA + t * (bB - bA))})`;
    }

    function initSwitcher(container) {
        const track    = container.querySelector('.track');
        const wrapper  = container.querySelector('.knob-wrapper');
        const knob     = container.querySelector('.knob');
        const specular = container.querySelector('.knob-specular');
        const checkbox = container.querySelector('.switch-input');

        let isDragging = false, hasMoved = false;
        let startX = 0, currentX = 0, initialX = 0;

        function updateVisuals() {
            track.classList.toggle('active-bg', checkbox.checked);
        }

        function setPosition(px) {
            wrapper.style.transform = `translateX(${px}px)`;
        }

        function updateSpecular(clientX, clientY) {
            const r = knob.getBoundingClientRect();
            specular.style.setProperty('--light-x', `${((clientX - r.left) / r.width)  * 100}%`);
            specular.style.setProperty('--light-y', `${((clientY - r.top)  / r.height) * 100}%`);
        }

        function snapToCurrent() {
            track.style.backgroundColor = '';
            setPosition(checkbox.checked ? MAX_TRAVEL : 0);
            updateVisuals();
            validateForm();
        }

        function toggleState() {
            initAudio();
            checkbox.checked = !checkbox.checked;
            playClickSound();
            snapToCurrent();
        }

        function startDrag(e) {
            initAudio();
            isDragging = true;
            hasMoved   = false;
            wrapper.classList.add('active', 'dragging');
            track.classList.add('dragging');
            const cx = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const cy = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            startX   = cx;
            initialX = checkbox.checked ? MAX_TRAVEL : 0;
            updateSpecular(cx, cy);
        }

        function onDrag(e) {
            if (!isDragging) return;
            const cx    = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const cy    = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            const delta = (cx - startX) / SCALE;
            if (Math.abs(delta) > 3) hasMoved = true;

            currentX = Math.max(0, Math.min(initialX + delta, MAX_TRAVEL));
            setPosition(currentX);
            track.style.backgroundColor = lerpColor(COLOR_OFF, COLOR_ON, currentX / MAX_TRAVEL);
            requestAnimationFrame(() => updateSpecular(cx, cy));
        }

        function endDrag() {
            if (!isDragging) return;
            isDragging = false;
            wrapper.classList.remove('active', 'dragging');
            track.classList.remove('dragging');

            if (!hasMoved) { toggleState(); return; }

            const prev = checkbox.checked;
            checkbox.checked = currentX > MAX_TRAVEL / 2;
            if (prev !== checkbox.checked) playClickSound();
            snapToCurrent();
        }

        knob.addEventListener('mousedown',  startDrag);
        knob.addEventListener('touchstart', startDrag, { passive: false });
        window.addEventListener('mousemove', onDrag);
        window.addEventListener('touchmove', onDrag,  { passive: false });
        window.addEventListener('mouseup',   endDrag);
        window.addEventListener('touchend',  endDrag);

        track.addEventListener('click', (e) => {
            if (wrapper.contains(e.target)) return;
            toggleState();
        });

        snapToCurrent();
    }

    document.querySelectorAll('.switch-container').forEach(initSwitcher);
});