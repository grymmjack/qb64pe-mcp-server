' Example showing incorrect usage of TRUE/FALSE constants
' This will be flagged by the compatibility checker

DECLARE SUB TestProcedure

DIM running AS INTEGER
running = TRUE  ' Error: TRUE not defined

DO WHILE running = TRUE  ' Error: TRUE not defined
    PRINT "Running..."
    IF _KEYDOWN(27) THEN running = FALSE  ' Error: FALSE not defined
LOOP

SUB TestProcedure
    PRINT "Testing"
END SUB
