// AI generated

const urlParams = new URLSearchParams(window.location.search);
const channelName = urlParams.get('channel');
let targetName = 'Групповой звонок';

const currentLogin = document.querySelector('meta[name="current-user"]')?.content || 'Вы';
const currentUserAvatar = document.querySelector('meta[name="current-user-avatar"]')?.content || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentLogin)}&background=232323&color=fff&rounded=true&bold=true`;

document.getElementById('call-name').textContent = targetName;
document.getElementById('local-off-avatar').src = currentUserAvatar;

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

let localTracks = { videoTrack: null, audioTrack: null };
let remoteUsers = {};
let isMicOn = true;
let isVideoOn = true;
let isScreenSharing = false;
let callStartTime = null;
let timerInterval = null;
let activeSpeakerUid = null;
let pinnedUid = null;

const userInfoCache = {};

const statusEl = document.getElementById('call-status');
const btnMic = document.getElementById('btn-mic');
const btnVideo = document.getElementById('btn-video');
const btnScreen = document.getElementById('btn-screen');
const btnEnd = document.getElementById('btn-end');
const localVideoOff = document.getElementById('local-video-off');
const participantsBar = document.getElementById('participants-bar');
const toastEl = document.getElementById('toast');
const videoGrid = document.getElementById('video-grid');

async function getUserInfo(uid) {
    if (userInfoCache[uid]) return userInfoCache[uid];
    try {
        const res = await fetch(`/api/user/${uid}`);
        if (res.ok) {
            const data = await res.json();
            userInfoCache[uid] = data;
            return data;
        }
    } catch (e) {}
    return {
        login: `Участник ${uid.toString().slice(-4)}`,
        avatar: `https://ui-avatars.com/api/?name=${uid}&background=random&color=fff&rounded=true&bold=true`
    };
}

function updateRemoteUserInfo(uid, name, avatar) {
    const wrapper = document.getElementById(`wrapper-${uid}`);
    if (wrapper) {
        const label = wrapper.querySelector('.user-label');
        if (label) label.textContent = name;
        const placeholderAvatar = wrapper.querySelector('.remote-placeholder-avatar');
        if (placeholderAvatar) placeholderAvatar.src = avatar;
        const placeholderName = wrapper.querySelector('.remote-placeholder-name');
        if (placeholderName) placeholderName.textContent = name;
        const offOverlayImg = wrapper.querySelector('.video-off-overlay img');
        if (offOverlayImg) offOverlayImg.src = avatar;
    }
    const chip = document.getElementById(`chip-${uid}`);
    if (chip) {
        const img = chip.querySelector('img');
        if (img) img.src = avatar;
        const span = chip.querySelector('span');
        if (span) span.textContent = name;
    }
}

function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 3000);
}

function setStatus(text, isConnected) {
    if (callStartTime) return;
    statusEl.textContent = text;
    if (isConnected) {
        statusEl.classList.remove('waiting');
    } else {
        statusEl.classList.add('waiting');
    }
    const dotEl = statusEl.closest('.call-header')?.querySelector('.status-dot');
    if (dotEl) {
        dotEl.style.background = isConnected ? 'var(--green)' : 'var(--amber)';
    }
}

function updateTimer() {
    if (!callStartTime) return;
    const diff = new Date(Date.now() - callStartTime);
    const m = diff.getUTCMinutes().toString().padStart(2, '0');
    const s = diff.getUTCSeconds().toString().padStart(2, '0');
    statusEl.textContent = `${m}:${s}`;
}

function addParticipantChip(uid, name, avatar, micOn) {
    const existing = document.getElementById(`chip-${uid}`);
    if (existing) {
        const micIcon = existing.querySelector('.p-mic');
        if (micOn) micIcon.classList.remove('muted');
        else micIcon.classList.add('muted');
        return;
    }
    const chip = document.createElement('div');
    chip.className = 'participant-chip liquid-glass';
    chip.id = `chip-${uid}`;
    chip.innerHTML = `
        <img src="${avatar}" alt="${name}">
        <span>${name}</span>
        <svg class="p-mic ${micOn ? '' : 'muted'}" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
        </svg>
    `;
    participantsBar.appendChild(chip);
}

