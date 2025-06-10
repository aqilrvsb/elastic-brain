import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { serverConfig, staffBrainManager } from './config.js';

const rateLimiter = new RateLimiterMemory({
  points: serverConfig.rateLimit.maxRequests,
  duration: serverConfig.rateLimit.windowMs / 1000,
});

const app = express();
const server = createServer(app);

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors({
  origin: serverConfig.corsOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Staff-ID'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    activeStaff: staffBrainManager.getActiveStaffCount(),
    maxConnections: serverConfig.maxConnections,
    environment: serverConfig.environment,
    service: 'Elasticsearch Brain MCP Server',
    railway: 'ready',
    port: serverConfig.port
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Elasticsearch Brain MCP Server',
    status: 'running',
    tools: 32,
    endpoints: {
      health: '/health',
      stream: '/stream',
      mcp: '/mcp/{STAFF_ID}'
    }
  });
});

// Stream endpoint for n8n MCP Client compatibility (GET for SSE, POST for MCP messages)
// EXACT COPY FROM WORKING FACEBOOK MCP
app.get('/stream/:userId?', (req, res) => {
  // Set headers for SSE (Server-Sent Events)
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Send initial connection message
  const userId = req.params.userId;
  res.write(`data: {"type":"connection","status":"connected","message":"Brain MCP Server stream ready","userId":"${userId || 'none'}"}\n\n`);

  // Keep connection alive with periodic heartbeat
  const heartbeat = setInterval(() => {
    res.write('data: {"type":"heartbeat","timestamp":"' + new Date().toISOString() + '"}\n\n');
  }, 30000); // Every 30 seconds

  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(heartbeat);
  });

  req.on('aborted', () => {
    clearInterval(heartbeat);
  });
});

// Handle POST requests to /stream (n8n MCP Client compatibility)
// EXACT COPY FROM WORKING FACEBOOK MCP
app.post('/stream/:userId?', async (req, res) => {
  try {
    const { jsonrpc, method, params, id } = req.body;

    // Handle MCP protocol messages
    switch (method) {
      case 'initialize':
        res.json({
          jsonrpc: '2.0',
          id: id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {},
              resources: {},
              prompts: {}
            },
            serverInfo: {
              name: 'brain-mcp',
              version: '1.0.0'
            }
          }
        });
        break;

      case 'tools/list':
        const { getBrainToolsList } = await import('./brain-tools.js');
        const brainTools = getBrainToolsList();
        
        res.json({
          jsonrpc: '2.0',
          id: id,
          result: {
            tools: brainTools
          }
        });
        break;

      case 'tools/call':
        // Route tool calls to the main MCP endpoint with session from params
        const toolName = params.name;
        const toolArgs = params.arguments || {};
        
        // Extract userId dynamically from multiple sources
        const userId = req.params.userId || 
                      (req.headers['x-user-id'] as string) || 
                      req.body.sessionId || 
                      req.query.sessionId as string;
        
        if (!userId) {
          return res.status(400).json({
            jsonrpc: '2.0',
            id: id,
            error: {
              code: -32602,
              message: 'Session ID required. Provide via URL parameter (/stream/SESSION_ID), X-User-ID header, or sessionId in body/query.'
            }
          });
        }
        
        try {
          const result = await processBrainToolCall(toolName, toolArgs, userId);
          res.json({
            jsonrpc: '2.0',
            id: id,
            result: {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2)
                }
              ]
            }
          });
        } catch (error) {
          res.json({
            jsonrpc: '2.0',
            id: id,
            error: {
              code: -32603,
              message: error instanceof Error ? error.message : 'Unknown error'
            }
          });
        }
        break;

      default:
        res.json({
          jsonrpc: '2.0',
          id: id,
          result: {}
        });
    }
  } catch (error) {
    res.status(500).json({
      jsonrpc: '2.0',
      id: req.body?.id || null,
      error: {
        code: -32603,
        message: 'Internal error'
      }
    });
  }
});

// EXACT COPY FROM WORKING FACEBOOK MCP
app.post('/mcp/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { method, params } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: 'Invalid session',
        message: 'User session not found or expired'
      });
    }

    const response = await processBrainToolCall(method, params || {}, userId);
    res.json(response);
  } catch (error) {
    console.error('MCP request error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process MCP request'
    });
  }
});

// Import brain tool processor
async function processBrainToolCall(toolName: string, args: any, staffId: string): Promise<any> {
  const { processBrainTool } = await import('./brain-processor.js');
  return processBrainTool(toolName, args, staffId);
}

// Server startup
export async function startHttpServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const httpServer = server.listen(serverConfig.port, '0.0.0.0', () => {
        console.error(`🧠 Brain MCP Server started on port ${serverConfig.port}`);
        console.error(`📊 Environment: ${serverConfig.environment}`);
        console.error(`🛠️ Available tools: 32 brain tools`);
        console.error(`👥 Ready for STAFF_ID routing!`);
        resolve();
      });

      httpServer.on('error', (error: any) => {
        console.error('Server startup error:', error);
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function stopHttpServer(): Promise<void> {
  return new Promise((resolve) => {
    console.error('🧠 Brain MCP Server stopped');
    resolve();
  });
}
