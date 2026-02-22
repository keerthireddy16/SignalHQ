# VC Scout Clean Start Utility
# Use this script to start the development server without port or lock conflicts.

Write-Host "--- Clearing Zombie Processes ---" -ForegroundColor Cyan
# Kill any node process holding port 3000
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    Write-Host "Killing process on port 3000..."
    Stop-Process -Id $port3000.OwningProcess -Force -ErrorAction SilentlyContinue
}

# Kill any node process holding port 3001
$port3001 = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($port3001) {
    Write-Host "Killing process on port 3001..."
    Stop-Process -Id $port3001.OwningProcess -Force -ErrorAction SilentlyContinue
}

# General node cleanup
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

Write-Host "--- Resetting Lock Files ---" -ForegroundColor Cyan
if (Test-Path ".next\dev\lock") {
    Remove-Item ".next\dev\lock" -Force -ErrorAction SilentlyContinue
}

Write-Host "--- Starting Dev Server ---" -ForegroundColor Green
npm run dev
