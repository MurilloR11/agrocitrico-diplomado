// static/js/ia.js

(function () {
    const emptyEl    = document.getElementById('ia-empty');
    const messagesEl = document.getElementById('ia-messages');
    const suggestEl  = document.getElementById('ia-suggestions');
    const textarea   = document.getElementById('ia-textarea');
    const sendBtn    = document.getElementById('ia-send');
    const newChatBtn = document.getElementById('btn-new-chat');

    const BOT_REPLY = 'Esta es una vista de demostración visual. La integración con el modelo de IA estará disponible próximamente.';

    function switchToChat() {
        emptyEl.hidden    = true;
        messagesEl.hidden = false;
        suggestEl.hidden  = false;
    }

    function resetToEmpty() {
        messagesEl.innerHTML = '';
        emptyEl.hidden    = false;
        messagesEl.hidden = true;
        suggestEl.hidden  = true;
    }

    function appendMessage(text, role) {
        const isBot = role === 'bot';
        const msg   = document.createElement('div');
        msg.className = `ia-msg ia-msg--${isBot ? 'bot' : 'user'}`;
        msg.innerHTML = `
            <div class="ia-avatar ia-avatar--${isBot ? 'bot' : 'user'}" aria-hidden="true">${isBot ? 'IA' : 'Tú'}</div>
            <div class="ia-bubble"><p>${text}</p></div>
        `;
        messagesEl.appendChild(msg);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showTyping() {
        const wrap = document.createElement('div');
        wrap.className = 'ia-msg ia-msg--bot';
        wrap.id = 'ia-typing';
        wrap.innerHTML = `
            <div class="ia-avatar ia-avatar--bot" aria-hidden="true">IA</div>
            <div class="ia-typing" aria-label="El asistente está escribiendo">
                <span></span><span></span><span></span>
            </div>
        `;
        messagesEl.appendChild(wrap);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function hideTyping() {
        const el = document.getElementById('ia-typing');
        if (el) el.remove();
    }

    function send(text) {
        const trimmed = text.trim();
        if (!trimmed) return;

        switchToChat();
        appendMessage(trimmed, 'user');
        textarea.value = '';
        textarea.style.height = 'auto';
        sendBtn.disabled = true;

        showTyping();
        setTimeout(function () {
            hideTyping();
            appendMessage(BOT_REPLY, 'bot');
        }, 1400);
    }

    textarea.addEventListener('input', function () {
        sendBtn.disabled = this.value.trim() === '';
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    textarea.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!sendBtn.disabled) send(this.value);
        }
    });

    sendBtn.addEventListener('click', function () {
        send(textarea.value);
    });

    document.addEventListener('click', function (e) {
        const chip = e.target.closest('.ia-suggestion');
        if (chip && chip.dataset.prompt) send(chip.dataset.prompt);
    });

    newChatBtn.addEventListener('click', function () {
        resetToEmpty();
        textarea.value = '';
        textarea.style.height = 'auto';
        sendBtn.disabled = true;
    });
}());
