// MCP server creation for brain tools
export function createMcpServer(userId: string): any {
  // Return a mock MCP server instance
  // The actual brain tool processing is handled in brain-processor.js
  return {
    userId,
    initialized: true,
    serverInfo: {
      name: 'elastic-brain-mcp',
      version: '1.0.0'
    }
  };
}