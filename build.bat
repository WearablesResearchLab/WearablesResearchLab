@echo off
cls
echo =============================
echo   Wearables Blog Generator
echo =============================
echo.

REM Step 1: Create venv if it doesn't exist
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Step 2: Activate venv
call venv\Scripts\activate.bat

REM Step 3: Install dependencies
echo.
echo Installing dependencies (if needed)...
venv\Scripts\python.exe -m pip install --upgrade pip >nul
venv\Scripts\python.exe -m pip install markdown pyyaml beautifulsoup4 >nul

REM Step 4: Run build
echo.
echo Starting build process...
echo.

venv\Scripts\python.exe build.py
if errorlevel 1 (
    echo.
    echo =============================
    echo ⚠️  An error occurred during build.
    echo =============================
    goto end
)

REM Step 5: Git commit and push
echo.
echo Committing and pushing to GitHub...
git add .
git commit -m "Auto-build: update blog content"
git push origin main

if errorlevel 1 (
    echo.
    echo ⚠️  Git push failed. Check remote or authentication.
) else (
    echo.
    echo ✅ Pushed to GitHub!
)

:end
echo.
echo -----------------------------
echo ✅ Build complete!
echo 📂 Your posts are now in /public/
echo -----------------------------
echo.
pause
