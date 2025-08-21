' Console Demo - Good example of monitorable console output
' This program demonstrates proper console formatting and completion signals

$CONSOLE

' Enhanced console formatting
COLOR 15, 1 ' White on blue header
PRINT STRING$(60, "=")
PRINT "  QB64PE CONSOLE DEMO - MONITORING EXAMPLE"
PRINT "  Started at: " + DATE$ + " " + TIME$
PRINT STRING$(60, "=")
COLOR 7, 0 ' Reset to normal

' Simulate some processing with progress updates
PRINT
COLOR 14, 0 ' Yellow for info
PRINT "[INFO] Starting data processing..."
COLOR 7, 0

FOR i = 1 TO 10
    COLOR 10, 0 ' Green for progress
    PRINT "[PROGRESS] Processing item " + STR$(i) + " of 10..."
    COLOR 7, 0
    
    ' Simulate work
    _DELAY 0.5
    
    ' Show some results
    result = i * i
    COLOR 11, 0 ' Cyan for results
    PRINT "[RESULT] Item " + STR$(i) + " processed. Square = " + STR$(result)
    COLOR 7, 0
NEXT i

' Show completion
PRINT
COLOR 10, 0 ' Green for success
PRINT "[SUCCESS] All processing completed successfully!"
COLOR 7, 0

' Final summary table
PRINT
COLOR 15, 1 ' Header
PRINT "| Item | Value | Square |"
COLOR 7, 0
PRINT "|------|-------|--------|"
FOR i = 1 TO 10
    PRINT "|  " + RIGHT$("  " + STR$(i), 2) + "  |   " + RIGHT$("  " + STR$(i), 2) + "  |   " + RIGHT$("   " + STR$(i * i), 3) + "  |"
NEXT i

' Clear completion signal that LLMs can detect
PRINT
COLOR 12, 0 ' Red for attention
PRINT STRING$(60, "=")
PRINT "PROGRAM COMPLETED SUCCESSFULLY"
PRINT "Runtime: Approximately " + STR$(10 * 0.5) + " seconds"
PRINT "Press any key to exit..."
COLOR 7, 0

' Wait for user - this is where monitoring should detect "requires_user_input"
SLEEP

' Final cleanup message
PRINT
PRINT "Program finished. Exiting..."
SYSTEM
