@echo off
title La Buena Semilla
color 0A
echo.
echo  Liberando puerto 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000 "') do taskkill /F /PID %%a >nul 2>&1
echo  Iniciando servidor...
echo  NO cierres esta ventana!
echo.
cd /d C:\VERDUNUEVA
node server.js
pause
