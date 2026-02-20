document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chatBox');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const currentUserId = parseInt(document.querySelector('meta[name="current-user-id"]').content);

    let lastMessageId = 0;
    let isFetching = false;

    function scrollToBottom() {
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function createMessageElement(msg) {
        const div = document.createElement('div');
        const isOwn = msg.user_id === currentUserId;

        div.className = `message-box ${isOwn ? 'msg-own' : 'msg-other'}`;

        div.innerHTML = `
            <div class="msg-header">
                <span class="msg-author">${msg.login}</span>
                <span class="msg-time">${msg.timestamp}</span>
            </div>
            <div class="msg-content">${msg.content}</div>
        `;
        return div;
    }

    async function fetchMessages() {
        if (isFetching) return;
        isFetching = true;

        try {
            const response = await fetch(`/api/messages?last_id=${lastMessageId}`);
            if (!response.ok) throw new Error('Network error');

            const messages = await response.json();

            if (messages.length > 0) {
                let shouldScroll = chatBox.scrollTop + chatBox.clientHeight >= chatBox.scrollHeight - 50;

                messages.forEach(msg => {
                    chatBox.appendChild(createMessageElement(msg));
                    lastMessageId = Math.max(lastMessageId, msg.id);
                });

                if (shouldScroll || messages.some(m => m.user_id === currentUserId)) {
                    scrollToBottom();
                }
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            isFetching = false;
        }
    }

    async function sendMessage() {
        const content = messageInput.value.trim();
        if (!content) return;

        messageInput.value = '';
        messageInput.focus();

        try {
            await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    sendBtn.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    setInterval(fetchMessages, 2000);
    fetchMessages();
});