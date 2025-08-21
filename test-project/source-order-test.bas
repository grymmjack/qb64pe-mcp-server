' Test file to demonstrate QB64PE source organization issues
' This file intentionally violates QB64PE ordering rules

' Some initial comments
PRINT "Starting the program..."

' This TYPE definition after main code will cause errors
TYPE Point
    x AS INTEGER
    y AS INTEGER
END TYPE

' More main program code
DIM p AS Point
p.x = 10
p.y = 20

' This CONST after main code will also cause errors  
CONST MAX_POINTS = 100

PRINT "Point:", p.x, p.y
ShowPoint p

' SUB definition (this is correctly placed at the end)
SUB ShowPoint(pt AS Point)
    PRINT "Showing point:", pt.x, pt.y
END SUB
