' ============================================================================
' QB64PE Enhanced Debugging Template
' Auto-generated example showing all debugging enhancements
' ============================================================================

$CONSOLE ' Enable console for logging output

' === DEBUGGING ENHANCEMENT: Console Management ===
$IF WIN THEN
_CONSOLE ON
$END IF

CONST DEBUG_MODE = 1
CONST AUTO_TEST_DELAY = 3

SUB DebugPause (message AS STRING)
    IF DEBUG_MODE = 1 THEN
        PRINT message + " (auto-continuing in " + STR$(AUTO_TEST_DELAY) + "s...)"
        _DELAY AUTO_TEST_DELAY
    ELSE
        PRINT message
        SLEEP
    END IF
END SUB

SUB DebugExit (message AS STRING)
    PRINT message
    IF DEBUG_MODE = 1 THEN
        PRINT "Auto-exiting in " + STR$(AUTO_TEST_DELAY) + " seconds..."
        _DELAY AUTO_TEST_DELAY
    ELSE
        PRINT "Press any key to exit..."
        SLEEP
    END IF
    SYSTEM
END SUB

' === DEBUGGING ENHANCEMENT: Resource Management ===
DIM SHARED ResourceManager_FileHandles(100) AS INTEGER
DIM SHARED ResourceManager_ImageHandles(100) AS LONG
DIM SHARED ResourceManager_FileCount AS INTEGER
DIM SHARED ResourceManager_ImageCount AS INTEGER

SUB ResourceManager_Init
    ResourceManager_FileCount = 0
    ResourceManager_ImageCount = 0
END SUB

FUNCTION ResourceManager_GetFileHandle%
    DIM handle AS INTEGER
    handle = FREEFILE
    IF ResourceManager_FileCount < 100 THEN
        ResourceManager_FileHandles(ResourceManager_FileCount) = handle
        ResourceManager_FileCount = ResourceManager_FileCount + 1
    END IF
    ResourceManager_GetFileHandle% = handle
END FUNCTION

SUB ResourceManager_RegisterImage (handle AS LONG)
    IF ResourceManager_ImageCount < 100 THEN
        ResourceManager_ImageHandles(ResourceManager_ImageCount) = handle
        ResourceManager_ImageCount = ResourceManager_ImageCount + 1
    END IF
END SUB

SUB ResourceManager_Cleanup
    DIM i AS INTEGER
    ' Close any open file handles
    FOR i = 0 TO ResourceManager_FileCount - 1
        IF ResourceManager_FileHandles(i) > 0 THEN
            CLOSE #ResourceManager_FileHandles(i)
        END IF
    NEXT i
    ' Free any image handles
    FOR i = 0 TO ResourceManager_ImageCount - 1
        IF ResourceManager_ImageHandles(i) > 0 THEN
            _FREEIMAGE ResourceManager_ImageHandles(i)
        END IF
    NEXT i
    PRINT "Resource cleanup completed"
END SUB

CALL ResourceManager_Init

' === DEBUGGING ENHANCEMENT: Graphics Context Management ===
DIM SHARED GraphicsManager_CurrentDest AS LONG
DIM SHARED GraphicsManager_StackPointer AS INTEGER
DIM SHARED GraphicsManager_DestStack(10) AS LONG

SUB GraphicsManager_Init
    GraphicsManager_CurrentDest = 0
    GraphicsManager_StackPointer = 0
END SUB

FUNCTION GraphicsManager_CreateImage& (width AS INTEGER, height AS INTEGER)
    DIM img AS LONG
    img = _NEWIMAGE(width, height, 32)
    IF img > 0 THEN
        CALL ResourceManager_RegisterImage(img)
        PRINT "Created image handle: " + STR$(img) + " (" + STR$(width) + "x" + STR$(height) + ")"
    ELSE
        PRINT "ERROR: Failed to create image (" + STR$(width) + "x" + STR$(height) + ")"
    END IF
    GraphicsManager_CreateImage& = img
END FUNCTION

SUB GraphicsManager_SafePSET (x AS INTEGER, y AS INTEGER, clr AS LONG)
    IF x >= 0 AND y >= 0 AND x < _WIDTH AND y < _HEIGHT THEN
        PSET (x, y), clr
    END IF
END SUB

CALL GraphicsManager_Init

