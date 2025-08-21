
' Test Program: Red Circle in Center of Screen
' This program is designed to test screenshot analysis capabilities

$CONSOLE ' Enable console for monitoring
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

' Console output for monitoring
_DEST _CONSOLE
PRINT "Starting red circle rendering test..."
PRINT "Screen size: " + STR$(_WIDTH) + "x" + STR$(_HEIGHT)
PRINT "Center position: (" + STR$(centerX) + ", " + STR$(centerY) + ")"
PRINT "Drawing red circle with radius 100..."

' Switch back to graphics
_DEST 0

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

' Console confirmation
_DEST _CONSOLE
PRINT "Red circle rendered successfully!"
PRINT "Screenshot saved to: " + screenshotFile
PRINT "Circle details:"
PRINT "  - Color: RGB(255, 0, 0) - Pure Red"
PRINT "  - Position: Center (" + STR$(centerX) + ", " + STR$(centerY) + ")"
PRINT "  - Radius: 100 pixels"
PRINT "  - Fill: Solid"
PRINT "Analysis ready for LLM processing..."

' Short pause to ensure screenshot is saved
_DELAY 1

' Take a second screenshot for comparison
screenshotFile = "qb64pe-screenshots/red-circle-test-final.bmp"
_SAVEIMAGE screenshotFile
PRINT "Final screenshot saved: " + screenshotFile

' Console completion signal
PRINT "Program completed successfully."
PRINT "Screenshots are ready for analysis."
PRINT "Press any key to exit..."

' Wait briefly then exit automatically (for testing)
_DELAY 3
PRINT "Auto-exiting after 3 seconds for test automation."
SYSTEM
