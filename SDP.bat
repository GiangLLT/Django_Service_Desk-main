@echo off
cd "C:\test\Django_Service_Desk-main"

git status

git fetch origin Dev
git merge origin/Dev

echo Done
pause