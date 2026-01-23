"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeywordsService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class KeywordsService {
    keywordsData = { categories: {}, keywords: {} };
    originalKeywords = {};
    wikiCategoriesData = {};
    /**
     * Calculate Levenshtein distance between two strings for fuzzy matching
     */
    levenshteinDistance(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;
        const matrix = [];
        for (let i = 0; i <= len1; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= len2; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(matrix[i - 1][j] + 1, // deletion
                matrix[i][j - 1] + 1, // insertion
                matrix[i - 1][j - 1] + cost // substitution
                );
            }
        }
        return matrix[len1][len2];
    }
    constructor() {
        this.loadKeywordsData();
        this.loadWikiCategoriesData();
    }
    loadWikiCategoriesData() {
        try {
            const wikiCategoriesPath = path.join(__dirname, "../../docs/resources/QB64PE Keywords by Category.json");
            const wikiData = JSON.parse(fs.readFileSync(wikiCategoriesPath, "utf-8"));
            this.wikiCategoriesData = wikiData.categories || {};
            // Removed console.log to prevent MCP protocol parsing issues
        }
        catch (error) {
            console.error("Error loading wiki categories data:", error);
            this.wikiCategoriesData = {};
        }
    }
    loadKeywordsData() {
        try {
            // Load the original keywords JSON
            const originalPath = path.join(__dirname, "../../docs/resources/QB64PE_Keywords.json");
            const originalData = JSON.parse(fs.readFileSync(originalPath, "utf-8"));
            this.originalKeywords = originalData.keywords;
            // Try to load the enhanced keywords data, generate if not exists or incomplete
            const enhancedPath = path.join(__dirname, "../data/keywords-data.json");
            let shouldRegenerate = false;
            if (fs.existsSync(enhancedPath)) {
                this.keywordsData = JSON.parse(fs.readFileSync(enhancedPath, "utf-8"));
                // Check if we have all keywords from the original file
                const originalKeywordCount = Object.keys(this.originalKeywords).length;
                const enhancedKeywordCount = Object.keys(this.keywordsData.keywords).length;
                // Removed console.log to prevent MCP protocol parsing issues
                // Regenerate if we're missing keywords or have significantly fewer
                if (enhancedKeywordCount < originalKeywordCount * 0.9) {
                    // Removed console.log to prevent MCP protocol parsing issues
                    shouldRegenerate = true;
                }
            }
            else {
                shouldRegenerate = true;
            }
            if (shouldRegenerate) {
                // Removed console.log to prevent MCP protocol parsing issues
                this.keywordsData = this.generateEnhancedKeywordsData();
                this.saveEnhancedKeywordsData();
                // Removed console.log to prevent MCP protocol parsing issues
            }
        }
        catch (error) {
            console.error("Error loading keywords data:", error);
            this.keywordsData = { categories: {}, keywords: {} };
            this.originalKeywords = {};
        }
    }
    categorizeKeyword(name, description) {
        const lowerName = name.toLowerCase();
        const lowerDesc = description.toLowerCase();
        // Metacommands start with $
        if (name.startsWith("$"))
            return "metacommand";
        // OpenGL functions start with _gl
        if (name.startsWith("_gl"))
            return "opengl";
        // Check for operators - expanded list
        const operators = [
            "+",
            "-",
            "*",
            "/",
            "\\",
            "^",
            "=",
            "<",
            ">",
            "&",
            "|",
            "~",
            "MOD",
            "AND",
            "OR",
            "XOR",
            "NOT",
            "EQV",
            "IMP",
            "_ANDALSO",
            "_ORELSE",
            "_NEGATE",
            "AND (boolean)",
            "OR (boolean)",
            "XOR (boolean)",
        ];
        if (operators.includes(name) ||
            operators.includes(name.replace(" (boolean)", ""))) {
            return "operator";
        }
        // Check for data types - expanded list
        const types = [
            "INTEGER",
            "LONG",
            "SINGLE",
            "DOUBLE",
            "STRING",
            "_BIT",
            "_BYTE",
            "_INTEGER64",
            "_FLOAT",
            "_UNSIGNED",
            "_OFFSET",
            "_MEM",
            "ABSOLUTE",
            "_MEM (function)",
            "OPTION _EXPLICIT",
            "OPTION _EXPLICITARRAY",
        ];
        if (types.includes(name) ||
            name.includes("numerical type") ||
            name.includes("variable type")) {
            return "type";
        }
        // Constants and predefined values
        if (name.includes("_PI") ||
            name.includes("_MIDDLE") ||
            name.includes("BASE") ||
            lowerDesc.includes("constant") ||
            lowerDesc.includes("predefined")) {
            return "constant";
        }
        // Check if it's explicitly marked as a function
        if (name.endsWith("(function)") ||
            name.endsWith(" (function)") ||
            lowerDesc.startsWith("(function)") ||
            (lowerDesc.includes("function") && lowerDesc.includes("returns")) ||
            (name.endsWith("$") && !name.startsWith("$"))) {
            return "function";
        }
        // Check if it's explicitly marked as a statement
        if (name.endsWith("(statement)") ||
            name.endsWith(" (statement)") ||
            lowerDesc.startsWith("(statement)") ||
            (lowerDesc.includes("statement") && !lowerDesc.includes("function"))) {
            return "statement";
        }
        // Legacy or compatibility items
        if (lowerDesc.includes("legacy") ||
            lowerDesc.includes("compatibility") ||
            lowerDesc.includes("deprecated") ||
            lowerDesc.includes("qbasic only")) {
            return "legacy";
        }
        // Function indicators - broader detection
        if ((lowerDesc.includes("returns") && !lowerDesc.includes("statement")) ||
            name.endsWith("$") ||
            lowerDesc.match(/returns?\s+(-?\d+|true|false|the|a|an)/i)) {
            return "function";
        }
        // Default to statement for most QB64PE keywords
        return "statement";
    }
    extractVersion(name, description) {
        if (name.startsWith("_") || description.includes("QB64")) {
            return description.includes("QB64PE") ? "QB64PE" : "QB64";
        }
        return "QBasic";
    }
    extractAvailability(name, description) {
        if (description.includes("Windows only") ||
            description.includes("Windows-only")) {
            return "Windows";
        }
        if (description.includes("Linux only")) {
            return "Linux";
        }
        if (description.includes("macOS only")) {
            return "macOS";
        }
        return "All platforms";
    }
    generateSyntax(name, description, type) {
        const cleanName = name
            .replace(" (function)", "")
            .replace(" (statement)", "")
            .replace(" (boolean)", "");
        // Special cases for specific keywords
        const syntaxMap = {
            "IF...THEN": "IF condition THEN\n  statements\n[ELSEIF condition THEN\n  statements]\n[ELSE\n  statements]\nEND IF",
            "FOR...NEXT": "FOR variable = start TO end [STEP increment]\n  statements\nNEXT [variable]",
            "DO...LOOP": "DO [WHILE|UNTIL condition]\n  statements\nLOOP [WHILE|UNTIL condition]",
            "SELECT CASE": "SELECT CASE expression\n  CASE value\n    statements\n  CASE ELSE\n    statements\nEND SELECT",
            "WHILE...WEND": "WHILE condition\n  statements\nWEND",
            SUB: "SUB name[(parameters)]\n  statements\nEND SUB",
            FUNCTION: "FUNCTION name[(parameters)] [AS type]\n  statements\n  name = return_value\nEND FUNCTION",
            TYPE: "TYPE type_name\n  element AS type\nEND TYPE",
            "DECLARE LIBRARY (QB64 statement block)": 'DECLARE LIBRARY ["library_file"]\n  FUNCTION|SUB name ALIAS "actual_name" (parameters)\nEND DECLARE',
            _MEM: "DIM mem_var AS _MEM",
            "OPTION _EXPLICIT": "OPTION _EXPLICIT",
            "OPTION _EXPLICITARRAY": "OPTION _EXPLICITARRAY",
        };
        if (syntaxMap[name]) {
            return syntaxMap[name];
        }
        if (type === "function") {
            if (cleanName.endsWith("$")) {
                return `string_result = ${cleanName}([parameters])`;
            }
            return `result = ${cleanName}([parameters])`;
        }
        if (type === "metacommand") {
            return `'${cleanName}: [parameters]`;
        }
        if (type === "operator") {
            if (["AND (boolean)", "OR (boolean)", "XOR (boolean)"].includes(name)) {
                return `IF condition1 ${cleanName.replace(" (boolean)", "")} condition2 THEN`;
            }
            return `result = operand1 ${cleanName} operand2`;
        }
        if (type === "type") {
            if (cleanName.includes("%") ||
                cleanName.includes("&") ||
                cleanName.includes("#") ||
                cleanName.includes("!") ||
                cleanName.includes("$")) {
                return `DIM variable${cleanName.slice(-1)}`;
            }
            return `DIM variable AS ${cleanName}`;
        }
        if (type === "constant") {
            return cleanName;
        }
        return `${cleanName} [parameters]`;
    }
    generateExample(name, type, description) {
        const cleanName = name
            .replace(" (function)", "")
            .replace(" (statement)", "")
            .replace(" (boolean)", "");
        // Special examples for complex keywords
        const exampleMap = {
            "IF...THEN": 'IF x > 10 THEN\n    PRINT "Greater than 10"\nELSE\n    PRINT "10 or less"\nEND IF',
            "FOR...NEXT": "FOR i = 1 TO 10\n    PRINT i\nNEXT i",
            "DO...LOOP": "DO\n    x = x + 1\nLOOP WHILE x < 10",
            "SELECT CASE": 'SELECT CASE day\n    CASE 1\n        PRINT "Monday"\n    CASE 2\n        PRINT "Tuesday"\n    CASE ELSE\n        PRINT "Other day"\nEND SELECT',
            "WHILE...WEND": "WHILE x < 10\n    x = x + 1\nWEND",
            PRINT: 'PRINT "Hello, World!"\nPRINT "Number:"; 42',
            _ACCEPTFILEDROP: "_ACCEPTFILEDROP\nIF _TOTALDROPPEDFILES > 0 THEN\n    FOR i = 1 TO _TOTALDROPPEDFILES\n        PRINT _DROPPEDFILE(i)\n    NEXT\n    _FINISHDROP\nEND IF",
            SCREEN: "SCREEN _NEWIMAGE(800, 600, 32)\nSCREEN 13 ' Legacy 320x200 mode",
            COLOR: "COLOR 15, 1 ' White text on blue background\nCOLOR _RGB32(255, 0, 0) ' Red text",
            CIRCLE: "CIRCLE (100, 100), 50 ' Circle at (100,100) with radius 50\nCIRCLE (200, 200), 30, _RGB32(255, 0, 0) ' Red circle",
            LINE: "LINE (0, 0)-(100, 100) ' Diagonal line\nLINE (50, 50)-(150, 100), _RGB32(0, 255, 0), BF ' Green filled box",
        };
        if (exampleMap[name]) {
            return exampleMap[name];
        }
        switch (type) {
            case "function":
                if (cleanName.endsWith("$")) {
                    if (cleanName.includes("INPUT")) {
                        return `text$ = ${cleanName}(10) \' Read 10 characters`;
                    }
                    if (cleanName.includes("CHR")) {
                        return `char$ = ${cleanName}(65) \' Returns "A"`;
                    }
                    if (cleanName.includes("HEX")) {
                        return `hex$ = ${cleanName}(255) \' Returns "FF"`;
                    }
                    return `text$ = ${cleanName}()`;
                }
                if (cleanName.includes("_RGB")) {
                    return `color& = ${cleanName}(255, 0, 0) \' Red color`;
                }
                if (cleanName.includes("TIMER")) {
                    return `seconds! = ${cleanName} \' Current time in seconds`;
                }
                if (cleanName.includes("RND")) {
                    return `random_num = ${cleanName} \' Random number 0 to 1`;
                }
                return `value = ${cleanName}()`;
            case "statement":
                if (cleanName.includes("PRINT")) {
                    return `${cleanName} "Hello, World!"`;
                }
                if (cleanName.includes("INPUT")) {
                    return `${cleanName} "Enter value: ", userValue`;
                }
                if (cleanName.includes("DIM")) {
                    return `${cleanName} myArray(10) AS INTEGER`;
                }
                return `${cleanName}`;
            case "metacommand":
                if (cleanName.includes("INCLUDE")) {
                    return `'${cleanName}: 'mylib.bi'`;
                }
                if (cleanName.includes("CONSOLE")) {
                    return `'${cleanName}:ONLY`;
                }
                return `'${cleanName}:`;
            case "operator":
                if (["AND", "OR", "XOR"].some((op) => cleanName.includes(op))) {
                    return `IF condition1 ${cleanName.replace(" (boolean)", "")} condition2 THEN`;
                }
                return `result = a ${cleanName} b`;
            case "type":
                if (cleanName === "_MEM") {
                    return `DIM buffer AS ${cleanName}`;
                }
                return `DIM myVar AS ${cleanName}`;
            case "opengl":
                if (cleanName === "_glBegin") {
                    return `${cleanName} _GL_TRIANGLES\n_glVertex3f 0, 1, 0\n_glVertex3f -1, -1, 0\n_glVertex3f 1, -1, 0\n_glEnd`;
                }
                return `${cleanName}`;
            default:
                return `${cleanName}`;
        }
    }
    findRelatedKeywords(name, description) {
        const related = [];
        const keywords = Object.keys(this.originalKeywords);
        // Look for keywords mentioned in the description
        const descWords = description.toLowerCase().split(/[\s,._()]+/);
        for (const keyword of keywords) {
            const cleanKeyword = keyword
                .replace(" (function)", "")
                .replace(" (statement)", "")
                .replace(" (boolean)", "");
            if (cleanKeyword !== name &&
                descWords.includes(cleanKeyword.toLowerCase())) {
                related.push(cleanKeyword);
            }
        }
        // Add specific relationships based on keyword patterns and categories
        const cleanName = name
            .replace(" (function)", "")
            .replace(" (statement)", "")
            .replace(" (boolean)", "");
        // OpenGL relationships
        if (cleanName.startsWith("_gl") && cleanName !== "_glBegin") {
            if (!related.includes("_glBegin"))
                related.push("_glBegin");
            if (!related.includes("_glEnd"))
                related.push("_glEnd");
            if (!related.includes("SUB _GL"))
                related.push("SUB _GL");
        }
        // Color relationships
        if (cleanName.includes("COLOR") ||
            cleanName.includes("_RGB") ||
            cleanName.includes("_RED") ||
            cleanName.includes("_GREEN") ||
            cleanName.includes("_BLUE") ||
            cleanName.includes("_ALPHA")) {
            [
                "_RGB32",
                "_RGBA32",
                "COLOR",
                "_RED32",
                "_GREEN32",
                "_BLUE32",
                "_ALPHA32",
            ].forEach((rel) => {
                if (rel !== cleanName && !related.includes(rel))
                    related.push(rel);
            });
        }
        // Screen and image relationships
        if (cleanName.includes("SCREEN") ||
            cleanName.includes("_NEWIMAGE") ||
            cleanName.includes("_LOADIMAGE") ||
            cleanName.includes("_DISPLAY") ||
            cleanName.includes("_PUTIMAGE")) {
            [
                "SCREEN",
                "_NEWIMAGE",
                "_LOADIMAGE",
                "_DISPLAY",
                "_PUTIMAGE",
                "_FREEIMAGE",
            ].forEach((rel) => {
                if (rel !== cleanName && !related.includes(rel))
                    related.push(rel);
            });
        }
        // File operations relationships
        if (cleanName.includes("FILE") ||
            cleanName.includes("OPEN") ||
            cleanName.includes("CLOSE") ||
            cleanName.includes("INPUT") ||
            cleanName.includes("OUTPUT") ||
            cleanName.includes("PRINT")) {
            [
                "OPEN",
                "CLOSE",
                "INPUT",
                "OUTPUT",
                "PRINT",
                "GET",
                "PUT",
                "EOF",
                "LOF",
            ].forEach((rel) => {
                if (rel !== cleanName && !related.includes(rel))
                    related.push(rel);
            });
        }
        // Math function relationships
        if (cleanName.includes("SIN") ||
            cleanName.includes("COS") ||
            cleanName.includes("TAN") ||
            cleanName.includes("_ASIN") ||
            cleanName.includes("_ACOS") ||
            cleanName.includes("ATN")) {
            [
                "SIN",
                "COS",
                "TAN",
                "ATN",
                "_ASIN",
                "_ACOS",
                "_ATAN2",
                "_D2R",
                "_R2D",
            ].forEach((rel) => {
                if (rel !== cleanName && !related.includes(rel))
                    related.push(rel);
            });
        }
        // String function relationships
        if (cleanName.includes("LEFT$") ||
            cleanName.includes("RIGHT$") ||
            cleanName.includes("MID$") ||
            cleanName.includes("LEN") ||
            cleanName.includes("INSTR") ||
            cleanName.includes("CHR$")) {
            [
                "LEFT$",
                "RIGHT$",
                "MID$",
                "LEN",
                "INSTR",
                "CHR$",
                "ASC",
                "VAL",
                "STR$",
            ].forEach((rel) => {
                if (rel !== cleanName && !related.includes(rel))
                    related.push(rel);
            });
        }
        // Sound relationships
        if (cleanName.includes("_SND") ||
            cleanName.includes("SOUND") ||
            cleanName.includes("PLAY")) {
            [
                "_SNDOPEN",
                "_SNDPLAY",
                "_SNDSTOP",
                "_SNDCLOSE",
                "SOUND",
                "PLAY",
            ].forEach((rel) => {
                if (rel !== cleanName && !related.includes(rel))
                    related.push(rel);
            });
        }
        // Memory relationships
        if (cleanName.includes("_MEM") ||
            cleanName.includes("PEEK") ||
            cleanName.includes("POKE")) {
            [
                "_MEM",
                "_MEMGET",
                "_MEMPUT",
                "_MEMFREE",
                "_MEMNEW",
                "PEEK",
                "POKE",
            ].forEach((rel) => {
                if (rel !== cleanName && !related.includes(rel))
                    related.push(rel);
            });
        }
        // Timer relationships
        if (cleanName.includes("TIMER") ||
            cleanName.includes("_DELAY") ||
            cleanName.includes("SLEEP")) {
            ["TIMER", "_DELAY", "SLEEP", "_LIMIT", "ON TIMER"].forEach((rel) => {
                if (rel !== cleanName && !related.includes(rel))
                    related.push(rel);
            });
        }
        // Control flow relationships
        if (cleanName.includes("IF") ||
            cleanName.includes("FOR") ||
            cleanName.includes("DO") ||
            cleanName.includes("WHILE") ||
            cleanName.includes("SELECT")) {
            [
                "IF...THEN",
                "FOR...NEXT",
                "DO...LOOP",
                "WHILE...WEND",
                "SELECT CASE",
            ].forEach((rel) => {
                if (rel !== cleanName && !related.includes(rel))
                    related.push(rel);
            });
        }
        // Mouse and keyboard relationships
        if (cleanName.includes("_MOUSE") ||
            cleanName.includes("_KEY") ||
            cleanName.includes("INKEY")) {
            [
                "_MOUSEINPUT",
                "_MOUSEX",
                "_MOUSEY",
                "_MOUSEBUTTON",
                "_KEYHIT",
                "_KEYDOWN",
                "INKEY$",
            ].forEach((rel) => {
                if (rel !== cleanName && !related.includes(rel))
                    related.push(rel);
            });
        }
        return related.slice(0, 8); // Limit to 8 related keywords
    }
    generateEnhancedKeywordsData() {
        const data = {
            categories: {
                statements: {
                    description: "QB64PE statements that perform actions",
                    keywords: [],
                },
                functions: {
                    description: "QB64PE functions that return values",
                    keywords: [],
                },
                operators: {
                    description: "Mathematical and logical operators",
                    keywords: [],
                },
                metacommands: {
                    description: "Compiler directives starting with $",
                    keywords: [],
                },
                opengl: {
                    description: "OpenGL graphics functions and statements",
                    keywords: [],
                },
                types: { description: "Data types and type suffixes", keywords: [] },
                constants: {
                    description: "Built-in constants and literals",
                    keywords: [],
                },
                legacy: {
                    description: "Legacy QBasic keywords and compatibility items",
                    keywords: [],
                },
            },
            keywords: {},
        };
        for (const [name, description] of Object.entries(this.originalKeywords)) {
            const cleanName = name
                .replace(" (function)", "")
                .replace(" (statement)", "")
                .replace(" (boolean)", "");
            const type = this.categorizeKeyword(name, description); // Pass original name for better categorization
            const category = type === "opengl"
                ? "opengl"
                : type === "metacommand"
                    ? "metacommands"
                    : type === "operator"
                        ? "operators"
                        : type === "type"
                            ? "types"
                            : type === "function"
                                ? "functions"
                                : type === "constant"
                                    ? "constants"
                                    : type === "legacy"
                                        ? "legacy"
                                        : "statements";
            const keywordInfo = {
                name: cleanName,
                type,
                category,
                description: description.replace(/^\([^)]+\)\s*/, ""), // Remove type prefix
                syntax: this.generateSyntax(name, description, type), // Pass original name for better syntax
                parameters: [], // Will be enhanced later
                returns: type === "function" ? "VALUE" : null,
                example: this.generateExample(name, type, description), // Pass original name for better examples
                related: this.findRelatedKeywords(cleanName, description),
                version: this.extractVersion(cleanName, description),
                availability: this.extractAvailability(cleanName, description),
                tags: [type, category],
            };
            // Handle special cases where we want to keep the full name
            if (name.includes("(boolean)")) {
                keywordInfo.name = name; // Keep the full name for boolean operators
                keywordInfo.aliases = [cleanName]; // Add clean name as alias
            }
            data.keywords[keywordInfo.name] = keywordInfo;
            data.categories[category].keywords.push(keywordInfo.name);
        }
        return data;
    }
    saveEnhancedKeywordsData() {
        try {
            // Save to both src and build directories
            const srcPath = path.join(__dirname, "../data/keywords-data.json");
            const buildPath = path.join(__dirname, "../../build/data/keywords-data.json");
            const dataStr = JSON.stringify(this.keywordsData, null, 2);
            // Ensure directories exist
            const srcDir = path.dirname(srcPath);
            const buildDir = path.dirname(buildPath);
            if (!fs.existsSync(srcDir))
                fs.mkdirSync(srcDir, { recursive: true });
            if (!fs.existsSync(buildDir))
                fs.mkdirSync(buildDir, { recursive: true });
            // Save to both locations
            fs.writeFileSync(srcPath, dataStr);
            fs.writeFileSync(buildPath, dataStr);
            // Removed console.log to prevent MCP protocol parsing issues
        }
        catch (error) {
            console.error("Error saving enhanced keywords data:", error);
        }
    }
    getKeyword(name) {
        return this.keywordsData.keywords[name] || null;
    }
    getAllKeywords() {
        return this.keywordsData.keywords;
    }
    getKeywordsByCategory(category) {
        const categoryData = this.keywordsData.categories[category];
        if (!categoryData)
            return [];
        return categoryData.keywords
            .map((name) => this.keywordsData.keywords[name])
            .filter(Boolean);
    }
    getCategories() {
        return this.keywordsData.categories;
    }
    searchKeywords(query, maxResults = 20) {
        const results = [];
        const lowerQuery = query.toLowerCase();
        // Remove underscore prefix if present for component search
        const queryWithoutUnderscore = query.startsWith("_")
            ? query.substring(1)
            : query;
        // Split query into component words for partial matching
        const componentWords = queryWithoutUnderscore
            .split(/[_\s]+/)
            .filter((w) => w.length > 2);
        for (const [name, info] of Object.entries(this.keywordsData.keywords)) {
            const lowerName = name.toLowerCase();
            const lowerDesc = info.description.toLowerCase();
            const nameWithoutUnderscore = name.startsWith("_")
                ? name.substring(1).toLowerCase()
                : lowerName;
            let relevance = 0;
            let matchType = "contains";
            // Exact match
            if (lowerName === lowerQuery) {
                relevance = 100;
                matchType = "exact";
            }
            // Exact match without underscore
            else if (nameWithoutUnderscore === lowerQuery.replace(/^_/, "")) {
                relevance = 95;
                matchType = "exact";
            }
            // Prefix match
            else if (lowerName.startsWith(lowerQuery)) {
                relevance = 80;
                matchType = "prefix";
            }
            // Fuzzy match (Levenshtein distance < 4 for longer queries)
            else if (lowerQuery.length > 3) {
                const distance = this.levenshteinDistance(lowerName, lowerQuery);
                const maxDistance = lowerQuery.length > 10 ? 3 : 2;
                if (distance <= maxDistance) {
                    relevance = 75 - distance * 10;
                    matchType = "contains";
                }
            }
            // Component word matching (all words from query appear in keyword)
            if (relevance === 0 && componentWords.length > 0) {
                const matchedWords = componentWords.filter((word) => lowerName.includes(word.toLowerCase()));
                if (matchedWords.length === componentWords.length) {
                    relevance = 70;
                    matchType = "contains";
                }
                else if (matchedWords.length > 0) {
                    relevance = 50 + matchedWords.length * 10;
                    matchType = "contains";
                }
            }
            // Contains in name
            if (relevance === 0 && lowerName.includes(lowerQuery)) {
                relevance = 60;
                matchType = "contains";
            }
            // Contains in description
            if (relevance === 0 && lowerDesc.includes(lowerQuery)) {
                relevance = 40;
                matchType = "contains";
            }
            // Related keywords
            if (relevance === 0 &&
                info.related.some((rel) => rel.toLowerCase().includes(lowerQuery))) {
                relevance = 20;
                matchType = "related";
            }
            if (relevance > 0) {
                results.push({
                    keyword: name,
                    info,
                    relevance,
                    matchType,
                });
            }
        }
        return results
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, maxResults);
    }
    getAutocomplete(prefix, maxResults = 10) {
        const lowerPrefix = prefix.toLowerCase();
        const matches = [];
        for (const name of Object.keys(this.keywordsData.keywords)) {
            if (name.toLowerCase().startsWith(lowerPrefix)) {
                matches.push(name);
            }
        }
        return matches.slice(0, maxResults).sort();
    }
    validateKeyword(name) {
        const keyword = this.getKeyword(name);
        if (keyword) {
            return { isValid: true, keyword };
        }
        // Find similar keywords for suggestions
        const suggestions = this.searchKeywords(name, 5)
            .map((result) => result.keyword)
            .filter((suggestion) => suggestion !== name);
        return {
            isValid: false,
            suggestions,
        };
    }
    getKeywordsByType(type) {
        return Object.values(this.keywordsData.keywords).filter((keyword) => keyword.type === type);
    }
    getKeywordsByVersion(version) {
        return Object.values(this.keywordsData.keywords).filter((keyword) => keyword.version === version);
    }
    getDeprecatedKeywords() {
        return Object.values(this.keywordsData.keywords).filter((keyword) => keyword.deprecated === true);
    }
    regenerateKeywordsData() {
        // Removed console.log to prevent MCP protocol parsing issues
        this.keywordsData = this.generateEnhancedKeywordsData();
        this.saveEnhancedKeywordsData();
        // Removed console.log to prevent MCP protocol parsing issues
    }
    getKeywordCount() {
        return Object.keys(this.keywordsData.keywords).length;
    }
    getOriginalKeywordCount() {
        return Object.keys(this.originalKeywords).length;
    }
    getCategoryStats() {
        const stats = {};
        for (const [category, categoryData] of Object.entries(this.keywordsData.categories)) {
            stats[category] = categoryData.keywords.length;
        }
        return stats;
    }
    getKeywordsByTag(tag) {
        return Object.values(this.keywordsData.keywords).filter((keyword) => keyword.tags?.includes(tag));
    }
    getQB64PESpecificKeywords() {
        return Object.values(this.keywordsData.keywords).filter((keyword) => keyword.version === "QB64PE" || keyword.version === "QB64");
    }
    getLegacyKeywords() {
        return Object.values(this.keywordsData.keywords).filter((keyword) => keyword.version === "QBasic" || keyword.type === "legacy");
    }
    getWikiCategories() {
        return this.wikiCategoriesData;
    }
    getWikiCategoryCounts() {
        const counts = {};
        for (const [category, keywords] of Object.entries(this.wikiCategoriesData)) {
            counts[category] = keywords.length;
        }
        return counts;
    }
    getKeywordsByWikiCategory(category) {
        return this.wikiCategoriesData[category] || [];
    }
    getWikiCategoryNames() {
        return Object.keys(this.wikiCategoriesData);
    }
    searchWikiCategories(query) {
        const lowerQuery = query.toLowerCase();
        return Object.keys(this.wikiCategoriesData).filter((category) => category.toLowerCase().includes(lowerQuery));
    }
    /**
     * Search keywords by wiki category with optional filtering
     */
    searchByWikiCategory(category, searchTerm) {
        const keywordsInCategory = this.wikiCategoriesData[category] || [];
        if (!searchTerm) {
            // Return all keywords in the category
            return keywordsInCategory
                .map((name) => this.keywordsData.keywords[name])
                .filter(Boolean);
        }
        // Filter by search term
        const lowerSearchTerm = searchTerm.toLowerCase();
        return keywordsInCategory
            .map((name) => this.keywordsData.keywords[name])
            .filter((keyword) => {
            if (!keyword)
                return false;
            const lowerName = keyword.name.toLowerCase();
            const lowerDesc = keyword.description.toLowerCase();
            return (lowerName.includes(lowerSearchTerm) ||
                lowerDesc.includes(lowerSearchTerm));
        });
    }
}
exports.KeywordsService = KeywordsService;
//# sourceMappingURL=keywords-service.js.map