import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'jarvis-secret-key-2024'
    DEBUG = True
    UPLOAD_FOLDER = 'static/temp'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
