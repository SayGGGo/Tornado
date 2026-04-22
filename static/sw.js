self.addEventListener('push', function(event) {
    if (!event.data) return;

    let data;
    try { data = event.data.json(); } catch { data = { title: 'Tornado', body: event.data.text() }; }

    const title = data.title || 'Tornado';
    const options = {
        body: data.body || 'Новое сообщение',
        icon: data.icon || '/static/icons/logo.svg',
        badge: '/static/icons/logo.svg',
        tag: data.tag || 'tornado-msg',
        renotify: true,
        data: { chatId: data.chatId, url: data.url || '/chat' },
        vibrate: [100, 50, 100],
        actions: [{ action: 'open', title: 'Открыть' }],
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const url = (event.notification.data && event.notification.data.url) || '/chat';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (const client of clientList) {
                if (client.url.includes('/chat') && 'focus' in client) {
                    client.postMessage({ type: 'NOTIF_CLICK', chatId: event.notification.data.chatId });
                    return client.focus();
                }
            }
            return clients.openWindow(url);
        })
    );
});
