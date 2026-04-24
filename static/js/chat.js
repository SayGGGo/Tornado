const sidebar = document.getElementById('sidebar');
const resizer = document.getElementById('resizer');
const contextMenu = document.getElementById('customContextMenu');
const chatPremiumEl = document.getElementById('current-chat-premium');
const noChatState = document.getElementById('no-chat-selected');
const activeChatLayout = document.getElementById('active-chat-layout');
const chatNameEl = document.getElementById('current-chat-name');
const chatAvatarEl = document.getElementById('current-chat-avatar');
let searchResultsBox = document.getElementById('search-results-box');
function escAttr(t) { if(!t) return ''; return String(t).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function renderAvatar(src, className = 'avatar', id = '') {
    const _invalid = !src || src === 'null' || src === 'undefined' || src === 'None' || src === '';
    const validSrc = _invalid ? null : src;
    const fallback = 'https://ui-avatars.com/api/?name=U&background=random&color=fff&rounded=true';
    const safeSrc = escAttr(validSrc || fallback);
    const safeClass = escAttr(className);
    const idAttr = id ? ` id="${escAttr(id)}"` : '';
    const isVideo = validSrc && (validSrc.endsWith('.mp4') || validSrc.endsWith('.webm') || validSrc.startsWith('data:video/'));
    if (isVideo) {
        const randomId = 'vid_' + Math.random().toString(36).substr(2, 9);
        return `<video src="${safeSrc}" class="${safeClass}"${idAttr} id="${randomId}" autoplay loop muted playsinline style="opacity:0; transition:opacity 0.4s; object-fit:cover; border-radius:50%; display:block;" oncanplay="this.style.opacity=1" onloadeddata="this.style.opacity=1" onerror="this.style.display='none'" onplay="this.style.opacity=1"></video>`;
    }
    return `<img src="${safeSrc}" class="${safeClass}"${idAttr} style="opacity:0; transition:opacity 0.4s; object-fit:cover;" onload="this.style.opacity=1" onerror="this.src='${fallback}'; this.style.opacity=1">`;
}
function escHtml(t) { if(!t) return ''; return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
const messagesContainer = document.getElementById('chat-messages');
let messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const searchInput = document.querySelector('.search-bar');
const headerContainer = document.querySelector('.header');
const currentUserMeta = document.querySelector('meta[name="current-user"]');
const currentUser = currentUserMeta ? currentUserMeta.content : '';
const chatPreloader = document.getElementById('chat-preloader');
const chatInputWrapper = document.getElementById('chat-input-wrapper-el');
const currentUserPremium = document.querySelector('meta[name="current-user-premium"]')?.content || '';
const groupModalOverlay = document.getElementById('group-modal-overlay');
const closeGroupBtn = document.getElementById('close-group-btn');
const groupContactsList = document.getElementById('group-contacts-list');
const groupNameInput = document.getElementById('group-name-input');
const confirmCreateGroup = document.getElementById('confirm-create-group');
const inviteChatOverlay = document.getElementById('invite-chat-overlay');
const closeInviteChatBtn = document.getElementById('close-invite-chat-btn');
const inviteChatContactsList = document.getElementById('invite-chat-contacts-list');
const inviteChatSearch = document.getElementById('invite-chat-search');
const confirmInviteChat = document.getElementById('confirm-invite-chat');
const inviteToChatBtn = document.getElementById('invite-to-chat-btn');
const chatSettingsOverlay = document.getElementById('chat-settings-overlay');
const closeChatSettingsBtn = document.getElementById('close-chat-settings-btn');
const settingsParticipantsList = document.getElementById('settings-participants-list');
const openInviteFromSettingsBtn = document.getElementById('open-invite-from-settings-btn');
const moreOptionsBtn = document.querySelector('.more-options-btn');
const msgContextMenu = document.getElementById('msg-context-menu');
const ctxEditMsg = document.getElementById('ctx-edit-msg');
const ctxDeleteMsg = document.getElementById('ctx-delete-msg');
const editBar = document.getElementById('edit-bar');
const editBarContent = document.getElementById('edit-bar-content');
const editBarClose = document.getElementById('edit-bar-close');
const fileInput = document.getElementById('file-input');
const attachBtn = document.getElementById('attach-btn');
const filePreviewBar = document.getElementById('file-preview-bar');
const filePreviewImg = document.getElementById('file-preview-img');
const filePreviewIcon = document.getElementById('file-preview-icon');
const filePreviewName = document.getElementById('file-preview-name');
const filePreviewClose = document.getElementById('file-preview-close');
const emojiPicker = document.getElementById('emoji-picker');
const emojiGrid = document.getElementById('emoji-grid');
const emojiTabsContainer = document.getElementById('emoji-tabs');
const emojiToggleBtn = document.getElementById('emoji-toggle-btn');
let isResizing = false;
let contextChatId = null;
let currentChatId = null;
let currentTargetId = null;
let currentChatAvatar = '';
let isLoadingHistory = false;
let fetchAbortController = null;
let isFetchingInitial = false;
let editingMessageId = null;
let selectedFiles = [];
let currentChatIsPersonal = false;
let sendCooldown = false;
let emojiPickerOpen = false;
let replyingToId = null;
let replyingToAuthor = '';
let replyingToText = '';
let voiceMediaRecorder = null;
let voiceAudioChunks = [];
let voiceRecordInterval = null;
let voiceRecordSeconds = 0;
let isRecordingVoice = false;
let circleMediaRecorder = null;
let circleVideoChunks = [];
let circleRecordInterval = null;
let circleRecordSeconds = 0;
let circleStream = null;
let currentChatType = 'group';
let currentChatOwnerId = null;
const chatCache = {};
let selectedForGroup = new Set();
let selectedForInvite = new Set();
let allAvailableContacts = [];
let contextMsgId = null;
let contextMsgOwn = false;
let contextMsgIsSystem = false;
let tempMsgCounter = -1;
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const IMAGE_MAX_W = 420;
const IMAGE_MAX_H = 360;
const ANIMATED_EMOJI_BASE = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main';
const EMOJI_CATEGORIES = [
    {
        id:'smileys', label:'Смайлы', icon:'😀',
        emojis:['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','😊','😇','🥰','😍','🤩','😘','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🥵','🥶','🥴','😵','🤯','🤠','🥳','😎','🤓','🧐','😕','😟','🙁','😮','😲','😳','🥺','😨','😰','😥','😢','😭','😱','😖','😞','😩','😫','🥱','😤','😡','😠','🤬','😈','👿','💀','💩','🤡','👻','👽','🤖'],
        animated:[
            {n:'Grinning Face', c:'Smileys and People'}, {n:'Face with Tears of Joy', c:'Smileys and People'},
            {n:'Rolling on the Floor Laughing', c:'Smileys and People'}, {n:'Smiling Face with Heart-Eyes', c:'Smileys and People'},
            {n:'Star-Struck', c:'Smileys and People'}, {n:'Face Blowing a Kiss', c:'Smileys and People'},
            {n:'Winking Face', c:'Smileys and People'}, {n:'Smiling Face with Halo', c:'Smileys and People'},
            {n:'Nerd Face', c:'Smileys and People'}, {n:'Zany Face', c:'Smileys and People'},
            {n:'Money-Mouth Face', c:'Smileys and People'}, {n:'Thinking Face', c:'Smileys and People'},
            {n:'Shushing Face', c:'Smileys and People'}, {n:'Smiling Face with Sunglasses', c:'Smileys and People'},
            {n:'Partying Face', c:'Smileys and People'}, {n:'Pleading Face', c:'Smileys and People'},
            {n:'Loudly Crying Face', c:'Smileys and People'}, {n:'Face with Steam From Nose', c:'Smileys and People'},
            {n:'Exploding Head', c:'Smileys and People'}, {n:'Smirking Face', c:'Smileys and People'},
            {n:'Melting Face', c:'Smileys and People'}, {n:'Saluting Face', c:'Smileys and People'},
            {n:'Face Holding Back Tears', c:'Smileys and People'}, {n:'Skull', c:'Smileys and People'},
            {n:'Ghost', c:'Smileys and People'}, {n:'Alien', c:'Smileys and People'}, {n:'Robot', c:'Smileys and People'}
        ]
    },
    {
        id:'people', label:'Люди', icon:'👋',
        emojis:['👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💪','👀','👁️','👅','👄','👶','🧒','👦','👧','🧑','👨','👩','🧓','👴','👵','👮','🕵️','💂','🥷','👷','🤴','👸','👳','👲','🧕','🤵','👰','🤰','🫃','👼','🎅','🤶','🦸','🦹','🧙','🧚','🧛','🧜','🧝','🧞','🧟','💆','💇','🚶','🧍','🧎','🏃','💃','🕺','🧖','🧗','🤸','🏌️','🏄','🚣','🏊','⛹️','🏋️','🚴','🚵'],
        animated:[
            {n:'Waving Hand', c:'Smileys and People'}, {n:'Thumbs Up', c:'Smileys and People'},
            {n:'Clapping Hands', c:'Smileys and People'}, {n:'Folded Hands', c:'Smileys and People'},
            {n:'Writing Hand', c:'Smileys and People'}, {n:'Flexed Biceps', c:'Smileys and People'},
            {n:'Eyes', c:'Smileys and People'}, {n:'Brain', c:'Smileys and People'},
            {n:'Heart on Fire', c:'Smileys and People'}, {n:'Mending Heart', c:'Smileys and People'},
            {n:'Red Heart', c:'Smileys and People'}, {n:'Sparkling Heart', c:'Smileys and People'},
            {n:'Beating Heart', c:'Smileys and People'}
        ]
    },
    {
        id:'animals', label:'Природа', icon:'🐱',
        emojis:['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🕷️','🌸','🌹','🌺','🌻','🌼','🌷','🌱','🌿','☘️','🍀','🍁','🍂','🍃','🌍','🌏','🌕','🌙','⭐','🌟','💫','☀️','🌤️','⛅','🌈','❄️','💧','🌊','🔥'],
        animated:[
            {n:'Dog Face', c:'Animals and Nature'}, {n:'Cat Face', c:'Animals and Nature'},
            {n:'Unicorn', c:'Animals and Nature'}, {n:'Butterfly', c:'Animals and Nature'},
            {n:'Sun with Face', c:'Animals and Nature'}, {n:'Rainbow', c:'Animals and Nature'},
            {n:'Fire', c:'Animals and Nature'}, {n:'Cherry Blossom', c:'Animals and Nature'},
            {n:'Rose', c:'Animals and Nature'}, {n:'Four Leaf Clover', c:'Animals and Nature'},
            {n:'Star', c:'Animals and Nature'}, {n:'Glowing Star', c:'Animals and Nature'},
            {n:'Sparkles', c:'Animals and Nature'}
        ]
    },
    {
        id:'food', label:'Еда', icon:'🍕',
        emojis:['🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🥑','🍆','🌶️','🥒','🥦','🌽','🥕','🥔','🍞','🥐','🥖','🧀','🥚','🍳','🥞','🥓','🍗','🍖','🌭','🍔','🍟','🍕','🥪','🌮','🌯','🥙','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🍤','🍙','🍚','🍧','🍨','🍦','🥧','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','☕','🍵','🧃','🥤','🍶','🍺','🍻','🥂','🍷','🍸','🍹','🍾'],
        animated:[
            {n:'Pizza', c:'Food and Drink'}, {n:'Hamburger', c:'Food and Drink'},
            {n:'Hot Dog', c:'Food and Drink'}, {n:'Taco', c:'Food and Drink'},
            {n:'Birthday Cake', c:'Food and Drink'}, {n:'Cookie', c:'Food and Drink'},
            {n:'Doughnut', c:'Food and Drink'}, {n:'Hot Beverage', c:'Food and Drink'},
            {n:'Clinking Beer Mugs', c:'Food and Drink'}, {n:'Bottle with Popping Cork', c:'Food and Drink'},
            {n:'Bubble Tea', c:'Food and Drink'}, {n:'French Fries', c:'Food and Drink'},
            {n:'Pancakes', c:'Food and Drink'}, {n:'Sushi', c:'Food and Drink'},
            {n:'Strawberry', c:'Food and Drink'}
        ]
    },
    {
        id:'activity', label:'Активность', icon:'⚽',
        emojis:['⚽','🏀','🏈','⚾','🎾','🏐','🏉','🎱','🏓','🏸','🏒','🥊','🥋','🎽','🛹','⛸️','🥌','🎿','🏂','🏋️','🤸','🤺','⛹️','🏇','🏄','🏊','🚣','🧗','🚵','🚴','🏆','🥇','🥈','🥉','🏅','🎖️','🎪','🤹','🎭','🎨','🎬','🎤','🎧','🎼','🎹','🥁','🎷','🎺','🎸','🎻','🎲','♟️','🎯','🎳','🎮','🕹️','🧩','🎰'],
        animated:[
            {n:'Trophy', c:'Activity'}, {n:'1st Place Medal', c:'Activity'},
            {n:'Sports Medal', c:'Activity'}, {n:'Soccer Ball', c:'Activity'},
            {n:'Basketball', c:'Activity'}, {n:'Party Popper', c:'Activity'},
            {n:'Confetti Ball', c:'Activity'}, {n:'Balloon', c:'Activity'},
            {n:'Artist Palette', c:'Activity'}, {n:'Video Game', c:'Activity'},
            {n:'Direct Hit', c:'Activity'}
        ]
    },
    {
        id:'travel', label:'Места', icon:'✈️',
        emojis:['🚗','🚕','🚌','🏎️','🚓','🚑','🚒','🚐','🛻','🚚','🚜','🏍️','🚲','🛴','🚁','🛸','🚀','✈️','🛩️','⛵','🚢','🏠','🏢','🏥','🏦','🏨','🏪','🏫','🏬','🏭','🏯','🏰','💒','🗼','🗽','⛪','🕌','⛩️','⛲','⛺','🌁','🌃','🏙️','🌄','🌅','🌆','🌇','🌉','🎠','🎡','🎢','🎪','🗾','🏔️','⛰️','🌋'],
        animated:[
            {n:'Rocket', c:'Travel and Places'}, {n:'Airplane', c:'Travel and Places'},
            {n:'Automobile', c:'Travel and Places'}, {n:'Helicopter', c:'Travel and Places'},
            {n:'High-Speed Train', c:'Travel and Places'}, {n:'Flying Saucer', c:'Travel and Places'}
        ]
    },
    {
        id:'objects', label:'Объекты', icon:'💡',
        emojis:['⌚','📱','💻','⌨️','🖥️','🖨️','🕹️','💾','💿','📷','📹','🎥','📞','📺','📻','🎙️','⏰','🕰️','⌛','💡','🔦','🕯️','💸','💵','💰','💳','💎','⚖️','🧰','🔧','🔨','⛏️','🔩','⚙️','🔫','💣','🔪','🗡️','⚔️','🛡️','🔑','🔒','🔓','📦','📫','✏️','🖊️','📝','📁','📅','📊','📌','📎','🔖','🔗','✂️','🗑️','🪣','🧲','🏷️','🔔','📣','📢'],
        animated:[
            {n:'Light Bulb', c:'Objects'}, {n:'Gem Stone', c:'Objects'},
            {n:'Crown', c:'Objects'}, {n:'Bomb', c:'Objects'},
            {n:'Key', c:'Objects'}, {n:'Megaphone', c:'Objects'},
            {n:'Bell', c:'Objects'}, {n:'Wrapped Gift', c:'Objects'}
        ]
    },
    {
        id:'symbols', label:'Символы', icon:'❤️',
        emojis:['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❤️‍🔥','❤️‍🩹','❣️','💕','💞','💓','💗','💖','💘','💝','💟','☮️','✝️','☪️','☯️','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','⚛️','☢️','☣️','💯','💢','♨️','❗','❕','❓','❔','‼️','⁉️','⚠️','♻️','✅','❌','⭕','🚫','💤','🏧','🚾','♿','🅿️','🈳','✴️','🆚','💮','🔅','🔆','🌀','🔱','⚜️','🔰'],
        animated:[
            {n:'Check Mark Button', c:'Symbols'}, {n:'Cross Mark', c:'Symbols'},
            {n:'Collision', c:'Symbols'}, {n:'Dizzy', c:'Symbols'},
            {n:'ZZZ', c:'Symbols'}, {n:'Warning', c:'Symbols'},
            {n:'Radioactive', c:'Symbols'}, {n:'Infinity', c:'Symbols'},
            {n:'Hundred Points', c:'Symbols'}
        ]
    }
];
searchResultsBox = document.createElement('div');
searchResultsBox.className = 'search-results-box';
searchResultsBox.style.display = 'none';
headerContainer.style.position = 'relative';
headerContainer.appendChild(searchResultsBox);
const style = document.createElement('style');
style.textContent = `
@keyframes smoothFadeIn {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
}
.msg-animate {
    animation: smoothFadeIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
}
.call-card, .invite-card {
    display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-radius: 18px;
    cursor: pointer; transition: all 0.25s ease; text-decoration: none; max-width: 320px;
    margin: 2px 0; position: relative; overflow: hidden;
}
.call-card { background: rgba(52,199,89,0.07); border: 1px solid rgba(52,199,89,0.25); }
.invite-card { background: rgba(135,116,225,0.07); border: 1px solid rgba(135,116,225,0.25); }
.call-card::before, .invite-card::before { content: ''; position: absolute; inset: 0; pointer-events: none; }
.call-card::before { background: radial-gradient(ellipse 80% 60% at 20% 50%, rgba(52,199,89,0.08), transparent); }
.invite-card::before { background: radial-gradient(ellipse 80% 60% at 20% 50%, rgba(135,116,225,0.08), transparent); }
.call-card:hover { background: rgba(52,199,89,0.13); border-color: rgba(52,199,89,0.4); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(52,199,89,0.15); }
.invite-card:hover { background: rgba(135,116,225,0.13); border-color: rgba(135,116,225,0.4); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(135,116,225,0.15); }
.call-card-icon, .invite-card-icon { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.call-card-icon { background: rgba(52,199,89,0.15); border: 1px solid rgba(52,199,89,0.3); animation: callIconPulse 2.5s ease-in-out infinite; }
.invite-card-icon { background: rgba(135,116,225,0.15); border: 1px solid rgba(135,116,225,0.3); }
@keyframes callIconPulse { 0%,100%{box-shadow:0 0 0 0 rgba(52,199,89,0.3)} 50%{box-shadow:0 0 0 8px rgba(52,199,89,0)} }
.call-card-icon .material-symbols-outlined { font-size: 22px; color: #34c759; }
.invite-card-icon .material-symbols-outlined { font-size: 22px; color: #8774e1; }
.call-card-info { flex: 1; min-width: 0; }
.call-card-title, .invite-card-title { font-size: 14px; font-weight: 800; letter-spacing: -0.1px; margin-bottom: 3px; }
.call-card-title { color: #34c759; }
.invite-card-title { color: #8774e1; }
.call-card-subtitle, .invite-card-subtitle { font-size: 12px; color: rgba(255,255,255,0.45); font-weight: 600; }
.call-card-arrow { font-size: 20px; color: rgba(52,199,89,0.5); flex-shrink: 0; transition: transform 0.2s ease; }
.call-card:hover .call-card-arrow { transform: translateX(3px); }
.msg-image { max-width: ${IMAGE_MAX_W}px; max-height: ${IMAGE_MAX_H}px; border-radius: 12px; cursor: pointer; transition: transform 0.2s ease; display: block; margin: 4px 0; }
.msg-image:hover { transform: scale(1.02); }
.msg-video { max-width: ${IMAGE_MAX_W}px; max-height: ${IMAGE_MAX_H}px; border-radius: 12px; display: block; margin: 4px 0; outline: none; }
.msg-voice-player { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: rgba(255,255,255,0.05); border-radius: 16px; width: fit-content; margin: 4px 0; }
.msg-audio { flex: 1; min-width: 200px; max-width: 280px; height: 32px; outline: none; margin: 0; accent-color: #34c759; }
.msg-audio::-webkit-media-controls { color: #34c759; }
.msg-audio::-webkit-media-controls-play-button { accent-color: #34c759; }
.msg-file-card { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; cursor: pointer; transition: all 0.2s ease; text-decoration: none; margin: 4px 0; }
.msg-file-card:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.12); }
.msg-file-card .material-symbols-outlined { font-size: 28px; color: var(--green); }
.msg-file-info { flex: 1; min-width: 0; }
.msg-file-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.msg-file-size { font-size: 11px; color: var(--text-muted); }
.msg-edited-label { font-size: 10px; color: var(--text-muted); margin-right: 4px; font-style: italic; }
.msg-own .msg-edited-label { color: rgba(0,0,0,0.4); }
.msg-pending { opacity: 0.55; }
.msg-pending .msg-ticks .material-symbols-outlined { animation: pendingSpin 1.2s linear infinite; }
@keyframes pendingSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.image-overlay { position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.85); backdrop-filter: blur(16px); display: flex; align-items: center; justify-content: center; cursor: zoom-out; animation: fadeIn 0.2s ease; }
.image-overlay img { max-width: 90vw; max-height: 90vh; border-radius: 12px; box-shadow: 0 16px 48px rgba(0,0,0,0.5); }
.chat-input[contenteditable="true"]:empty:before {
    content: attr(data-placeholder);
    color: var(--text-placeholder);
    pointer-events: none;
    display: block;
}
.chat-input[contenteditable="true"] {
    cursor: text;
    white-space: pre-wrap;
    overflow-y: auto;
    max-height: 150px;
    min-height: 40px;
    padding: 10px 12px;
}
`;
document.head.appendChild(style);
function isSystemContent(content) {
    if (!content) return false;
    return content.startsWith('__CALL_INVITE__') || content.startsWith('__CHATLINK__');
}
function isAnimatedEmojiMsg(content) {
    if (!content) return false;
    return /^__AEMOJI__([^\/]+)\/\/\/(.+?)__$/.test(content.trim());
}
function getAnimatedEmojiUrl(code) {
    const match = code.trim().match(/^__AEMOJI__([^\/]+)\/\/\/(.+?)__$/);
    if (match) {
        return `${ANIMATED_EMOJI_BASE}/${encodeURIComponent(match[1])}/${encodeURIComponent(match[2])}.webp`;
    }
    return '';
}
document.addEventListener('DOMContentLoaded', function () {
    window._currentUserId = document.querySelector('meta[name="current-user-id"]')?.content || '';
    if (messageInput && messageInput.tagName === 'TEXTAREA') {
        const newDiv = document.createElement('div');
        newDiv.id = 'message-input';
        newDiv.className = messageInput.className;
        newDiv.setAttribute('contenteditable', 'true');
        newDiv.setAttribute('data-placeholder', messageInput.getAttribute('placeholder') || 'Сообщение (Shift+Enter — новая строка)');
        messageInput.replaceWith(newDiv);
        messageInput = newDiv;
    }
    bindInputEvents();
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
    initEmojiPicker();
    updateSidebar(true);
    const spotifyToggle = document.getElementById('spotify-toggle');
    if (spotifyToggle) {
        spotifyToggle.addEventListener('change', function() {
            fetch('/api/spotify/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled: this.checked })
            });
        });
    }
});
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
    const targetId = item.getAttribute('data-target-id');
    if (currentChatId === clickedChatId && clickedChatId !== 'null') return;
    if (fetchAbortController) fetchAbortController.abort();
    if (currentChatId && chatCache[currentChatId]) chatCache[currentChatId].scrollPos = messagesContainer.scrollTop;
    document.querySelectorAll('.chat-item').forEach(c => c.classList.remove('active'));
    item.classList.add('active');
    currentChatId = clickedChatId;
    currentTargetId = targetId;
    currentChatAvatar = item.querySelector('.avatar')?.src || '';
    currentChatIsPersonal = !!(targetId && targetId !== 'null' && targetId !== '');
    currentChatType = item.getAttribute('data-chat-type') || 'group';
    currentChatOwnerId = item.getAttribute('data-owner-id') || null;
    updateChannelInputState();
    const moreBtn = document.querySelector('.more-options-btn');
    if (moreBtn) {
        if (currentChatType === 'channel') {
            moreBtn.style.display = 'none';
            const soundBtn = document.createElement('button');
            soundBtn.className = 'icon-btn';
            soundBtn.id = 'channel-sound-btn';
            soundBtn.innerHTML = '<span class="material-symbols-outlined">volume_up</span>';
            soundBtn.title = 'Вкл/Откл звук';
            const headerActions = document.querySelector('.header-actions');
            if (headerActions && !headerActions.querySelector('#channel-sound-btn')) {
                headerActions.insertBefore(soundBtn, moreBtn);
                soundBtn.addEventListener('click', () => {
                    const isMuted = isChatPushMuted(currentChatId);
                    toggleChatMute(currentChatId);
                    soundBtn.innerHTML = `<span class="material-symbols-outlined">${isMuted ? 'volume_up' : 'volume_off'}</span>`;
                });
            }
        } else {
            moreBtn.style.display = 'block';
            const soundBtn = document.querySelector('#channel-sound-btn');
            if (soundBtn) soundBtn.remove();
        }
    }
    cancelReply();
    chatNameEl.textContent = item.querySelector('.chat-name').childNodes[0].textContent.trim();
    const avatarImg = item.querySelector('.avatar');
    if (avatarImg) {
        const avatarSrc = avatarImg.src || avatarImg.currentSrc;
        const headerAvatarWrapper = document.getElementById('current-chat-avatar-wrapper');
        if (headerAvatarWrapper) {
            headerAvatarWrapper.innerHTML = renderAvatar(avatarSrc, 'avatar', 'current-chat-avatar');
        }
    }
    const itemPremium = item.querySelector('.premium-icon');
    if (itemPremium) { chatPremiumEl.style.display = 'block'; chatPremiumEl.style.webkitMaskImage = itemPremium.style.webkitMaskImage; chatPremiumEl.style.maskImage = itemPremium.style.maskImage; } else { chatPremiumEl.style.display = 'none'; }
    if (!targetId || targetId === 'null' || targetId === '') { if (inviteToChatBtn) inviteToChatBtn.style.display = 'flex'; } else { if (inviteToChatBtn) inviteToChatBtn.style.display = 'none'; }
    noChatState.style.display = 'none';
    activeChatLayout.style.display = 'flex';
    if (chatInputWrapper) chatInputWrapper.style.display = 'flex';
    cancelEdit();
    clearFilePreview();
    closeEmojiPicker();
    messagesContainer.innerHTML = '';
    isLoadingHistory = false;
    isFetchingInitial = false;
    if (currentChatId && currentChatId !== 'null') {
        if (!chatCache[currentChatId]) chatCache[currentChatId] = { messages: [], lastMessageId: 0, firstMessageId: 0, hasMoreHistory: true, scrollPos: 0 };
        const cache = chatCache[currentChatId];
        if (cache.messages.length > 0) {
            chatPreloader.style.display = 'none';
            const fragment = document.createDocumentFragment();
            cache.messages.forEach(msg => { if (!msg.is_deleted) { const el = createMessageElement(msg, false); if (el) fragment.appendChild(el); } });
            messagesContainer.appendChild(fragment);
            setTimeout(() => {
                messagesContainer.scrollTop = cache.scrollPos || messagesContainer.scrollHeight + 1000;
            }, 50);
            pollNewMessages();
        } else { chatPreloader.style.display = 'flex'; isFetchingInitial = true; fetchMessages(); }
    } else { chatPreloader.style.display = 'none'; }
}
function onChatContextMenu(e) {
    if (!contextMenu) return;
    e.preventDefault();
    contextChatId = e.currentTarget.getAttribute('data-chat-id');
    const ctxNotify = document.getElementById('ctx-chat-notify');
    if (ctxNotify && contextChatId) {
        const muted = isChatPushMuted(contextChatId);
        ctxNotify.innerHTML = `<span class="material-symbols-outlined">${muted ? 'notifications' : 'notifications_off'}</span> ${muted ? 'Включить уведомления' : 'Отключить уведомления'}`;
    }
    let x = e.clientX, y = e.clientY;
    contextMenu.style.display = 'flex';
    requestAnimationFrame(() => {
        const mw = contextMenu.offsetWidth, mh = contextMenu.offsetHeight;
        if (x + mw > window.innerWidth) x = window.innerWidth - mw - 10;
        if (y + mh > window.innerHeight) y = window.innerHeight - mh - 10;
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        contextMenu.classList.add('active');
    });
}
function startChatWithUser(userId, userName) {
    if (searchResultsBox) searchResultsBox.style.display = 'none';
    if (searchInput) searchInput.value = '';
    let existingItem = document.querySelector(`.chat-item[data-target-id="${userId}"]`);
    if (existingItem) { existingItem.click(); return; }
    const chatList = document.querySelector('.chat-list');
    const tempItem = document.createElement('div');
    tempItem.className = 'chat-item';
    tempItem.setAttribute('data-chat-id', 'null');
    tempItem.setAttribute('data-target-id', userId);
    const avatarUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userName) + '&background=random&color=fff&rounded=true';
    const avatarHtml = renderAvatar(avatarUrl, 'avatar');
    const userName_escaped = escHtml(userName);
    tempItem.innerHTML = avatarHtml + '<div class="chat-info"><div class="chat-header"><div class="chat-name">' + userName_escaped + '</div></div><div class="chat-message-row"><span class="msg-text">Начните диалог</span></div></div>';
    if (chatList) chatList.prepend(tempItem);
    bindChatClickEvents();
    tempItem.click();
}
function parseCallInvite(content) {
    if (!content || !content.startsWith('__CALL_INVITE__')) return null;
    const parts = content.split('|');
    return { channel: parts[0].replace('__CALL_INVITE__', ''), callerName: parts[1] || 'Пользователь', callerAvatar: parts[2] || '' };
}
function createCallCard(callData, isOwn) {
    const card = document.createElement('a');
    card.className = 'call-card';
    card.href = '#';
    const title = isOwn ? 'Вы начали звонок' : escHtml(callData.callerName) + ' начинает звонок';
    card.innerHTML = '<div class="call-card-icon"><span class="material-symbols-outlined">videocam</span></div><div class="call-card-info"><div class="call-card-title">' + title + '</div><div class="call-card-subtitle">Внимание! Данная система в разработке, заходите в звонки только к тем, кому доверяете и не вводите никакие коды.</div></div><span class="material-symbols-outlined call-card-arrow">chevron_right</span>';
    const channel = callData.channel;
    card.addEventListener('click', (e) => { e.preventDefault(); openCallWindow('/call?channel=' + channel, channel); });
    return card;
}
function formatFileSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' Б';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
    return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
}
function isImageType(t) { return t && t.startsWith('image/'); }
function isVideoType(t) { return t && t.startsWith('video/'); }
function isAudioType(t) { return t && (t.startsWith('audio/') || t === 'audio/mpeg' || t === 'audio/ogg'); }
function createFileContent(msg) {
    const container = document.createElement('div');
    if (isImageType(msg.file_type)) {
        const img = document.createElement('img');
        img.className = 'msg-image';
        img.src = msg.file_url;
        img.loading = 'lazy';
        img.onload = () => {
            if (messagesContainer.scrollHeight - messagesContainer.scrollTop <= messagesContainer.clientHeight + 150) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        };
        img.addEventListener('click', () => openImageOverlay(msg.file_url));
        container.appendChild(img);
    } else if (isVideoType(msg.file_type)) {
        const vid = document.createElement('video');
        vid.className = 'msg-video';
        vid.src = msg.file_url;
        vid.controls = true;
        vid.preload = 'metadata';
        vid.playsInline = true;
        vid.onloadedmetadata = () => {
            if (messagesContainer.scrollHeight - messagesContainer.scrollTop <= messagesContainer.clientHeight + 150) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        };
        container.appendChild(vid);
    } else if (isAudioType(msg.file_type)) {
        const aud = document.createElement('audio');
        aud.className = 'msg-audio';
        aud.src = msg.file_url;
        aud.controls = true;
        aud.preload = 'metadata';
        container.appendChild(aud);
    } else {
        const card = document.createElement('a');
        card.className = 'msg-file-card';
        card.href = msg.file_url;
        card.target = '_blank';
        card.download = msg.file_name;
        card.innerHTML = `<span class="material-symbols-outlined">description</span><div class="msg-file-info"><div class="msg-file-name">${escHtml(msg.file_name || 'Файл')}</div><div class="msg-file-size">${formatFileSize(msg.file_size)}</div></div><span class="material-symbols-outlined" style="font-size:20px; color:var(--text-dim);">download</span>`;
        container.appendChild(card);
    }
    if (msg.content && msg.content !== msg.file_name) {
        const caption = document.createElement('div');
        caption.style.cssText = 'margin-top: 6px; font-size: 14px; line-height: 1.4;';
        caption.innerHTML = formatMessageContent(msg.content);
        container.appendChild(caption);
    }
    return container;
}
function openImageOverlay(src) {
    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';
    overlay.innerHTML = `<img src="${escHtml(src)}">`;
    overlay.addEventListener('click', () => overlay.remove());
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', esc); } });
    document.body.appendChild(overlay);
}
function createMessageElement(msg, animate = false) {
    if (msg.is_deleted) return null;
    const isOwn = msg.login === currentUser;
    const isPending = msg._pending;
    const msgDiv = document.createElement('div');
    msgDiv.className = `message-box ${isOwn ? 'msg-own' : 'msg-other'}`;
    if (isPending) msgDiv.classList.add('msg-pending');
    if (animate && !isPending) msgDiv.classList.add('msg-animate');
    msgDiv.setAttribute('data-msg-id', msg.id);
    msgDiv.setAttribute('data-user-id', msg.user_id);
    if (isAnimatedEmojiMsg(msg.content) && !msg.file_url) {
        const url = getAnimatedEmojiUrl(msg.content);
        const editedHtml = msg.is_edited ? '<span class="msg-edited-label">изменено</span>' : '';
        const ticksHtml = isOwn ? (isPending
            ? `<span class="material-symbols-outlined" style="font-size:14px;">schedule</span>`
            : msg.is_read
                ? `<span class="material-symbols-outlined" style="font-size:14px; color:#4CAF50;">done_all</span>`
                : `<span class="material-symbols-outlined" style="font-size:14px;">done</span>`) : '';
        msgDiv.style.background = 'transparent';
        msgDiv.style.border = 'none';
        msgDiv.style.boxShadow = 'none';
        msgDiv.style.padding = '4px';
        msgDiv.innerHTML = `<img src="${url}" class="animated-emoji-msg" alt="emoji"><div class="msg-meta" style="justify-content:flex-end;">${editedHtml}<span class="msg-time">${escHtml(msg.timestamp)}</span><span class="msg-ticks">${ticksHtml}</span></div>`;
        msgDiv.addEventListener('contextmenu', onMsgContextMenu);
        return msgDiv;
    }
    const callData = parseCallInvite(msg.content);
    if (callData) {
        msgDiv.innerHTML = isOwn ? '' : `<div class="msg-author">${escHtml(msg.login)}</div>`;
        const metaDiv = document.createElement('div');
        metaDiv.className = 'msg-content';
        metaDiv.style.cssText = 'padding:4px 0;background:transparent;border:none;box-shadow:none;';
        metaDiv.appendChild(createCallCard(callData, isOwn));
        const timeDiv = document.createElement('div');
        timeDiv.className = 'msg-meta';
        timeDiv.style.marginTop = '6px';
        timeDiv.innerHTML = `<span class="msg-time">${escHtml(msg.timestamp)}</span>`;
        metaDiv.appendChild(timeDiv);
        msgDiv.appendChild(metaDiv);
        msgDiv.setAttribute('data-system', '1');
        msgDiv.addEventListener('contextmenu', onMsgContextMenu);
        return msgDiv;
    }
    if (msg.content && msg.content.startsWith('__CHATLINK__')) {
        const linkChatId = msg.content.replace('__CHATLINK__', '');
        msgDiv.innerHTML = isOwn ? '' : `<div class="msg-author">${escHtml(msg.login)}</div>`;
        const metaDiv = document.createElement('div');
        metaDiv.className = 'msg-content';
        metaDiv.style.cssText = 'padding:4px 0;background:transparent;border:none;box-shadow:none;';
        const card = document.createElement('div');
        card.className = 'invite-card';
        card.innerHTML = `<div class="invite-card-icon"><span class="material-symbols-outlined">group_add</span></div><div class="call-card-info"><div class="invite-card-title">Приглашение в группу</div><div class="invite-card-subtitle">Хотите вступить в этот чат?</div><div class="invite-card-actions"><button class="invite-btn invite-btn-accept">Принять</button><button class="invite-btn invite-btn-decline">Отклонить</button></div></div>`;
        card.querySelector('.invite-btn-accept').addEventListener('click', async (ev) => { ev.stopPropagation(); try { const res = await fetch('/api/chats/join', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: linkChatId }) }); if (res.ok) { updateSidebar(); setTimeout(() => { const btn = document.querySelector('.chat-item[data-chat-id="' + linkChatId + '"]'); if (btn) btn.click(); }, 500); } } catch(e){} });
        card.querySelector('.invite-btn-decline').addEventListener('click', (ev) => { ev.stopPropagation(); card.closest('.msg-content').style.opacity = '0.5'; card.style.pointerEvents = 'none'; });
        const timeDiv = document.createElement('div');
        timeDiv.className = 'msg-meta';
        timeDiv.style.marginTop = '6px';
        timeDiv.innerHTML = `<span class="msg-time">${escHtml(msg.timestamp)}</span>`;
        metaDiv.appendChild(card);
        metaDiv.appendChild(timeDiv);
        msgDiv.appendChild(metaDiv);
        msgDiv.setAttribute('data-system', '1');
        msgDiv.addEventListener('contextmenu', onMsgContextMenu);
        return msgDiv;
    }
    const authorHtml = isOwn ? '' : `<div class="msg-author clickable" data-user-id="${msg.user_id}">${escHtml(msg.login)}</div>`;
    const editedHtml = msg.is_edited ? '<span class="msg-edited-label">изменено</span>' : '';
    const ticksHtml = isOwn ? (isPending
        ? `<span class="material-symbols-outlined" style="font-size:14px;">schedule</span>`
        : msg.is_read
            ? `<span class="material-symbols-outlined" style="font-size:14px; color:#4CAF50;">done_all</span>`
            : `<span class="material-symbols-outlined" style="font-size:14px;">done</span>`) : '';
    const replyHtml = msg.reply ? (() => {
        const r = msg.reply;
        const icon = r.msg_type === 'voice' ? '🎤' : r.msg_type === 'circle' ? '🎥' : (r.file_url ? '📎' : '');
        const preview = icon ? `${icon} ${escHtml(r.text)}` : escHtml(r.text);
        return `<div class="msg-reply-preview" data-reply-id="${escAttr(String(r.id))}"><span class="msg-reply-author">${escHtml(r.login)}</span><span class="msg-reply-text">${preview}</span></div>`;
    })() : '';
    const msgType = msg.msg_type || 'text';
    if (msgType === 'circle' && msg.file_url) {
        const metaDiv = `<div class="msg-meta" style="margin-top:6px;">${editedHtml}<span class="msg-time">${escHtml(msg.timestamp)}</span><span class="msg-ticks">${ticksHtml}</span></div>`;
        msgDiv.innerHTML = `${authorHtml}<div class="msg-content msg-content-circle">${replyHtml}<video src="${escAttr(msg.file_url)}" class="msg-circle-video" playsinline controls loop></video>${metaDiv}</div>`;
        msgDiv.addEventListener('contextmenu', onMsgContextMenu);
        return msgDiv;
    }
    if (msgType === 'voice' && msg.file_url) {
        const metaDiv = `<div class="msg-meta">${editedHtml}<span class="msg-time">${escHtml(msg.timestamp)}</span><span class="msg-ticks">${ticksHtml}</span></div>`;
        msgDiv.innerHTML = `${authorHtml}<div class="msg-content">${replyHtml}<div class="msg-voice-player"><span class="material-symbols-outlined" style="color:var(--green);font-size:20px;">graphic_eq</span><audio src="${escAttr(msg.file_url)}" class="msg-audio" controls></audio></div>${metaDiv}</div>`;
        msgDiv.addEventListener('contextmenu', onMsgContextMenu);
        return msgDiv;
    }
    if (msg.file_url) {
        msgDiv.innerHTML = authorHtml;
        const contentDiv = document.createElement('div');
        contentDiv.className = 'msg-content';
        if (replyHtml) contentDiv.insertAdjacentHTML('beforeend', replyHtml);
        contentDiv.appendChild(createFileContent(msg));
        const metaDiv = document.createElement('div');
        metaDiv.className = 'msg-meta';
        metaDiv.innerHTML = `${editedHtml}<span class="msg-time">${escHtml(msg.timestamp)}</span><span class="msg-ticks">${ticksHtml}</span>`;
        contentDiv.appendChild(metaDiv);
        msgDiv.appendChild(contentDiv);
    } else {
        const formattedContent = formatMessageContent(msg.content);
        msgDiv.innerHTML = `${authorHtml}<div class="msg-content">${replyHtml}${formattedContent}<div class="msg-meta">${editedHtml}<span class="msg-time">${escHtml(msg.timestamp)}</span><span class="msg-ticks">${ticksHtml}</span></div></div>`;
    }
    msgDiv.addEventListener('contextmenu', onMsgContextMenu);
    return msgDiv;
}
function onMsgContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    const msgEl = e.currentTarget;
    const msgId = msgEl.getAttribute('data-msg-id');
    const msgUserId = msgEl.getAttribute('data-user-id');
    const isOwn = msgUserId == window._currentUserId;
    const isSys = msgEl.getAttribute('data-system') === '1';
    contextMsgId = msgId;
    contextMsgOwn = isOwn;
    contextMsgIsSystem = isSys;
    ctxEditMsg.style.display = (isOwn && !isSys) ? 'flex' : 'none';
    ctxDeleteMsg.style.display = (isOwn || currentChatIsPersonal) ? 'flex' : 'none';
    const ctxReply = document.getElementById('ctx-reply-msg');
    if (ctxReply) ctxReply.style.display = isSys ? 'none' : 'flex';
    let x = e.clientX, y = e.clientY;
    msgContextMenu.style.display = 'flex';
    msgContextMenu.classList.add('active');
    requestAnimationFrame(() => {
        const mw = msgContextMenu.offsetWidth, mh = msgContextMenu.offsetHeight;
        if (x + mw > window.innerWidth) x = window.innerWidth - mw - 10;
        if (y + mh > window.innerHeight) y = window.innerHeight - mh - 10;
        msgContextMenu.style.left = `${x}px`;
        msgContextMenu.style.top = `${y}px`;
    });
}
document.addEventListener('click', (e) => {
    if (msgContextMenu && !msgContextMenu.contains(e.target)) { msgContextMenu.style.display = 'none'; msgContextMenu.classList.remove('active'); }
    if (contextMenu && !contextMenu.contains(e.target)) { contextMenu.style.display = 'none'; contextMenu.classList.remove('active'); }
});
ctxEditMsg.addEventListener('click', () => {
    msgContextMenu.style.display = 'none';
    msgContextMenu.classList.remove('active');
    if (!contextMsgId || !contextMsgOwn || contextMsgIsSystem) return;
    const msgEl = messagesContainer.querySelector('[data-msg-id="' + contextMsgId + '"]');
    if (!msgEl) return;
    const contentEl = msgEl.querySelector('.msg-content');
    if (contentEl) {
        const clone = contentEl.cloneNode(true);
        clone.querySelectorAll('.msg-meta, .msg-image, .msg-video, .msg-audio, .msg-file-card, .code-wrapper, .animated-emoji-msg').forEach(el => el.remove());
        messageInput.innerHTML = clone.innerHTML.trim();
        let safeText = clone.textContent.trim();
        clone.querySelectorAll('.animated-emoji-inline').forEach(el => {
            safeText += `⭐ ${el.getAttribute('data-name')} `;
        });
        editBarContent.textContent = safeText.substring(0, 80) + (safeText.length > 80 ? '...' : '');
    }
    editingMessageId = contextMsgId;
    editBar.style.display = 'flex';
    messageInput.focus();
    messageInput.dispatchEvent(new Event('input'));
});
ctxDeleteMsg.addEventListener('click', () => {
    msgContextMenu.style.display = 'none';
    msgContextMenu.classList.remove('active');
    if (!contextMsgId) return;
    const msgEl = messagesContainer.querySelector('[data-msg-id="' + contextMsgId + '"]');
    const msgIdToDelete = contextMsgId;
    if (msgEl) thanosSnap(msgEl);
    const cache = chatCache[currentChatId];
    if (cache) {
        const idx = cache.messages.findIndex(m => m.id == msgIdToDelete);
        if (idx !== -1) cache.messages.splice(idx, 1);
    }
    fetch(`/api/messages/${msgIdToDelete}`, { method: 'DELETE' }).catch(() => {});
});
editBarClose.addEventListener('click', cancelEdit);
function cancelEdit() { editingMessageId = null; editBar.style.display = 'none'; editBarContent.textContent = ''; messageInput.innerHTML = ''; cancelReply(); }
async function thanosSnap(element) {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) { element.remove(); return; }
    if (typeof html2canvas === 'undefined') {
        element.remove();
        return;
    }
    try {
        const canvas = await html2canvas(element, { backgroundColor: null, scale: 2, logging: false, useCORS: true });
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;
        const imageData = ctx.getImageData(0, 0, width, height);
        element.style.opacity = '0';
        element.style.pointerEvents = 'none';
        setTimeout(() => {
            element.style.transition = 'height 0.3s ease, margin 0.3s ease, padding 0.3s ease';
            element.style.height = '0px';
            element.style.margin = '0';
            element.style.padding = '0';
            element.style.overflow = 'hidden';
            element.style.border = 'none';
        }, 800);
        setTimeout(() => {
            element.remove();
        }, 1200);
        const animationCanvas = document.createElement('canvas');
        const aCtx = animationCanvas.getContext('2d');
        const offsetV = 50;
        animationCanvas.width = width;
        animationCanvas.height = height + (offsetV * 2);
        animationCanvas.style.width = rect.width + 'px';
        animationCanvas.style.height = (rect.height + (offsetV * 2) / 2) + 'px';
        animationCanvas.style.position = 'fixed';
        animationCanvas.style.pointerEvents = 'none';
        animationCanvas.style.zIndex = '9999';
        animationCanvas.style.left = rect.left + 'px';
        animationCanvas.style.top = (rect.top - offsetV / 2) + 'px';
        document.body.appendChild(animationCanvas);
        const particles = [];
        const data = imageData.data;
        const step = 4;
        for (let y = 0; y < height; y += step) {
            for (let x = 0; x < width; x += step) {
                const i = (y * width + x) * 4;
                if (data[i + 3] > 128) {
                    particles.push({
                        x: x,
                        y: y + offsetV,
                        r: data[i],
                        g: data[i + 1],
                        b: data[i + 2],
                        a: data[i + 3] / 255,
                        vx: (Math.random() - 0.5) * 2 + 2,
                        vy: (Math.random() - 0.5) * 2 - 1.5,
                        delay: x / 2 + (Math.random() * 40)
                    });
                }
            }
        }
        let startTime = performance.now();
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            aCtx.clearRect(0, 0, animationCanvas.width, animationCanvas.height);
            let anyAlive = false;
            for (let p of particles) {
                if (elapsed > p.delay) {
                    const t = (elapsed - p.delay) / 800;
                    if (t < 1) {
                        anyAlive = true;
                        const x = p.x + p.vx * t * 60;
                        const y = p.y + p.vy * t * 60;
                        const alpha = p.a * (1 - t);
                        aCtx.fillStyle = `rgba(${p.r},${p.g},${p.b},${alpha})`;
                        aCtx.fillRect(x, y, step, step);
                    }
                } else {
                    anyAlive = true;
                    aCtx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.a})`;
                    aCtx.fillRect(p.x, p.y, step, step);
                }
            }
            if (anyAlive) {
                requestAnimationFrame(animate);
            } else {
                animationCanvas.remove();
            }
        }
        requestAnimationFrame(animate);
    } catch (e) {
        element.remove();
    }
}
attachBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const valid = files.filter(f => f.size <= MAX_FILE_SIZE);
    if (valid.length < files.length) alert('Некоторые файлы превышают лимит 50 МБ и были пропущены.');
    if (!valid.length) return;
    selectedFiles = valid;
    showFilePreview(valid);
});
function showFilePreview(files) {
    if (files.length === 1) {
        filePreviewName.textContent = files[0].name + ' (' + formatFileSize(files[0].size) + ')';
        if (files[0].type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => { filePreviewImg.src = e.target.result; filePreviewImg.style.display = 'block'; filePreviewIcon.style.display = 'none'; };
            reader.readAsDataURL(files[0]);
        } else { filePreviewImg.style.display = 'none'; filePreviewIcon.style.display = 'block'; }
    } else {
        filePreviewName.textContent = `${files.length} файлов (${formatFileSize(files.reduce((a, f) => a + f.size, 0))})`;
        filePreviewImg.style.display = 'none';
        filePreviewIcon.style.display = 'block';
    }
    filePreviewBar.style.display = 'flex';
    sendBtn.classList.add('active');
    document.querySelector('.mic-icon').style.display = 'none';
    document.querySelector('.send-icon').style.display = 'block';
}
filePreviewClose.addEventListener('click', clearFilePreview);
function clearFilePreview() {
    selectedFiles = [];
    fileInput.value = '';
    filePreviewBar.style.display = 'none';
    filePreviewImg.src = '';
    if (!messageInput.innerText.trim() && !messageInput.querySelector('img')) { sendBtn.classList.remove('active'); document.querySelector('.mic-icon').style.display = 'block'; document.querySelector('.send-icon').style.display = 'none'; }
}
messagesContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    messagesContainer.style.outline = '2px dashed var(--green)';
    messagesContainer.style.outlineOffset = '-4px';
});
messagesContainer.addEventListener('dragleave', (e) => { e.stopPropagation(); messagesContainer.style.outline = 'none'; });
messagesContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    messagesContainer.style.outline = 'none';
    const files = Array.from(e.dataTransfer.files).filter(f => f.size <= MAX_FILE_SIZE);
    if (files.length) { selectedFiles = files; showFilePreview(files); }
});
async function fetchMessages(isHistory = false) {
    if (!messagesContainer || !currentChatId || currentChatId === 'null') return;
    const cache = chatCache[currentChatId];
    if (isHistory && (isLoadingHistory || !cache.hasMoreHistory)) return;
    if (!isHistory) { if (fetchAbortController) fetchAbortController.abort(); fetchAbortController = new AbortController(); }
    const requestedChatId = currentChatId;
    let url = `/api/messages?chat_id=${currentChatId}`;
    if (isHistory) { url += `&first_id=${cache.firstMessageId}`; isLoadingHistory = true; }
    else { url += `&last_id=${cache.lastMessageId}`; }
    try {
        const response = await fetch(url, { signal: isHistory ? undefined : fetchAbortController.signal });
        if (response.ok) {
            const messages = await response.json();
            if (requestedChatId !== currentChatId) return;
            if (!isHistory) { chatPreloader.style.display = 'none'; isFetchingInitial = false; }
            if (isHistory) {
                isLoadingHistory = false;
                if (messages.length === 0) { cache.hasMoreHistory = false; return; }
                const oldScrollHeight = messagesContainer.scrollHeight;
                const oldScrollTop = messagesContainer.scrollTop;
                const fragment = document.createDocumentFragment();
                let addedCount = 0;
                messages.forEach(msg => {
                    cache.firstMessageId = Math.min(cache.firstMessageId === 0 ? msg.id : cache.firstMessageId, msg.id);
                    if (msg.is_deleted) return;
                    if (!messagesContainer.querySelector('[data-msg-id="' + msg.id + '"]')) {
                        const el = createMessageElement(msg, false);
                        if (el) { fragment.appendChild(el); addedCount++; }
                    }
                });
                if (addedCount > 0) {
                    cache.messages = [...messages.filter(m => !m.is_deleted && !cache.messages.some(cm => cm.id === m.id)), ...cache.messages];
                    messagesContainer.insertBefore(fragment, messagesContainer.firstChild);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight - oldScrollHeight + oldScrollTop;
                } else if (messages.length > 0 && cache.hasMoreHistory) {
                    fetchMessages(true);
                }
            } else {
                if (messages.length > 0) {
                    const isAtBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop <= messagesContainer.clientHeight + 150;
                    const isInitialLoad = cache.lastMessageId === 0;
                    messages.forEach(msg => {
                        cache.lastMessageId = Math.max(cache.lastMessageId, msg.id);
                        if (cache.firstMessageId === 0 || msg.id < cache.firstMessageId) cache.firstMessageId = msg.id;
                        const existingEl = messagesContainer.querySelector('[data-msg-id="' + msg.id + '"]');
                        if (existingEl) {
                            const cachedMsg = cache.messages.find(cm => cm.id === msg.id);
                            if (msg.is_deleted) { thanosSnap(existingEl); if (cachedMsg) cache.messages.splice(cache.messages.indexOf(cachedMsg), 1); return; }
                            if (cachedMsg && (cachedMsg.is_edited !== msg.is_edited || cachedMsg._pending)) { const newEl = createMessageElement(msg, false); if (newEl) existingEl.replaceWith(newEl); else existingEl.remove(); Object.assign(cachedMsg, msg); delete cachedMsg._pending; }
                        } else {
                            if (msg.is_deleted) return;
                            const pendingEl = messagesContainer.querySelector('[data-msg-id^="-"]');
                            if (pendingEl && msg.login === currentUser) {
                                const newEl = createMessageElement(msg, false);
                                if (newEl) pendingEl.replaceWith(newEl); else pendingEl.remove();
                                const pIdx = cache.messages.findIndex(m => m._pending && m.login === currentUser);
                                if (pIdx !== -1) cache.messages[pIdx] = msg;
                                else cache.messages.push(msg);
                            } else {
                                const el = createMessageElement(msg, !isInitialLoad);
                                if (el) messagesContainer.appendChild(el);
                                cache.messages.push(msg);
                            }
                        }
                        cache.lastMessageId = Math.max(cache.lastMessageId, msg.id);
                        if (cache.firstMessageId === 0 || msg.id < cache.firstMessageId) cache.firstMessageId = msg.id;
                    });
                    if (isInitialLoad || isAtBottom) scrollToBottom();
                }
            }
        }
    } catch (e) {
        if (e.name !== 'AbortError') { if (!isHistory) { chatPreloader.style.display = 'none'; isFetchingInitial = false; } if (isHistory) isLoadingHistory = false; }
    }
}
async function pollNewMessages() {
    if (!currentChatId || currentChatId === 'null' || isFetchingInitial) return;
    const requestedChatId = currentChatId;
    const cache = chatCache[currentChatId];
    if (!cache) return;
    try {
        const response = await fetch(`/api/messages?chat_id=${currentChatId}&last_id=${cache.lastMessageId}`);
        if (response.ok) {
            const messages = await response.json();
            if (requestedChatId !== currentChatId) return;
            if (messages.length > 0) {
                const isAtBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop <= messagesContainer.clientHeight + 150;
                messages.forEach(msg => {
                    cache.lastMessageId = Math.max(cache.lastMessageId, msg.id);
                    if (cache.firstMessageId === 0 || msg.id < cache.firstMessageId) cache.firstMessageId = msg.id;
                    const existingEl = messagesContainer.querySelector('[data-msg-id="' + msg.id + '"]');
                    if (existingEl) {
                        const cachedMsg = cache.messages.find(cm => cm.id === msg.id);
                        if (msg.is_deleted) { thanosSnap(existingEl); if (cachedMsg) cache.messages.splice(cache.messages.indexOf(cachedMsg), 1); return; }
                        if (cachedMsg && (cachedMsg.is_edited !== msg.is_edited || cachedMsg._pending)) { const newEl = createMessageElement(msg, false); if (newEl) existingEl.replaceWith(newEl); else existingEl.remove(); Object.assign(cachedMsg, msg); delete cachedMsg._pending; }
                    } else {
                        if (msg.is_deleted) return;
                        const pendingEl = messagesContainer.querySelector('[data-msg-id^="-"]');
                        if (pendingEl && msg.login === currentUser) {
                            const newEl = createMessageElement(msg, false);
                            if (newEl) pendingEl.replaceWith(newEl); else pendingEl.remove();
                            const pIdx = cache.messages.findIndex(m => m._pending && m.login === currentUser);
                            if (pIdx !== -1) cache.messages[pIdx] = msg;
                            else cache.messages.push(msg);
                        } else {
                            const el = createMessageElement(msg, true);
                            if (el) messagesContainer.appendChild(el);
                            cache.messages.push(msg);
                        }
                    }
                    cache.lastMessageId = Math.max(cache.lastMessageId, msg.id);
                    if (cache.firstMessageId === 0 || msg.id < cache.firstMessageId) cache.firstMessageId = msg.id;
                });
                if (isAtBottom) scrollToBottom();
            }
        }
    } catch (e) {}
}
async function checkMessageStatuses() {
    if (!currentChatId || currentChatId === 'null') return;
    const cache = chatCache[currentChatId];
    if (!cache || !cache.messages.length) return;
    const ids = cache.messages.filter(m => !m._pending && m.id > 0).map(m => m.id).join(',');
    if (!ids) return;
    try {
        const res = await fetch(`/api/messages/status?chat_id=${currentChatId}&ids=${ids}`);
        if (!res.ok) return;
        const statuses = await res.json();
        for (const s of statuses) {
            const cachedMsg = cache.messages.find(m => m.id === s.id);
            if (!cachedMsg) continue;
            if (s.is_deleted && !cachedMsg.is_deleted) {
                const el = messagesContainer.querySelector('[data-msg-id="' + s.id + '"]');
                if (el) thanosSnap(el);
                cache.messages.splice(cache.messages.indexOf(cachedMsg), 1);
            } else if (s.is_edited && !cachedMsg.is_edited) {
                cachedMsg.is_edited = true;
                if (s.content) cachedMsg.content = s.content;
                const el = messagesContainer.querySelector('[data-msg-id="' + s.id + '"]');
                if (el) { const newEl = createMessageElement(cachedMsg, false); if (newEl) el.replaceWith(newEl); else el.remove(); }
            }
        }
    } catch(e) {}
}
function scrollToBottom() {
    setTimeout(() => {
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight + 1000;
        }
    }, 50);
}
function addPendingMessage(content) {
    const tempId = tempMsgCounter--;
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const pendingMsg = { id: tempId, user_id: parseInt(window._currentUserId), login: currentUser, content: content, timestamp: ts, is_read: false, is_edited: false, is_deleted: false, file_url: null, file_name: null, file_type: null, file_size: null, _pending: true };
    const cache = chatCache[currentChatId];
    if (cache) cache.messages.push(pendingMsg);
    const el = createMessageElement(pendingMsg, true);
    if (el) messagesContainer.appendChild(el);
    scrollToBottom();
    return tempId;
}
function getMessageText() {
    const clone = messageInput.cloneNode(true);
    const textNodes = [];
    const walk = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT, null, false);
    let n;
    while (n = walk.nextNode()) {
        textNodes.push(n);
    }
    textNodes.forEach(node => {
        node.textContent = node.textContent.replace(/__AEMOJI__/g, 'AEMOJI');
    });
    clone.querySelectorAll('img.animated-emoji-inline').forEach(img => {
        if (currentUserPremium) {
            const cat = img.getAttribute('data-cat') || '';
            const name = img.getAttribute('data-name') || '';
            const t = document.createTextNode(`__AEMOJI__${cat}///${name}__`);
            img.replaceWith(t);
        } else {
            img.remove();
        }
    });
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.whiteSpace = 'pre-wrap';
    tempDiv.appendChild(clone);
    document.body.appendChild(tempDiv);
    const text = clone.innerText.trim();
    document.body.removeChild(tempDiv);
    return text;
}
async function sendMessage() {
    if (editingMessageId) { await saveEdit(); return; }
    const content = getMessageText();
    if (!content && !selectedFiles.length) return;
    if (!currentChatId && !currentTargetId) return;
    if (sendCooldown) return;
    sendCooldown = true;
    setTimeout(() => { sendCooldown = false; }, 800);
    messageInput.innerHTML = '';
    messageInput.dispatchEvent(new Event('input'));
    closeEmojiPicker();
    if (selectedFiles.length) { await uploadFiles(content); return; }
    if (!currentChatId || currentChatId === 'null') {
        if (!chatCache['null']) chatCache['null'] = { messages: [], lastMessageId: 0, firstMessageId: 0, hasMoreHistory: false, scrollPos: 0 };
    }
    addPendingMessage(content);
    try {
        const reqBody = { content };
        if (currentChatId && currentChatId !== 'null') reqBody.chat_id = currentChatId;
        else reqBody.target_user_id = currentTargetId;
        const response = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reqBody) });
        const data = await response.json();
        if (data.error) { const pendingEl = messagesContainer.querySelector('[data-msg-id^="-"]'); if (pendingEl) pendingEl.remove(); return; }
        if (data.chat_id && data.chat_id != currentChatId) {
            const oldChatId = currentChatId;
            currentChatId = String(data.chat_id);
            const activeItem = document.querySelector('.chat-item.active');
            if (activeItem) activeItem.setAttribute('data-chat-id', currentChatId);
            if (!chatCache[currentChatId]) chatCache[currentChatId] = { messages: [], lastMessageId: 0, firstMessageId: 0, hasMoreHistory: true, scrollPos: 0 };
            if (oldChatId && chatCache[oldChatId]) {
                chatCache[currentChatId].messages = chatCache[oldChatId].messages;
                delete chatCache[oldChatId];
            }
        }
        pollNewMessages();
        updateSidebar();
    } catch (e) {}
}
async function uploadFiles(caption, fileOverride, msgTypeOverride) {
    const files = fileOverride ? [fileOverride] : [...selectedFiles];
    const pendingReplyId = replyingToId;
    if (!fileOverride) clearFilePreview();
    cancelReply();
    for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        formData.append('caption', i === 0 ? (caption || '') : '');
        if (currentChatId && currentChatId !== 'null') formData.append('chat_id', currentChatId);
        else if (currentTargetId) formData.append('target_user_id', currentTargetId);
        if (pendingReplyId && i === 0) formData.append('reply_to_id', pendingReplyId);
        if (msgTypeOverride && i === 0) formData.append('msg_type', msgTypeOverride);
        try {
            const response = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await response.json();
            if (data.chat_id && data.chat_id != currentChatId) {
                currentChatId = String(data.chat_id);
                const activeItem = document.querySelector('.chat-item.active');
                if (activeItem) activeItem.setAttribute('data-chat-id', currentChatId);
                if (!chatCache[currentChatId]) chatCache[currentChatId] = { messages: [], lastMessageId: 0, firstMessageId: 0, hasMoreHistory: true, scrollPos: 0 };
            }
        } catch (e) {}
    }
    pollNewMessages();
    updateSidebar();
}
async function saveEdit() {
    const content = getMessageText();
    if (!content || !editingMessageId) return;
    const msgId = editingMessageId;
    cancelEdit();
    messageInput.innerHTML = '';
    messageInput.dispatchEvent(new Event('input'));
    const cache = chatCache[currentChatId];
    if (cache) {
        const idx = cache.messages.findIndex(m => m.id == msgId);
        if (idx !== -1) {
            cache.messages[idx].content = content;
            cache.messages[idx].is_edited = true;
            const el = messagesContainer.querySelector('[data-msg-id="' + msgId + '"]');
            if (el) { const newEl = createMessageElement(cache.messages[idx], false); if (newEl) el.replaceWith(newEl); }
        }
    }
    try {
        await fetch(`/api/messages/${msgId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) });
    } catch (e) {}
}
function formatLocalTime(isoTimeStr) {
    if (!isoTimeStr) return '';
    try {
        const date = new Date(isoTimeStr);
        if (isNaN(date.getTime())) return isoTimeStr;
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterdayStart = new Date(todayStart);
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        const msgDateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const time = `${hours}:${minutes}`;
        if (msgDateStart.getTime() === todayStart.getTime()) return time;
        if (msgDateStart.getTime() === yesterdayStart.getTime()) return 'Вчера';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}.${month}`;
    } catch(e) { return isoTimeStr; }
}
function showChatSkeletons() {
    const chatList = document.querySelector('.chat-list');
    chatList.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'chat-item skeleton-chat';
        skeleton.innerHTML = `
            <div class="skeleton skeleton-avatar"></div>
            <div class="chat-info" style="flex: 1;">
                <div class="chat-header">
                    <div class="skeleton skeleton-text" style="width: 120px; height: 14px;"></div>
                    <div class="skeleton skeleton-text" style="width: 40px; height: 12px;"></div>
                </div>
                <div class="chat-message-row">
                    <div class="skeleton skeleton-text" style="width: 180px; height: 12px;"></div>
                </div>
            </div>
        `;
        chatList.appendChild(skeleton);
    }
}
async function updateSidebar(showSkeletons = false) {
    try {
        if (showSkeletons) showChatSkeletons();
        const res = await fetch('/api/chats');
        if (!res.ok) return;
        const chatsData = await res.json();
        const chatList = document.querySelector('.chat-list');
        chatList.querySelectorAll('.skeleton-chat').forEach(el => el.remove());
        const sortedChats = Object.entries(chatsData).sort((a, b) => {
            const timeA = new Date(a[1].last_time || 0).getTime();
            const timeB = new Date(b[1].last_time || 0).getTime();
            return timeB - timeA;
        });
        const existingIds = new Set(Array.from(chatList.querySelectorAll('.chat-item[data-chat-id]')).map(el => el.getAttribute('data-chat-id')));
        const newIds = new Set(sortedChats.map(([id]) => String(id)));
        existingIds.forEach(id => { if (!newIds.has(id)) chatList.querySelector(`.chat-item[data-chat-id="${id}"]`)?.remove(); });

        sortedChats.forEach(([chatId, chat], index) => {
            const readIcon = chat.last_status === true
                ? `<span class="material-symbols-outlined" style="font-size:14px; color:#4CAF50;">done_all</span>`
                : chat.last_status === false
                    ? `<span class="material-symbols-outlined" style="font-size:14px; opacity:0.5;">done_all</span>`
                    : '';
            let previewText = chat.last_msg || '';
            if (previewText.startsWith('__CALL_INVITE__')) previewText = '📞 Входящий видеозвонок';
            else if (previewText.startsWith('__CHATLINK__')) previewText = '📩 Приглашение в чат';
            else { previewText = previewText.replace(/__AEMOJI__([^\/]+)\/\/\/(.+?)__/g, '⭐ $2'); }
            const onlineDot = chat.online ? `<div class="online-status-dot"></div>` : '';
            const typingClass = chat.typing ? 'msg-text-typing' : '';
            const localTime = formatLocalTime(chat.last_time);
            const channelBadge = chat.chat_type === 'channel' ? `<span class="channel-badge" title="Канал"><span class="material-symbols-outlined" style="font-size:13px;vertical-align:middle;">campaign</span></span>` : '';
            const infoHtml = `<div class="chat-info"><div class="chat-header"><div class="chat-name">${channelBadge}${escHtml(chat.name)}${chat.premium ? `<div class="premium-icon" style="-webkit-mask-image: url('/static/premium/${escHtml(chat.premium)}.svg'); mask-image: url('/static/premium/${escHtml(chat.premium)}.svg');"></div>` : ''}</div><div class="chat-meta"><span class="chat-time">${localTime ? `${readIcon}${readIcon ? ' ' : ''}${localTime}` : ''}</span></div></div><div class="chat-message-row"><span class="msg-text ${typingClass}">${escHtml(previewText)}</span><div class="chat-meta">${chat.unread > 0 ? `<span class="unread-badge">${escHtml(String(chat.unread))}</span>` : ''}</div></div></div>`;

            let chatItem = chatList.querySelector(`.chat-item[data-chat-id="${chatId}"]`);
            if (!chatItem) {
                chatItem = document.createElement('div');
                chatItem.className = 'chat-item';
                chatItem.setAttribute('data-chat-id', chatId);
                const avatarHtml = `<div class="avatar-wrapper">${renderAvatar(chat.avatar, 'avatar')}${onlineDot}</div>`;
                chatItem.innerHTML = avatarHtml + ' ' + infoHtml;
                chatList.appendChild(chatItem);
            } else {
                const avatarWrapper = chatItem.querySelector('.avatar-wrapper');
                if (avatarWrapper) {
                    const existingAvatar = avatarWrapper.querySelector('img, video');
                    const currentSrc = existingAvatar?.src || existingAvatar?.getAttribute('src') || '';
                    const newSrc = chat.avatar && chat.avatar !== 'null' && chat.avatar !== 'None' ? chat.avatar : '';
                    if (existingAvatar && newSrc && !currentSrc.includes(newSrc)) {
                        existingAvatar.src = newSrc;
                    }
                    const dot = avatarWrapper.querySelector('.online-status-dot');
                    if (chat.online && !dot) avatarWrapper.insertAdjacentHTML('beforeend', '<div class="online-status-dot"></div>');
                    else if (!chat.online && dot) dot.remove();
                }
                const existingInfo = chatItem.querySelector('.chat-info');
                if (existingInfo) existingInfo.outerHTML = infoHtml;
                else chatItem.insertAdjacentHTML('beforeend', infoHtml);
            }

            chatItem.setAttribute('data-target-id', chat.target_user_id || '');
            chatItem.setAttribute('data-chat-type', chat.chat_type || 'group');
            if (chat.owner_id) chatItem.setAttribute('data-owner-id', chat.owner_id);
            chatItem.classList.toggle('active', currentChatId == chatId);

            const refNode = chatList.children[index];
            if (refNode !== chatItem) chatList.insertBefore(chatItem, refNode || null);

            const prevUnread = lastUnreadCounts[chatId] !== undefined ? lastUnreadCounts[chatId] : chat.unread;
            if (chat.unread > prevUnread && String(chatId) !== String(currentChatId)) {
                showPushNotification(chat.name, chat.last_msg || '', chat.avatar, chatId);
            }
            lastUnreadCounts[chatId] = chat.unread;
        });
        bindChatClickEvents();
    } catch(e) {}
}
async function loadContactsForModals() { try { const res = await fetch('/api/chats'); const data = await res.json(); allAvailableContacts = Object.values(data).filter(c => c.target_user_id); } catch (e) {} }
function renderContactsList(container, selectedSet, filterQuery = '') {
    container.innerHTML = '';
    allAvailableContacts.filter(c => c.name.toLowerCase().includes(filterQuery.toLowerCase())).forEach(c => {
        const row = document.createElement('div');
        row.className = `contact-row ${selectedSet.has(c.target_user_id) ? 'selected' : ''}`;
        row.innerHTML = `${renderAvatar(c.avatar || null, 'avatar contact-avatar')}<div class="contact-info"><div class="contact-name">${escHtml(c.name)}</div><div class="contact-login">@${escHtml(c.name)}</div></div>`;
        row.addEventListener('click', () => { if (selectedSet.has(c.target_user_id)) { selectedSet.delete(c.target_user_id); row.classList.remove('selected'); } else { selectedSet.add(c.target_user_id); row.classList.add('selected'); } });
        container.appendChild(row);
    });
}
async function openGroupModal() { searchResultsBox.style.display = 'none'; searchInput.value = ''; selectedForGroup.clear(); groupNameInput.value = ''; await loadContactsForModals(); renderContactsList(groupContactsList, selectedForGroup); groupModalOverlay.classList.add('visible'); }
function decodeHtmlEntities(text) { const t = document.createElement('textarea'); t.innerHTML = text; return t.value; }
function escHtml(v) { if (v == null) return ''; return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function formatMessageContent(text) {
    if (!text) return text;
    const safeText = escHtml(String(text));
    let formatted = safeText.replace(/```([a-zA-Z0-9+#-]*)\n?([\s\S]*?)```/g, (match, lang, code) => {
        code = decodeHtmlEntities(code.trim());
        const safeLang = escAttr(lang || '');
        let highlighted = '';
        try { if (lang && hljs.getLanguage(lang)) highlighted = hljs.highlight(code, { language: lang }).value; else highlighted = hljs.highlightAuto(code).value; } catch (e) { highlighted = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
        return `<div class="code-wrapper"><button class="copy-code-btn" onclick="copyCodeBlock(this, '${encodeURIComponent(code)}')"><span class="material-symbols-outlined" style="font-size:16px;">content_copy</span></button><pre><code class="hljs ${safeLang}">${highlighted}</code></pre></div>`;
    });
    formatted = formatted.replace(/__AEMOJI__([^\/]+)\/\/\/(.+?)__/g, (match, cat, name) => {
        const safeName = name.replace(/"/g, '&quot;');
        const url = `${ANIMATED_EMOJI_BASE}/${encodeURIComponent(cat)}/${encodeURIComponent(name)}.webp`;
        return `<img src="${url}" class="animated-emoji-inline" data-cat="${cat}" data-name="${safeName}" title="${safeName}" style="width: 24px; height: 24px; vertical-align: middle; display: inline-block;">`;
    });
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
}
function openCallWindow(url, channelId) { const w = 1200, h = 800, l = Math.round((screen.width - w) / 2), t = Math.round((screen.height - h) / 2); window.open(url, `call_${channelId}`, `width=${w},height=${h},top=${t},left=${l},menubar=no,toolbar=no,status=no`); }
function initEmojiPicker() {
    EMOJI_CATEGORIES.forEach((cat, idx) => {
        const tab = document.createElement('button');
        tab.className = `emoji-tab${idx === 0 ? ' active' : ''}`;
        tab.textContent = cat.icon;
        tab.title = cat.label;
        tab.addEventListener('click', () => {
            emojiTabsContainer.querySelectorAll('.emoji-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderEmojiGrid(cat);
        });
        emojiTabsContainer.appendChild(tab);
    });
    renderEmojiGrid(EMOJI_CATEGORIES[0]);
}
function renderEmojiGrid(cat) {
    emojiGrid.innerHTML = '';
    cat.emojis.forEach(emoji => {
        const btn = document.createElement('button');
        btn.className = 'emoji-item';
        btn.textContent = emoji;
        btn.addEventListener('click', () => insertEmoji(emoji, false));
        emojiGrid.appendChild(btn);
    });
    if (cat.animated && cat.animated.length > 0) {
        const label = document.createElement('div');
        label.className = 'emoji-section-label';
        label.textContent = 'Premium';
        emojiGrid.appendChild(label);
        cat.animated.forEach(anim => {
            const btn = document.createElement('button');
            btn.className = 'emoji-item premium-emoji';
            const img = document.createElement('img');
            img.src = `${ANIMATED_EMOJI_BASE}/${encodeURIComponent(anim.c)}/${encodeURIComponent(anim.n)}.webp`;
            img.alt = anim.n;
            img.loading = 'lazy';
            btn.appendChild(img);
            btn.addEventListener('click', () => {
                if (!currentUserPremium) { btn.style.animation = 'shake 0.3s ease'; setTimeout(() => btn.style.animation = '', 300); return; }
                insertEmoji('', true, anim.c, anim.n);
            });
            emojiGrid.appendChild(btn);
        });
    }
}
function insertEmoji(emoji, isPremium, cat, name) {
    messageInput.focus();
    if (isPremium) {
        const url = `${ANIMATED_EMOJI_BASE}/${encodeURIComponent(cat)}/${encodeURIComponent(name)}.webp`;
        const safeName = name.replace(/"/g, '&quot;');
        const imgHtml = `<img src="${url}" class="animated-emoji-inline" data-cat="${cat}" data-name="${safeName}" alt="${safeName}" contenteditable="false" style="width: 24px; height: 24px; vertical-align: middle; display: inline-block;">`;
        document.execCommand('insertHTML', false, imgHtml);
    } else {
        document.execCommand('insertText', false, emoji);
    }
    messageInput.dispatchEvent(new Event('input'));
}
function toggleEmojiPicker() {
    if (emojiPickerOpen) closeEmojiPicker();
    else openEmojiPicker();
}
function openEmojiPicker() {
    emojiPicker.style.display = 'block';
    emojiPickerOpen = true;
}
function closeEmojiPicker() {
    emojiPicker.style.display = 'none';
    emojiPickerOpen = false;
}
if (emojiToggleBtn) emojiToggleBtn.addEventListener('click', toggleEmojiPicker);
document.addEventListener('click', (e) => {
    if (emojiPickerOpen && !emojiPicker.contains(e.target) && !emojiToggleBtn.contains(e.target)) closeEmojiPicker();
});
function bindInputEvents() {
    if (messageInput) {
        messageInput.addEventListener('input', () => {
            const text = messageInput.innerText.trim();
            const hasImgs = messageInput.querySelector('img');
            const mic = document.querySelector('.mic-icon'), send = document.querySelector('.send-icon');
            if (text.length > 0 || hasImgs || selectedFiles.length) {
                sendBtn.classList.add('active');
                mic.style.display = 'none';
                send.style.display = 'block';
            } else {
                sendBtn.classList.remove('active');
                mic.style.display = 'block';
                send.style.display = 'none';
                if (messageInput.innerHTML === '<br>') messageInput.innerHTML = '';
            }
        });
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            } else if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                document.execCommand('insertLineBreak');
            }
            if (e.key === 'Escape' && editingMessageId) { cancelEdit(); }
        });
        messageInput.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        });
    }
    if (sendBtn) {
        sendBtn.removeEventListener('click', sendMessage);
        sendBtn.addEventListener('click', (e) => {
            if (isRecordingVoice) return;
            sendMessage();
        });
    }
}
setInterval(pollNewMessages, 2000);
setInterval(checkMessageStatuses, 2500);
setInterval(updateSidebar, 3000);
messagesContainer.addEventListener('scroll', () => {
    if (!currentChatId || currentChatId === 'null') return;
    const cache = chatCache[currentChatId];
    if (messagesContainer.scrollTop <= 50 && !isLoadingHistory && cache && cache.hasMoreHistory) fetchMessages(true);
});
searchInput.addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    if (!query.length) { searchResultsBox.style.display = 'none'; return; }
    try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
        const users = await res.json();
        searchResultsBox.innerHTML = '';
        searchResultsBox.style.display = 'block';
        users.slice(0, 5).forEach(u => {
            const div = document.createElement('div');
            div.className = 'search-result-item';
            div.innerHTML = `<span style="display:flex; justify-content:space-between; align-items:center; gap:8px;"><b>${escHtml(u.login)}</b><span class="search-result-sub">${escHtml(u.fio || '')}</span></span>`;
            div.addEventListener('click', () => startChatWithUser(u.id, u.login));
            searchResultsBox.appendChild(div);
        });
    } catch (err) {}
});
document.addEventListener('click', (e) => { if (searchInput && searchResultsBox && !searchInput.contains(e.target) && !searchResultsBox.contains(e.target)) searchResultsBox.style.display = 'none'; });
const startCallBtn2 = document.getElementById('start-call-btn');
if (startCallBtn2) {
    startCallBtn2.addEventListener('click', async () => {
        if (!currentChatId || currentChatId === 'null') return;
        const targetId = document.querySelector('.chat-item.active')?.getAttribute('data-target-id');
        if (!targetId) { openCallWindow(`/call?channel=${currentChatId}`, currentChatId); return; }
        try {
            const resp = await fetch('/api/call/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target_user_id: parseInt(targetId), chat_id: parseInt(currentChatId) }) });
            const data = await resp.json();
            if (data.channel) { openCallWindow(`/call?channel=${data.channel}`, data.channel); pollNewMessages(); updateSidebar(); }
        } catch (err) { openCallWindow(`/call?channel=${currentChatId}`, currentChatId); }
    });
}
closeGroupBtn.addEventListener('click', () => groupModalOverlay.classList.remove('visible'));
confirmCreateGroup.addEventListener('click', async () => { const name = groupNameInput.value.trim(); if (!name) return; try { const res = await fetch('/api/chats/group', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, participants: Array.from(selectedForGroup) }) }); if (res.ok) { groupModalOverlay.classList.remove('visible'); updateSidebar(); } } catch (e) {} });
inviteToChatBtn.addEventListener('click', async () => { selectedForInvite.clear(); inviteChatSearch.value = ''; await loadContactsForModals(); renderContactsList(inviteChatContactsList, selectedForInvite); inviteChatOverlay.classList.add('visible'); });
closeInviteChatBtn.addEventListener('click', () => inviteChatOverlay.classList.remove('visible'));
inviteChatSearch.addEventListener('input', (e) => renderContactsList(inviteChatContactsList, selectedForInvite, e.target.value.trim()));
confirmInviteChat.addEventListener('click', async () => { if (!currentChatId || selectedForInvite.size === 0) return; for (const tid of selectedForInvite) { try { await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target_user_id: parseInt(tid), content: `__CHATLINK__${currentChatId}` }) }); } catch(e){} } inviteChatOverlay.classList.remove('visible'); });
moreOptionsBtn.addEventListener('click', async () => {
    if (!currentChatId || currentChatId === 'null') return;
    document.getElementById('settings-chat-name').textContent = chatNameEl.textContent;
    const _settingsAvatarWrapper = document.getElementById('settings-chat-avatar');
    if (_settingsAvatarWrapper) {
        const _ava = document.getElementById('current-chat-avatar');
        const _avaSrc = (_ava && (_ava.src || _ava.currentSrc)) || currentChatAvatar || '';
        _settingsAvatarWrapper.src = _avaSrc;
    }
    settingsParticipantsList.innerHTML = '<div style="text-align:center; padding: 20px; color:#aaa;">Загрузка...</div>';
    let oldDelBtn = document.getElementById('delete-group-action');
    if (oldDelBtn) oldDelBtn.remove();
    chatSettingsOverlay.classList.add('visible');
    try {
        const res = await fetch(`/api/chats/${currentChatId}/info`);
        if (res.ok) {
            const data = await res.json();
            settingsParticipantsList.innerHTML = '';
            if (data.participants?.length > 0) {
                data.participants.forEach(p => {
                    const row = document.createElement('div');
                    row.className = 'contact-row';
                    if (p.id != window._currentUserId) {
                        row.style.cursor = 'pointer';
                        row.onclick = () => {
                            chatSettingsOverlay.classList.remove('visible');
                            window.openOtherProfile(p.id);
                        };
                    }
                    row.innerHTML = `${renderAvatar(p.avatar || null, 'avatar contact-avatar')}<div class="contact-info"><div class="contact-name">${escHtml(p.login)}</div><div class="contact-login">${p.role === 'owner' ? 'Создатель' : 'Участник'}</div></div>`;
                    settingsParticipantsList.appendChild(row);
                });
            } else {
                settingsParticipantsList.innerHTML = '<div style="text-align:center; padding: 10px; color:#aaa;">Участников нет</div>';
            }
                if (!data.is_personal && data.owner_id == window._currentUserId) {
                    const delBtn = document.createElement('button');
                    delBtn.id = 'delete-group-action';
                    delBtn.className = 'contact-action-btn';
                    delBtn.style.cssText = 'width: 100%; margin-top: 15px; background: rgba(255,82,82,0.15); border-color: #ff5252; color: #ff5252;';
                    delBtn.textContent = 'Удалить группу';
                    delBtn.onclick = async () => {
                        if (confirm('Удалить эту группу навсегда?')) {
                            try {
                                const r = await fetch(`/api/chats/${currentChatId}`, { method: 'DELETE' });
                                if (r.ok) {
                                    chatSettingsOverlay.classList.remove('visible');
                                    currentChatId = null;
                                    activeChatLayout.style.display = 'none';
                                    noChatState.style.display = 'flex';
                                    document.querySelector('.chat-item.active')?.remove();
                                }
                            } catch(e){}
                        }
                    };
                    settingsParticipantsList.parentElement.appendChild(delBtn);
                }
            } else {
                settingsParticipantsList.innerHTML = '<div style="text-align:center; padding: 10px; color:#aaa;">Не удалось загрузить</div>';
            }
        } catch (e) {
            settingsParticipantsList.innerHTML = '<div style="text-align:center; padding: 10px; color:#aaa;">Ошибка сети</div>';
        }
});
closeChatSettingsBtn.addEventListener('click', () => chatSettingsOverlay.classList.remove('visible'));
openInviteFromSettingsBtn.addEventListener('click', async () => { chatSettingsOverlay.classList.remove('visible'); selectedForInvite.clear(); inviteChatSearch.value = ''; await loadContactsForModals(); renderContactsList(inviteChatContactsList, selectedForInvite); inviteChatOverlay.classList.add('visible'); });
window.openOtherProfile = async function(userId) {
    if (!userId) return;
    try {
        const res = await fetch(`/api/user/${userId}`);
        if (!res.ok) return;
        const user = await res.json();
        const updateField = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        const updateAvatar = (id, src) => {
            const el = document.getElementById(id);
            if (!el) return;
            const isVid = src && (src.endsWith('.mp4') || src.endsWith('.webm') || src.startsWith('data:video/'));
            if (isVid) {
                const vid = document.createElement('video');
                vid.src = src; vid.autoplay = true; vid.loop = true; vid.muted = true; vid.playsInline = true;
                vid.className = el.className; vid.id = el.id;
                vid.style.cssText = el.style.cssText || 'object-fit:cover;';
                el.replaceWith(vid);
            } else {
                el.src = src || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.login)}&background=random&color=fff&rounded=true`;
            }
        };
        updateAvatar('other-profile-avatar', user.avatar);
        updateField('other-profile-name', user.login);
        updateField('other-profile-login', '@' + user.login);
        updateField('other-profile-bio', user.bio || 'Нет информации');
        updateAvatar('other-profile-avatar-mob', user.avatar);
        updateField('other-profile-name-mob', user.login);
        updateField('other-profile-login-mob', '@' + user.login);
        updateField('other-profile-bio-mob', user.bio || 'Нет информации');
        const goChat = async () => {
            const resp = await fetch('/api/chats/get_or_create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target_user_id: user.id })
            });
            if (resp.ok) {
                const data = await resp.json();
                document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('visible'));
                updateSidebar();
                setTimeout(() => {
                    const el = document.querySelector(`.chat-item[data-chat-id="${data.chat_id}"]`);
                    if (el) el.click();
                    if (window.innerWidth <= 768) window.showTab('chats');
                }, 300);
            }
        };
        const goCall = () => {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('visible'));
            startCallWithUserInChat(user.id);
        };
        const msgBtn = document.getElementById('other-profile-msg-btn');
        const msgBtnMob = document.getElementById('other-profile-msg-btn-mob');
        const callBtn = document.getElementById('other-profile-call-btn');
        const callBtnMob = document.getElementById('other-profile-call-btn-mob');
        if (msgBtn) msgBtn.onclick = goChat;
        if (msgBtnMob) msgBtnMob.onclick = goChat;
        if (callBtn) callBtn.onclick = goCall;
        if (callBtnMob) callBtnMob.onclick = goCall;
        if (window.innerWidth <= 768) {
            window.showTab('other_profile');
        } else {
            document.getElementById('other-profile-modal-overlay').classList.add('visible');
        }
    } catch(e) {}
};
async function startCallWithUserInChat(userId) {
    const resp = await fetch('/api/chats/get_or_create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_user_id: userId })
    });
    if (resp.ok) {
        const data = await resp.json();
        const cid = data.chat_id;
        const callResp = await fetch('/api/call/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ target_user_id: userId, chat_id: cid })
        });
        if (callResp.ok) {
            const cdata = await callResp.json();
            window.location.href = cdata.call_url;
        }
    }
}
document.getElementById('my-bio-input')?.addEventListener('blur', async (e) => {
    const bio = e.target.value.trim();
    try {
        await fetch('/api/user/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bio })
        });
    } catch(e) {}
});
messagesContainer.addEventListener('click', (e) => {
    const target = e.target.closest('.msg-author, .msg-author-avatar');
    if (target) {
        const uid = target.getAttribute('data-user-id');
        if (uid && uid != window._currentUserId) window.openOtherProfile(uid);
    }
    const replyTarget = e.target.closest('.msg-reply-preview');
    if (replyTarget) {
        const rid = replyTarget.getAttribute('data-reply-id');
        if (rid) {
            const origEl = messagesContainer.querySelector('[data-msg-id="' + rid + '"]');
            if (origEl) {
                origEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                origEl.classList.add('msg-highlight');
                setTimeout(() => origEl.classList.remove('msg-highlight'), 1500);
            }
        }
    }
});
Object.defineProperty(window, '_currentChatId', { get: () => currentChatId, configurable: true });
window.openGroupModal = async function() {
    selectedForGroup.clear();
    if (groupNameInput) groupNameInput.value = '';
    await loadContactsForModals();
    renderContactsList(groupContactsList, selectedForGroup);
    groupModalOverlay.classList.add('visible');
};
async function openChannelModal() {
    searchResultsBox.style.display = 'none';
    searchInput.value = '';
    selectedForGroup.clear();
    groupNameInput.value = '';
    groupNameInput.placeholder = 'Название канала';
    const modalTitle = groupModalOverlay.querySelector('.modal-title');
    const createBtn = confirmCreateGroup;
    const prevTitle = modalTitle.textContent;
    const prevPlaceholder = groupNameInput.placeholder;
    const prevBtnText = createBtn.textContent;

    modalTitle.textContent = 'Новый канал';
    createBtn.textContent = 'Создать канал';

    await loadContactsForModals();
    renderContactsList(groupContactsList, selectedForGroup);
    groupModalOverlay.classList.add('visible');

    const handleCreate = async () => {
        const name = groupNameInput.value.trim();
        if (!name) {
            alert('Введите название канала');
            return;
        }
        try {
            const res = await fetch('/api/chats/group', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name, participants: [], chat_type: 'channel' })
            });
            if (res.ok) {
                updateSidebar();
                groupModalOverlay.classList.remove('visible');
            }
        } catch (e) {}
    };

    createBtn.onclick = handleCreate;

    closeGroupBtn.onclick = () => {
        groupModalOverlay.classList.remove('visible');
        modalTitle.textContent = prevTitle;
        createBtn.textContent = prevBtnText;
        groupNameInput.placeholder = prevPlaceholder;
        closeGroupBtn.onclick = () => groupModalOverlay.classList.remove('visible');
    };
}
window.setTheme = (theme) => {
    if (theme === 'light') {
        document.documentElement.classList.add('light-theme');
        setCookie('theme', 'light', 365);
    } else {
        document.documentElement.classList.remove('light-theme');
        setCookie('theme', 'dark', 365);
    }
    const cb = document.getElementById('theme-checkbox');
    const scb = document.getElementById('settings-theme-checkbox');
    if (cb) cb.checked = (theme === 'dark');
    if (scb) scb.checked = (theme === 'dark');
};
window.setGlassMode = function(enabled) {
    if (enabled) {
        document.documentElement.classList.add('glass-mode');
        setCookie('glass-mode', '1', 365);
    } else {
        document.documentElement.classList.remove('glass-mode');
        setCookie('glass-mode', '0', 365);
    }
    document.querySelectorAll('[id^="glass-mode-checkbox"]').forEach(cb => { cb.checked = !!enabled; });
    document.querySelectorAll('.glass-settings-panel').forEach(p => { p.style.display = enabled ? '' : 'none'; });
};
window.setGlassParams = function(params) {
    const saved = JSON.parse(getCookie('glass-params') || '{}');
    const merged = Object.assign(saved, params);
    setCookie('glass-params', JSON.stringify(merged), 365);
    if (params.opacity !== undefined) {
        document.documentElement.style.setProperty('--glass-opacity', params.opacity);
    }
    const filterParams = {};
    if (params.preBlur !== undefined) filterParams.preBlur = params.preBlur;
    if (params.noiseScale !== undefined) filterParams.noiseScale = params.noiseScale;
    if (params.animationSpeed !== undefined) filterParams.animationSpeed = params.animationSpeed;
    if (params.baseFrequency !== undefined) filterParams.baseFrequency = params.baseFrequency;
    if (params.chromaBase !== undefined) filterParams.chromaBase = params.chromaBase;
    if (params.chromaSpread !== undefined) filterParams.chromaSpread = params.chromaSpread;
    if (params.highlightOpacity !== undefined) filterParams.highlightOpacity = params.highlightOpacity;
    if (Object.keys(filterParams).length) {
        window.dispatchEvent(new CustomEvent('glass-update-params', { detail: filterParams }));
    }
};
function syncGlassSliders(params) {
    const safeSet = (sel, key, def) => {
        document.querySelectorAll(sel).forEach(s => {
            const v = Number.isFinite(Number(params[key])) ? params[key] : def;
            s.value = v;
            if (s.nextElementSibling) s.nextElementSibling.textContent = v;
        });
    };
    safeSet('.glass-opacity-slider', 'opacity',        0.45);
    safeSet('.glass-blur-slider',    'preBlur',        2);
    safeSet('.glass-noise-slider',   'noiseScale',     5);
    safeSet('.glass-speed-slider',   'animationSpeed', 0.3);
}
window.setGlassLiteMode = function(enabled) {
    if (enabled) {
        document.documentElement.classList.add('glass-lite');
        setCookie('glass-lite', '1', 365);
    } else {
        document.documentElement.classList.remove('glass-lite');
        setCookie('glass-lite', '0', 365);
    }
    document.querySelectorAll('[id^="glass-lite-checkbox"]').forEach(cb => { cb.checked = !!enabled; });
    window.dispatchEvent(new CustomEvent('glass-update-params', { detail: { liteMode: !!enabled } }));
};
window.setMaterialMode = function(enabled) {
    if (enabled) {
        document.documentElement.classList.add('material-theme');
        setCookie('material-theme', '1', 365);
    } else {
        document.documentElement.classList.remove('material-theme');
        setCookie('material-theme', '0', 365);
        document.documentElement.classList.remove('light-theme');
        setCookie('material-light', '0', 365);
        document.querySelectorAll('[id^="material-light-checkbox"]').forEach(c => { c.checked = false; });
    }
    document.querySelectorAll('[id^="material-mode-checkbox"]').forEach(cb => { cb.checked = !!enabled; });
    document.querySelectorAll('[id^="material-light-row"]').forEach(el => { el.style.display = enabled ? '' : 'none'; });
};
window.setMaterialLightMode = function(enabled) {
    if (enabled) {
        document.documentElement.classList.add('light-theme');
        setCookie('material-light', '1', 365);
    } else {
        document.documentElement.classList.remove('light-theme');
        setCookie('material-light', '0', 365);
    }
    document.querySelectorAll('[id^="material-light-checkbox"]').forEach(cb => { cb.checked = !!enabled; });
};
const MSG_STYLES = {
    default:  { bg: null, text: '#000',                  meta: 'rgba(0,0,0,0.5)' },
    neutral:  { bg: 'rgba(255,255,255,0.09)',             text: 'rgba(255,255,255,0.87)', meta: 'rgba(255,255,255,0.35)' },
    dark:     { bg: 'rgba(255,255,255,0.05)',             text: 'rgba(255,255,255,0.87)', meta: 'rgba(255,255,255,0.35)' },
    blue:     { bg: 'rgba(10,132,255,0.85)',              text: '#fff',                  meta: 'rgba(255,255,255,0.55)' },
    none:     { bg: 'transparent',                       text: 'rgba(255,255,255,0.87)', meta: 'rgba(255,255,255,0.38)' },
};
window.setMsgOwnStyle = function(style) {
    const preset = MSG_STYLES[style] || MSG_STYLES.default;
    const root = document.documentElement;
    if (preset.bg === null) {
        const accent = getComputedStyle(root).getPropertyValue('--green').trim();
        root.style.setProperty('--msg-own-bg', accent.startsWith('#') ? hexToRgba(accent, 0.88) : accent);
    } else {
        root.style.setProperty('--msg-own-bg', preset.bg);
    }
    root.style.setProperty('--msg-own-text', preset.text);
    root.style.setProperty('--msg-own-meta', preset.meta);
    setCookie('msg-own-style', style, 365);
    document.querySelectorAll('.msg-style-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-msg-style') === style);
    });
};
function hexToRgba(hex, a) {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${a})`;
}
let bgEnabled = true;
window.setBgEnabled = function(enabled) {
    bgEnabled = !!enabled;
    if (window.bgToggle) window.bgToggle(bgEnabled);
    setCookie('bg-enabled', bgEnabled ? '1' : '0', 365);
    document.querySelectorAll('[id^="bg-toggle-btn"]').forEach(el => {
        el.textContent = bgEnabled ? 'Вкл' : 'Выкл';
        el.style.color = bgEnabled ? 'var(--green)' : 'var(--text-muted)';
    });
    document.querySelectorAll('.bg-settings-panel').forEach(p => {
        p.style.display = bgEnabled ? '' : 'none';
    });
};
window.setBgSettings = function(params) {
    const saved = JSON.parse(getCookie('bg-params') || '{}');
    const merged = Object.assign(saved, params);
    setCookie('bg-params', JSON.stringify(merged), 365);
    if (window.setBgParams) window.setBgParams(params);
};
function syncBgSliders(params) {
    const safeSet = (sel, key, def) => {
        document.querySelectorAll(sel).forEach(s => {
            const v = Number.isFinite(params[key]) ? params[key] : def;
            s.value = v;
            if (s.nextElementSibling) s.nextElementSibling.textContent = v;
        });
    };
    safeSet('.bg-speed-slider',   'zOffsetSpeed', 0.00009);
    safeSet('.bg-scale-slider',   'noiseScale',   0.008);
    safeSet('.bg-lines-slider',   'lineCount',    10);
    safeSet('.bg-opacity-slider', 'opacity',      0.35);
    safeSet('.bg-cell-slider',    'cellSize',      8);
}
const BIND_ACTIONS = {
    'glass-mode':   { label: 'Liquid Glass',   fn: () => window.setGlassMode(!document.documentElement.classList.contains('glass-mode')) },
    'material-mode':{ label: 'Material Design',fn: () => window.setMaterialMode(!document.documentElement.classList.contains('material-theme')) },
    'theme':        { label: 'Тема',           fn: () => setTheme(document.documentElement.classList.contains('light-theme') ? 'dark' : 'light') },
    'bg-toggle':    { label: 'Фон',            fn: () => window.setBgEnabled(!bgEnabled) },
    'glass-lite':   { label: 'Lite Glass',     fn: () => window.setGlassLiteMode(!document.documentElement.classList.contains('glass-lite')) },
};
let keybinds = {};
let bindRecordingFor = null;
function loadKeybinds() {
    try { keybinds = JSON.parse(getCookie('keybinds') || '{}'); } catch { keybinds = {}; }
    document.querySelectorAll('.bind-badge[data-bind-for]').forEach(el => {
        const id = el.getAttribute('data-bind-for');
        el.textContent = keybinds[id] ? formatKey(keybinds[id]) : '';
    });
}
function saveKeybinds() {
    setCookie('keybinds', JSON.stringify(keybinds), 365);
}
function formatKey(code) {
    return code.replace(/^Key/, '').replace(/^Digit/, '').replace(/^Arrow/, '↑↓←→'['UDLR'.indexOf(code.slice(5))]).replace('AltLeft','Alt').replace('AltRight','Alt⊞').replace('ShiftLeft','⇧').replace('ShiftRight','⇧').replace('ControlLeft','Ctrl').replace('ControlRight','Ctrl⊞').replace('Space','Space');
}
document.addEventListener('mousedown', function(e) {
    if (e.button !== 1) return;
    const row = e.target.closest('[data-bind-id]');
    if (!row) return;
    e.preventDefault();
    const id = row.getAttribute('data-bind-id');
    if (!BIND_ACTIONS[id]) return;
    bindRecordingFor = id;
    document.querySelectorAll(`.bind-badge[data-bind-for="${id}"]`).forEach(el => {
        el.textContent = '...';
        el.classList.add('bind-recording');
    });
    const onKey = (ke) => {
        if (ke.key === 'Escape') {
            keybinds[id] = '';
            saveKeybinds();
        } else {
            keybinds[id] = ke.code;
            saveKeybinds();
        }
        document.querySelectorAll(`.bind-badge[data-bind-for="${id}"]`).forEach(el => {
            el.textContent = keybinds[id] ? formatKey(keybinds[id]) : '';
            el.classList.remove('bind-recording');
        });
        bindRecordingFor = null;
        document.removeEventListener('keydown', onKey, { capture: true });
    };
    document.addEventListener('keydown', onKey, { capture: true, once: true });
});
document.addEventListener('keydown', function(e) {
    if (bindRecordingFor) return;
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.isContentEditable || activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;
    for (const [id, code] of Object.entries(keybinds)) {
        if (!code || e.code !== code) continue;
        const action = BIND_ACTIONS[id];
        if (!action) continue;
        e.preventDefault();
        action.fn();
        if (window.islandEmit) {
            window.islandEmit('island:status', { text: action.label, color: 'var(--green)', autoDismiss: true });
        }
        break;
    }
}, { capture: true });
window._sendMessageToChat = async function(chatId, text) {
    if (!chatId || !text) return;
    try { const resp = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: parseInt(chatId), content: text }) }); if (resp.ok) { pollNewMessages(); updateSidebar(); } } catch (e) {}
};
window.copyCodeBlock = function(btn, encodedCode) {
    navigator.clipboard.writeText(decodeURIComponent(encodedCode)).then(() => { const orig = btn.innerHTML; btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px; color:#4CAF50;">done</span>'; setTimeout(() => { btn.innerHTML = orig; }, 2000); }).catch(console.error);
};
window.startCall = async function(chatId) {
    if (!chatId) return;
    const item = document.querySelector(`.chat-item[data-chat-id="${chatId}"]`);
    const targetId = item?.getAttribute('data-target-id');
    if (!targetId) { openCallWindow(`/call?channel=${chatId}`, chatId); return; }
    try {
        const resp = await fetch('/api/call/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ target_user_id: parseInt(targetId), chat_id: parseInt(chatId) })
        });
        const data = await resp.json();
        if (data.channel) {
            openCallWindow(`/call?channel=${data.channel}`, data.channel);
            if (typeof pollNewMessages === 'function') pollNewMessages();
            if (typeof updateSidebar === 'function') updateSidebar();
        }
    } catch (err) {
        openCallWindow(`/call?channel=${chatId}`, chatId);
    }
};
bindChatClickEvents();
function setCookie(n, v, d) { let e = ""; if (d) { let dt = new Date(); dt.setTime(dt.getTime() + d * 86400000); e = "; expires=" + dt.toUTCString(); } document.cookie = n + "=" + (v || "") + e + "; path=/"; }
function getCookie(n) { let eq = n + "="; for (let c of document.cookie.split(';')) { c = c.trim(); if (c.indexOf(eq) === 0) return c.substring(eq.length); } return null; }
function initTheme() {
    const t = getCookie('theme');
    const cb = document.getElementById('theme-checkbox');
    if (t === 'light') {
        document.documentElement.classList.add('light-theme');
        if (cb) cb.checked = false;
    } else {
        if (cb) cb.checked = true;
    }
    if (getCookie('glass-mode') === '1') {
        document.documentElement.classList.add('glass-mode');
        document.querySelectorAll('[id^="glass-mode-checkbox"]').forEach(c => { c.checked = true; });
        document.querySelectorAll('.glass-settings-panel').forEach(p => { p.style.display = ''; });
        const gp = JSON.parse(getCookie('glass-params') || '{}');
        if (gp.opacity !== undefined) document.documentElement.style.setProperty('--glass-opacity', gp.opacity);
        if (Object.keys(gp).length) {
            syncGlassSliders(gp);
            window.__glassInitParams = gp;
            window.dispatchEvent(new CustomEvent('glass-update-params', { detail: gp }));
        }
        if (getCookie('glass-lite') === '1') {
            document.documentElement.classList.add('glass-lite');
            document.querySelectorAll('[id^="glass-lite-checkbox"]').forEach(c => { c.checked = true; });
            window.__glassInitParams = Object.assign(window.__glassInitParams || {}, { liteMode: true });
        }
    }
    if (getCookie('material-theme') === '1') {
        document.documentElement.classList.add('material-theme');
        document.querySelectorAll('[id^="material-mode-checkbox"]').forEach(c => { c.checked = true; });
        document.querySelectorAll('[id^="material-light-row"]').forEach(el => { el.style.display = ''; });
        if (getCookie('material-light') === '1') {
            document.documentElement.classList.add('light-theme');
            document.querySelectorAll('[id^="material-light-checkbox"]').forEach(c => { c.checked = true; });
        }
    }
    const ms = getCookie('msg-own-style');
    if (ms && MSG_STYLES[ms]) window.setMsgOwnStyle(ms);
    else {
        document.querySelectorAll('.msg-style-btn[data-msg-style="default"]').forEach(b => b.classList.add('active'));
    }
    if (getCookie('bg-enabled') === '0') {
        bgEnabled = false;
        document.querySelectorAll('[id^="bg-toggle-btn"]').forEach(el => {
            el.textContent = 'Выкл';
            el.style.color = 'var(--text-muted)';
        });
        if (window.bgToggle) window.bgToggle(false);
    } else {
        bgEnabled = true;
        document.querySelectorAll('.bg-settings-panel').forEach(p => { p.style.display = ''; });
    }
    const bp = JSON.parse(getCookie('bg-params') || '{}');
    if (Object.keys(bp).length) {
        syncBgSliders(bp);
        if (window.setBgParams) window.setBgParams(bp);
    }
    loadKeybinds();
}
initTheme();
document.addEventListener('change', function(e) {
    const id = e.target?.id || '';
    if (id.startsWith('glass-mode-checkbox')) window.setGlassMode(e.target.checked);
    if (id.startsWith('glass-lite-checkbox')) window.setGlassLiteMode(e.target.checked);
    if (id.startsWith('material-mode-checkbox')) {
        window.setMaterialMode(e.target.checked);
        document.querySelectorAll('[id^="material-light-row"]').forEach(el => {
            el.style.display = e.target.checked ? '' : 'none';
        });
        if (!e.target.checked) {
            document.querySelectorAll('[id^="material-light-checkbox"]').forEach(c => { c.checked = false; });
            window.setMaterialLightMode(false);
        }
    }
    if (id.startsWith('material-light-checkbox')) window.setMaterialLightMode(e.target.checked);
});
document.addEventListener('click', function(e) {
    if (e.target && (e.target.id?.startsWith('bg-toggle-btn'))) {
        window.setBgEnabled(!bgEnabled);
    }
    if (e.target && e.target.classList.contains('msg-style-btn')) {
        const style = e.target.getAttribute('data-msg-style');
        if (style) window.setMsgOwnStyle(style);
    }
});
document.addEventListener('input', function(e) {
    const t = e.target;
    if (!t || !t.classList || t.type !== 'range') return;
    const val = parseFloat(t.value);
    const valEl = t.nextElementSibling;
    if (valEl && valEl.classList.contains('glass-val')) valEl.textContent = val;
    if (t.classList.contains('glass-opacity-slider')) {
        document.querySelectorAll('.glass-opacity-slider').forEach(s => { if (s !== t) { s.value = val; if (s.nextElementSibling) s.nextElementSibling.textContent = val; } });
        window.setGlassParams({ opacity: val });
    } else if (t.classList.contains('glass-blur-slider')) {
        document.querySelectorAll('.glass-blur-slider').forEach(s => { if (s !== t) { s.value = val; if (s.nextElementSibling) s.nextElementSibling.textContent = val; } });
        window.setGlassParams({ preBlur: val });
    } else if (t.classList.contains('glass-noise-slider')) {
        document.querySelectorAll('.glass-noise-slider').forEach(s => { if (s !== t) { s.value = val; if (s.nextElementSibling) s.nextElementSibling.textContent = val; } });
        window.setGlassParams({ noiseScale: val });
    } else if (t.classList.contains('glass-speed-slider')) {
        document.querySelectorAll('.glass-speed-slider').forEach(s => { if (s !== t) { s.value = val; if (s.nextElementSibling) s.nextElementSibling.textContent = val; } });
        window.setGlassParams({ animationSpeed: val });
    } else if (t.classList.contains('bg-speed-slider')) {
        document.querySelectorAll('.bg-speed-slider').forEach(s => { if (s !== t) { s.value = val; if (s.nextElementSibling) s.nextElementSibling.textContent = val; } });
        window.setBgSettings({ zOffsetSpeed: val });
    } else if (t.classList.contains('bg-scale-slider')) {
        document.querySelectorAll('.bg-scale-slider').forEach(s => { if (s !== t) { s.value = val; if (s.nextElementSibling) s.nextElementSibling.textContent = val; } });
        window.setBgSettings({ noiseScale: val });
    } else if (t.classList.contains('bg-lines-slider')) {
        document.querySelectorAll('.bg-lines-slider').forEach(s => { if (s !== t) { s.value = val; if (s.nextElementSibling) s.nextElementSibling.textContent = val; } });
        window.setBgSettings({ lineCount: val });
    } else if (t.classList.contains('bg-opacity-slider')) {
        document.querySelectorAll('.bg-opacity-slider').forEach(s => { if (s !== t) { s.value = val; if (s.nextElementSibling) s.nextElementSibling.textContent = val; } });
        window.setBgSettings({ opacity: val });
    } else if (t.classList.contains('bg-cell-slider')) {
        document.querySelectorAll('.bg-cell-slider').forEach(s => { if (s !== t) { s.value = val; if (s.nextElementSibling) s.nextElementSibling.textContent = val; } });
        window.setBgSettings({ cellSize: val });
    }
});
const menuBtn = document.querySelector('.menu-btn');
const sideDrawer = document.getElementById('side-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const drawerCreateGroup = document.getElementById('drawer-create-group');
const drawerThemeToggle = document.getElementById('drawer-theme-toggle');
const themeCheckbox = document.getElementById('theme-checkbox');
if (menuBtn && sideDrawer && drawerOverlay) {
    menuBtn.addEventListener('click', () => {
        sideDrawer.classList.add('open');
        drawerOverlay.classList.add('visible');
        const um = document.querySelector('meta[name="current-user"]');
        if (um && document.getElementById('drawer-user-name')) document.getElementById('drawer-user-name').textContent = um.content;
        const _daEl = document.getElementById('drawer-user-avatar');
        if (_daEl) {
            const _myProf = document.getElementById('my-profile-avatar');
            if (_myProf && _myProf.src && !_myProf.src.endsWith('/')) _daEl.src = _myProf.src;
        }
    });
    drawerOverlay.addEventListener('click', () => {
        sideDrawer.classList.remove('open');
        drawerOverlay.classList.remove('visible');
    });
    const closeDrawer = () => {
        sideDrawer.classList.remove('open');
        drawerOverlay.classList.remove('visible');
    };
    document.getElementById('drawer-profile')?.addEventListener('click', () => {
        closeDrawer();
        document.getElementById('profile-modal-overlay').classList.add('visible');
    });
    document.getElementById('drawer-premium')?.addEventListener('click', () => {
        alert('Tornado Premium пока что не работает.');
    });
    document.getElementById('drawer-calls')?.addEventListener('click', () => {
        closeDrawer();
        const list = document.getElementById('calls-history-list');
        if (list) {
            const items = document.querySelectorAll('.chat-item');
            if (items.length > 0) {
                list.innerHTML = '';
                items.forEach(item => {
                    const name = item.querySelector('.chat-name')?.textContent.trim();
                    const avatar = item.querySelector('.avatar')?.src;
                    const id = item.dataset.chatId;
                    const entry = document.createElement('div');
                    entry.className = 'drawer-item';
                    entry.style.padding = '12px 0';
                    entry.innerHTML = `
                        <img src="${avatar}" style="width:40px;height:40px;border-radius:50%;margin-right:12px;">
                        <div style="flex:1;">
                            <div style="font-weight:600;">${name}</div>
                            <div style="font-size:12px;color:var(--text-muted);">Исходящий звонок</div>
                        </div>
                        <span class="material-symbols-outlined" style="color:var(--green);cursor:pointer;" onclick="startCall('${id}')">call</span>
                    `;
                    list.appendChild(entry);
                });
            }
        }
        document.getElementById('calls-modal-overlay').classList.add('visible');
    });
    document.getElementById('drawer-design')?.addEventListener('click', () => {
        closeDrawer();
        document.getElementById('design-modal-overlay').classList.add('visible');
    });
    document.getElementById('drawer-notifications')?.addEventListener('click', () => {
        closeDrawer();
        document.getElementById('notifications-modal-overlay').classList.add('visible');
        window.updateNotifPermUI();
    });
    if (drawerCreateGroup) drawerCreateGroup.addEventListener('click', () => {
        closeDrawer();
        openGroupModal();
    });
    document.getElementById('drawer-create-channel')?.addEventListener('click', () => {
        closeDrawer();
        openChannelModal();
    });
    if (drawerThemeToggle) drawerThemeToggle.addEventListener('click', (e) => {
        if (e.target !== themeCheckbox) themeCheckbox.checked = !themeCheckbox.checked;
        const isLight = document.documentElement.classList.toggle('light-theme');
        setCookie('theme', isLight ? 'light' : 'dark', 365);
        if (isLight) {
            document.getElementById('theme-light-btn')?.classList.add('active');
            document.getElementById('theme-dark-btn')?.classList.remove('active');
        } else {
            document.getElementById('theme-dark-btn')?.classList.add('active');
            document.getElementById('theme-light-btn')?.classList.remove('active');
        }
    });
}
document.getElementById('avatar-upload-input')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type.startsWith('video/') || file.type.endsWith('gif')) {
        const isPremium = document.querySelector('meta[name="is-premium"]')?.content === 'True';
        if (!isPremium) {
            alert('Установка видео-аватаров доступна только Premium пользователям.');
            return;
        }
    }
    const reader = new FileReader();
    reader.onload = async (ev) => {
        let finalData = ev.target.result;
        if (file.type.startsWith('image/') && !file.type.endsWith('gif')) {
            finalData = await compressImage(ev.target.result, 400, 400);
        }
        try {
            const resp = await fetch('/api/user/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ avatar: finalData })
            });
            if (resp.ok) {
                const data = await resp.json();
                const profileContainer = document.getElementById('profile-avatar-container');
                if (profileContainer) {
                    profileContainer.innerHTML = renderAvatar(data.avatar, 'profile-big-avatar', 'my-profile-avatar') + '<div class="avatar-edit-overlay"><span class="material-symbols-outlined">photo_camera</span></div>';
                }
                const drawerAvatar = document.getElementById('drawer-user-avatar');
                if (drawerAvatar && drawerAvatar.parentElement) {
                    drawerAvatar.parentElement.innerHTML = renderAvatar(data.avatar, 'drawer-avatar', 'drawer-user-avatar');
                }
                const settingsAvatar = document.getElementById('settingsAvatar');
                if (settingsAvatar && settingsAvatar.parentElement) {
                    settingsAvatar.parentElement.innerHTML = renderAvatar(data.avatar, 'avatar', 'settingsAvatar');
                }
            }
        } catch (err) { console.error(err); }
    };
    reader.readAsDataURL(file);
});
async function compressImage(base64, mw, mh) {
    return new Promise((res) => {
        const img = new Image();
        img.src = base64;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let w = img.width, h = img.height;
            if (w > h) { if (w > mw) { h *= mw / w; w = mw; } }
            else { if (h > mh) { w *= mh / h; h = mh; } }
            canvas.width = w; canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            res(canvas.toDataURL('image/jpeg', 0.8));
        };
    });
}
document.querySelectorAll('.accent-color').forEach(btn => {
    btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color');
        document.documentElement.style.setProperty('--green', color);
        document.documentElement.style.setProperty('--text-accent', color);
        document.documentElement.style.setProperty('--green-dim', color + '1f');
        document.documentElement.style.setProperty('--green-glow', color + '40');
        document.documentElement.style.setProperty('--green-border', color + '59');
        document.querySelectorAll('.accent-color').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        setCookie('accent-color', color, 365);
    });
});
document.getElementById('theme-dark-btn')?.addEventListener('click', () => {
    document.documentElement.classList.remove('light-theme');
    const cb = document.getElementById('theme-checkbox');
    if (cb) cb.checked = true;
    document.getElementById('theme-dark-btn').classList.add('active');
    document.getElementById('theme-light-btn')?.classList.remove('active');
    setCookie('theme', 'dark', 365);
});
document.getElementById('theme-light-btn')?.addEventListener('click', () => {
    document.documentElement.classList.add('light-theme');
    const cb = document.getElementById('theme-checkbox');
    if (cb) cb.checked = false;
    document.getElementById('theme-light-btn').classList.add('active');
    document.getElementById('theme-dark-btn')?.classList.remove('active');
    setCookie('theme', 'light', 365);
});
document.getElementById('font-family-select')?.addEventListener('change', (e) => {
    document.body.style.setProperty('--main-font', e.target.value);
    document.documentElement.style.setProperty('font-family', e.target.value);
    setCookie('font-family', e.target.value, 365);
});
document.querySelectorAll('.wallpaper-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const wp = btn.getAttribute('data-wallpaper');
        const chatMsgs = document.getElementById('chat-messages');
        if (wp === 'none') {
            chatMsgs.style.backgroundImage = 'none';
            setCookie('wallpaper', 'none', 365);
        } else if (wp === 'lines') {
            chatMsgs.style.backgroundImage = 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 10h100M0 30h100M0 50h100M0 70h100M0 90h100\' fill=\'none\' stroke=\'rgba(255,255,255,0.03)\' stroke-width=\'1\'/%3E%3C/svg%3E")';
            chatMsgs.style.backgroundRepeat = 'repeat';
            setCookie('wallpaper', 'lines', 365);
        }
    });
});
document.getElementById('wallpaper-file-btn')?.addEventListener('click', () => {
    document.getElementById('wallpaper-file-input').click();
});
document.getElementById('wallpaper-file-input')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            document.getElementById('chat-messages').style.backgroundImage = `url(${ev.target.result})`;
            document.getElementById('chat-messages').style.backgroundSize = 'cover';
        };
        reader.readAsDataURL(file);
    }
});
window._resetChatSelection = function() {
    currentChatId = null;
    currentTargetId = null;
    document.querySelectorAll('.chat-item').forEach(c => c.classList.remove('active'));
    noChatState.style.display = 'flex';
    activeChatLayout.style.display = 'none';
    if (chatInputWrapper) chatInputWrapper.style.display = 'none';
};
function loadDesignPresets() {
    const accent = getCookie('accent-color');
    if (accent) {
        document.documentElement.style.setProperty('--green', accent);
        document.documentElement.style.setProperty('--text-accent', accent);
        document.documentElement.style.setProperty('--green-dim', accent + '1f');
        document.documentElement.style.setProperty('--green-glow', accent + '40');
        document.documentElement.style.setProperty('--green-border', accent + '59');
    }
    const wp = getCookie('wallpaper');
    if (wp) {
        setTimeout(() => {
            const btn = document.querySelector(`.wallpaper-btn[data-wallpaper="${wp}"]`);
            if (btn) btn.click();
        }, 100);
    }
}
loadDesignPresets();
const PUSH_MUTED_KEY = 'push-muted-chats';
const PUSH_ENABLED_KEY = 'push-notifications-enabled';
const PUSH_PREVIEW_KEY = 'push-message-preview';
const lastUnreadCounts = {};
function getPushMuted() {
    try { return JSON.parse(localStorage.getItem(PUSH_MUTED_KEY) || '[]'); } catch { return []; }
}
function isChatPushMuted(chatId) { return getPushMuted().includes(String(chatId)); }
function toggleChatPushMute(chatId) {
    let muted = getPushMuted();
    const sid = String(chatId);
    muted = muted.includes(sid) ? muted.filter(id => id !== sid) : [...muted, sid];
    localStorage.setItem(PUSH_MUTED_KEY, JSON.stringify(muted));
}
function isPushEnabled() { return localStorage.getItem(PUSH_ENABLED_KEY) !== '0'; }
function isPushPreviewEnabled() { return localStorage.getItem(PUSH_PREVIEW_KEY) !== '0'; }
function showPushNotification(chatName, content, avatar, chatId) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    if (!isPushEnabled()) return;
    if (isChatPushMuted(chatId)) return;
    let body = isPushPreviewEnabled()
        ? (content.length > 90 ? content.substring(0, 90) + '…' : content)
        : 'Новое сообщение';
    if (body.startsWith('__CALL_INVITE__')) body = '📞 Входящий видеозвонок';
    else if (body.startsWith('__CHATLINK__')) body = '📩 Приглашение в чат';
    body = body.replace(/__AEMOJI__([^\/]+)\/\/\/(.+?)__/g, '⭐ $2');
    const n = new Notification(chatName, {
        body,
        icon: avatar || '/static/icons/logo.svg',
        badge: '/static/icons/logo.svg',
        tag: `tornado-chat-${chatId}`,
        renotify: true,
    });
    n.onclick = () => {
        window.focus();
        const item = document.querySelector(`.chat-item[data-chat-id="${chatId}"]`);
        if (item) item.click();
        n.close();
    };
}
let _swRegistration = null;
let _pushSubscription = null;
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const raw = atob(base64);
    return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}