' === DEBUGGING ENHANCEMENT: Logging System ===
DIM SHARED LogFile AS STRING
DIM SHARED LogEnabled AS INTEGER

SUB LogInit
    LogFile = "qb64pe-logs/debug_" + DATE$ + "_" + TIME$ + ".log"
    LogEnabled = 1
    IF LogEnabled THEN
        OPEN LogFile FOR OUTPUT AS #98
        PRINT #98, "=== QB64PE DEBUG SESSION STARTED ==="
        PRINT #98, "Date: " + DATE$ + " Time: " + TIME$
        PRINT #98, "Platform: " + _OS$
        PRINT #98, "======================================="
        CLOSE #98
    END IF
END SUB

SUB LogMessage (category AS STRING, message AS STRING)
    IF LogEnabled THEN
        OPEN LogFile FOR APPEND AS #98
        PRINT #98, TIME$ + " [" + category + "] " + message
        CLOSE #98
    END IF
    
    ' Also print to console with color coding
    DIM oldDest AS LONG
    oldDest = _DEST
    _DEST _CONSOLE
    
    SELECT CASE UCASE$(category)
        CASE "ERROR"
            COLOR 12, 0
        CASE "WARNING"
            COLOR 14, 0
        CASE "SUCCESS"
            COLOR 10, 0
        CASE "INFO"
            COLOR 11, 0
        CASE ELSE
            COLOR 7, 0
    END SELECT
    
    PRINT "[" + category + "] " + message
    COLOR 7, 0
    _DEST oldDest
END SUB

CALL LogInit

' === DEBUGGING ENHANCEMENT: Screenshot System ===
DIM SHARED ScreenshotCounter AS INTEGER
DIM SHARED ScreenshotBase AS STRING

SUB ScreenshotInit
    ScreenshotCounter = 0
    ScreenshotBase = "qb64pe-screenshots/debug_" + DATE$ + "_" + TIME$
END SUB

SUB TakeDebugScreenshot (label AS STRING)
    IF _DEST <> _CONSOLE THEN
        ScreenshotCounter = ScreenshotCounter + 1
        DIM filename AS STRING
        filename = ScreenshotBase + "_" + label + "_" + RIGHT$("000" + LTRIM$(STR$(ScreenshotCounter)), 3) + ".png"
        _SAVEIMAGE filename
        CALL LogMessage("SCREENSHOT", "Saved: " + filename + " (" + label + ")")
    END IF
END SUB

CALL ScreenshotInit

' ============================================================================
' EXAMPLE PROGRAM WITH DEBUGGING ENHANCEMENTS
' ============================================================================

' Console header
_DEST _CONSOLE
COLOR 15, 1 ' White on blue
PRINT STRING$(60, "=")
PRINT "  QB64PE ENHANCED DEBUGGING DEMO"
PRINT "  Started: " + DATE$ + " " + TIME$
PRINT STRING$(60, "=")
COLOR 7, 0

CALL LogMessage("INFO", "Starting demonstration program")

' Example: Graphics operations with enhanced management
SCREEN GraphicsManager_CreateImage&(800, 600)
_DEST 0

' Draw some graphics with automatic screenshots
CIRCLE (400, 300), 100, _RGB32(255, 0, 0)
CALL TakeDebugScreenshot("circle")

LINE (200, 200)-(600, 400), _RGB32(0, 255, 0), BF
CALL TakeDebugScreenshot("rectangle")

CALL GraphicsManager_SafePSET(400, 300, _RGB32(255, 255, 0))
CALL TakeDebugScreenshot("pixel")

CALL LogMessage("SUCCESS", "Graphics operations completed successfully")

' Example: File operations with resource tracking
DIM filename AS STRING
filename = "test_data.txt"
DIM fileHandle AS INTEGER
fileHandle = ResourceManager_GetFileHandle%

OPEN filename FOR OUTPUT AS #fileHandle
PRINT #fileHandle, "Test data written at " + DATE$ + " " + TIME$
CLOSE #fileHandle

CALL LogMessage("INFO", "File operations completed: " + filename)

' Demonstrate enhanced flow control
CALL DebugPause("Graphics demo completed. Check screenshots!")

' Clean exit with resource cleanup
CALL LogMessage("INFO", "Program completing normally")
CALL ResourceManager_Cleanup
CALL DebugExit("Enhanced debugging demo completed successfully!")