function removeParticipantChip(uid) {
    const chip = document.getElementById(`chip-${uid}`);
    if (chip) chip.remove();
}

function setSpeaker(uid) {
    if (pinnedUid && uid !== pinnedUid && uid !== null) return;
    if (activeSpeakerUid === uid) return;

    if (activeSpeakerUid) {
        const oldWrap = document.getElementById(`wrapper-${activeSpeakerUid}`);
        if (oldWrap) oldWrap.classList.remove('active-speaker');
    }

    activeSpeakerUid = uid;

    if (uid) {
        const newWrap = document.getElementById(`wrapper-${uid}`);
        if (newWrap) {
            newWrap.classList.add('active-speaker');
            videoGrid.classList.add('has-active');
        }
    } else {
        videoGrid.classList.remove('has-active');
    }
}

function attachPinEvent(wrapper, uid) {
    wrapper.addEventListener('dblclick', () => {
        if (pinnedUid === uid) {
            pinnedUid = null;
            setSpeaker(null);
            showToast('Откреплено');
        } else {
            pinnedUid = uid;
            setSpeaker(uid);
            showToast('Закреплено на экране');
        }
    });
}

attachPinEvent(document.getElementById('wrapper-local'), 'local');

function createRemoteVideoWrapper(uid, name, avatar) {
    let wrapper = document.getElementById(`wrapper-${uid}`);
    if (wrapper) return wrapper;

    wrapper = document.createElement('div');
    wrapper.className = 'video-wrapper liquid-glass';
    wrapper.id = `wrapper-${uid}`;

    wrapper.innerHTML = `
        <div id="remote-video-${uid}" style="width:100%; height:100%; position:absolute; inset:0; z-index:1;"></div>
        <div class="remote-placeholder" id="remote-placeholder-${uid}">
            <img src="${avatar}" class="remote-placeholder-avatar" alt="">
            <span class="remote-placeholder-name">${name}</span>
            <div class="remote-placeholder-subtext" id="remote-subtext-${uid}">
                <span>Ожидание медиа...</span>
            </div>
        </div>
        <div class="video-off-overlay" id="remote-video-off-${uid}" style="display:none;">
            <img src="${avatar}" alt="">
            <span>Видео выключено</span>
        </div>
        <span class="user-label">${name}</span>
    `;

    attachPinEvent(wrapper, uid);
    videoGrid.appendChild(wrapper);
    return wrapper;
}

function removeRemoteVideoWrapper(uid) {
    const wrapper = document.getElementById(`wrapper-${uid}`);
    if (wrapper) wrapper.remove();
    if (activeSpeakerUid === uid) {
        activeSpeakerUid = null;
        if (pinnedUid === uid) pinnedUid = null;
        setSpeaker(null);
    }
}

