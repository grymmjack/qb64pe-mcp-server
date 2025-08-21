
' Test Program: Red Circle in Center of Screen
' This program is designed to test screenshot analysis capabilities

_TITLE "QB64PE Screenshot Test - Red Circle"

' Setup graphics screen
SCREEN _NEWIMAGE(800, 600, 32)
_DEST 0

' Clear to black background
CLS , _RGB32(0, 0, 0)

' Calculate center position
DIM centerX AS INTEGER, centerY AS INTEGER
centerX = _WIDTH / 2
centerY = _HEIGHT / 2

' Draw red circle in center
DIM red AS _UNSIGNED LONG
red = _RGB32(255, 0, 0) ' Pure red

' Draw filled red circle
CIRCLE (centerX, centerY), 100, red
PAINT (centerX, centerY), red

' Add some text for context
COLOR _RGB32(255, 255, 255) ' White text
_PRINTSTRING (centerX - 100, centerY - 150), "RED CIRCLE TEST"
_PRINTSTRING (centerX - 80, centerY + 120), "Screenshot Analysis"

' Display the graphics
_DISPLAY

' Take screenshot for analysis
DIM screenshotFile AS STRING
screenshotFile = "qb64pe-screenshots/red-circle-test.bmp"
_SAVEIMAGE screenshotFile

' Short pause to ensure screenshot is saved
_DELAY 1

' Take a second screenshot for comparison
screenshotFile = "qb64pe-screenshots/red-circle-test-final.bmp"
_SAVEIMAGE screenshotFile

' Wait briefly then exit automatically (for testing)
_DELAY 3
SYSTEM
