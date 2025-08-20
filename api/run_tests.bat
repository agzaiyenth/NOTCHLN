@echo off
echo Running API tests...

:: Activate virtual environment
call venv\Scripts\activate

:: Run the tests
python test_api.py

pause
