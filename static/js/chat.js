const sidebar = document.getElementById('sidebar');
const resizer = document.getElementById('resizer');
const contextMenu = document.getElementById('customContextMenu');
const chatPremiumEl = document.getElementById('current-chat-premium');
const noChatState = document.getElementById('no-chat-selected');
const activeChatLayout = document.getElementById('active-chat-layout');
const chatNameEl = document.getElementById('current-chat-name');
const chatAvatarEl = document.getElementById('current-chat-avatar');
const messagesContainer = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const searchInput = document.querySelector('.search-bar');
const headerContainer = document.querySelector('.header');
const currentUserMeta = document.querySelector('meta[name="current-user"]');
const currentUser = currentUserMeta ? currentUserMeta.content : '';
const chatPreloader = document.getElementById('chat-preloader');

let isResizing = false;
let currentChatId = null;
let currentTargetId = null;
let isLoadingHistory = false;
let fetchAbortController = null;
let isFetchingInitial = false;

const chatCache = {};

const style = document.createElement('style');
style.textContent = `
@keyframes smoothFadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
}
.msg-animate {
    animation: smoothFadeIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
}
`;
document.head.appendChild(style);

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

function bindChatClickEvents() {
    document.querySelectorAll('.chat-item').forEach(item => {
        item.removeEventListener('click', onChatClick);
        item.addEventListener('click', onChatClick);
        item.removeEventListener('contextmenu', onChatContextMenu);
        item.addEventListener('contextmenu', onChatContextMenu);
    });
}

function onChatClick(e) {
    const item = e.currentTarget;
    const clickedChatId = item.getAttribute('data-chat-id');

    if (currentChatId === clickedChatId && clickedChatId !== 'null') return;

    if (fetchAbortController) {
        fetchAbortController.abort();
    }

    if (currentChatId && chatCache[currentChatId]) {
        chatCache[currentChatId].scrollPos = messagesContainer.scrollTop;
    }

    document.querySelectorAll('.chat-item').forEach(c => c.classList.remove('active'));
    item.classList.add('active');

    currentChatId = clickedChatId;
    currentTargetId = item.getAttribute('data-target-id');

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
    isLoadingHistory = false;
    isFetchingInitial = false;

    if (currentChatId && currentChatId !== 'null') {
        if (!chatCache[currentChatId]) {
            chatCache[currentChatId] = {
                messages: [],
                lastMessageId: 0,
                firstMessageId: 0,
                hasMoreHistory: true,
                scrollPos: 0
            };
        }

        const cache = chatCache[currentChatId];

        if (cache.messages.length > 0) {
            chatPreloader.style.display = 'none';
            const fragment = document.createDocumentFragment();
            cache.messages.forEach(msg => {
                fragment.appendChild(createMessageElement(msg, false));
            });
            messagesContainer.appendChild(fragment);
            messagesContainer.scrollTop = cache.scrollPos || messagesContainer.scrollHeight;

            pollNewMessages();
        } else {
            chatPreloader.style.display = 'flex';
            isFetchingInitial = true;
            fetchMessages();
        }
    } else {
        chatPreloader.style.display = 'none';
    }
}

function onChatContextMenu(e) {
    e.preventDefault();
    let x = e.clientX;
    let y = e.clientY;
    contextMenu.style.display = 'flex';
    const menuWidth = contextMenu.offsetWidth;
    const menuHeight = contextMenu.offsetHeight;
    if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 10;
    if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 10;
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.classList.add('active');
}

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

messagesContainer.addEventListener('scroll', () => {
    if (!currentChatId || currentChatId === 'null') return;
    const cache = chatCache[currentChatId];
    if (messagesContainer.scrollTop <= 150 && !isLoadingHistory && cache && cache.hasMoreHistory) {
        fetchMessages(true);
    }
});

function createMessageElement(msg, animate = false) {
    const isOwn = msg.login === currentUser;
    const msgDiv = document.createElement('div');
    msgDiv.className = `message-box ${isOwn ? 'msg-own' : 'msg-other'}`;
    if (animate) {
        msgDiv.classList.add('msg-animate');
    }
    msgDiv.setAttribute('data-msg-id', msg.id);

    const authorHtml = isOwn ? '' : `<div class="msg-author">${msg.login}</div>`;
    const ticksHtml = isOwn ? (msg.is_read ? `<svg class="read" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 6 7 17 2 12"></polyline><polyline points="22 6 11 17 11 17"></polyline></svg>` : `<svg class="unread" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`) : '';

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
    return msgDiv;
}