async function initServiceWorker() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    try {
        navigator.serviceWorker.addEventListener('message', (e) => {
            if (e.data && e.data.type === 'NOTIF_CLICK' && e.data.chatId) {
                const item = document.querySelector(`.chat-item[data-chat-id="${e.data.chatId}"]`);
                if (item) item.click();
            }
        });
    } catch {}
}
async function subscribeToPush() {
    if (!_swRegistration) return false;
    try {
        const keyRes = await fetch('/api/push/vapid-key');
        const { publicKey } = await keyRes.json();
        const sub = await _swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
        _pushSubscription = sub;
        await fetch('/api/push/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sub.toJSON()),
        });
        return true;
    } catch { return false; }
}
async function unsubscribeFromPush() {
    if (!_pushSubscription) return;
    try {
        const endpoint = _pushSubscription.endpoint;
        await _pushSubscription.unsubscribe();
        _pushSubscription = null;
        await fetch('/api/push/unsubscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint }),
        });
    } catch {}
}
async function requestAndSubscribe() {
    const perm = await Notification.requestPermission();
    window.updateNotifPermUI();
    if (perm === 'granted') await subscribeToPush();
    return perm;
}
window.updateNotifPermUI = function() {
    const supported = 'Notification' in window;
    const perm = supported ? Notification.permission : 'unsupported';
    [
        { block: 'notif-permission-block', title: 'notif-perm-title', sub: 'notif-perm-sub', btn: 'notif-perm-btn' },
        { block: 'notif-permission-block-mob', title: 'notif-perm-title-mob', sub: 'notif-perm-sub-mob', btn: 'notif-perm-btn-mob' },
    ].forEach(({ block, title, sub, btn }) => {
        const blockEl = document.getElementById(block);
        const titleEl = document.getElementById(title);
        const subEl = document.getElementById(sub);
        const btnEl = document.getElementById(btn);
        if (!blockEl) return;
        if (!supported) {
            blockEl.setAttribute('data-state', 'unsupported');
            if (titleEl) titleEl.textContent = 'Не поддерживается';
            if (subEl) subEl.textContent = 'Ваш браузер не поддерживает уведомления';
            if (btnEl) btnEl.style.display = 'none';
        } else if (perm === 'granted') {
            blockEl.setAttribute('data-state', 'granted');
            if (titleEl) titleEl.textContent = 'Уведомления разрешены';
            if (subEl) subEl.textContent = _pushSubscription ? 'Push-подписка активна' : 'Браузер разрешил уведомления';
            if (btnEl) { btnEl.style.display = ''; btnEl.textContent = 'Отписаться'; btnEl.onclick = async () => { await unsubscribeFromPush(); window.updateNotifPermUI(); }; }
        } else if (perm === 'denied') {
            blockEl.setAttribute('data-state', 'denied');
            if (titleEl) titleEl.textContent = 'Уведомления заблокированы';
            if (subEl) subEl.textContent = 'Разрешите в настройках браузера';
            if (btnEl) { btnEl.style.display = ''; btnEl.textContent = 'Как разрешить?'; btnEl.onclick = () => alert('Нажмите на замок в адресной строке браузера → Уведомления → Разрешить.'); }
        } else {
            blockEl.setAttribute('data-state', 'default');
            if (titleEl) titleEl.textContent = 'Разрешение не выдано';
            if (subEl) subEl.textContent = 'Нажмите, чтобы разрешить уведомления';
            if (btnEl) { btnEl.style.display = ''; btnEl.textContent = 'Разрешить'; btnEl.onclick = () => requestAndSubscribe(); }
        }
    });
    const dot = document.getElementById('notif-drawer-dot');
    if (dot) {
        dot.className = 'notif-perm-dot' + (perm === 'granted' ? ' granted' : perm === 'denied' ? ' denied' : '');
    }
    const pushEl = document.getElementById('push-enabled-checkbox');
    const pushMobEl = document.getElementById('push-enabled-checkbox-mob');
    const previewEl = document.getElementById('push-preview-checkbox');
    const previewMobEl = document.getElementById('push-preview-checkbox-mob');
    if (pushEl) pushEl.checked = isPushEnabled();
    if (pushMobEl) pushMobEl.checked = isPushEnabled();
    if (previewEl) previewEl.checked = isPushPreviewEnabled();
    if (previewMobEl) previewMobEl.checked = isPushPreviewEnabled();
};
document.addEventListener('change', function(e) {
    if (e.target.id === 'push-enabled-checkbox' || e.target.id === 'push-enabled-checkbox-mob') {
        localStorage.setItem(PUSH_ENABLED_KEY, e.target.checked ? '1' : '0');
        const other = document.getElementById(e.target.id === 'push-enabled-checkbox' ? 'push-enabled-checkbox-mob' : 'push-enabled-checkbox');
        if (other) other.checked = e.target.checked;
    }
    if (e.target.id === 'push-preview-checkbox' || e.target.id === 'push-preview-checkbox-mob') {
        localStorage.setItem(PUSH_PREVIEW_KEY, e.target.checked ? '1' : '0');
        const other = document.getElementById(e.target.id === 'push-preview-checkbox' ? 'push-preview-checkbox-mob' : 'push-preview-checkbox');
        if (other) other.checked = e.target.checked;
    }
});
document.getElementById('ctx-chat-notify')?.addEventListener('click', () => {
    if (!contextChatId) return;
    contextMenu.style.display = 'none';
    contextMenu.classList.remove('active');
    toggleChatPushMute(contextChatId);
});
function cancelReply() {
    replyingToId = null;
    replyingToAuthor = '';
    replyingToText = '';
    const rb = document.getElementById('reply-bar');
    if (rb) rb.style.display = 'none';
}
function startReply(msgId, author, text) {
    replyingToId = msgId;
    replyingToAuthor = author;
    replyingToText = text;
    const rb = document.getElementById('reply-bar');
    const rbAuthor = document.getElementById('reply-bar-author');
    const rbContent = document.getElementById('reply-bar-content');
    if (rb) rb.style.display = 'flex';
    if (rbAuthor) rbAuthor.textContent = author;
    if (rbContent) rbContent.textContent = text.substring(0, 80) + (text.length > 80 ? '...' : '');
    if (messageInput) messageInput.focus();
}
document.getElementById('reply-bar-close')?.addEventListener('click', cancelReply);
const ctxReplyMsg = document.getElementById('ctx-reply-msg');
if (ctxReplyMsg) {
    ctxReplyMsg.addEventListener('click', () => {
        msgContextMenu.style.display = 'none';
        msgContextMenu.classList.remove('active');
        if (!contextMsgId || contextMsgIsSystem) return;
        const msgEl = messagesContainer.querySelector('[data-msg-id="' + contextMsgId + '"]');
        if (!msgEl) return;
        const authorEl = msgEl.querySelector('.msg-author');
        const author = authorEl ? authorEl.textContent.trim() : currentUser;
        const contentEl = msgEl.querySelector('.msg-content');
        let text = '';
        if (contentEl) {
            const clone = contentEl.cloneNode(true);
            clone.querySelectorAll('.msg-meta, .msg-reply-preview, .msg-image, .msg-video, .msg-audio, .msg-file-card').forEach(el => el.remove());
            text = clone.textContent.trim();
        }
        startReply(contextMsgId, author, text || '📎 Файл');
    });
}
const sendBtnEl = document.getElementById('send-btn');
function isMicMode() {
    const micIcon = sendBtnEl?.querySelector('.mic-icon');
    const sendIcon = sendBtnEl?.querySelector('.send-icon');
    return micIcon && micIcon.style.display !== 'none' && sendIcon && sendIcon.style.display === 'none';
}
if (sendBtnEl) {
    sendBtnEl.addEventListener('mousedown', (e) => {
        if (!isMicMode()) return;
        e.preventDefault();
        startVoiceRecord();
    });
    sendBtnEl.addEventListener('mouseup', () => {
        if (isRecordingVoice) stopVoiceRecord(true);
    });
    sendBtnEl.addEventListener('mouseleave', () => {
        if (isRecordingVoice) stopVoiceRecord(false);
    });
    sendBtnEl.addEventListener('touchstart', (e) => {
        if (!isMicMode()) return;
        e.preventDefault();
        startVoiceRecord();
    }, { passive: false });
    sendBtnEl.addEventListener('touchend', () => {
        if (isRecordingVoice) stopVoiceRecord(true);
    });
}
async function startVoiceRecord() {
    if (isRecordingVoice) return;
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        isRecordingVoice = true;
        voiceAudioChunks = [];
        voiceRecordSeconds = 0;
        const bar = document.getElementById('voice-record-bar');
        const glass = document.getElementById('chat-input-glass');
        if (bar) bar.style.display = 'flex';
        if (glass) glass.style.display = 'none';
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/ogg';
        voiceMediaRecorder = new MediaRecorder(stream, { mimeType });
        voiceMediaRecorder.ondataavailable = e => { if (e.data.size > 0) voiceAudioChunks.push(e.data); };
        voiceMediaRecorder.start(100);
        const timeEl = document.getElementById('voice-record-time');
        voiceRecordInterval = setInterval(() => {
            voiceRecordSeconds++;
            const m = Math.floor(voiceRecordSeconds / 60);
            const s = voiceRecordSeconds % 60;
            if (timeEl) timeEl.textContent = `${m}:${String(s).padStart(2, '0')}`;
        }, 1000);
    } catch (e) {
        isRecordingVoice = false;
    }
}
function stopVoiceRecord(send) {
    if (!isRecordingVoice || !voiceMediaRecorder) return;
    isRecordingVoice = false;
    clearInterval(voiceRecordInterval);
    voiceRecordInterval = null;
    const bar = document.getElementById('voice-record-bar');
    const glass = document.getElementById('chat-input-glass');
    if (bar) bar.style.display = 'none';
    if (glass) glass.style.display = 'flex';
    voiceMediaRecorder.stream.getTracks().forEach(t => t.stop());
    if (!send || voiceRecordSeconds < 1) {
        voiceMediaRecorder = null;
        voiceAudioChunks = [];
        return;
    }
    const recorderRef = voiceMediaRecorder;
    const chunksRef = voiceAudioChunks;
    voiceMediaRecorder = null;
    voiceAudioChunks = [];
    recorderRef.onstop = async () => {
        const mimeType = recorderRef.mimeType || 'audio/ogg';
        const ext = mimeType.includes('webm') ? 'webm' : 'ogg';
        const blob = new Blob(chunksRef, { type: mimeType });
        const file = new File([blob], `voice_${Date.now()}.${ext}`, { type: mimeType });
        await uploadFiles('', file, 'voice');
    };
    recorderRef.stop();
}
document.getElementById('voice-record-cancel')?.addEventListener('click', () => {
    stopVoiceRecord(false);
});
async function openCircleRecord() {
    if (!currentChatId || currentChatId === 'null') return;
    const overlay = document.getElementById('circle-record-overlay');
    const previewVideo = document.getElementById('circle-preview-video');
    if (!overlay || !previewVideo) return;
    try {
        circleStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 360 }, height: { ideal: 360 } }, audio: true });
        previewVideo.srcObject = circleStream;
        overlay.style.display = 'flex';
        circleVideoChunks = [];
        circleRecordSeconds = 0;
        const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') ? 'video/webm;codecs=vp9,opus' : 'video/webm';
        circleMediaRecorder = new MediaRecorder(circleStream, { mimeType });
        circleMediaRecorder.ondataavailable = e => { if (e.data.size > 0) circleVideoChunks.push(e.data); };
        circleMediaRecorder.start(100);
        const timerEl = document.getElementById('circle-record-timer');
        const ring = document.getElementById('circle-record-ring');
        const MAX_DURATION = 60;
        circleRecordInterval = setInterval(() => {
            circleRecordSeconds++;
            const m = Math.floor(circleRecordSeconds / 60);
            const s = circleRecordSeconds % 60;
            if (timerEl) timerEl.textContent = `${m}:${String(s).padStart(2, '0')}`;
            if (ring) {
                const progress = (circleRecordSeconds / MAX_DURATION) * 360;
                ring.style.background = `conic-gradient(#34c759 ${progress}deg, rgba(255,255,255,0.1) ${progress}deg)`;
            }
            if (circleRecordSeconds >= MAX_DURATION) stopCircleRecord(true);
        }, 1000);
    } catch (e) {
        alert('Не удалось получить доступ к камере');
    }
}
function stopCircleRecord(send) {
    clearInterval(circleRecordInterval);
    circleRecordInterval = null;
    const overlay = document.getElementById('circle-record-overlay');
    if (overlay) overlay.style.display = 'none';
    if (circleStream) { circleStream.getTracks().forEach(t => t.stop()); circleStream = null; }
    const previewVideo = document.getElementById('circle-preview-video');
    if (previewVideo) previewVideo.srcObject = null;
    if (!send || circleRecordSeconds < 1 || !circleMediaRecorder) {
        circleMediaRecorder = null;
        circleVideoChunks = [];
        return;
    }
    const recorderRef = circleMediaRecorder;
    const chunksRef = [...circleVideoChunks];
    circleMediaRecorder = null;
    circleVideoChunks = [];
    recorderRef.onstop = async () => {
        const blob = new Blob(chunksRef, { type: 'video/webm' });
        const file = new File([blob], `circle_${Date.now()}.webm`, { type: 'video/webm' });
        await uploadFiles('', file, 'circle');
    };
    recorderRef.stop();
}
document.getElementById('circle-cancel-btn')?.addEventListener('click', () => stopCircleRecord(false));
document.getElementById('circle-send-btn')?.addEventListener('click', () => stopCircleRecord(true));
function updateChannelInputState() {
    const inputWrapper = document.getElementById('chat-input-wrapper-el');
    if (!inputWrapper) return;
    const isChannel = currentChatType === 'channel';
    const isOwner = currentChatOwnerId && String(currentChatOwnerId) === String(window._currentUserId);
    if (isChannel && !isOwner) {
        inputWrapper.style.display = 'none';
    } else {
        inputWrapper.style.display = 'flex';
    }
}
window.updateNotifPermUI();