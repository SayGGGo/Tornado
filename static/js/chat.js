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
const chatInputWrapper = document.getElementById('chat-input-wrapper-el');

let isResizing = false;
let currentChatId = null;
let currentTargetId = null;
let currentChatAvatar = '';
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

.call-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
    background: rgba(52,199,89,0.07);
    border: 1px solid rgba(52,199,89,0.25);
    border-radius: 18px;
    cursor: pointer;
    transition: all 0.25s ease;
    text-decoration: none;
    max-width: 320px;
    margin: 2px 0;
    position: relative;
    overflow: hidden;
}
.call-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 20% 50%, rgba(52,199,89,0.08), transparent);
    pointer-events: none;
}
.call-card:hover {
    background: rgba(52,199,89,0.13);
    border-color: rgba(52,199,89,0.4);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(52,199,89,0.15);
}
.call-card-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(52,199,89,0.15);
    border: 1px solid rgba(52,199,89,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    animation: callIconPulse 2.5s ease-in-out infinite;
}
@keyframes callIconPulse {
    0%,100%{box-shadow:0 0 0 0 rgba(52,199,89,0.3)}
    50%{box-shadow:0 0 0 8px rgba(52,199,89,0)}
}
.call-card-icon svg {
    width: 22px;
    height: 22px;
    fill: #34c759;
}
.call-card-info {
    flex: 1;
    min-width: 0;
}
.call-card-title {
    font-size: 14px;
    font-weight: 800;
    color: #34c759;
    letter-spacing: -0.1px;
    margin-bottom: 3px;
}
.call-card-subtitle {
    font-size: 12px;
    color: rgba(255,255,255,0.45);
    font-weight: 600;
}
.call-card-arrow {
    width: 20px;
    height: 20px;
    fill: rgba(52,199,89,0.5);
    flex-shrink: 0;
    transition: transform 0.2s ease;
}
.call-card:hover .call-card-arrow {
    transform: translateX(3px);
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

    if (fetchAbortController) fetchAbortController.abort();

    if (currentChatId && chatCache[currentChatId]) {
        chatCache[currentChatId].scrollPos = messagesContainer.scrollTop;
    }

    document.querySelectorAll('.chat-item').forEach(c => c.classList.remove('active'));
    item.classList.add('active');

    currentChatId = clickedChatId;
    currentTargetId = item.getAttribute('data-target-id');
    currentChatAvatar = item.querySelector('.avatar')?.src || '';

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
    if (chatInputWrapper) chatInputWrapper.style.display = 'flex';

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
            cache.messages.forEach(msg => fragment.appendChild(createMessageElement(msg, false)));
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
        messageInput.style.height = 'auto';
        messageInput.style.height = (messageInput.scrollHeight) + 'px';

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

    sendBtn.addEventListener('click', sendMessage);

    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    setInterval(pollNewMessages, 2000);
    setInterval(updateSidebar, 3000);
}

messagesContainer.addEventListener('scroll', () => {
    if (!currentChatId || currentChatId === 'null') return;
    const cache = chatCache[currentChatId];
    if (messagesContainer.scrollTop <= 150 && !isLoadingHistory && cache && cache.hasMoreHistory) {
        fetchMessages(true);
    }
});

function parseCallInvite(content) {
    if (!content || !content.startsWith('__CALL_INVITE__')) return null;
    const parts = content.split('|');
    const channelName = parts[0].replace('__CALL_INVITE__', '');
    return {
        channel: channelName,
        callerName: parts[1] || 'Пользователь',
        callerAvatar: parts[2] || `https://ui-avatars.com/api/?name=${encodeURIComponent(parts[1] || 'U')}&background=random`
    };
}

