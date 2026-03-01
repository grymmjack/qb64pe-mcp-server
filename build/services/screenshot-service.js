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
exports.ScreenshotService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Service for QB64PE screenshot support via _SAVEIMAGE.
 *
 * Screenshots are captured entirely from within QB64PE code:
 *   _SAVEIMAGE "/absolute/path/screenshot.png"
 * This service reads the resulting file and returns it as base64
 * so the LLM can inspect the visual output.
 */
class ScreenshotService {
    screenshotDir;
    constructor(screenshotDir = "qb64pe-screenshots") {
        this.screenshotDir = path.resolve(screenshotDir);
        this.ensureScreenshotDirectory();
    }
    ensureScreenshotDirectory() {
        if (!fs.existsSync(this.screenshotDir)) {
            fs.mkdirSync(this.screenshotDir, { recursive: true });
        }
    }
    /**
     * Get all screenshot files in the directory, newest first.
     */
    getScreenshotFiles() {
        if (!fs.existsSync(this.screenshotDir)) {
            return [];
        }
        return fs
            .readdirSync(this.screenshotDir)
            .filter((file) => /\.(png|jpg|jpeg|gif)$/i.test(file))
            .map((file) => path.join(this.screenshotDir, file))
            .sort((a, b) => {
            const statA = fs.statSync(a);
            const statB = fs.statSync(b);
            return statB.mtime.getTime() - statA.mtime.getTime();
        });
    }
    /**
     * Read an image file saved by QB64PE's _SAVEIMAGE statement and return its
     * contents as base64 so the calling LLM can inspect the visual output.
     *
     * Workflow:
     *  1. Add  _SAVEIMAGE "/abs/path/screenshot.png"  near the END of QB64PE program
     *     (just before END or an _EXIT call).
     *  2. Compile and run the program so it writes the file.
     *  3. Call this method with the same path to read and return the image.
     */
    async analyzeScreenshot(filePath, options = {}) {
        const hint = 'Add  _SAVEIMAGE "' +
            filePath +
            '"  near the end of your QB64PE program ' +
            "(before END/_EXIT), compile and run it, then call this tool again.";
        if (!fs.existsSync(filePath)) {
            return {
                success: false,
                filePath,
                error: `File not found: ${filePath}. The QB64PE program must write it first using _SAVEIMAGE.`,
                hint,
            };
        }
        try {
            const data = fs.readFileSync(filePath);
            const ext = path.extname(filePath).toLowerCase();
            const mimeMap = {
                ".png": "image/png",
                ".jpg": "image/jpeg",
                ".jpeg": "image/jpeg",
                ".gif": "image/gif",
                ".bmp": "image/bmp",
            };
            const mimeType = mimeMap[ext] ?? "image/png";
            return {
                success: true,
                filePath,
                base64Data: data.toString("base64"),
                mimeType,
                fileSizeBytes: data.length,
                hint: "Image loaded. Inspect base64Data to view the screenshot.",
            };
        }
        catch (err) {
            return {
                success: false,
                filePath,
                error: err instanceof Error ? err.message : String(err),
                hint,
            };
        }
    }
    /**
     * Generate a QB64PE code snippet that adds _SAVEIMAGE calls for screenshot
     * capture, ready to paste into an existing program.
     */
    generateAnalysisTemplate(programType = "shapes", expectedElements) {
        const outFile = path.join(this.screenshotDir, "screenshot.png");
        const elemList = expectedElements?.length
            ? expectedElements.map((e) => `'   - ${e}`).join("\n")
            : "'   (none specified)";
        return [
            "' ─── QB64PE Screenshot capture via _SAVEIMAGE ──────────────────────────",
            "' Add this block at the END of your program (before END or _EXIT):",
            "'",
            `' Program type : ${programType}`,
            "' Expected elements:",
            elemList,
            "'",
            `_SAVEIMAGE "${outFile}"`,
            `PRINT "Screenshot saved to: ${outFile}"`,
            "' ─── Then call analyze_qb64pe_graphics_screenshot with that path ────────",
        ].join("\n");
    }
    /**
     * Clean up screenshots older than maxAge milliseconds (default: 24 h).
     */
    cleanupOldScreenshots(maxAge = 24 * 60 * 60 * 1000) {
        const files = this.getScreenshotFiles();
        const now = Date.now();
        for (const file of files) {
            try {
                const stats = fs.statSync(file);
                if (now - stats.mtime.getTime() > maxAge) {
                    fs.unlinkSync(file);
                    console.error(`Cleaned up old screenshot: ${file}`);
                }
            }
            catch (error) {
                console.warn(`Error cleaning up ${file}:`, error);
            }
        }
    }
}
exports.ScreenshotService = ScreenshotService;
//# sourceMappingURL=screenshot-service.js.map