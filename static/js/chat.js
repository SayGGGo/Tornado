const sidebar = document.getElementById('sidebar');
const resizer = document.getElementById('resizer');
const contextMenu = document.getElementById('customContextMenu');
const chatItems = document.querySelectorAll('.chat-item');
const chatPremiumEl = document.getElementById('current-chat-premium');

const noChatState = document.getElementById('no-chat-selected');
const activeChatLayout = document.getElementById('active-chat-layout');
const chatNameEl = document.getElementById('current-chat-name');
const chatAvatarEl = document.getElementById('current-chat-avatar');

let isResizing = false;
let currentChatId = null;

resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    resizer.classList.add('resizing');
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', () => {
        isResizing = false;
        resizer.classList.remove('resizing');
        document.removeEventListener('mousemove', handleMouseMove);
    }, { once: true });
});

function handleMouseMove(e) {
    if (!isResizing) return;
    let newWidth = e.clientX;
    if (newWidth < 260) newWidth = 260;
    if (newWidth > window.innerWidth * 0.5) newWidth = window.innerWidth * 0.5;
    sidebar.style.width = newWidth + 'px';
}

chatItems.forEach(item => {
    item.addEventListener('click', () => {
        chatItems.forEach(c => c.classList.remove('active'));
        item.classList.add('active');

        currentChatId = item.getAttribute('data-chat-id');
        chatNameEl.textContent = item.querySelector('.chat-name').childNodes[0].textContent.trim();
        chatAvatarEl.src = item.querySelector('.avatar').src;

        const itemPremium = item.querySelector('.premium-icon');
        if (itemPremium) {
            chatPremiumEl.style.display = 'block';
            chatPremiumEl.style.webkitMaskImage = itemPremium.style.webkitMaskImage;
            chatPremiumEl.style.maskImage = itemPremium.style.maskImage;
        } else {
            chatPremiumEl.style.display = 'none';
        }

        noChatState.style.display = 'none';
        activeChatLayout.style.display = 'flex';

        messagesContainer.innerHTML = '';
        lastMessageId = 0;
        fetchMessages();
    });

    item.addEventListener('contextmenu', (e) => {
        e.preventDefault();

        const chatId = item.getAttribute('data-chat-id');

        let x = e.clientX;
        let y = e.clientY;

        contextMenu.style.display = 'flex';

        const menuWidth = contextMenu.offsetWidth;
        const menuHeight = contextMenu.offsetHeight;

        if (x + menuWidth > window.innerWidth) {
            x = window.innerWidth - menuWidth - 10;
        }

        if (y + menuHeight > window.innerHeight) {
            y = window.innerHeight - menuHeight - 10;
        }

        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        contextMenu.classList.add('active');
    });
});

document.addEventListener('click', (e) => {
    if (!contextMenu.contains(e.target)) {
        contextMenu.classList.remove('active');
        setTimeout(() => {
            if (!contextMenu.classList.contains('active')) {
                contextMenu.style.display = 'none';
            }
        }, 100);
    }
});

const currentUserMeta = document.querySelector('meta[name="current-user"]');
const currentUser = currentUserMeta ? currentUserMeta.content : '';
const messagesContainer = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
let lastMessageId = 0;

if (messageInput && sendBtn) {
    messageInput.addEventListener('input', () => {
        const micIcon = document.querySelector('.mic-icon');
        const sendIcon = document.querySelector('.send-icon');

        if (messageInput.value.trim().length > 0) {
            sendBtn.classList.add('active');
            micIcon.style.display = 'none';
            sendIcon.style.display = 'block';
        } else {
            sendBtn.classList.remove('active');
            micIcon.style.display = 'block';
            sendIcon.style.display = 'none';
        }
    });
}

async function fetchMessages() {
    if (!messagesContainer || !currentChatId) return;
    try {
        const response = await fetch(`/api/messages?last_id=${lastMessageId}`);
        if (response.ok) {
            const messages = await response.json();
            if (messages.length > 0) {
                messages.forEach(msg => {
                    appendMessage(msg);
                    lastMessageId = Math.max(lastMessageId, msg.id);
                });
                scrollToBottom();
            }
        }
    } catch (e) {}
}

function appendMessage(msg) {
    const isOwn = msg.login === currentUser;
    const msgDiv = document.createElement('div');
    msgDiv.className = `message-box ${isOwn ? 'msg-own' : 'msg-other'}`;

    const authorHtml = isOwn ? '' : `<div class="msg-author">${msg.login}</div>`;
    const ticksHtml = isOwn ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 6 7 17 2 12"></polyline><polyline points="22 6 11 17 11 17"></polyline></svg>` : '';

    msgDiv.innerHTML = `
        ${authorHtml}
        <div class="msg-content">
            ${msg.content}
            <div class="msg-meta">
                <span class="msg-time">${msg.timestamp}</span>
                <span class="msg-ticks">${ticksHtml}</span>
            </div>
        </div>
    `;
    messagesContainer.appendChild(msgDiv);
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function sendMessage() {
    const content = messageInput.value.trim();
    if (!content || !currentChatId) return;

    messageInput.value = '';
    messageInput.dispatchEvent(new Event('input'));

    try {
        await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });
        fetchMessages();
    } catch (e) {}
}

if (sendBtn && messageInput) {
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    setInterval(fetchMessages, 2000);
}