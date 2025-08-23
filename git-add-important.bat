@echo off
echo Git Helper - Add Important Files Only
echo =======================================

echo.
echo This script will help you add only the important files to Git,
echo excluding large model files, virtual environments, and other
echo files that shouldn't be committed.
echo.

echo Adding modified files in the root directory...
git add .gitignore .gitattributes README.md GIT_MANAGEMENT.md

echo.
echo Adding important files from the API directory...
git add api/app.py api/model_predictor.py api/test_api.py api/test_standalone.py api/test_model.py
git add api/requirements.txt api/ARCHITECTURE.md
git add api/*.bat

echo.
echo Adding frontend code changes...
git add app/prediction-test/page.tsx
git add app/services/\[id\]/page.tsx
git add app/services/page.tsx
git add components/service-time-prediction.tsx
git add lib/prediction-service.ts

echo.
echo Checking Git status...
git status

echo.
echo Ready for commit. If everything looks good, run:
echo git commit -m "Add prediction service and API"
echo.

pause
