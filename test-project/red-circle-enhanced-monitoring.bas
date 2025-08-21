
' ============================================================================
' QB64PE Execution Monitoring Template
' Auto-generated monitoring wrapper for better execution visibility
' ============================================================================

$CONSOLE ' Enable console for logging output

' Monitoring variables
DIM LogFile AS STRING
DIM ScreenshotCounter AS INTEGER
DIM StartTime AS DOUBLE

' Initialize monitoring
LogFile = "C:/Users/grymmjack/git/qb64pe-mcp-server/qb64pe-logs/execution_2025-08-21T09-57-11-597Z.log"
ScreenshotCounter = 0
StartTime = TIMER

' Log program start
OPEN LogFile FOR APPEND AS #99
PRINT #99, "=== QB64PE Program Started at " + DATE$ + " " + TIME$ + " ==="
PRINT #99, "Platform: " + _OS$
PRINT #99, "Screen Mode: " + STR$(_WIDTH) + "x" + STR$(_HEIGHT)
CLOSE #99

' Console output formatting
_DEST _CONSOLE
COLOR 15, 1 ' White on blue for headers
PRINT STRING$(60, "=")
PRINT "  QB64PE PROGRAM EXECUTION MONITOR"
PRINT "  Started: " + DATE$ + " " + TIME$
PRINT "  Log: execution_2025-08-21T09-57-11-597Z.log"
PRINT STRING$(60, "=")
COLOR 7, 0 ' Reset to normal

' Monitoring SUBs
SUB LogMessage (msg AS STRING)
    OPEN LogFile FOR APPEND AS #99
    PRINT #99, TIME$ + " - " + msg
    CLOSE #99
    
    ' Also print to console with formatting
    _DEST _CONSOLE
    COLOR 14, 0 ' Yellow text
    PRINT "[LOG] " + TIME$ + " - " + msg
    COLOR 7, 0 ' Reset
    _DEST 0
END SUB

SUB TakeScreenshot
    IF _DEST <> _CONSOLE THEN ' Only if graphics mode
        ScreenshotCounter = ScreenshotCounter + 1
        DIM filename AS STRING
        filename = "C:/Users/grymmjack/git/qb64pe-mcp-server/qb64pe-screenshots/screenshot_2025-08-21T09-57-11-597Z_" + RIGHT$("000" + LTRIM$(STR$(ScreenshotCounter)), 3) + ".bmp"
        _SAVEIMAGE filename
        CALL LogMessage("Screenshot saved: " + filename)
    END IF
END SUB

SUB MonitoringCleanup
    DIM ElapsedTime AS DOUBLE
    ElapsedTime = TIMER - StartTime
    CALL LogMessage("Program completed. Runtime: " + STR$(ElapsedTime) + " seconds")
    
    _DEST _CONSOLE
    COLOR 10, 0 ' Green
    PRINT STRING$(60, "-")
    PRINT "EXECUTION COMPLETED - Runtime: " + STR$(ElapsedTime) + "s"
    PRINT "Check log file: execution_2025-08-21T09-57-11-597Z.log"
    IF ScreenshotCounter > 0 THEN
        PRINT "Screenshots taken: " + STR$(ScreenshotCounter)
    END IF
    PRINT STRING$(60, "-")
    COLOR 7, 0
END SUB

' ============================================================================
' ORIGINAL PROGRAM CODE BEGINS HERE
' ============================================================================

CALL LogMessage("Starting original program code")


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


' ============================================================================
' MONITORING CLEANUP
' ============================================================================

CALL LogMessage("Original program code completed")
CALL MonitoringCleanup

' Final screenshot if graphics were used
CALL TakeScreenshot

PRINT "Press any key to exit..."
SLEEP
SYSTEM
