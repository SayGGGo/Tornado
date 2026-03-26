const sidebar = document.getElementById('sidebar');
const resizer = document.getElementById('resizer');
const contextMenu = document.getElementById('customContextMenu');
const chatPremiumEl = document.getElementById('current-chat-premium');
const noChatState = document.getElementById('no-chat-selected');
const activeChatLayout = document.getElementById('active-chat-layout');
const chatNameEl = document.getElementById('current-chat-name');
const chatAvatarEl = document.getElementById('current-chat-avatar');
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

const searchResultsBox = document.createElement('div');
searchResultsBox.className = 'search-results-box';
searchResultsBox.style.cssText = 'display: none; position: absolute; top: 100%; left: 15px; right: 15px; background: rgba(20, 20, 20, 0.95); backdrop-filter: blur(10px); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); margin-top: 5px; z-index: 9999; overflow-y: auto; max-height: 300px;';
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
.msg-audio { width: 100%; max-width: 320px; margin: 4px 0; outline: none; height: 36px; }
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
        newDiv.setAttribute('data-placeholder', messageInput.getAttribute('placeholder') || 'Сообщение');
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
    chatNameEl.textContent = item.querySelector('.chat-name').childNodes[0].textContent.trim();
    chatAvatarEl.src = item.querySelector('.avatar').src;
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
    e.preventDefault();
    let x = e.clientX, y = e.clientY;
    contextMenu.style.display = 'flex';
    const mw = contextMenu.offsetWidth, mh = contextMenu.offsetHeight;
    if (x + mw > window.innerWidth) x = window.innerWidth - mw - 10;
    if (y + mh > window.innerHeight) y = window.innerHeight - mh - 10;
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.classList.add('active');
}

