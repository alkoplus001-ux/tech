@echo off
echo Seeding demo data in MongoDB...
curl -X POST http://localhost:5000/api/seed
echo.
echo Done! Refresh your browser.
pause
