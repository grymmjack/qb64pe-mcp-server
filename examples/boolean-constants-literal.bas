' Example showing correct usage - Option 2: Use literal values
' This will pass the compatibility checker

' No DECLARE SUB needed - removed

DIM running AS INTEGER
running = -1  ' Use -1 for true

DO WHILE running = -1  ' Use -1 for true
    PRINT "Running..."
    IF _KEYDOWN(27) THEN running = 0  ' Use 0 for false
LOOP

SUB TestProcedure
    PRINT "Testing"
END SUB
