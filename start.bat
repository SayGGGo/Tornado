@echo off
chcp 65001 > nul

set "VENV_DIR=venv"
set "REQUIREMENTS=requirements.txt"
set "MAIN_FILE=app.py"
set "LOG_FILE=app-trn.log"

echo ──────────────────────────────────────────

if not exist %VENV_DIR% (
    echo [*] Инициализация окружения...
    python -m venv %VENV_DIR%
)

echo [*] Активация окружения...
call %VENV_DIR%\Scripts\activate

if exist %REQUIREMENTS% (
    echo [*] Обновление компонентов...
    python -m pip install --upgrade pip -q
    pip install -r %REQUIREMENTS% -q
) else (
    echo [!] Файл %REQUIREMENTS% отсутствует
)

echo [*] Развертывание %MAIN_FILE%...

set PYTHONIOENCODING=utf-8
start /b python %MAIN_FILE% > %LOG_FILE% 2>&1

timeout /t 1 /nobreak > nul

tasklist /fi "imagename eq python.exe" | findstr /i "python.exe" > nul
if %errorlevel% equ 0 (
    echo [+] TORNADO запущена успешно!
    echo [+] LOG: %LOG_FILE%
) else (
    echo [-] КРИТИЧЕСКАЯ ОШИБКА ПРИ ЗАПУСКЕ
)
echo ──────────────────────────────────────────
