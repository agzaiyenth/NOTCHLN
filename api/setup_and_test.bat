@echo off
echo Service Completion Time Prediction API - Setup and Test

:: Check if Python is installed
echo Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH. Please install Python and try again.
    exit /b 1
)

:: Create and activate virtual environment if it doesn't exist
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate

:: Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

:: Check for model file and create if needed
echo Checking model file...
if not exist "..\Model\Tast1\model.pkl" (
    echo Model file not found. Exporting model from notebook...
    python export_model.py
)

:: Test the model directly
echo Testing the model directly...
python test_model.py

echo.
echo Testing the standalone predictor...
python test_standalone.py

echo.
echo Running comprehensive demonstration...
python demo.py

echo.
echo If all tests passed, you can now start the API server.
echo To start the API server, run: run_api.bat
echo.

pause
