const sidebar = document.getElementById('sidebar');
const resizer = document.getElementById('resizer');
const contextMenu = document.getElementById('customContextMenu');
const chatItems = document.querySelectorAll('.chat-item');
let isResizing = false;

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