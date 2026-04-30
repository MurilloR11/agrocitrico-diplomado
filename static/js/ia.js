// static/js/ia.js

(function () {
    const emptyEl    = document.getElementById('ia-empty');
    const messagesEl = document.getElementById('ia-messages');
    const suggestEl  = document.getElementById('ia-suggestions');
    const textarea   = document.getElementById('ia-textarea');
    const sendBtn    = document.getElementById('ia-send');
    const newChatBtn = document.getElementById('btn-new-chat');
    const endpoint   = window.AGROCITRICO_IA_ENDPOINT || '/ia/chat';

    let isSending = false;

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

        const avatar = document.createElement('div');
        avatar.className = `ia-avatar ia-avatar--${isBot ? 'bot' : 'user'}`;
        avatar.setAttribute('aria-hidden', 'true');
        avatar.textContent = isBot ? 'IA' : 'Tú';

        const bubble = document.createElement('div');
        bubble.className = 'ia-bubble';

        const paragraph = document.createElement('p');
        paragraph.textContent = text;

        bubble.appendChild(paragraph);
        msg.appendChild(avatar);
        msg.appendChild(bubble);
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

    async function send(text) {
        const trimmed = text.trim();
        if (!trimmed || isSending) return;

        isSending = true;
        switchToChat();
        appendMessage(trimmed, 'user');
        textarea.value = '';
        textarea.style.height = 'auto';
        sendBtn.disabled = true;

        showTyping();
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: trimmed })
            });
            const data = await response.json();

            hideTyping();
            if (!response.ok) {
                appendMessage(data.error || 'No se pudo generar la respuesta.', 'bot');
                return;
            }
            appendMessage(data.reply || 'No se recibio respuesta del modelo.', 'bot');
        } catch (error) {
            hideTyping();
            appendMessage('No se pudo conectar con el asistente de IA.', 'bot');
        } finally {
            isSending = false;
            sendBtn.disabled = textarea.value.trim() === '';
        }
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
