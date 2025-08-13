@echo off
pip install -r requirements.txt
mkdir backend\static\temp 2>nul
echo Setup complete! Run: python backend/app.py
pause
