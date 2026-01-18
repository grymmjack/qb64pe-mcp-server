' QB64PE Basic Shapes Screenshot Analysis Template
$RESIZE:SMOOTH

_Title "QB64PE Basic Shapes Test"
Screen _NewImage(800, 600, 32)
Cls , _RGB32(0, 0, 0) ' Black background

' Colors
Dim red, blue, green, yellow, white
red = _RGB32(255, 0, 0)
blue = _RGB32(0, 0, 255)
green = _RGB32(0, 255, 0)  
yellow = _RGB32(255, 255, 0)
white = _RGB32(255, 255, 255)

' Title text
Color white
_PrintString (300, 50), "BASIC SHAPES TEST"

' Circle in top-left quadrant
Circle (200, 200), 80, red
Paint (200, 200), red
_PrintString (160, 290), "Circle"

' Rectangle in top-right quadrant
Line (450, 120)-(650, 280), blue, BF
_PrintString (530, 290), "Rectangle"

' Line in bottom-left quadrant
Line (100, 350)-(300, 500), green
_PrintString (180, 510), "Line"

' Triangle in bottom-right quadrant
Line (500, 350)-(600, 500), yellow
Line (600, 500)-(700, 350), yellow
Line (700, 350)-(500, 350), yellow
_PrintString (580, 510), "Triangle"

_Display
_SaveImage "qb64pe-screenshots/basic-shapes-test.png"
_Delay 2
System 0
