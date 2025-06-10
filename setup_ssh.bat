@echo off
SETLOCAL ENABLEEXTENSIONS

echo ==============================
echo   GitHub SSH Setup Script
echo ==============================

:: Set variables
SET KEY_PATH=%USERPROFILE%\.ssh\id_ed25519
SET PUB_KEY=%KEY_PATH%.pub

:: Create .ssh folder if missing
IF NOT EXIST "%USERPROFILE%\.ssh" (
    echo Creating .ssh directory...
    mkdir "%USERPROFILE%\.ssh"
)

:: Generate SSH key if missing
IF NOT EXIST "%KEY_PATH%" (
    echo Generating new SSH key...
    ssh-keygen -t ed25519 -C "%USERNAME%@%COMPUTERNAME%" -f "%KEY_PATH%" -N ""
) ELSE (
    echo SSH key already exists at %KEY_PATH%
)

:: Start SSH agent and add key
echo Starting ssh-agent and adding key...
call ssh-agent > nul
ssh-add "%KEY_PATH%"

:: Copy public key to clipboard
echo Copying public key to clipboard...
type "%PUB_KEY%" | clip

:: Open GitHub SSH keys page
echo Opening GitHub SSH key settings in browser...
start https://github.com/settings/ssh/new

:: Test GitHub SSH connection
echo.
echo Testing SSH connection to GitHub...
ssh -T git@github.com

echo.
echo Done! You can now use Git with SSH.
pause
