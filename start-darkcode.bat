@echo off
chcp 65001 >nul
title DARK CODE AI - 로컬 실행기
echo ========================================================
echo   ⚡ DARK CODE AI v3.0 (Turbo Engine) - 로컬 실행기
echo ========================================================
echo.
echo  로컬 환경을 확인하고 다크코드를 실행합니다...
echo.

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo  [OK] Python 감지됨: 로컬 서버(http://localhost:8080)를 실행합니다.
    start "" http://localhost:8080/index.html?v=turbo
    python -m http.server 8080
    exit /b
)

where py >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo  [OK] Python(py) 감지됨: 로컬 서버(http://localhost:8080)를 실행합니다.
    start "" http://localhost:8080/index.html?v=turbo
    py -m http.server 8080
    exit /b
)

echo  [*] 브라우저로 index.html 을 직접 실행합니다.
start "" "%~dp0index.html"
exit /b
