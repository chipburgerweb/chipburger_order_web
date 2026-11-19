@echo off
title Chip Burger Web Server (Node.js)
color 0E
echo ====================================================
echo        CHIP BURGER (@chipburger_id) NODE.JS SERVER
echo ====================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [PERINGATAN] Node.js belum terdeteksi di sistem PATH komputer Anda.
    echo Silakan download dan install Node.js dari: https://nodejs.org/
    echo Setelah install, jalankan file ini kembali.
    echo.
    echo Membuka index.html langsung di browser...
    start index.html
    pause
    exit /b
)

echo [1/2] Memeriksa modul Node.js...
if not exist node_modules (
    echo Menginstall dependensi (express, cors)...
    call npm install
)

echo [2/2] Menjalankan Chip Burger Web Server di http://localhost:3000 ...
echo.
start http://localhost:3000
node server.js
pause
