document.addEventListener('DOMContentLoaded', () => {
    const cardWindow = document.querySelector('.card-window');
    cardWindow.style.opacity = '0';
    cardWindow.style.transform = 'translateY(30px) scale(0.98)';
    cardWindow.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';

    setTimeout(() => {
        cardWindow.style.opacity = '1';
        cardWindow.style.transform = 'translateY(0) scale(1)';
    }, 50);

    const form = document.getElementById('setupForm');
    const nextBtn = document.getElementById('nextBtn');
    const dynamicFields = document.getElementById('dynamic-fields');
    const positionInput = document.getElementById('position_input');

    function showError(message) {
        let errDiv = document.getElementById('error-msg');
        if (!errDiv) {
            errDiv = document.createElement('div');
            errDiv.id = 'error-msg';
            errDiv.className = 'error-message';
            form.insertBefore(errDiv, document.querySelector('.action-row'));
        }
        errDiv.textContent = message;
        errDiv.style.display = 'block';
        setTimeout(() => {
            errDiv.style.opacity = '0';
            setTimeout(() => {
                errDiv.style.display = 'none';
                errDiv.style.opacity = '1';
            }, 300);
        }, 3000);
    }

    nextBtn.addEventListener('click', async () => {
        if (nextBtn.classList.contains('locked')) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const premiumInput = form.querySelector('[name="premium_sub"]');
        const termsInput = form.querySelector('[name="terms"]');

        data.premium_sub = premiumInput ? premiumInput.checked : false;
        data.terms = termsInput ? termsInput.checked : false;

        if (data.password !== data.password_retry) {
            showError('Пароли не совпадают');
            return;
        }

        const originalBtnText = nextBtn.textContent;
        nextBtn.textContent = 'Загрузка...';
        nextBtn.classList.add('locked');

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                window.location.href = result.redirect;
            } else {
                showError(result.message);
                nextBtn.textContent = originalBtnText;
                nextBtn.classList.remove('locked');
            }
        } catch (error) {
            showError('Ошибка соединения с сервером');
            nextBtn.textContent = originalBtnText;
            nextBtn.classList.remove('locked');
        }
    });

    function validateForm() {
        let isValid = true;
        const isDynamicVisible = dynamicFields.style.display !== 'none';
        const requiredInputs = form.querySelectorAll('[required]');

        requiredInputs.forEach(input => {
            if (!isDynamicVisible && dynamicFields.contains(input)) {
                return;
            }

            if (input.type === 'checkbox') {
                if (!input.checked) {
                    isValid = false;
                }
            } else if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                }
            } else {
                if (!input.value.trim()) {
                    isValid = false;
                }
            }
        });

        if (isValid) {
            nextBtn.classList.remove('locked');
            nextBtn.disabled = false;
        } else {
            nextBtn.classList.add('locked');
            nextBtn.disabled = true;
        }
    }

    form.addEventListener('input', validateForm);

    document.querySelectorAll('.glass-input').forEach(input => {
        input.addEventListener('mousemove', e => {
            const rect = input.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            input.style.setProperty('--mouse-x', `${x}px`);
            input.style.setProperty('--mouse-y', `${y}px`);
        });

        input.addEventListener('mouseleave', () => {
            input.style.setProperty('--mouse-x', `-500px`);
            input.style.setProperty('--mouse-y', `-500px`);
        });
    });

    const customSelects = document.querySelectorAll('.custom-select');
    customSelects.forEach(cs => {
        const display = cs.querySelector('.cs-display');
        const options = cs.querySelectorAll('.cs-option');
        const placeholder = cs.querySelector('.cs-placeholder');
        const hiddenInput = cs.querySelector('input[type="hidden"]');

        display.addEventListener('click', () => {
            const isActive = cs.classList.contains('active');
            document.querySelectorAll('.custom-select, .custom-multiselect').forEach(el => el.classList.remove('active'));
            if (!isActive) cs.classList.add('active');
        });

        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');

                const value = option.getAttribute('data-value');
                const text = option.textContent;

                let valueSpan = display.querySelector('.cs-value');
                if (!valueSpan) {
                    valueSpan = document.createElement('span');
                    valueSpan.className = 'cs-value';
                    display.appendChild(valueSpan);
                }
                valueSpan.textContent = text;
                placeholder.style.display = 'none';

                hiddenInput.value = value;
                cs.classList.remove('active');

                if (hiddenInput.id === 'position_input') {
                    dynamicFields.style.display = 'flex';
                    setTimeout(() => {
                        dynamicFields.style.opacity = '1';
                    }, 10);
                }
                validateForm();
            });
        });
    });

    const multiselects = document.querySelectorAll('.custom-multiselect');
    multiselects.forEach(ms => {
        const display = ms.querySelector('.ms-display');
        const options = ms.querySelectorAll('.ms-option');
        const tagsContainer = ms.querySelector('.ms-tags');
        const placeholder = ms.querySelector('.ms-placeholder');
        const hiddenInput = ms.querySelector('input[type="hidden"]');
        let selectedValues = [];

        display.addEventListener('click', (e) => {
            if(e.target.closest('.ms-tag-remove')) return;
            const isActive = ms.classList.contains('active');
            document.querySelectorAll('.custom-select, .custom-multiselect').forEach(el => el.classList.remove('active'));
            if (!isActive) ms.classList.add('active');
        });

        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = option.getAttribute('data-value');
                const text = option.textContent;

                if (selectedValues.some(item => item.value === value)) {
                    selectedValues = selectedValues.filter(item => item.value !== value);
                    option.classList.remove('selected');
                } else {
                    selectedValues.push({ value, text });
                    option.classList.add('selected');
                }
                updateTags();
            });
        });

        function updateTags() {
            tagsContainer.innerHTML = '';
            if (selectedValues.length > 0) {
                placeholder.style.display = 'none';
                selectedValues.forEach(item => {
                    const tag = document.createElement('div');
                    tag.className = 'ms-tag';
                    tag.innerHTML = `<span>${item.text}</span><span class="ms-tag-remove" data-value="${item.value}">&times;</span>`;
                    tagsContainer.appendChild(tag);
                });
            } else {
                placeholder.style.display = 'block';
            }
            hiddenInput.value = selectedValues.map(item => item.value).join(',');
            validateForm();

            tagsContainer.querySelectorAll('.ms-tag-remove').forEach(rmBtn => {
                rmBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const valToRemove = rmBtn.getAttribute('data-value');
                    selectedValues = selectedValues.filter(item => item.value !== valToRemove);
                    ms.querySelector(`.ms-option[data-value="${valToRemove}"]`).classList.remove('selected');
                    updateTags();
                });
            });
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-select') && !e.target.closest('.custom-multiselect')) {
            document.querySelectorAll('.custom-select, .custom-multiselect').forEach(el => el.classList.remove('active'));
        }
    });

    const track = document.getElementById('track');
    const wrapper = document.getElementById('knobWrapper');
    const knob = document.getElementById('knob');
    const knobSpecular = document.getElementById('knobSpecular');
    const checkbox = document.getElementById('toggle');

    const MAX_TRAVEL = 244;
    const COLOR_OFF = 0x121212;
    const COLOR_ON = 0x34c759;
    const SCALE = 0.24;

    let isDragging = false;
    let hasMoved = false;
    let startX = 0;
    let currentX = 0;
    let initialX = 0;
    let audioCtx;

