#!/bin/bash

VENV_DIR="venv"
REQUIREMENTS="requirements.txt"
MAIN_FILE="app.py"
LOG_FILE="app-trn.log"

R='\033[0;31m'
G='\033[0;32m'
Y='\033[1;33m'
B='\033[0;34m'
C='\033[0;36m'
NC='\033[0m'

echo -e "${C}──────────────────────────────────────────${NC}"

if [ ! -d "$VENV_DIR" ]; then
    echo -e "${B}[*]${NC} Инициализация окружения..."
    python3 -m venv $VENV_DIR
fi

echo -e "${B}[*]${NC} Активация окружения..."
source $VENV_DIR/bin/activate

if [ -f "$REQUIREMENTS" ]; then
    echo -e "${B}[*]${NC} Обновление компонентов..."
    pip install --upgrade pip -q
    pip install -r $REQUIREMENTS -q
else
    echo -e "${Y}[!]${NC} Файл $REQUIREMENTS отсутствует"
fi

echo -e "${B}[*]${NC} Развертывание $MAIN_FILE..."
nohup python3 $MAIN_FILE > $LOG_FILE 2>&1 &
PID=$!

sleep 1
if ps -p $PID > /dev/null; then
    echo -e "${G}[+] TORNADO запущена успешно!${NC}"
    echo -e "${G}[+] PID: $PID${NC}"
    echo -e "${G}[+] LOG: $LOG_FILE${NC}"
else
    echo -e "${R[-] КРИТИЧЕСКАЯ ОШИБКА ПРИ ЗАПУСКЕ${NC}"
fi
echo -e "${C}──────────────────────────────────────────${NC}"