async function joinCall() {
    if (!channelName) {
        setStatus('Ошибка канала', false);
        return;
    }
    try {
        const response = await fetch(`/api/agora/token?channel=${channelName}`);
        const data = await response.json();

        client.enableAudioVolumeIndicator();
        client.on("volume-indicator", volumes => {
            let maxVol = 0;
            let loudestUid = null;

            volumes.forEach(v => {
                if (v.level > 15 && v.level > maxVol) {
                    maxVol = v.level;
                    loudestUid = v.uid;
                }
            });

            volumes.forEach(v => {
                const wrap = document.getElementById(`wrapper-${v.uid}`);
                if (wrap) {
                    if (v.level > 10) wrap.classList.add('is-speaking');
                    else wrap.classList.remove('is-speaking');
                }
            });

            if (loudestUid && !pinnedUid) {
                setSpeaker(loudestUid);
            }
        });

        await client.join(data.app_id, channelName, data.token, data.uid);

        callStartTime = Date.now();
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
        statusEl.classList.remove('waiting');
        const dotEl = statusEl.closest('.call-header')?.querySelector('.status-dot');
        if (dotEl) dotEl.style.background = 'var(--green)';
        updateTimer();

        try {
            localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        } catch (e) {
            isMicOn = false;
            btnMic.classList.replace('on', 'off');
            document.getElementById('mic-icon-on').style.display = 'none';
            document.getElementById('mic-icon-off').style.display = '';
        }

        try {
            localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
            localTracks.videoTrack.play('local-video');
        } catch (e) {
            isVideoOn = false;
            btnVideo.classList.replace('on', 'off');
            document.getElementById('video-icon-on').style.display = 'none';
            document.getElementById('video-icon-off').style.display = '';
            localVideoOff.style.display = 'flex';
        }

        const tracksToPublish = [];
        if (localTracks.audioTrack) tracksToPublish.push(localTracks.audioTrack);
        if (localTracks.videoTrack) tracksToPublish.push(localTracks.videoTrack);

        if (tracksToPublish.length > 0) {
            await client.publish(tracksToPublish);
        }

    } catch (error) {
        setStatus('Ошибка подключения', false);
    }
}

client.on('user-joined', async (user) => {
    remoteUsers[user.uid] = user;
    const tempName = `Участник ${user.uid.toString().slice(-4)}`;
    const tempAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(tempName)}&background=random&color=fff&rounded=true&bold=true`;
    createRemoteVideoWrapper(user.uid, tempName, tempAvatar);
    addParticipantChip(user.uid, tempName, tempAvatar, false);

    const info = await getUserInfo(user.uid);
    updateRemoteUserInfo(user.uid, info.login, info.avatar);
});

client.on('user-published', async (user, mediaType) => {
    remoteUsers[user.uid] = user;

    try {
        await client.subscribe(user, mediaType);
    } catch (err) {}

    const tempName = `Участник ${user.uid.toString().slice(-4)}`;
    const tempAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(tempName)}&background=random&color=fff&rounded=true&bold=true`;

    if (!document.getElementById(`wrapper-${user.uid}`)) {
        createRemoteVideoWrapper(user.uid, tempName, tempAvatar);
    }

    if (mediaType === 'video') {
        const placeholder = document.getElementById(`remote-placeholder-${user.uid}`);
        const offOverlay = document.getElementById(`remote-video-off-${user.uid}`);
        if (placeholder) placeholder.style.display = 'none';
        if (offOverlay) offOverlay.style.display = 'none';

        try {
            user.videoTrack.play(`remote-video-${user.uid}`);
        } catch (e) {}
    }

    if (mediaType === 'audio') {
        try {
            user.audioTrack.play();
        } catch (e) {
            document.body.addEventListener('click', () => {
                try { user.audioTrack.play(); } catch (err) {}
            }, { once: true });
        }
        addParticipantChip(user.uid, tempName, tempAvatar, true);
        const subtext = document.getElementById(`remote-subtext-${user.uid}`);
        if (!user.hasVideo && subtext) {
            subtext.innerHTML = '<span>Видео выключено</span>';
            const offOverlay = document.getElementById(`remote-video-off-${user.uid}`);
            if (offOverlay) {
                offOverlay.style.display = 'flex';
                const placeholder = document.getElementById(`remote-placeholder-${user.uid}`);
                if (placeholder) placeholder.style.display = 'none';
            }
        }
    }

    const info = await getUserInfo(user.uid);
    updateRemoteUserInfo(user.uid, info.login, info.avatar);
});

client.on('user-unpublished', async (user, mediaType) => {
    if (mediaType === 'video') {
        const offOverlay = document.getElementById(`remote-video-off-${user.uid}`);
        if (offOverlay) offOverlay.style.display = 'flex';
    }
    if (mediaType === 'audio' && user.audioTrack) {
        user.audioTrack.stop();
        const info = await getUserInfo(user.uid);
        addParticipantChip(user.uid, info.login, info.avatar, false);
    }
});

