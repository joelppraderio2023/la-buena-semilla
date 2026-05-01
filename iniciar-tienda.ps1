$host.UI.RawUI.WindowTitle = "La Buena Semilla - Servidor"
Clear-Host
Write-Host ""
Write-Host "  ===============================" -ForegroundColor Green
Write-Host "      La Buena Semilla" -ForegroundColor Green
Write-Host "      Verduleria y Fruteria" -ForegroundColor Green
Write-Host "  ===============================" -ForegroundColor Green
Write-Host ""
Write-Host "  Iniciando servidor..." -ForegroundColor Yellow

$dir = $PSScriptRoot
$nextScript = Join-Path $dir "node_modules\next\dist\bin\next"

Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"

Write-Host "  Servidor activo en: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "  IMPORTANTE: No cierres esta ventana!" -ForegroundColor Red
Write-Host "  Para detener el servidor presiona Ctrl+C" -ForegroundColor Gray
Write-Host ""

node $nextScript dev

Write-Host ""
Write-Host "  El servidor se detuvo." -ForegroundColor Yellow
Read-Host "  Presiona Enter para cerrar"
