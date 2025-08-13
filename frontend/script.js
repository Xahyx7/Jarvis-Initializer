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

        // Simulate processing delay
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.getSmartResponse(message, this.contextSelect.value);
            this.addMessage(response, 'jarvis');
            this.speak(response);
        }, 1000 + Math.random() * 2000);
    }

    getSmartResponse(message, context) {
        const msg = message.toLowerCase();
        
        // Math responses
        if (context === 'math' || msg.includes('math') || msg.includes('equation') || msg.includes('solve')) {
            if (msg.includes('quadratic')) return "To solve quadratic equations, use the formula: x = (-b ± √(b² - 4ac)) / 2a. For example, for x² - 5x + 6 = 0: a=1, b=-5, c=6. Solutions are x = 2 and x = 3.";
            if (msg.includes('triangle')) return "For triangles, remember: Area = ½ × base × height. For right triangles, use Pythagoras theorem: a² + b² = c². Similar triangles have proportional sides.";
            if (msg.includes('algebra')) return "In algebra, always isolate the variable. For linear equations like 2x + 3 = 7, subtract 3 from both sides: 2x = 4, then divide by 2: x = 2.";
            return "I can help with mathematics! Try asking about specific topics like quadratic equations, triangles, algebra, geometry, or trigonometry. What math concept would you like to understand?";
        }
        
        // Science responses
        if (context === 'science' || msg.includes('physics') || msg.includes('chemistry') || msg.includes('biology')) {
            if (msg.includes('newton')) return "Newton's Laws: 1st Law - Objects at rest stay at rest unless acted upon by force. 2nd Law - F = ma (Force = mass × acceleration). 3rd Law - Every action has equal and opposite reaction.";
            if (msg.includes('photosynthesis')) return "Photosynthesis: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Plants convert carbon dioxide and water into glucose using sunlight in chloroplasts.";
            if (msg.includes('periodic')) return "Periodic table is organized by atomic number. Groups have similar properties. Periods show electron shells. Remember trends: atomic radius decreases across periods, increases down groups.";
            return "I'm here for science subjects! Ask about physics laws, chemistry reactions, biology processes, or any specific scientific concepts you're studying.";
        }
        
        // Test responses
        if (context === 'test' || msg.includes('test') || msg.includes('exam') || msg.includes('question')) {
            const tests = [
                "**Class 10 Math Mini Test:**\n1. Solve: 2x + 5 = 13\n2. Find HCF of 18 and 24\n3. If α, β are zeros of x² - 7x + 10, find α + β\n\nTry solving these and tell me your answers!",
                "**Physics Quick Quiz:**\n1. State Newton's first law\n2. What is the SI unit of force?\n3. Calculate force if mass = 5kg, acceleration = 2m/s²\n\nGive it a try!",
                "**Chemistry Test:**\n1. Write formula for water\n2. What is the atomic number of carbon?\n3. Balance: H₂ + O₂ → H₂O\n\nLet's see how you do!"
            ];
            return tests[Math.floor(Math.random() * tests.length)];
        }
        
        // Revision responses
        if (context === 'revision' || msg.includes('revision') || msg.includes('study') || msg.includes('prepare')) {
            return "**Revision Strategy:**\n📚 **Active Recall:** Test yourself without looking at notes\n📝 **Practice Papers:** Solve previous year questions daily\n⏰ **Spaced Repetition:** Review topics at intervals\n🎯 **Focus Areas:** Identify weak topics and practice more\n\nWhich subject would you like to revise? I can suggest specific topics and methods.";
        }
        
        // Greeting responses
        if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
            return "Hello! I'm Jarvis, your AI study assistant. I'm here to help you excel in your CBSE studies. I can assist with mathematics, science, test preparation, and revision strategies. What would you like to study today?";
        }
        
        // Default intelligent response
        return `I understand you're asking about "${message}". As your study assistant, I can help you with detailed explanations, step-by-step solutions, and practice questions. Please specify the subject (Math, Physics, Chemistry, Biology) or choose a context from the dropdown menu for more targeted assistance. What specific topic would you like to explore?`;
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
                    <strong>Jarvis is analyzing your question</strong>
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
            'test': 'Give me a practice test for Class 10 mathematics',
            'revision': 'Help me create a revision plan for my upcoming exams',
            'doubt': 'I have a doubt about quadratic equations. Can you explain?',
            'practice': 'Give me some practice questions for physics'
        };
        
        if (actions[action]) {
            this.messageInput.value = actions[action];
            this.sendMessage();
        }
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
