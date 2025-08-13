from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
import pyttsx3
import os
from dotenv import load_dotenv
import threading

load_dotenv()

app = Flask(__name__, template_folder='../frontend', static_folder='../frontend')
CORS(app)

from data.ncert_data import NCERTData
from data.cbse_pyq import CBSEPaper
from data.books_data import BooksData

class JarvisAI:
    def __init__(self):
        try:
            self.tts_engine = pyttsx3.init()
            self.tts_engine.setProperty('rate', 150)
            self.tts_engine.setProperty('volume', 0.8)
        except:
            self.tts_engine = None
        
        self.ncert_data = NCERTData()
        self.cbse_pyq = CBSEPaper()
        self.books_data = BooksData()
        self.conversation_history = []

    def get_ai_response(self, user_input, context="general"):
        return self.get_fallback_response(user_input, context)

    def get_fallback_response(self, user_input, context):
        fallback_responses = {
            "math": "I can help you with mathematics! Ask about algebra, geometry, calculus, or specific NCERT chapters. Example: 'Explain quadratic equations' or 'Help with Class 10 triangles'.",
            "science": "I'm here for science subjects! Ask about physics, chemistry, or biology concepts. Example: 'Explain photosynthesis' or 'What is Newton's first law?'",
            "test": "I can create tests for you! Specify subject and class. Example: 'Create Class 10 math test' or 'Give me physics questions for Class 12'.",
            "revision": "Let me help with revision! Tell me the subject and topics. Example: 'Help me revise Class 10 science' or 'Important chemistry topics'.",
            "general": f"Hello! I'm Jarvis, your AI study assistant. I can help with NCERT concepts, previous year questions, and tests. Your question: '{user_input}' - Please specify the subject for detailed help."
        }
        return fallback_responses.get(context, fallback_responses["general"])

jarvis = JarvisAI()

@app.route('/')
def index():
    return app.send_static_file('intro.html')

@app.route('/intro.html')
def intro():
    return app.send_static_file('intro.html')

@app.route('/index.html')
def main_app():
    return app.send_static_file('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        context = data.get('context', 'general')
        
        response = jarvis.get_ai_response(user_message, context)
        
        return jsonify({
            'response': response,
            'status': 'success'
        })
    
    except Exception as e:
        return jsonify({
            'response': f'Sorry, I encountered an error: {str(e)}',
            'status': 'error'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
