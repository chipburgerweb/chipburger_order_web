@echo off
title Push Chip Burger ke GitHub
color 0A
echo =======================================================
echo     PUSH REPOSITORY CHIP BURGER KE GITHUB
echo =======================================================
echo.
echo URL Remote: https://github.com/chipburgerweb/chipburger_order_web.git
echo Branch    : main
echo.
echo Sedang melakukan push...
echo (Jika muncul jendela popup GitHub / permintaan login, silakan login ke akun GitHub Anda)
echo.

"D:\Git\cmd\git.exe" push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo =======================================================
    echo   BERHASIL! Repository telah ter-upload ke GitHub!
    echo =======================================================
) else (
    echo.
    echo [INFO] Jika gagal autentikasi:
    echo Gunakan GitHub Personal Access Token (PAT) sebagai password saat diminta.
)

echo.
pause
