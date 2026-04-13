(function() {
    const style = document.createElement('style');
    style.innerHTML = `
        #cara-chatbot-container {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 350px;
            height: 500px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            z-index: 99999;
            transform: translateY(150%);
            transition: transform 0.3s ease-in-out;
        }
        #cara-chatbot-container.open {
            transform: translateY(0);
        }
        #cara-chatbot-header {
            background: #088178;
            color: #fff;
            padding: 15px;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #cara-chatbot-close {
            cursor: pointer;
            background: none;
            border: none;
            color: white;
            font-size: 20px;
        }
        #cara-chatbot-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            background: #f9f9f9;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .chat-msg {
            max-width: 80%;
            padding: 10px 14px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.4;
        }
        .chat-msg.user {
            align-self: flex-end;
            background: #e0f2f1;
            color: #004d40;
            border-bottom-right-radius: 2px;
        }
        .chat-msg.agent {
            align-self: flex-start;
            background: #e0e0e0;
            color: #333;
            border-bottom-left-radius: 2px;
        }
        .chat-meta {
            font-size: 10px;
            color: #888;
            margin-top: 4px;
            text-align: right;
        }
        .chat-copilot-bundle {
            font-size: 11px;
            background: #fff3cd;
            color: #856404;
            padding: 8px;
            border-radius: 8px;
            margin-top: 4px;
            border: 1px solid #ffeeba;
        }
        #cara-chatbot-input-area {
            display: flex;
            padding: 10px;
            background: #fff;
            border-top: 1px solid #eee;
        }
        #cara-chatbot-input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 20px;
            outline: none;
            font-size: 14px;
        }
        #cara-chatbot-send {
            background: #088178;
            color: #fff;
            border: none;
            padding: 0 15px;
            margin-left: 10px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
        }
        #cara-chatbot-launcher {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: #088178;
            color: #fff;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            z-index: 99998;
            transition: transform 0.2s;
        }
        #cara-chatbot-launcher:hover {
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);

    const launcher = document.createElement('div');
    launcher.id = 'cara-chatbot-launcher';
    launcher.innerHTML = '<i class="bi bi-chat-dots-fill"></i>';
    document.body.appendChild(launcher);

    const container = document.createElement('div');
    container.id = 'cara-chatbot-container';
    container.innerHTML = `
        <div id="cara-chatbot-header">
            <span>Cara Support AI</span>
            <button id="cara-chatbot-close">&times;</button>
        </div>
        <div id="cara-chatbot-messages">
            <div class="chat-msg agent">Hello! I'm your Cara Enterprise Support Agent. How can I help you today?</div>
        </div>
        <div id="cara-chatbot-input-area">
            <input type="text" id="cara-chatbot-input" placeholder="Type your issue..." />
            <button id="cara-chatbot-send"><i class="bi bi-send-fill"></i></button>
        </div>
    `;
    document.body.appendChild(container);

    const messagesDiv = document.getElementById('cara-chatbot-messages');
    const input = document.getElementById('cara-chatbot-input');
    const sendBtn = document.getElementById('cara-chatbot-send');
    const closeBtn = document.getElementById('cara-chatbot-close');

    launcher.addEventListener('click', () => {
        container.classList.add('open');
        launcher.style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
        container.classList.remove('open');
        setTimeout(() => { launcher.style.display = 'flex'; }, 300);
    });

    function appendMessage(sender, text, data = null) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}`;
        
        // Convert Markdown to simple HTML if any (bold, newlines)
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
        msgDiv.innerHTML = formattedText;
        
        if (data && data.triage) {
            let metaHtml = `<div class="chat-meta">Intent: ${data.triage.intent} | Conf: ${data.decision_block.decision === 'AUTO_RESOLVE' ? data.decision_block.confidence_score + '%' : 'Escalated'}</div>`;
            
            if (data.copilot_bundle) {
                metaHtml += `
                <div class="chat-copilot-bundle">
                    <strong>HITL Mode:</strong> ${data.copilot_bundle.summary}<br>
                    Sentiment: ${data.triage.sentiment}
                </div>`;
            }
            msgDiv.innerHTML += metaHtml;
        }

        messagesDiv.appendChild(msgDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    async function sendMessage() {
        const text = input.value.trim();
        if (!text) return;

        appendMessage('user', text);
        input.value = '';
        input.disabled = true;
        sendBtn.disabled = true;

        try {
            const res = await fetch('http://localhost:8000/api/tickets/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text, urgency: "Medium" })
            });
            const data = await res.json();
            
            if (data.response) {
                appendMessage('agent', data.response, data);
            } else {
                appendMessage('agent', "Sorry, I couldn't process this right now.");
            }
        } catch (error) {
            console.error("Chatbot API Error:", error);
            const fallbackData = {
                triage: { intent: "General Inquiry", urgency: "Medium", sentiment: "Neutral" },
                decision_block: { confidence_score: 90, decision: "AUTO_RESOLVE" },
                response: "The support server seems offline, but I'm here. Can you contact us via email?",
                explainability: { reasoning_trace: "No server connection made.", data_sources_used: [] }
            };
            appendMessage('agent', fallbackData.response, fallbackData);
        }

        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

})();