client.on('user-left', (user) => {
    delete remoteUsers[user.uid];
    removeParticipantChip(user.uid);
    removeRemoteVideoWrapper(user.uid);
    if (Object.keys(remoteUsers).length === 0) {
        setStatus('Ожидание участников...', false);
    }
});

btnMic.addEventListener('click', async () => {
    try {
        if (!localTracks.audioTrack) {
            localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            await client.publish(localTracks.audioTrack);
            isMicOn = true;
        } else {
            isMicOn = !isMicOn;
            await localTracks.audioTrack.setMuted(!isMicOn);
        }
        btnMic.classList.toggle('on', isMicOn);
        btnMic.classList.toggle('off', !isMicOn);
        document.getElementById('mic-icon-on').style.display = isMicOn ? '' : 'none';
        document.getElementById('mic-icon-off').style.display = isMicOn ? 'none' : '';
        showToast(isMicOn ? 'Микрофон включён' : 'Микрофон выключен');
    } catch (e) {
        showToast('Доступ к микрофону запрещен');
    }
});

btnVideo.addEventListener('click', async () => {
    try {
        if (!localTracks.videoTrack) {
            localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
            localTracks.videoTrack.play('local-video');
            await client.publish(localTracks.videoTrack);
            isVideoOn = true;
        } else {
            isVideoOn = !isVideoOn;
            await localTracks.videoTrack.setMuted(!isVideoOn);
        }
        btnVideo.classList.toggle('on', isVideoOn);
        btnVideo.classList.toggle('off', !isVideoOn);
        document.getElementById('video-icon-on').style.display = isVideoOn ? '' : 'none';
        document.getElementById('video-icon-off').style.display = isVideoOn ? 'none' : '';
        localVideoOff.style.display = isVideoOn ? 'none' : 'flex';
        showToast(isVideoOn ? 'Камера включена' : 'Камера выключена');
    } catch (e) {
        showToast('Доступ к камере запрещен');
    }
});

btnScreen.addEventListener('click', async () => {
    if (!isScreenSharing) {
        try {
            const screenTrack = await AgoraRTC.createScreenVideoTrack({}, "auto");
            if (localTracks.videoTrack) {
                await client.unpublish(localTracks.videoTrack);
                localTracks.videoTrack.stop();
                localTracks.videoTrack.close();
            }
            localTracks.videoTrack = Array.isArray(screenTrack) ? screenTrack[0] : screenTrack;
            localTracks.videoTrack.play('local-video');
            await client.publish(localTracks.videoTrack);

            localTracks.videoTrack.on("track-ended", () => {
                btnScreen.click();
            });

            isScreenSharing = true;
            btnScreen.classList.replace('off', 'on');
            btnVideo.classList.replace('on', 'off');
            document.getElementById('video-icon-on').style.display = 'none';
            document.getElementById('video-icon-off').style.display = '';
            isVideoOn = false;
            localVideoOff.style.display = 'none';

            pinnedUid = 'local';
            setSpeaker('local');

            showToast('Трансляция экрана включена');
        } catch (err) {
            showToast('Не удалось начать трансляцию');
        }
    } else {
        try {
            if (localTracks.videoTrack) {
                await client.unpublish(localTracks.videoTrack);
                localTracks.videoTrack.stop();
                localTracks.videoTrack.close();
                localTracks.videoTrack = null;
            }
            try {
                localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
                localTracks.videoTrack.play('local-video');
                await client.publish(localTracks.videoTrack);
                isVideoOn = true;
                btnVideo.classList.replace('off', 'on');
                document.getElementById('video-icon-on').style.display = '';
                document.getElementById('video-icon-off').style.display = 'none';
                localVideoOff.style.display = 'none';
            } catch (e) {
                isVideoOn = false;
                localVideoOff.style.display = 'flex';
            }
            isScreenSharing = false;
            btnScreen.classList.replace('on', 'off');

            if (pinnedUid === 'local') {
                pinnedUid = null;
                setSpeaker(null);
            }

            showToast('Трансляция экрана остановлена');
        } catch (err) {
            showToast('Ошибка при остановке трансляции');
        }
    }
});

