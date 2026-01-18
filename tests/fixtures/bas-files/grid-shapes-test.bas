' QB64PE Graphics Test: Grid and Shapes
' Tests various geometric shapes, colors, and grid layouts

_TITLE "QB64PE Graphics Test - Grid and Shapes"

' Setup graphics screen
SCREEN _NEWIMAGE(1024, 768, 32)
_DEST 0

' Clear to dark blue background
CLS , _RGB32(20, 30, 50)

' Define colors
DIM red AS _UNSIGNED LONG, green AS _UNSIGNED LONG, blue AS _UNSIGNED LONG
DIM yellow AS _UNSIGNED LONG, orange AS _UNSIGNED LONG, purple AS _UNSIGNED LONG
DIM white AS _UNSIGNED LONG, cyan AS _UNSIGNED LONG, magenta AS _UNSIGNED LONG

red = _RGB32(255, 0, 0)
green = _RGB32(0, 255, 0)
blue = _RGB32(0, 0, 255)
yellow = _RGB32(255, 255, 0)
orange = _RGB32(255, 165, 0)
purple = _RGB32(128, 0, 128)
white = _RGB32(255, 255, 255)
cyan = _RGB32(0, 255, 255)
magenta = _RGB32(255, 0, 255)

' Draw grid lines
DIM i AS INTEGER
COLOR white
FOR i = 0 TO 1024 STEP 128
    LINE (i, 0)-(i, 768), white
NEXT i
FOR i = 0 TO 768 STEP 96
    LINE (0, i)-(1024, i), white
NEXT i

' Add title
COLOR white
_PRINTSTRING (400, 20), "QB64PE GRAPHICS TEST - GRID AND SHAPES"
_PRINTSTRING (420, 40), "Testing various geometric elements"

' Row 1: Circles with different fills
CIRCLE (128, 144), 40, red
PAINT (128, 144), red

CIRCLE (256, 144), 40, green
' Hollow circle (no fill)

CIRCLE (384, 144), 40, blue
PAINT (384, 144), blue

CIRCLE (512, 144), 40, yellow
' Gradient effect - multiple circles
FOR i = 1 TO 20
    CIRCLE (512, 144), i * 2, _RGB32(255, 255 - i * 10, 0)
NEXT i

' Row 1 Labels
_PRINTSTRING (100, 200), "Filled"
_PRINTSTRING (230, 200), "Hollow"
_PRINTSTRING (360, 200), "Solid"
_PRINTSTRING (480, 200), "Gradient"

' Row 2: Rectangles and squares
LINE (64, 240)-(192, 320), orange, BF  ' Filled rectangle
LINE (224, 240)-(352, 320), purple, B  ' Hollow rectangle
LINE (384, 260)-(512, 300), cyan, BF   ' Horizontal rectangle
LINE (544, 240)-(608, 320), magenta, BF ' Square

' Row 2 Labels
_PRINTSTRING (100, 330), "Filled Rect"
_PRINTSTRING (250, 330), "Hollow Rect"
_PRINTSTRING (410, 330), "Horizontal"
_PRINTSTRING (560, 330), "Square"

' Row 3: Triangles and polygons (using LINE commands)
' Triangle 1
LINE (128, 360)-(96, 440), red
LINE (96, 440)-(160, 440), red
LINE (160, 440)-(128, 360), red
PAINT (128, 400), red

' Triangle 2 (right triangle)
LINE (256, 360)-(256, 440), green
LINE (256, 440)-(320, 440), green
LINE (320, 440)-(256, 360), green
PAINT (280, 420), green

' Hexagon approximation
DIM centerX AS INTEGER, centerY AS INTEGER, radius AS INTEGER
centerX = 424: centerY = 400: radius = 40
FOR i = 0 TO 5
    DIM x1 AS INTEGER, y1 AS INTEGER, x2 AS INTEGER, y2 AS INTEGER
    x1 = centerX + radius * COS(i * 3.14159 / 3)
    y1 = centerY + radius * SIN(i * 3.14159 / 3)
    x2 = centerX + radius * COS((i + 1) * 3.14159 / 3)
    y2 = centerY + radius * SIN((i + 1) * 3.14159 / 3)
    LINE (x1, y1)-(x2, y2), blue