function createCallCard(callData, isOwn) {
    const card = document.createElement('a');
    card.className = 'call-card';
    card.href = '#';
    card.innerHTML = `
        <div class="call-card-icon">
            <svg viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
        </div>
        <div class="call-card-info">
            <div class="call-card-title">${isOwn ? 'Вы начали звонок' : callData.callerName + ' начинает звонок'}</div>
            <div class="call-card-subtitle">Внимание! Данная система в разработке, заходите в звонки только к тем, кому доверяете и не вводите никакие коды.</div>
        </div>
        <svg class="call-card-arrow" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
    `;
    card.addEventListener('click', (e) => {
        e.preventDefault();
        const callUrl = `/call?channel=${callData.channel}`;
        const width = 1200;
        const height = 800;
        const left = Math.round((window.screen.width - width) / 2);
        const top = Math.round((window.screen.height - height) / 2);
        window.open(callUrl, `call_${callData.channel}`, `width=${width},height=${height},top=${top},left=${left},menubar=no,toolbar=no,status=no`);
    });
    return card;
}

function createMessageElement(msg, animate = false) {
    const isOwn = msg.login === currentUser;
    const msgDiv = document.createElement('div');
    msgDiv.className = `message-box ${isOwn ? 'msg-own' : 'msg-other'}`;
    if (animate) msgDiv.classList.add('msg-animate');
    msgDiv.setAttribute('data-msg-id', msg.id);

    const callData = parseCallInvite(msg.content);

    if (callData) {
        const authorHtml = isOwn ? '' : `<div class="msg-author">${msg.login}</div>`;
        msgDiv.innerHTML = authorHtml;
        const metaDiv = document.createElement('div');
        metaDiv.className = 'msg-content';
        metaDiv.style.padding = '4px 0';
        metaDiv.style.background = 'transparent';
        metaDiv.style.border = 'none';
        metaDiv.style.boxShadow = 'none';
        const card = createCallCard(callData, isOwn);
        const timeDiv = document.createElement('div');
        timeDiv.className = 'msg-meta';
        timeDiv.style.marginTop = '6px';
        timeDiv.innerHTML = `<span class="msg-time">${msg.timestamp}</span>`;
        metaDiv.appendChild(card);
        metaDiv.appendChild(timeDiv);
        msgDiv.appendChild(metaDiv);
        return msgDiv;
    }

    const authorHtml = isOwn ? '' : `<div class="msg-author">${msg.login}</div>`;
    const ticksHtml = isOwn ? (msg.is_read
        ? `<svg class="read" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 6 7 17 2 12"></polyline><polyline points="22 6 11 17 11 17"></polyline></svg>`
        : `<svg class="unread" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`) : '';

    const formattedContent = formatMessageContent(msg.content);

    msgDiv.innerHTML = `
        ${authorHtml}
        <div class="msg-content">
            ${formattedContent}
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
        if (fetchAbortController) fetchAbortController.abort();
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
        const response = await fetch(url, { signal: isHistory ? undefined : fetchAbortController.signal });

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
                    if (isInitialLoad || isAtBottom) scrollToBottom();
                }
            }
        }
    } catch (e) {
        if (e.name !== 'AbortError') {
            if (!isHistory) { chatPreloader.style.display = 'none'; isFetchingInitial = false; }
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
                if (isAtBottom) scrollToBottom();
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
    messageInput.style.height = 'auto';
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
            if (activeItem) activeItem.setAttribute('data-chat-id', currentChatId);
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
        if (!res.ok) return;
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

            const readIcon = chat.last_status
                ? `<span class="icon-read"><svg width="14" height="14" viewBox="0 0 24 24" stroke="#4CAF50" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 6 7 17 2 12"></polyline><polyline points="22 6 11 17 11 17"></polyline></svg></span>`
                : `<span class="icon-read"><svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>`;

            const previewText = chat.last_msg.startsWith('__CALL_INVITE__')
                ? '📞 Входящий видеозвонок'
                : chat.last_msg;

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
                        <span class="msg-text">${previewText}</span>
                        <div class="chat-meta">
                            ${chat.unread > 0 ? `<span class="unread-badge">${chat.unread}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
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

const startCallBtn = document.getElementById('start-call-btn');

if (startCallBtn) {
    startCallBtn.addEventListener('click', async () => {
        if (!currentChatId || currentChatId === 'null') return;

        const targetId = document.querySelector('.chat-item.active')?.getAttribute('data-target-id');

        if (!targetId) {
            const callUrl = `/call?channel=${currentChatId}`;
            openCallWindow(callUrl, currentChatId);
            return;
        }

        try {
            const resp = await fetch('/api/call/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    target_user_id: parseInt(targetId),
                    chat_id: parseInt(currentChatId)
                })
            });

            const data = await resp.json();

            if (data.channel) {
                const callUrl = `/call?channel=${data.channel}`;
                openCallWindow(callUrl, data.channel);
                pollNewMessages();
                updateSidebar();
            }
        } catch (err) {
            const fallbackUrl = `/call?channel=${currentChatId}`;
            openCallWindow(fallbackUrl, currentChatId);
        }
    });
}

function openCallWindow(url, channelId) {
    const width = 1200;
    const height = 800;
    const left = Math.round((window.screen.width - width) / 2);
    const top = Math.round((window.screen.height - height) / 2);
    window.open(url, `call_${channelId}`, `width=${width},height=${height},top=${top},left=${left},menubar=no,toolbar=no,status=no`);
}

Object.defineProperty(window, '_currentChatId', {
    get: () => currentChatId,
    configurable: true
});

window._sendMessageToChat = async function(chatId, text) {
    if (!chatId || !text) return;
    try {
        const resp = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: parseInt(chatId), content: text })
        });
        if (resp.ok) {
            pollNewMessages();
            updateSidebar();
        }
    } catch (e) {}
};

function decodeHtmlEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}

function formatMessageContent(text) {
    if (!text) return text;
    const codeBlockRegex = /```([a-zA-Z0-9+#-]*)\n?([\s\S]*?)```/g;

    return text.replace(codeBlockRegex, (match, lang, code) => {
        code = decodeHtmlEntities(code.trim());
        let highlighted = '';

        try {
            if (lang && hljs.getLanguage(lang)) {
                highlighted = hljs.highlight(code, { language: lang }).value;
            } else {
                highlighted = hljs.highlightAuto(code).value;
            }
        } catch (e) {
            highlighted = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        const encodedCode = encodeURIComponent(code);

        return `
            <div class="code-wrapper">
                <button class="copy-code-btn" onclick="copyCodeBlock(this, '${encodedCode}')">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                </button>
                <pre><code class="hljs ${lang}">${highlighted}</code></pre>
            </div>
        `;
    });
}

window.copyCodeBlock = function(btn, encodedCode) {
    const code = decodeURIComponent(encodedCode);
    navigator.clipboard.writeText(code).then(() => {
        const originalSvg = btn.innerHTML;
        btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="#4CAF50" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        setTimeout(() => {
            btn.innerHTML = originalSvg;
        }, 2000);
    }).catch(err => {
        console.error(err);
    });
};

document.addEventListener('DOMContentLoaded', function () {
    window._currentUserId = document.querySelector('meta[name="current-user-id"]')?.content || '';

    var startCallBtn = document.getElementById('start-call-btn');
    if (startCallBtn) {
        startCallBtn.addEventListener('click', function () {
            var name = document.getElementById('current-chat-name')?.textContent?.trim() || 'Звонок';
            var avatar = document.getElementById('current-chat-avatar')?.src || '';
            if (window.islandEmit) window.islandEmit('island:call:start', { name: name, avatar: avatar });
        });
    }

    var seenCallInvites = new Set();
    var me = document.querySelector('meta[name="current-user"]')?.content || '';

    window._islandCheckMessages = function (messages) {
        if (!window.islandEmit || !Array.isArray(messages)) return;
        messages.forEach(function (msg) {
            if (!msg || seenCallInvites.has(msg.id)) return;
            var content = msg.content || '';
            if (content.startsWith('__CALL_INVITE__') && msg.sender !== me) {
                seenCallInvites.add(msg.id);
                var parts = content.replace('__CALL_INVITE__', '').split('|');
                window.islandEmit('island:call:incoming', {
                    name: parts[1] || 'Входящий',
                    avatar: parts[2] || '',
                    callUrl: '/call?channel=' + parts[0]
                });
            }
        });
    };

});
