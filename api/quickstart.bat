@echo off
echo ================================================================================
echo                   SERVICE COMPLETION TIME PREDICTION SYSTEM                     
echo                               QUICK START                                       
echo ================================================================================
echo.
echo This script will:
echo 1. Set up the Python virtual environment
echo 2. Install all required dependencies
echo 3. Test the model predictor
echo 4. Run a comprehensive demonstration
echo.
echo ================================================================================
echo.

:: Check if Python is installed
echo Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH. Please install Python and try again.
    goto :end
)

:: Create and activate virtual environment
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate

:: Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

:: Test the model predictor
echo.
echo Testing model predictor...
python test_standalone.py

:: Run the demo
echo.
echo Running comprehensive demonstration...
python demo.py

echo.
echo ================================================================================
echo.
echo Setup and demonstration complete!
echo.
echo To start the API server:
echo   - Run start_server.bat
echo.
echo To integrate with the frontend:
echo   - Use the lib/prediction-service.ts file in your Next.js components
echo.
echo For more details, see the ARCHITECTURE.md file in the api folder.
echo ================================================================================

:end
pause
