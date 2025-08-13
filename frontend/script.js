class JarvisAssistant {
    constructor() {
        this.isRecording = false;
        this.recognition = null;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeSpeechRecognition();
        this.playWelcomeSound();
    }

    initializeElements() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.recordBtn = document.getElementById('recordBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.contextSelect = document.getElementById('contextSelect');
        this.statusText = document.getElementById('statusText');
        this.voiceIndicator = document.getElementById('jarvisVoiceIndicator');
    }

    initializeEventListeners() {
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        this.recordBtn.addEventListener('click', () => this.startRecording());
        this.stopBtn.addEventListener('click', () => this.stopRecording());
        
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.messageInput.value = transcript;
                this.updateVoiceIndicator('');
                this.sendMessage();
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.updateVoiceIndicator('');
                this.resetRecordingButtons();
            };

            this.recognition.onend = () => {
                this.updateVoiceIndicator('');
                this.resetRecordingButtons();
            };
        }
    }

    playWelcomeSound() {
        if (window.AudioContext || window.webkitAudioContext) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(660, audioContext.currentTime + 0.3);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.showTypingIndicator();

        try {
            const context = this.contextSelect.value;
            const response = await this.callAPI('/api/chat', {
                message: message,
                context: context
            });

            this.hideTypingIndicator();
            this.addMessage(response.response, 'jarvis');
            this.speak(response.response);

        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'jarvis');
            console.error('Error:', error);
        }
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        
        if (sender === 'jarvis') {
            messageContent.innerHTML = `<strong>Jarvis:</strong> ${this.formatMessage(content)}`;
        } else {
            messageContent.innerHTML = `<strong>You:</strong> ${content}`;
        }
        
        messageDiv.appendChild(messageContent);
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    formatMessage(content) {
        content = content.replace(/\n/g, '<br>');
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
        content = content.replace(/(\d+\.\s)/g, '<br>$1');
        return content;
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'jarvis-message');
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    <strong>Jarvis is thinking</strong>
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(typingDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    startRecording() {
        if (this.recognition) {
            this.recognition.start();
            this.recordBtn.style.display = 'none';
            this.stopBtn.style.display = 'block';
            this.recordBtn.classList.add('recording');
            this.updateVoiceIndicator('listening');
            this.updateStatus('Listening...');
        }
    }

    stopRecording() {
        if (this.recognition) {
            this.recognition.stop();
            this.updateVoiceIndicator('');
            this.resetRecordingButtons();
            this.updateStatus('Ready');
        }
    }

    resetRecordingButtons() {
        this.recordBtn.style.display = 'block';
        this.stopBtn.style.display = 'none';
        this.recordBtn.classList.remove('recording');
    }

    updateVoiceIndicator(state) {
        if (!this.voiceIndicator) return;
        
        this.voiceIndicator.classList.remove('listening', 'speaking');
        
        if (state === 'listening') {
            this.voiceIndicator.classList.add('listening');
        } else if (state === 'speaking') {
            this.voiceIndicator.classList.add('speaking');
        }
    }

    speak(text) {
        if ('speechSynthesis' in window) {
            this.updateVoiceIndicator('speaking');
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            
            utterance.onend = () => {
                this.updateVoiceIndicator('');
            };
            
            utterance.onerror = () => {
                this.updateVoiceIndicator('');
            };
            
            const voices = speechSynthesis.getVoices();
            const preferredVoice = voices.find(voice => 
                voice.name.includes('Google') || 
                voice.name.includes('Microsoft') ||
                voice.lang.includes('en-US')
            );
            
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }
            
            speechSynthesis.speak(utterance);
        }
    }

    handleQuickAction(action) {
        const actions = {
            'test': 'I want to take a test. Please create a test for me.',
            'revision': 'Help me with revision. What topics should I focus on?',
            'doubt': 'I have a doubt. Can you help me understand a concept?',
            'practice': 'Give me some practice questions to solve.'
        };
        
        if (actions[action]) {
            this.messageInput.value = actions[action];
            this.sendMessage();
        }
    }

    async callAPI(endpoint, data) {
        const response = await fetch(`http://localhost:5000${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    }

    updateStatus(status) {
        if (this.statusText) {
            this.statusText.textContent = status;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.jarvis = new JarvisAssistant();
    
    if ('speechSynthesis' in window) {
        speechSynthesis.getVoices();
        speechSynthesis.addEventListener('voiceschanged', () => {
            speechSynthesis.getVoices();
        });
    }
});
