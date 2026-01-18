' Mixed Graphics/Console Demo - Shows both visual and monitorable output
' This demonstrates how to make graphics programs more monitorable

$CONSOLE

' Enhanced console setup
_DEST _CONSOLE
COLOR 15, 1
PRINT STRING$(60, "=")
PRINT "  MIXED GRAPHICS/CONSOLE DEMO"
PRINT "  Monitor this console for progress updates"
PRINT STRING$(60, "=")
COLOR 7, 0
_DEST 0

' Set up graphics
SCREEN _NEWIMAGE(800, 600, 32)
_TITLE "Mixed Demo - Check Console for Progress"

DIM frame AS INTEGER
DIM max_frames AS INTEGER
max_frames = 100

' Log to console
_DEST _CONSOLE
COLOR 14, 0
PRINT "[INFO] Graphics window created: 800x600"
PRINT "[INFO] Starting animation sequence..."
COLOR 7, 0
_DEST 0

' Animation loop with console monitoring
FOR frame = 1 TO max_frames
    ' Clear and draw
    CLS , _RGB32(0, 0, 50)
    
    ' Draw animated circle
    x = 400 + 200 * COS(frame * 0.1)
    y = 300 + 100 * SIN(frame * 0.1)
    CIRCLE (x, y), 20, _RGB32(255, frame * 2, 255 - frame * 2)
    PAINT (x, y), _RGB32(255, frame * 2, 255 - frame * 2)
    
    ' Add frame counter
    COLOR _RGB32(255, 255, 255)
    _PRINTSTRING (10, 10), "Frame: " + STR$(frame) + "/" + STR$(max_frames)
    _PRINTSTRING (10, 30), "Check console for progress"
    
    ' Log progress to console every 10 frames
    IF frame MOD 10 = 0 THEN
        _DEST _CONSOLE
        COLOR 11, 0
        progress = INT((frame / max_frames) * 100)
        PRINT "[PROGRESS] Animation " + STR$(progress) + "% complete (frame " + STR$(frame) + ")"
        COLOR 7, 0
        _DEST 0
    END IF
    
    _DISPLAY
    _LIMIT 30 ' 30 FPS
    
    ' Allow early exit with ESC
    IF _KEYHIT = 27 THEN
        _DEST _CONSOLE
        COLOR 12, 0
        PRINT "[WARNING] Animation interrupted by user (ESC pressed)"
        COLOR 7, 0
        _DEST 0
        EXIT FOR
    END IF
NEXT frame

' Animation complete - log to console
_DEST _CONSOLE
COLOR 10, 0
PRINT "[SUCCESS] Animation sequence completed!"
PRINT "[INFO] Total frames rendered: " + STR$(frame - 1)
COLOR 7, 0

' Show final graphics screen
_DEST 0
CLS , _RGB32(0, 100, 0)
COLOR _RGB32(255, 255, 255)
_PRINTSTRING (300, 280), "Animation Complete!"
_PRINTSTRING (200, 320), "Check console for final status"

' Wait with timeout simulation
_DEST _CONSOLE
PRINT "[INFO] Showing final screen for 3 seconds..."
COLOR 7, 0
_DEST 0

_DELAY 3

' Clean completion
_DEST _CONSOLE
COLOR 15, 0
PRINT STRING$(60, "=")
PRINT "MIXED DEMO COMPLETED SUCCESSFULLY"
PRINT "Graphics and console monitoring demonstrated"
PRINT "Program finished - no user interaction required"
PRINT STRING$(60, "=")
COLOR 7, 0
_DEST 0

SYSTEM
