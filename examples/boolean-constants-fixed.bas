' Example showing correct usage - Option 1: Define constants
' This will pass the compatibility checker

' Define boolean constants at the top
CONST TRUE = -1
CONST FALSE = 0

' No DECLARE SUB needed - removed

DIM running AS INTEGER
running = TRUE  ' OK: TRUE is now defined

DO WHILE running = TRUE  ' OK: TRUE is now defined
    PRINT "Running..."
    IF _KEYDOWN(27) THEN running = FALSE  ' OK: FALSE is now defined
LOOP

SUB TestProcedure
    PRINT "Testing"
END SUB
