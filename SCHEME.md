Тестовая блоксхема
```mermaid
graph TD
    %% Стилизация узлов
    classDef server fill:#1a1a2e,stroke:#8774e1,stroke-width:2px,color:#fff;
    classDef client fill:#16213e,stroke:#34c759,stroke-width:2px,color:#fff;
    classDef db fill:#0f3460,stroke:#fff,stroke-width:1px,color:#fff;
    classDef note fill:#2a2a2a,stroke:#e94560,stroke-width:1px,color:#fff;

    %% === СЕКЦИЯ СЕРВЕРА ===
    subgraph Server [СЕРВЕРНАЯ ЧАСТЬ TORNADO]
        S_START([Старт сервера]):::server --> S_INIT[Запуск БД SQLite, логов и компонентов\nПроверка версии с GitHub]:::server
        
        S_INIT --> S_VER_CHECK{Есть ли верификация \nлицензионного ключа?}:::server
        
        S_VER_CHECK -- Нет --> S_NO_VER[Заблокирован доступ к функциям\nСервер помечен как небезопасный]:::server
        S_VER_CHECK -- Да --> S_YES_VER[Доступ к доп. функциям\nОтображение ключа в /api/ping]:::server
        
        S_NO_VER --> S_LIC_CHECK
        S_YES_VER --> S_LIC_CHECK
        
        S_LIC_CHECK{Нужна ли\nлицензия модулей?}:::server
        S_LIC_CHECK -- Да --> S_LIC_VERIFY[Проверка путем подключения\nк центральному серверу]:::server --> S_MOD_START
        S_LIC_CHECK -- Нет --> S_MOD_START[Запуск кастомных модулей\nи Telegram API]:::server
        
        S_MOD_START --> S_READY([Конец запуска, ожидание запросов\nВывод публичного и локального IP/порта]):::server
    end

    %% === СЕКЦИЯ КЛИЕНТА ===
    subgraph Client [КЛИЕНТСКАЯ ЧАСТЬ (БРАУЗЕР)]
        C_START([Старт клиента]):::client --> C_AUTH[Авторизация или регистрация\nс принятием условий]:::client
        C_AUTH --> C_SYSTEM[Пользователь в системе]:::client
        
        C_SYSTEM --> C_MSG_SYS[Работа систем,\nсвязанных с сообщениями]:::client
        C_SYSTEM --> C_EXTRA_SYS[Работа с доп. системами\n(Telegram сессии)]:::client
        
        C_MSG_SYS --> C_END([Конец сессии / Выход]):::client
        C_EXTRA_SYS --> C_END
    end

    %% === ВЗАИМОДЕЙСТВИЕ (API / WEBSOCKETS) ===
    C_AUTH -.->|Отправка JSON| API_AUTH[Принятие GET/POST запросов\nна /login и /api/register]:::db
    API_AUTH --> API_CHECK{Проверка данных пользователя\nи прохождения Turnstile Captcha}:::db
    
    API_CHECK -- Ошибка валидации --> API_REJECT[Отклонить запрос\n(Возврат JSON с ошибкой)]:::db -.-> C_AUTH
    API_CHECK -- Успех --> API_APPROVE[Одобрить запрос\nСоздание сессии Flask]:::db -.-> C_SYSTEM

    C_MSG_SYS -.->|Отправка/Получение| API_MSG[Обмен данными о чатах\nи сообщениях /api/messages]:::db
    API_MSG --> API_EXEC[Выполнение через БД (SQLAlchemy),\nмодули или встроенные функции]:::db

    C_EXTRA_SYS -.->|Интеграция| API_EXTRA[Получение запросов на\nвзаимодействие с др. системами]:::db
    API_EXTRA --> API_EXEC

    %% === ДОПОЛНЕНИЯ ===
    METRICA>Дополнение: Информация о пользователе\nтакже доступна в Яндекс.Метрика]:::note -.- Client