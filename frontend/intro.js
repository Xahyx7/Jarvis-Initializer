class JarvisIntro {
    constructor() {
        this.currentProgress = 0;
        this.bootupSequence = [
            { message: ">> Initializing Jarvis AI System...", delay: 500 },
            { message: ">> Loading Neural Networks...", delay: 800 },
            { message: ">> Calibrating Voice Recognition...", delay: 1000 },
            { message: ">> Establishing Database Connections...", delay: 700 },
            { message: ">> Loading NCERT Knowledge Base...", delay: 900 },
            { message: ">> Importing Previous Year Questions...", delay: 800 },
            { message: ">> Activating Natural Language Processing...", delay: 700 },
            { message: ">> System Diagnostics Complete...", delay: 600 },
            { message: ">> All Systems Online...", delay: 500 },
            { message: ">> JARVIS INITIALIZED SUCCESSFULLY", delay: 1000 }
        ];
        
        this.init();
    }

    init() {
        this.generateBootupAudio();
        setTimeout(() => {
            this.startBootupSequence();
        }, 1000);
    }

    generateBootupAudio() {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance("JARVIS INITIALIZED");
            utterance.rate = 0.7;
            utterance.pitch = 0.8;
            utterance.volume = 0.8;
            
            setTimeout(() => {
                speechSynthesis.speak(utterance);
            }, 3000);
        }

        this.createBootupSounds();
    }

    createBootupSounds() {
        if (window.AudioContext || window.webkitAudioContext) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            const playSound = (frequency, duration, delay) => {
                setTimeout(() => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                    oscillator.type = 'sawtooth';
                    
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
                    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + duration);
                }, delay);
            };

            playSound(200, 0.3, 100);
            playSound(400, 0.2, 400);
            playSound(600, 0.4, 700);
            playSound(300, 0.3, 1200);
        }
    }

    async startBootupSequence() {
        const statusText = document.getElementById('statusText');
        const progressFill = document.getElementById('progressFill');
        const percentageText = document.getElementById('percentageText');
        const logContainer = document.getElementById('logContainer');
        
        for (let i = 0; i < this.bootupSequence.length; i++) {
            const step = this.bootupSequence[i];
            
            this.addLogEntry(logContainer, step.message);
            
            const progress = ((i + 1) / this.bootupSequence.length) * 100;
            this.animateProgress(progressFill, percentageText, progress);
            
            if (i === 0) statusText.textContent = "INITIALIZING";
            if (i === 3) statusText.textContent = "LOADING DATABASES";
            if (i === 6) statusText.textContent = "ACTIVATING AI";
            if (i === 8) statusText.textContent = "SYSTEMS ONLINE";
            if (i === 9) statusText.textContent = "READY";
            
            await this.delay(step.delay);
        }
        
        setTimeout(() => {
            this.completeBootup();
        }, 1500);
    }

    addLogEntry(container, message) {
        const logEntry = document.createElement('div');
        logEntry.classList.add('log-entry');
        logEntry.textContent = message;
        container.appendChild(logEntry);
        
        container.scrollTop = container.scrollHeight;
        
        const entries = container.querySelectorAll('.log-entry');
        if (entries.length > 8) {
            entries[0].remove();
        }
    }

    animateProgress(progressFill, percentageText, targetProgress) {
        const currentProgress = this.currentProgress;
        const increment = (targetProgress - currentProgress) / 20;
        
        const animate = () => {
            this.currentProgress += increment;
            if (this.currentProgress >= targetProgress) {
                this.currentProgress = targetProgress;
            }
            
            progressFill.style.width = `${this.currentProgress}%`;
            percentageText.textContent = `${Math.round(this.currentProgress)}%`;
            
            if (this.currentProgress < targetProgress) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    completeBootup() {
        const container = document.querySelector('.intro-container');
        container.classList.add('bootup-complete');
        
        setTimeout(() => {
            window.location.href = 'main.html';
        }, 1000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (!window.jarvisIntroStarted) {
            window.jarvisIntroStarted = true;
            new JarvisIntro();
        }
    }, 500);
});
