' QB64PE Graphics Demo - Demonstrates the "hanging" execution issue
' This program will open a graphics window and wait indefinitely for user interaction
' LLMs should NOT wait forever for this program to complete!

DIM x AS INTEGER
DIM y AS INTEGER
DIM color AS _UNSIGNED LONG
DIM click_count AS INTEGER

' Set up graphics screen
SCREEN _NEWIMAGE(800, 600, 32)
_TITLE "QB64PE Graphics Demo - Click to Continue"

click_count = 0

' Main drawing routine
SUB DrawScene
    ' Clear screen with blue background
    CLS , _RGB32(0, 100, 200)
    
    ' Draw some colorful circles
    FOR x = 100 TO 700 STEP 100
        FOR y = 100 TO 500 STEP 100
            color = _RGB32(RND * 255, RND * 255, RND * 255)
            CIRCLE (x, y), 30, color
            PAINT (x, y), color
        NEXT y
    NEXT x
    
    ' Add instructions
    COLOR _RGB32(255, 255, 255)
    _PRINTSTRING (300, 50), "QB64PE Graphics Demo"
    _PRINTSTRING (200, 520), "Click anywhere to change colors"
    _PRINTSTRING (250, 540), "Press ESC to exit"
    _PRINTSTRING (300, 560), "Clicks: " + STR$(click_count)
END SUB

' Initial draw
CALL DrawScene

' Main event loop - THIS IS WHERE LLMs WILL HANG!
' The program waits indefinitely for user interaction
DO
    ' Process mouse input
    WHILE _MOUSEINPUT
        IF _MOUSEBUTTON(1) THEN
            click_count = click_count + 1
            CALL DrawScene
            _DELAY 0.2 ' Brief pause to prevent multiple clicks
        END IF
    WEND
    
    ' Check for ESC key to exit
    IF _KEYHIT = 27 THEN EXIT DO
    
    _LIMIT 60 ' Limit to 60 FPS to prevent high CPU usage
LOOP

' This code will only execute if user presses ESC
PRINT "Graphics demo ended by user"
SYSTEM