function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playClickSound() {
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.05);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.05);
    }

    const lerpColor = (colorA, colorB, amount) => {
        const rA = colorA >> 16;
        const gA = colorA >> 8 & 0xff;
        const bA = colorA & 0xff;
        const rB = colorB >> 16;
        const gB = colorB >> 8 & 0xff;
        const bB = colorB & 0xff;
        const rFinal = Math.round(rA + amount * (rB - rA));
        const gFinal = Math.round(gA + amount * (gB - gA));
        const bFinal = Math.round(bA + amount * (bB - bA));
        return `rgb(${rFinal}, ${gFinal}, ${bFinal})`;
    };

    function initSwitcher(container) {
        const track = container.querySelector('.track');
        const wrapper = container.querySelector('.knob-wrapper');
        const knob = container.querySelector('.knob');
        const specular = container.querySelector('.knob-specular');
        const checkbox = container.querySelector('.switch-input');

        let isDragging = false;
        let hasMoved = false;
        let startX = 0;
        let currentX = 0;
        let initialX = 0;

        function updateVisuals() {
            if (checkbox.checked) {
                track.classList.add('active-bg');
            } else {
                track.classList.remove('active-bg');
            }
        }

        function setPosition(px) {
            wrapper.style.transform = `translateX(${px}px)`;
        }

        function updateSpecularPosition(clientX, clientY) {
            const knobRect = knob.getBoundingClientRect();
            const x = clientX - knobRect.left;
            const y = clientY - knobRect.top;
            const xPercent = (x / knobRect.width) * 100;
            const yPercent = (y / knobRect.height) * 100;
            specular.style.setProperty('--light-x', `${xPercent}%`);
            specular.style.setProperty('--light-y', `${yPercent}%`);
        }

        function snapToCurrent() {
            track.style.backgroundColor = '';
            const targetX = checkbox.checked ? MAX_TRAVEL : 0;
            setPosition(targetX);
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
            hasMoved = false;
            wrapper.classList.add('active', 'dragging');
            track.classList.add('dragging');
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            startX = clientX;
            initialX = checkbox.checked ? MAX_TRAVEL : 0;
            updateSpecularPosition(clientX, clientY);
        }

        function onDrag(e) {
            if (!isDragging) return;
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            const deltaX = (clientX - startX) / SCALE;

            if (Math.abs(deltaX) > 3) {
                hasMoved = true;
            }

            let newPos = initialX + deltaX;
            newPos = Math.max(0, Math.min(newPos, MAX_TRAVEL));
            currentX = newPos;

            setPosition(newPos);

            const percent = newPos / MAX_TRAVEL;
            track.style.backgroundColor = lerpColor(COLOR_OFF, COLOR_ON, percent);

            requestAnimationFrame(() => {
                updateSpecularPosition(clientX, clientY);
            });
        }

        function endDrag() {
            if (!isDragging) return;
            isDragging = false;
            wrapper.classList.remove('active', 'dragging');
            track.classList.remove('dragging');

            if (!hasMoved) {
                toggleState();
                return;
            }

            const prevState = checkbox.checked;
            if (currentX > MAX_TRAVEL / 2) {
                checkbox.checked = true;
            } else {
                checkbox.checked = false;
            }

            if (prevState !== checkbox.checked) {
                playClickSound();
            }
            snapToCurrent();
        }

        knob.addEventListener('mousedown', startDrag);
        knob.addEventListener('touchstart', startDrag, { passive: false });

        window.addEventListener('mousemove', onDrag);
        window.addEventListener('touchmove', onDrag, { passive: false });

        window.addEventListener('mouseup', endDrag);
        window.addEventListener('touchend', endDrag);

        track.addEventListener('click', (e) => {
            if (e.target === knob || e.target === wrapper) return;
            toggleState();
        });

        snapToCurrent();
    }

    const allSwitchers = document.querySelectorAll('.switch-container');
    allSwitchers.forEach(container => {
        initSwitcher(container);
    });
});