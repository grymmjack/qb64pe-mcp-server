
@echo off
echo ================================================================================
echo QB64PE Graphics Screenshot Analysis Test
echo ================================================================================
echo.
echo This script will compile and run the red circle test program
echo.

echo Compiling QB64PE program...
qb64pe -c test-project\red-circle-screenshot-test.bas

if exist test-project\red-circle-screenshot-test.exe (
    echo ✓ Compilation successful
    echo.
    echo Running test program...
    echo Note: Program will auto-exit after 3 seconds
    echo.
    
    start /wait test-project\red-circle-screenshot-test.exe
    
    echo.
    echo Checking for screenshots...
    if exist qb64pe-screenshots\red-circle-test.bmp (
        echo ✓ Screenshot 1 found: qb64pe-screenshots\red-circle-test.bmp
    ) else (
        echo ✗ Screenshot 1 missing
    )
    
    if exist qb64pe-screenshots\red-circle-test-final.bmp (
        echo ✓ Screenshot 2 found: qb64pe-screenshots\red-circle-test-final.bmp
    ) else (
        echo ✗ Screenshot 2 missing
    )
    
    echo.
    echo Test complete! Check screenshots and analyze with LLM.
) else (
    echo ✗ Compilation failed
    echo Check QB64PE installation and path
)

echo.
echo Press any key to continue...
pause >nul