async function fetchMessages(isHistory = false) {
    if (!messagesContainer || !currentChatId || currentChatId === 'null') return;
    const cache = chatCache[currentChatId];
    if (isHistory && (isLoadingHistory || !cache.hasMoreHistory)) return;

    if (!isHistory) {
        if (fetchAbortController) {
            fetchAbortController.abort();
        }
        fetchAbortController = new AbortController();
    }

    const requestedChatId = currentChatId;
    let url = `/api/messages?chat_id=${currentChatId}`;

    if (isHistory) {
        url += `&first_id=${cache.firstMessageId}`;
        isLoadingHistory = true;
    } else {
        url += `&last_id=${cache.lastMessageId}`;
    }

    try {
        const response = await fetch(url, {
            signal: isHistory ? undefined : fetchAbortController.signal
        });

        if (response.ok) {
            const messages = await response.json();
            if (requestedChatId !== currentChatId) return;

            if (!isHistory) {
                chatPreloader.style.display = 'none';
                isFetchingInitial = false;
            }

            if (isHistory) {
                isLoadingHistory = false;
                if (messages.length === 0) {
                    cache.hasMoreHistory = false;
                    return;
                }

                const oldScrollHeight = messagesContainer.scrollHeight;
                const fragment = document.createDocumentFragment();

                messages.forEach(msg => {
                    if (!messagesContainer.querySelector(`[data-msg-id="${msg.id}"]`)) {
                        fragment.appendChild(createMessageElement(msg, false));
                    }
                    cache.firstMessageId = Math.min(cache.firstMessageId === 0 ? msg.id : cache.firstMessageId, msg.id);
                });

                const uniqueNewMsgs = messages.filter(m => !cache.messages.some(cm => cm.id === m.id));
                cache.messages = [...uniqueNewMsgs, ...cache.messages];

                messagesContainer.insertBefore(fragment, messagesContainer.firstChild);
                messagesContainer.scrollTop = messagesContainer.scrollHeight - oldScrollHeight;

            } else {
                if (messages.length > 0) {
                    const isAtBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop <= messagesContainer.clientHeight + 150;
                    const isInitialLoad = cache.lastMessageId === 0;

                    messages.forEach(msg => {
                        if (!messagesContainer.querySelector(`[data-msg-id="${msg.id}"]`)) {
                            messagesContainer.appendChild(createMessageElement(msg, !isInitialLoad));
                            cache.messages.push(msg);
                        }
                        cache.lastMessageId = Math.max(cache.lastMessageId, msg.id);
                        if (cache.firstMessageId === 0 || msg.id < cache.firstMessageId) cache.firstMessageId = msg.id;
                    });

                    if (isInitialLoad || isAtBottom) {
                       scrollToBottom();
                    }
                }
            }
        }
    } catch (e) {
        if (e.name !== 'AbortError') {
            if (!isHistory) {
                chatPreloader.style.display = 'none';
                isFetchingInitial = false;
            }
            if (isHistory) isLoadingHistory = false;
        }
    }
}

async function pollNewMessages() {
    if (!currentChatId || currentChatId === 'null' || isFetchingInitial) return;
    const requestedChatId = currentChatId;
    const cache = chatCache[currentChatId];

    let url = `/api/messages?chat_id=${currentChatId}&last_id=${cache.lastMessageId}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const messages = await response.json();
            if (requestedChatId !== currentChatId) return;

            if (messages.length > 0) {
                const isAtBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop <= messagesContainer.clientHeight + 150;

                messages.forEach(msg => {
                    if (!messagesContainer.querySelector(`[data-msg-id="${msg.id}"]`)) {
                        messagesContainer.appendChild(createMessageElement(msg, true));
                        cache.messages.push(msg);
                    }
                    cache.lastMessageId = Math.max(cache.lastMessageId, msg.id);
                    if (cache.firstMessageId === 0 || msg.id < cache.firstMessageId) cache.firstMessageId = msg.id;
                });

                if (isAtBottom) {
                    scrollToBottom();
                }
            }
        }
    } catch (e) {}
}

function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function sendMessage() {
    const content = messageInput.value.trim();
    if (!content || (!currentChatId && !currentTargetId)) return;

    messageInput.value = '';
    messageInput.dispatchEvent(new Event('input'));

    try {
        const reqBody = { content };
        if (currentChatId && currentChatId !== 'null') {
            reqBody.chat_id = currentChatId;
        } else {
            reqBody.target_user_id = currentTargetId;
        }

        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reqBody)
        });
        const data = await response.json();

        if (data.chat_id) {
            currentChatId = data.chat_id;
            const activeItem = document.querySelector('.chat-item.active');
            if (activeItem) {
                activeItem.setAttribute('data-chat-id', currentChatId);
            }
        }

        pollNewMessages();
        updateSidebar();
    } catch (e) {}
}

if (sendBtn && messageInput) {
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    setInterval(pollNewMessages, 2000);
    setInterval(updateSidebar, 3000);
}

async function updateSidebar() {
    try {
        const res = await fetch('/api/chats');
        if (res.ok) {
            const chatsData = await res.json();
            const chatList = document.querySelector('.chat-list');

            for (const [chatId, chat] of Object.entries(chatsData)) {
                let chatItem = document.querySelector(`.chat-item[data-chat-id="${chatId}"]`);

                if (!chatItem) {
                    const existingTemp = document.querySelector(`.chat-item[data-target-id="${chat.target_user_id}"][data-chat-id="null"]`);
                    if (existingTemp) {
                        existingTemp.setAttribute('data-chat-id', chatId);
                        chatItem = existingTemp;
                    } else {
                        chatItem = document.createElement('div');
                        chatItem.className = 'chat-item';
                        chatItem.setAttribute('data-chat-id', chatId);
                        chatItem.setAttribute('data-target-id', chat.target_user_id);
                        if (currentChatId == chatId) chatItem.classList.add('active');
                        chatList.prepend(chatItem);
                        bindChatClickEvents();
                    }
                }

                const readIcon = chat.last_status ? `<span class="icon-read"><svg width="14" height="14" viewBox="0 0 24 24" stroke="#4CAF50" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 6 7 17 2 12"></polyline><polyline points="22 6 11 17 11 17"></polyline></svg></span>` : `<span class="icon-read"><svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>`;

                chatItem.innerHTML = `
                    <img src="${chat.avatar}" alt="Avatar" class="avatar">
                    <div class="chat-info">
                        <div class="chat-header">
                            <div class="chat-name">
                                ${chat.name}
                                ${chat.premium ? `<div class="premium-icon" style="-webkit-mask-image: url('/static/premium/${chat.premium}.svg'); mask-image: url('/static/premium/${chat.premium}.svg');"></div>` : ''}
                            </div>
                            <div class="chat-meta">
                                <span class="chat-time">${chat.last_time ? `${readIcon} ${chat.last_time}` : ''}</span>
                            </div>
                        </div>
                        <div class="chat-message-row">
                            <span class="msg-text">${chat.last_msg}</span>
                            <div class="chat-meta">
                                ${chat.unread > 0 ? `<span class="unread-badge">${chat.unread}</span>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    } catch(e) {}
}