function startChatWithUser(userId, userName) {
    searchResultsBox.style.display = 'none';
    searchInput.value = '';
    let existingItem = document.querySelector(`.chat-item[data-target-id="${userId}"]`);
    if (existingItem) { existingItem.click(); return; }
    const chatList = document.querySelector('.chat-list');
    const tempItem = document.createElement('div');
    tempItem.className = 'chat-item';
    tempItem.setAttribute('data-chat-id', 'null');
    tempItem.setAttribute('data-target-id', userId);
    tempItem.innerHTML = `<img src="https://ui-avatars.com/api/?name=${userName}&background=random&color=fff&rounded=true" class="avatar"><div class="chat-info"><div class="chat-header"><div class="chat-name">${userName}</div></div><div class="chat-message-row"><span class="msg-text">Начните диалог</span></div></div>`;
    chatList.prepend(tempItem);
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
    card.innerHTML = `<div class="call-card-icon"><span class="material-symbols-outlined">videocam</span></div><div class="call-card-info"><div class="call-card-title">${isOwn ? 'Вы начали звонок' : callData.callerName + ' начинает звонок'}</div><div class="call-card-subtitle">Внимание! Данная система в разработке, заходите в звонки только к тем, кому доверяете и не вводите никакие коды.</div></div><span class="material-symbols-outlined call-card-arrow">chevron_right</span>`;
    card.addEventListener('click', (e) => { e.preventDefault(); openCallWindow(`/call?channel=${callData.channel}`, callData.channel); });
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
        img.alt = msg.file_name || '';
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
        card.innerHTML = `<span class="material-symbols-outlined">description</span><div class="msg-file-info"><div class="msg-file-name">${msg.file_name || 'Файл'}</div><div class="msg-file-size">${formatFileSize(msg.file_size)}</div></div><span class="material-symbols-outlined" style="font-size:20px; color:var(--text-dim);">download</span>`;
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
    overlay.innerHTML = `<img src="${src}">`;
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
        msgDiv.innerHTML = `<img src="${url}" class="animated-emoji-msg" alt="emoji"><div class="msg-meta" style="justify-content:flex-end;">${editedHtml}<span class="msg-time">${msg.timestamp}</span><span class="msg-ticks">${ticksHtml}</span></div>`;
        msgDiv.addEventListener('contextmenu', onMsgContextMenu);
        return msgDiv;
    }

    const callData = parseCallInvite(msg.content);
    if (callData) {
        msgDiv.innerHTML = isOwn ? '' : `<div class="msg-author">${msg.login}</div>`;
        const metaDiv = document.createElement('div');
        metaDiv.className = 'msg-content';
        metaDiv.style.cssText = 'padding:4px 0;background:transparent;border:none;box-shadow:none;';
        metaDiv.appendChild(createCallCard(callData, isOwn));
        const timeDiv = document.createElement('div');
        timeDiv.className = 'msg-meta';
        timeDiv.style.marginTop = '6px';
        timeDiv.innerHTML = `<span class="msg-time">${msg.timestamp}</span>`;
        metaDiv.appendChild(timeDiv);
        msgDiv.appendChild(metaDiv);
        msgDiv.setAttribute('data-system', '1');
        msgDiv.addEventListener('contextmenu', onMsgContextMenu);
        return msgDiv;
    }

    if (msg.content && msg.content.startsWith('__CHATLINK__')) {
        const linkChatId = msg.content.replace('__CHATLINK__', '');
        msgDiv.innerHTML = isOwn ? '' : `<div class="msg-author">${msg.login}</div>`;
        const metaDiv = document.createElement('div');
        metaDiv.className = 'msg-content';
        metaDiv.style.cssText = 'padding:4px 0;background:transparent;border:none;box-shadow:none;';
        const card = document.createElement('div');
        card.className = 'invite-card';
        card.innerHTML = `<div class="invite-card-icon"><span class="material-symbols-outlined">group_add</span></div><div class="call-card-info"><div class="invite-card-title">Приглашение в группу</div><div class="invite-card-subtitle">Нажмите, чтобы присоединиться к чату</div></div>`;
        card.addEventListener('click', async () => { try { const res = await fetch('/api/chats/join', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: linkChatId }) }); if (res.ok) { updateSidebar(); setTimeout(() => { const btn = document.querySelector(`.chat-item[data-chat-id="${linkChatId}"]`); if (btn) btn.click(); }, 500); } } catch(e){} });
        const timeDiv = document.createElement('div');
        timeDiv.className = 'msg-meta';
        timeDiv.style.marginTop = '6px';
        timeDiv.innerHTML = `<span class="msg-time">${msg.timestamp}</span>`;
        metaDiv.appendChild(card);
        metaDiv.appendChild(timeDiv);
        msgDiv.appendChild(metaDiv);
        msgDiv.setAttribute('data-system', '1');
        msgDiv.addEventListener('contextmenu', onMsgContextMenu);
        return msgDiv;
    }

    const authorHtml = isOwn ? '' : `<div class="msg-author">${msg.login}</div>`;
    const editedHtml = msg.is_edited ? '<span class="msg-edited-label">изменено</span>' : '';
    const ticksHtml = isOwn ? (isPending
        ? `<span class="material-symbols-outlined" style="font-size:14px;">schedule</span>`
        : msg.is_read
            ? `<span class="material-symbols-outlined" style="font-size:14px; color:#4CAF50;">done_all</span>`
            : `<span class="material-symbols-outlined" style="font-size:14px;">done</span>`) : '';

    if (msg.file_url) {
        msgDiv.innerHTML = authorHtml;
        const contentDiv = document.createElement('div');
        contentDiv.className = 'msg-content';
        contentDiv.appendChild(createFileContent(msg));
        const metaDiv = document.createElement('div');
        metaDiv.className = 'msg-meta';
        metaDiv.innerHTML = `${editedHtml}<span class="msg-time">${msg.timestamp}</span><span class="msg-ticks">${ticksHtml}</span>`;
        contentDiv.appendChild(metaDiv);
        msgDiv.appendChild(contentDiv);
    } else {
        const formattedContent = formatMessageContent(msg.content);
        msgDiv.innerHTML = `${authorHtml}<div class="msg-content">${formattedContent}<div class="msg-meta">${editedHtml}<span class="msg-time">${msg.timestamp}</span><span class="msg-ticks">${ticksHtml}</span></div></div>`;
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
});

