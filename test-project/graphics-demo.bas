' QB64PE Graphics Demo - Testing MCP Server Integration
' This program demonstrates basic QB64PE graphics and syntax

DIM x AS INTEGER
DIM y AS INTEGER
DIM color AS _UNSIGNED LONG

' Set up graphics screen
SCREEN _NEWIMAGE(800, 600, 32)
_TITLE "QB64PE Graphics Demo"

' Clear screen with black
CLS

' Draw some colorful circles
FOR x = 100 TO 700 STEP 100
    FOR y = 100 TO 500 STEP 100
        color = _RGB32(RND * 255, RND * 255, RND * 255)
        CIRCLE (x, y), 30, color
        PAINT (x, y), color
    NEXT y
NEXT x

' Add some text
COLOR _RGB32(255, 255, 255)
_PRINTSTRING (300, 50), "QB64PE Graphics Demo"
_PRINTSTRING (250, 550), "Press any key to continue..."

' Wait for keypress
SLEEP

' Demonstrate console output for debugging
$CONSOLE
PRINT "Debug: Graphics demo completed successfully"
PRINT "Debug: Screen resolution was 800x600"
PRINT "Debug: Drew"; (7 * 5); "circles total"

' Clean up
_FREEIMAGE _DEST
END
