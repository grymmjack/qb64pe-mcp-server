# QB64PE MCP Server Configuration Examples

## Claude Desktop Configuration

To use this MCP server with Claude Desktop, add this configuration to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "qb64pe": {
      "command": "node",
      "args": ["C:/path/to/qb64pe-mcp-server/build/index.js"],
      "env": {}
    }
  }
}
```

### Windows Claude Desktop Config Location
`%APPDATA%\Claude\claude_desktop_config.json`

### macOS Claude Desktop Config Location
`~/Library/Application Support/Claude/claude_desktop_config.json`

### Linux Claude Desktop Config Location
`~/.config/Claude/claude_desktop_config.json`

## Example MCP Client Configuration

For other MCP-compatible clients:

```json
{
  "server": {
    "name": "qb64pe",
    "transport": {
      "type": "stdio",
      "command": "node",
      "args": ["build/index.js"],
      "cwd": "/path/to/qb64pe-mcp-server"
    }
  }
}
```

## Environment Variables

The server supports these optional environment variables:

- `QB64PE_CACHE_SIZE`: Maximum number of cached wiki pages (default: 100)
- `QB64PE_CACHE_TTL`: Cache time-to-live in milliseconds (default: 3600000 = 1 hour)
- `QB64PE_WIKI_BASE_URL`: Base URL for QB64PE wiki (default: https://qb64phoenix.com/qb64wiki/)

Example with environment variables:

```json
{
  "mcpServers": {
    "qb64pe": {
      "command": "node",
      "args": ["C:/path/to/qb64pe-mcp-server/build/index.js"],
      "env": {
        "QB64PE_CACHE_SIZE": "200",
        "QB64PE_CACHE_TTL": "7200000"
      }
    }
  }
}
```

## Testing the Server

To test if the server is working correctly:

1. Start the server: `npm start`
2. You should see: "QB64PE MCP Server started successfully"
3. The server will listen for MCP protocol messages on stdin/stdout

## Troubleshooting

### Common Issues

1. **"Cannot find module" error**
   - Ensure you've run `npm install` and `npm run build`
   - Check that the path to `build/index.js` is correct

2. **"Permission denied" error**
   - Ensure Node.js has permission to read the project directory
   - Check file permissions on the build directory

3. **Network timeouts during wiki search**
   - Check internet connectivity
   - The server includes retry logic for network requests

### Debug Mode

To run in debug mode with verbose logging:

```bash
DEBUG=qb64pe:* npm start
```

This will show detailed information about wiki requests, caching, and tool invocations.