ctxEditMsg.addEventListener('click', () => {
    msgContextMenu.style.display = 'none';
    msgContextMenu.classList.remove('active');
    if (!contextMsgId || !contextMsgOwn || contextMsgIsSystem) return;
    const msgEl = messagesContainer.querySelector(`[data-msg-id="${contextMsgId}"]`);
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
    const msgEl = messagesContainer.querySelector(`[data-msg-id="${contextMsgId}"]`);
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

function cancelEdit() { editingMessageId = null; editBar.style.display = 'none'; editBarContent.textContent = ''; messageInput.innerHTML = ''; }

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
                    if (!messagesContainer.querySelector(`[data-msg-id="${msg.id}"]`)) {
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
                        const existingEl = messagesContainer.querySelector(`[data-msg-id="${msg.id}"]`);
                        if (existingEl) {
                            const cachedMsg = cache.messages.find(cm => cm.id === msg.id);
                            if (msg.is_deleted) { thanosSnap(existingEl); if (cachedMsg) cache.messages.splice(cache.messages.indexOf(cachedMsg), 1); return; }
                            if (cachedMsg && (cachedMsg.is_edited !== msg.is_edited || cachedMsg._pending)) { const newEl = createMessageElement(msg, false); if (newEl) existingEl.replaceWith(newEl); else existingEl.remove(); Object.assign(cachedMsg, msg); delete cachedMsg._pending; }
                        } else {
                            if (msg.is_deleted) return;
                            const pendingEl = messagesContainer.querySelector(`[data-msg-id^="-"]`);
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
                    const existingEl = messagesContainer.querySelector(`[data-msg-id="${msg.id}"]`);
                    if (existingEl) {
                        const cachedMsg = cache.messages.find(cm => cm.id === msg.id);
                        if (msg.is_deleted) { thanosSnap(existingEl); if (cachedMsg) cache.messages.splice(cache.messages.indexOf(cachedMsg), 1); return; }
                        if (cachedMsg && (cachedMsg.is_edited !== msg.is_edited || cachedMsg._pending)) { const newEl = createMessageElement(msg, false); if (newEl) existingEl.replaceWith(newEl); else existingEl.remove(); Object.assign(cachedMsg, msg); delete cachedMsg._pending; }
                    } else {
                        if (msg.is_deleted) return;
                        const pendingEl = messagesContainer.querySelector(`[data-msg-id^="-"]`);
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
                const el = messagesContainer.querySelector(`[data-msg-id="${s.id}"]`);
                if (el) thanosSnap(el);
                cache.messages.splice(cache.messages.indexOf(cachedMsg), 1);
            } else if (s.is_edited && !cachedMsg.is_edited) {
                cachedMsg.is_edited = true;
                if (s.content) cachedMsg.content = s.content;
                const el = messagesContainer.querySelector(`[data-msg-id="${s.id}"]`);
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
        if (data.error) { const pendingEl = messagesContainer.querySelector(`[data-msg-id^="-"]`); if (pendingEl) pendingEl.remove(); return; }
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

async function uploadFiles(caption) {
    const files = [...selectedFiles];
    clearFilePreview();
    for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        formData.append('caption', i === 0 ? (caption || '') : '');
        if (currentChatId && currentChatId !== 'null') formData.append('chat_id', currentChatId);
        else if (currentTargetId) formData.append('target_user_id', currentTargetId);
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
            const el = messagesContainer.querySelector(`[data-msg-id="${msgId}"]`);
            if (el) { const newEl = createMessageElement(cache.messages[idx], false); if (newEl) el.replaceWith(newEl); }
        }
    }
    try {
        await fetch(`/api/messages/${msgId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) });
    } catch (e) {}
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
                if (existingTemp) { existingTemp.setAttribute('data-chat-id', chatId); chatItem = existingTemp; }
                else { chatItem = document.createElement('div'); chatItem.className = 'chat-item'; chatItem.setAttribute('data-chat-id', chatId); chatItem.setAttribute('data-target-id', chat.target_user_id); if (currentChatId == chatId) chatItem.classList.add('active'); chatList.prepend(chatItem); bindChatClickEvents(); }
            }
            const readIcon = chat.last_status ? `<span class="material-symbols-outlined" style="font-size:14px; color:#4CAF50;">done_all</span>` : `<span class="material-symbols-outlined" style="font-size:14px;">done</span>`;
            let previewText = chat.last_msg;
            if (previewText.startsWith('__CALL_INVITE__')) previewText = '📞 Входящий видеозвонок';
            else if (previewText.startsWith('__CHATLINK__')) previewText = '📩 Приглашение в чат';
            else {
                previewText = previewText.replace(/__AEMOJI__([^\/]+)\/\/\/(.+?)__/g, '⭐ $2');
            }
            chatItem.innerHTML = `<img src="${chat.avatar}" alt="Avatar" class="avatar"><div class="chat-info"><div class="chat-header"><div class="chat-name">${chat.name}${chat.premium ? `<div class="premium-icon" style="-webkit-mask-image: url('/static/premium/${chat.premium}.svg'); mask-image: url('/static/premium/${chat.premium}.svg');"></div>` : ''}</div><div class="chat-meta"><span class="chat-time">${chat.last_time ? `${readIcon} ${chat.last_time}` : ''}</span></div></div><div class="chat-message-row"><span class="msg-text">${previewText}</span><div class="chat-meta">${chat.unread > 0 ? `<span class="unread-badge">${chat.unread}</span>` : ''}</div></div></div>`;
        }
    } catch(e) {}
}

async function loadContactsForModals() { try { const res = await fetch('/api/chats'); const data = await res.json(); allAvailableContacts = Object.values(data).filter(c => c.target_user_id); } catch (e) {} }

function renderContactsList(container, selectedSet, filterQuery = '') {
    container.innerHTML = '';
    allAvailableContacts.filter(c => c.name.toLowerCase().includes(filterQuery.toLowerCase())).forEach(c => {
        const row = document.createElement('div');
        row.className = `contact-row ${selectedSet.has(c.target_user_id) ? 'selected' : ''}`;
        row.innerHTML = `<img src="${c.avatar}" alt=""><div class="contact-info"><div class="contact-name">${c.name}</div><div class="contact-login">Пользователь</div></div>`;
        row.addEventListener('click', () => { if (selectedSet.has(c.target_user_id)) { selectedSet.delete(c.target_user_id); row.classList.remove('selected'); } else { selectedSet.add(c.target_user_id); row.classList.add('selected'); } });
        container.appendChild(row);
    });
}

async function openGroupModal() { searchResultsBox.style.display = 'none'; searchInput.value = ''; selectedForGroup.clear(); groupNameInput.value = ''; await loadContactsForModals(); renderContactsList(groupContactsList, selectedForGroup); groupModalOverlay.classList.add('visible'); }

function decodeHtmlEntities(text) { const t = document.createElement('textarea'); t.innerHTML = text; return t.value; }

function formatMessageContent(text) {
    if (!text) return text;
    let formatted = text.replace(/```([a-zA-Z0-9+#-]*)\n?([\s\S]*?)```/g, (match, lang, code) => {
        code = decodeHtmlEntities(code.trim());
        let highlighted = '';
        try { if (lang && hljs.getLanguage(lang)) highlighted = hljs.highlight(code, { language: lang }).value; else highlighted = hljs.highlightAuto(code).value; } catch (e) { highlighted = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
        return `<div class="code-wrapper"><button class="copy-code-btn" onclick="copyCodeBlock(this, '${encodeURIComponent(code)}')"><span class="material-symbols-outlined" style="font-size:16px;">content_copy</span></button><pre><code class="hljs ${lang}">${highlighted}</code></pre></div>`;
    });

    formatted = formatted.replace(/__AEMOJI__([^\/]+)\/\/\/(.+?)__/g, (match, cat, name) => {
        const safeName = name.replace(/"/g, '&quot;');
        const url = `${ANIMATED_EMOJI_BASE}/${encodeURIComponent(cat)}/${encodeURIComponent(name)}.webp`;
        return `<img src="${url}" class="animated-emoji-inline" data-cat="${cat}" data-name="${safeName}" alt="${safeName}" title="${safeName}" style="width: 24px; height: 24px; vertical-align: middle; display: inline-block;">`;
    });

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
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
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
        sendBtn.addEventListener('click', sendMessage);
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
            div.style.cssText = 'padding: 12px 15px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.05); color: #fff; transition: background 0.2s;';
            div.innerHTML = `<span style="display:flex; justify-content:space-between; align-items:center;"><b>${u.login}</b><span style="color: rgba(255,255,255,0.5); font-size: 0.85em;">${u.fio}</span></span>`;
            div.onmouseover = () => div.style.background = 'rgba(255,255,255,0.1)';
            div.onmouseout = () => div.style.background = 'transparent';
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
    document.getElementById('settings-chat-avatar').src = chatAvatarEl.src;
    settingsParticipantsList.innerHTML = '<div style="text-align:center; padding: 20px; color:#aaa;">Загрузка...</div>';
    let oldDelBtn = document.getElementById('delete-group-action');
    if (oldDelBtn) oldDelBtn.remove();
    chatSettingsOverlay.classList.add('visible');
    try {
        const res = await fetch(`/api/chats/${currentChatId}/info`);
        if (res.ok) {
            const data = await res.json();
            settingsParticipantsList.innerHTML = '';
            if (data.participants?.length > 0) data.participants.forEach(p => { settingsParticipantsList.innerHTML += `<div class="contact-row" style="cursor:default;"><img src="${p.avatar}" alt=""><div class="contact-info"><div class="contact-name">${p.login}</div><div class="contact-login">${p.role === 'owner' ? 'Создатель' : 'Участник'}</div></div></div>`; });
            else settingsParticipantsList.innerHTML = '<div style="text-align:center; padding: 10px; color:#aaa;">Участников нет</div>';
            if (!data.is_personal && data.owner_id == window._currentUserId) {
                const delBtn = document.createElement('button');
                delBtn.id = 'delete-group-action';
                delBtn.className = 'contact-action-btn';
                delBtn.style.cssText = 'width: 100%; margin-top: 15px; background: rgba(255,82,82,0.15); border-color: #ff5252; color: #ff5252;';
                delBtn.textContent = 'Удалить группу';
                delBtn.onclick = async () => { if (confirm('Удалить эту группу навсегда?')) { try { const r = await fetch(`/api/chats/${currentChatId}`, { method: 'DELETE' }); if (r.ok) { chatSettingsOverlay.classList.remove('visible'); currentChatId = null; activeChatLayout.style.display = 'none'; noChatState.style.display = 'flex'; document.querySelector('.chat-item.active')?.remove(); } } catch(e){} } };
                settingsParticipantsList.parentElement.appendChild(delBtn);
            }
        } else settingsParticipantsList.innerHTML = '<div style="text-align:center; padding: 10px; color:#aaa;">Не удалось загрузить</div>';
    } catch (e) { settingsParticipantsList.innerHTML = '<div style="text-align:center; padding: 10px; color:#aaa;">Ошибка сети</div>'; }
});

closeChatSettingsBtn.addEventListener('click', () => chatSettingsOverlay.classList.remove('visible'));
openInviteFromSettingsBtn.addEventListener('click', async () => { chatSettingsOverlay.classList.remove('visible'); selectedForInvite.clear(); inviteChatSearch.value = ''; await loadContactsForModals(); renderContactsList(inviteChatContactsList, selectedForInvite); inviteChatOverlay.classList.add('visible'); });

Object.defineProperty(window, '_currentChatId', { get: () => currentChatId, configurable: true });

window._sendMessageToChat = async function(chatId, text) {
    if (!chatId || !text) return;
    try { const resp = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: parseInt(chatId), content: text }) }); if (resp.ok) { pollNewMessages(); updateSidebar(); } } catch (e) {}
};

window.copyCodeBlock = function(btn, encodedCode) {
    navigator.clipboard.writeText(decodeURIComponent(encodedCode)).then(() => { const orig = btn.innerHTML; btn.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px; color:#4CAF50;">done</span>'; setTimeout(() => { btn.innerHTML = orig; }, 2000); }).catch(console.error);
};

bindChatClickEvents();

function setCookie(n, v, d) { let e = ""; if (d) { let dt = new Date(); dt.setTime(dt.getTime() + d * 86400000); e = "; expires=" + dt.toUTCString(); } document.cookie = n + "=" + (v || "") + e + "; path=/"; }
function getCookie(n) { let eq = n + "="; for (let c of document.cookie.split(';')) { c = c.trim(); if (c.indexOf(eq) === 0) return c.substring(eq.length); } return null; }

function initTheme() { const t = getCookie('theme'); const cb = document.getElementById('theme-checkbox'); if (t === 'light') { document.documentElement.classList.add('light-theme'); if (cb) cb.checked = false; } else { if (cb) cb.checked = true; } }
initTheme();

const menuBtn = document.querySelector('.menu-btn');
const sideDrawer = document.getElementById('side-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const drawerCreateGroup = document.getElementById('drawer-create-group');
const drawerThemeToggle = document.getElementById('drawer-theme-toggle');
const themeCheckbox = document.getElementById('theme-checkbox');

if (menuBtn && sideDrawer && drawerOverlay) {
    menuBtn.addEventListener('click', () => { sideDrawer.classList.add('open'); drawerOverlay.classList.add('visible'); const um = document.querySelector('meta[name="current-user"]'); if (um && document.getElementById('drawer-user-name')) document.getElementById('drawer-user-name').textContent = um.content; });
    drawerOverlay.addEventListener('click', () => { sideDrawer.classList.remove('open'); drawerOverlay.classList.remove('visible'); });
    if (drawerCreateGroup) drawerCreateGroup.addEventListener('click', () => { sideDrawer.classList.remove('open'); drawerOverlay.classList.remove('visible'); openGroupModal(); });
    if (drawerThemeToggle) drawerThemeToggle.addEventListener('click', (e) => { if (e.target !== themeCheckbox) themeCheckbox.checked = !themeCheckbox.checked; document.documentElement.classList.toggle('light-theme'); setCookie('theme', document.documentElement.classList.contains('light-theme') ? 'light' : 'dark', 365); });
}