' QB64PE File Handling Example - Demonstrating potential errors
' This code has some intentional issues for testing our MCP server

DIM filename AS STRING
DIM data AS STRING

' This line has a potential issue - should check if file exists first
OPEN "data.txt" FOR INPUT AS #1

' Missing error handling here
INPUT #1, data
PRINT "Read data: "; data

' This could cause an error if file is still open
CLOSE #1

' Try to read from a file that might not exist
OPEN "missing.txt" FOR INPUT AS #2
INPUT #2, data  ' This will crash if file doesn't exist
CLOSE #2

END