NEXT i
PAINT (centerX, centerY), blue

' Diamond
LINE (552, 360)-(512, 400), yellow
LINE (512, 400)-(552, 440), yellow
LINE (552, 440)-(592, 400), yellow
LINE (592, 400)-(552, 360), yellow
PAINT (552, 400), yellow

' Row 3 Labels
_PRINTSTRING (100, 450), "Triangle"
_PRINTSTRING (240, 450), "Right Tri"
_PRINTSTRING (400, 450), "Hexagon"
_PRINTSTRING (540, 450), "Diamond"

' Row 4: Complex patterns
' Concentric circles
FOR i = 1 TO 8
    CIRCLE (128, 568), i * 8, _RGB32(255 - i * 30, i * 30, 128)
NEXT i

' Checkerboard pattern
FOR i = 0 TO 7
    FOR j = 0 TO 7
        IF (i + j) MOD 2 = 0 THEN
            LINE (224 + i * 16, 504 + j * 16)-(240 + i * 16, 520 + j * 16), white, BF
        ELSE
            LINE (224 + i * 16, 504 + j * 16)-(240 + i * 16, 520 + j * 16), _RGB32(64, 64, 64), BF
        END IF
    NEXT j
NEXT i

' Spiral pattern
DIM angle AS SINGLE, x AS INTEGER, y AS INTEGER
FOR angle = 0 TO 12.56 STEP 0.1
    x = 424 + (angle * 5) * COS(angle)
    y = 568 + (angle * 5) * SIN(angle)
    PSET (x, y), _RGB32(255, 255 - angle * 20, angle * 20)
NEXT angle

' Star pattern
centerX = 552: centerY = 568
FOR i = 0 TO 4
    x1 = centerX + 50 * COS(i * 1.256)
    y1 = centerY + 50 * SIN(i * 1.256)
    x2 = centerX + 50 * COS((i + 2) * 1.256)
    y2 = centerY + 50 * SIN((i + 2) * 1.256)
    LINE (x1, y1)-(x2, y2), cyan
NEXT i

' Row 4 Labels
_PRINTSTRING (80, 640), "Concentric"
_PRINTSTRING (240, 640), "Checkerboard"
_PRINTSTRING (400, 640), "Spiral"
_PRINTSTRING (530, 640), "Star"

' Bottom info
COLOR white
_PRINTSTRING (300, 680), "Grid: 128x96 pixel cells"
_PRINTSTRING (280, 700), "Resolution: 1024x768 (4:3 aspect)"
_PRINTSTRING (260, 720), "Test completed - Screenshots ready"

' Display the graphics
_DISPLAY

' Take screenshots for analysis
DIM screenshotFile AS STRING

' Screenshot 1: Initial render
screenshotFile = "qb64pe-screenshots/grid-shapes-test.png"
_SAVEIMAGE screenshotFile

' Short pause
_DELAY 1

' Add some animation elements for second screenshot
' Rotating line
FOR i = 0 TO 359 STEP 15
    DIM lineX AS INTEGER, lineY AS INTEGER
    lineX = 850 + 60 * COS(i * 3.14159 / 180)
    lineY = 150 + 60 * SIN(i * 3.14159 / 180)
    LINE (850, 150)-(lineX, lineY), _RGB32(255, 255 - i, i)
    _DISPLAY
    _DELAY 0.05
NEXT i

' Add "ANIMATED" label
_PRINTSTRING (820, 220), "ANIMATED"

' Screenshot 2: With animation
screenshotFile = "qb64pe-screenshots/grid-shapes-animated.png"
_SAVEIMAGE screenshotFile

' Final pause then exit
_DELAY 2
SYSTEM