async function leaveCall() {
    if (timerInterval) clearInterval(timerInterval);
    for (const trackName in localTracks) {
        const track = localTracks[trackName];
        if (track) {
            track.stop();
            track.close();
            localTracks[trackName] = null;
        }
    }
    try { await client.leave(); } catch (e) {}
    window.close();
    setTimeout(() => window.location.href = '/chat', 300);
}

btnEnd.addEventListener('click', leaveCall);

const inviteModalOverlay = document.getElementById('invite-modal-overlay');
const openInviteBtn = document.getElementById('open-invite-btn');
const closeInviteBtn = document.getElementById('close-invite-btn');
const contactsListEl = document.getElementById('contacts-list');
const contactSearchEl = document.getElementById('contact-search');

let allContacts = [];
let invitedUids = new Set();

async function loadContacts() {
    try {
        const resp = await fetch('/api/chats');
        const data = await resp.json();
        allContacts = Object.entries(data).map(([chatId, chat]) => ({
            chatId,
            name: chat.name,
            avatar: chat.avatar,
            targetUserId: chat.target_user_id
        }));
        renderContacts(allContacts);
    } catch (err) {
        contactsListEl.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg><span>Не удалось загрузить контакты</span></div>';
    }
}

function renderContacts(contacts) {
    if (!contacts.length) {
        contactsListEl.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg><span>Нет контактов</span></div>';
        return;
    }
    contactsListEl.innerHTML = contacts.map(c => `
        <div class="contact-row">
            <img src="${c.avatar}" alt="${c.name}">
            <div class="contact-info">
                <div class="contact-name">${c.name}</div>
                <div class="contact-login">Личный чат</div>
            </div>
            <button class="contact-action-btn ${invitedUids.has(c.targetUserId) ? 'sent' : ''}" 
                    data-chat-id="${c.chatId}" 
                    data-user-id="${c.targetUserId}" 
                    data-name="${c.name}">
                ${invitedUids.has(c.targetUserId) ? 'Отправлено' : 'Позвать'}
            </button>
        </div>
    `).join('');

    contactsListEl.querySelectorAll('.contact-action-btn:not(.sent)').forEach(btn => {
        btn.addEventListener('click', async () => {
            const chatId = btn.dataset.chatId;
            const userId = parseInt(btn.dataset.userId);
            const name = btn.dataset.name;
            await sendCallInvite(chatId, name);
            invitedUids.add(userId);
            btn.textContent = 'Отправлено';
            btn.classList.add('sent');
            showToast(`Приглашение отправлено ${name}`);
        });
    });
}

async function sendCallInvite(chatId, name) {
    const msgContent = `__CALL_INVITE__${channelName}|${currentLogin}|${currentUserAvatar}`;
    await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: parseInt(chatId), content: msgContent })
    });
}

contactSearchEl.addEventListener('input', () => {
    const q = contactSearchEl.value.toLowerCase().trim();
    renderContacts(q ? allContacts.filter(c => c.name.toLowerCase().includes(q)) : allContacts);
});

openInviteBtn.addEventListener('click', () => {
    inviteModalOverlay.classList.add('visible');
    if (!allContacts.length) loadContacts();
});

closeInviteBtn.addEventListener('click', () => {
    inviteModalOverlay.classList.remove('visible');
});

inviteModalOverlay.addEventListener('click', (e) => {
    if (e.target === inviteModalOverlay) inviteModalOverlay.classList.remove('visible');
});

if (channelName) {
    joinCall();
} else {
    setStatus('Ошибка: нет канала', false);
}