@echo off
echo Service Completion Time Prediction API - Starting Server

:: Check if Python is installed
echo Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH. Please install Python and try again.
    exit /b 1
)

:: Activate virtual environment
call venv\Scripts\activate

:: Run the Flask app
echo Starting the Flask API server...
python -m flask --app app run --host=0.0.0.0 --port=5000

pause
