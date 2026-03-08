export interface ReadSourceFileResult {
    sourceCode: string;
    extension: string;
}
export declare function readSourceFileForTool(sourceFilePath: string, allowedExtensions?: string[]): Promise<ReadSourceFileResult>;
//# sourceMappingURL=source-file-utils.d.ts.map