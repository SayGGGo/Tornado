document.addEventListener("DOMContentLoaded", () => {
    const btnApprove = document.getElementById("btn-approve");
    const btnReject = document.getElementById("btn-reject");
    const cardContent = document.getElementById("card-content");
    const animContainer = document.getElementById("anim-container");
    const warningsContainer = document.getElementById("warnings-container");
    const token = document.body.dataset.token;
    const appNameEl = document.querySelector(".app-name");

    if (!appNameEl) return;

    const appName = appNameEl.innerText.trim();
    const perms = Array.from(document.querySelectorAll(".req-list div span")).map(e => e.innerText.trim().toLowerCase());

    let isCritical = false;
    let timerActive = false;

    if (perms.length > 3) {
        warningsContainer.innerHTML += '<div class="alert alert-orange">Приложение запрашивает расширенный доступ к большому количеству данных.</div>';
        isCritical = true;
    }

    if (appName === "TORNADO for IDE") {
        warningsContainer.innerHTML += '<div class="alert alert-blue">Убедитесь, что запрос исходит из безопасного источника (вашего локального редактора кода).</div>';
    } else if (appName.toUpperCase().includes("TORNADO")) {
        warningsContainer.innerHTML += '<div class="alert alert-red">Внимание: Возможен фишинг. Системные модули не требуют авторизации через веб-интерфейс.</div>';
        isCritical = true;
    }

    const criticalKeywords = ["пароль", "удален", "полный", "чтение и запись", "токен", "admin", "админ"];
    if (perms.some(p => criticalKeywords.some(k => p.includes(k)))) {
        isCritical = true;
    }

    if (isCritical && warningsContainer.children.length === 0) {
         warningsContainer.innerHTML += '<div class="alert alert-orange">Запрашиваются критически важные разрешения. Будьте осторожны.</div>';
    }

    function showAnimation(isSuccess) {
        cardContent.classList.add("blur-out");

        setTimeout(() => {
            cardContent.style.display = "none";
            animContainer.style.display = "flex";
            animContainer.classList.add("blur-in");

            if (isSuccess) {
                animContainer.style.color = "#34c759";
                animContainer.innerHTML = `
                    <svg class="svg-anim" viewBox="0 0 52 52">
                        <circle cx="26" cy="26" r="25" fill="none" stroke="#34c759" stroke-width="2" />
                        <path class="path-check" fill="none" stroke="#34c759" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
                    <h2>Успешно!</h2>
                    <p class="anim-subtext">Вы можете закрыть эту страницу</p>
                `;
            } else {
                animContainer.style.color = "#ff453a";
                animContainer.innerHTML = `
                    <svg class="svg-anim" viewBox="0 0 52 52">
                        <circle cx="26" cy="26" r="25" fill="none" stroke="#ff453a" stroke-width="2" />
                        <path class="path-cross" fill="none" stroke="#ff453a" stroke-width="4" stroke-linecap="round" d="M16 16 36 36 M36 16 16 36" />
                    </svg>
                    <h2>Отклонено</h2>
                    <p class="anim-subtext">Запрос был отменен</p>
                `;
            }
        }, 400);
    }

    if (btnApprove) {
        btnApprove.addEventListener("click", async () => {
            if (isCritical && !timerActive && !btnApprove.classList.contains("unlocked")) {
                timerActive = true;
                btnApprove.classList.add("btn-timer");
                let seconds = 3;
                btnApprove.innerText = `Подтвердить (${seconds})`;

                const interval = setInterval(() => {
                    seconds--;
                    if (seconds > 0) {
                        btnApprove.innerText = `Подтвердить (${seconds})`;
                    } else {
                        clearInterval(interval);
                        btnApprove.innerText = "Подтвердить";
                        btnApprove.classList.remove("btn-timer");
                        btnApprove.classList.add("unlocked");
                        timerActive = false;
                    }
                }, 1000);
                return;
            }

            if (timerActive) return;

            btnApprove.style.pointerEvents = "none";
            btnReject.style.pointerEvents = "none";
            const originalText = btnApprove.innerText;
            btnApprove.innerHTML = '<div class="loader"></div>';

            try {
                const res = await fetch(`/api/auth/${token}/approve`, { method: "POST" });
                showAnimation(res.ok);
            } catch {
                showAnimation(false);
            }
        });
    }

    if (btnReject) {
        btnReject.addEventListener("click", async () => {
            btnApprove.style.pointerEvents = "none";
            btnReject.style.pointerEvents = "none";
            btnReject.innerHTML = '<div class="loader"></div>';

            try {
                const res = await fetch(`/api/auth/${token}/reject`, { method: "POST" });
                showAnimation(false);
            } catch {
                showAnimation(false);
            }
        });
    }
});