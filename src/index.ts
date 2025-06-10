import { startHttpServer, stopHttpServer } from './http-server.js';
import { serverConfig } from './config.js';

// Main application startup
const main = async () => {
  try {
    console.error('🧠 Starting Elasticsearch Brain MCP Server...');
    console.error(`📊 Environment: ${serverConfig.environment}`);
    console.error(`🌐 Railway PORT env: ${process.env.PORT || 'NOT SET'}`);
    console.error(`🔌 Configured Port: ${serverConfig.port}`);
    console.error(`👥 Max connections: ${serverConfig.maxConnections}`);
    console.error(`🧠 Brain tools: 32 available`);
    
    // Start HTTP server with WebSocket support
    await startHttpServer();
    
    console.error('✅ Elasticsearch Brain MCP Server successfully started');
    console.error('📋 Available endpoints:');
    console.error(`   - Health check: GET /health`);
    console.error(`   - Authentication: POST /auth`);
    console.error(`   - HTTP MCP: POST /mcp/{userId}`);
    console.error(`   - Stream endpoint: GET /stream/{userId}`);
    console.error(`   - WebSocket MCP: ws://localhost:${serverConfig.port}/ws/{userId}`);
    console.error('🧠 Ready to serve brain intelligence!');
    
  } catch (error) {
    console.error('❌ Critical error during brain server startup:', error);
    process.exit(1);
  }
};

// Graceful shutdown handling
const shutdown = async (signal: string) => {
  console.error(`\n🔄 Received ${signal}. Shutting down brain server gracefully...`);
  
  try {
    await stopHttpServer();
    console.error('✅ Brain server shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during brain server shutdown:', error);
    process.exit(1);
  }
};

// Signal handlers
process.on('SIGINT', () => shutdown('SIGINT'));   // Ctrl+C
process.on('SIGTERM', () => shutdown('SIGTERM')); // Terminate signal

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception in brain server:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection in brain server at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the brain application
main();