const searchResultsBox = document.createElement('div');
searchResultsBox.className = 'search-results-box';
searchResultsBox.style.cssText = 'display: none; position: absolute; top: 100%; left: 15px; right: 15px; background: rgba(20, 20, 20, 0.95); backdrop-filter: blur(10px); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); margin-top: 5px; z-index: 9999; overflow-y: auto; max-height: 300px;';
headerContainer.style.position = 'relative';
headerContainer.appendChild(searchResultsBox);

searchInput.addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    if (query.length === 0) {
        searchResultsBox.style.display = 'none';
        return;
    }

    try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
        const users = await res.json();
        searchResultsBox.innerHTML = '';

        if (users.length > 0) {
            searchResultsBox.style.display = 'block';
            users.forEach(u => {
                const div = document.createElement('div');
                div.style.cssText = 'padding: 12px 15px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.05); color: #fff; transition: background 0.2s;';
                div.innerHTML = `<span style="display:flex; justify-content:space-between; align-items:center;"><b>${u.login}</b><span style="color: rgba(255,255,255,0.5); font-size: 0.85em;">${u.fio}</span></span>`;
                div.onmouseover = () => div.style.background = 'rgba(255,255,255,0.1)';
                div.onmouseout = () => div.style.background = 'transparent';
                div.addEventListener('click', () => startChatWithUser(u.id, u.login));
                searchResultsBox.appendChild(div);
            });
        } else {
            searchResultsBox.style.display = 'block';
            searchResultsBox.innerHTML = '<div style="padding: 12px 15px; color: #888; text-align: center;">Не найдено</div>';
        }
    } catch (err) {}
});

function startChatWithUser(userId, userName) {
    searchResultsBox.style.display = 'none';
    searchInput.value = '';

    let existingItem = document.querySelector(`.chat-item[data-target-id="${userId}"]`);
    if (existingItem) {
        existingItem.click();
        return;
    }

    const chatList = document.querySelector('.chat-list');
    const tempItem = document.createElement('div');
    tempItem.className = 'chat-item';
    tempItem.setAttribute('data-chat-id', 'null');
    tempItem.setAttribute('data-target-id', userId);

    tempItem.innerHTML = `
        <img src="https://ui-avatars.com/api/?name=${userName}&background=random&color=fff&rounded=true" class="avatar">
        <div class="chat-info">
            <div class="chat-header">
                <div class="chat-name">${userName}</div>
            </div>
            <div class="chat-message-row">
                <span class="msg-text">Начните диалог</span>
            </div>
        </div>
    `;

    chatList.prepend(tempItem);
    bindChatClickEvents();
    tempItem.click();
}

document.addEventListener('click', (e) => {
    if (searchInput && searchResultsBox && !searchInput.contains(e.target) && !searchResultsBox.contains(e.target)) {
        searchResultsBox.style.display = 'none';
    }
});

bindChatClickEvents();