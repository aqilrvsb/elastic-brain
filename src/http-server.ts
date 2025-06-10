import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { serverConfig, userSessionManager, UserCredentials } from './config.js';
import { createMcpServer } from './mcp-server.js';

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
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-ID'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    activeConnections: userSessionManager.getActiveSessionCount(),
    maxConnections: serverConfig.maxConnections,
    environment: serverConfig.environment,
    service: 'Elasticsearch Brain MCP Server'
  });
});

// Test endpoint to verify deployment
app.get('/test-deploy', (req, res) => {
  res.json({
    status: 'deployed',
    timestamp: new Date().toISOString(),
    message: 'Elasticsearch Brain MCP Stream endpoint ready',
    deployTime: new Date().toISOString(),
    brainTools: 32
  });
});

// Stream endpoint for n8n MCP Client compatibility (GET for SSE, POST for MCP messages)
app.get('/stream/:userId?', (req, res) => {
  // Set headers for SSE (Server-Sent Events)
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  const userId = req.params.userId;
  res.write(`data: {"type":"connection","status":"connected","message":"Elasticsearch Brain MCP Server stream ready","userId":"${userId || 'none'}","tools":32}\n\n`);  // Keep connection alive with periodic heartbeat
  const heartbeat = setInterval(() => {
    res.write('data: {"type":"heartbeat","timestamp":"' + new Date().toISOString() + '","service":"brain-mcp"}\n\n');
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
app.post('/stream/:userId?', async (req, res) => {
  try {
    const { jsonrpc, method, params, id } = req.body;
    const userId = req.params.userId || 
                  (req.headers['x-user-id'] as string) || 
                  req.body.sessionId || 
                  req.query.sessionId as string;

    // Handle MCP protocol messages
    switch (method) {
      case 'initialize':
        res.json({
          jsonrpc: '2.0',
          id: id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {}, resources: {}, prompts: {} },
            serverInfo: { name: 'elastic-brain-mcp', version: '1.0.0' }
          }
        });
        break;      case 'tools/list':
        // Import brain tools list from the original MCP server
        const { getBrainToolsList } = await import('./brain-tools.js');
        const brainTools = getBrainToolsList();
        
        res.json({
          jsonrpc: '2.0',
          id: id,
          result: { tools: brainTools }
        });
        break;

      case 'tools/call':
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
          const result = await processBrainToolCall(params.name, params.arguments || {}, userId);
          res.json({
            jsonrpc: '2.0',
            id: id,
            result: {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
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
        break;      default:
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
      error: { code: -32603, message: 'Internal error' }
    });
  }
});

// Authentication endpoint for creating brain sessions
app.post('/auth', async (req, res) => {
  try {
    const { elasticsearchUrl, elasticsearchApiKey, groqApiKey } = req.body;
    
    if (!elasticsearchUrl || !elasticsearchApiKey) {
      return res.status(400).json({
        error: 'Missing required credentials',
        required: ['elasticsearchUrl', 'elasticsearchApiKey']
      });
    }

    if (userSessionManager.getActiveSessionCount() >= serverConfig.maxConnections) {
      return res.status(503).json({
        error: 'Server at capacity',
        message: 'Maximum number of connections reached. Please try again later.'
      });
    }

    const userId = uuidv4();
    const credentials: UserCredentials = {
      elasticsearchUrl,
      elasticsearchApiKey,
      groqApiKey: groqApiKey || process.env.GROQ_API_KEY,
      userId
    };    const result = userSessionManager.createSession(credentials);
    
    if (!result.success) {
      return res.status(400).json({
        error: 'Authentication failed',
        message: result.error
      });
    }

    res.json({
      success: true,
      userId,
      message: 'Brain session created successfully',
      endpoints: {
        websocket: `/ws/${userId}`,
        http: `/mcp/${userId}`,
        stream: `/stream/${userId}`
      },
      brainTools: 32,
      ready: true
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process authentication request'
    });
  }
});

// MCP endpoint for direct tool calls
app.post('/mcp/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { method, params } = req.body;

    const session = userSessionManager.getSession(userId);
    if (!session) {
      return res.status(401).json({
        error: 'Invalid session',
        message: 'User session not found or expired'
      });
    }    const response = await processBrainToolCall(method, params || {}, userId);
    res.json(response);
  } catch (error) {
    console.error('MCP request error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process brain request'
    });
  }
});

// WebSocket server for real-time MCP protocol
const wss = new (WebSocket as any).Server({ 
  server,
  path: '/ws',
  maxPayload: 16 * 1024 * 1024
});

wss.on('connection', async (ws: WebSocket, req) => {
  try {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const pathParts = url.pathname.split('/');
    const userId = pathParts[2];

    if (!userId) {
      ws.close(1008, 'User ID required in path');
      return;
    }

    const session = userSessionManager.getSession(userId);
    if (!session) {
      ws.close(1008, 'Invalid or expired session');
      return;
    }

    console.error(`Brain MCP WebSocket connected for user: ${userId}`);

    // Create MCP server instance for this user
    const mcpServer = createMcpServer(userId);    // Handle MCP protocol messages
    ws.on('message', async (data: WebSocket.Data) => {
      let message: any = null;
      try {
        message = JSON.parse(data.toString());
        console.error(`Brain MCP message from user ${userId}:`, message.method);
        
        if (message.method === 'initialize') {
          const response = {
            jsonrpc: '2.0',
            id: message.id,
            result: {
              protocolVersion: '2024-11-05',
              capabilities: { tools: {}, prompts: {}, resources: {} },
              serverInfo: { name: 'elastic-brain-mcp', version: '1.0.0' }
            }
          };
          ws.send(JSON.stringify(response));
          return;
        }

        if (message.method === 'tools/list') {
          const { getBrainToolsList } = await import('./brain-tools.js');
          const brainTools = getBrainToolsList();
          
          const response = {
            jsonrpc: '2.0',
            id: message.id,
            result: { tools: brainTools }
          };
          ws.send(JSON.stringify(response));
          return;
        }

        if (message.method === 'tools/call') {
          const toolResult = await processBrainToolCall(message.params.name, message.params.arguments || {}, userId);
          const response = {
            jsonrpc: '2.0',
            id: message.id,
            result: { content: [{ type: 'text', text: JSON.stringify(toolResult, null, 2) }] }
          };
          ws.send(JSON.stringify(response));
          return;
        }        // Default response for other methods
        const response = { jsonrpc: '2.0', id: message.id, result: {} };
        ws.send(JSON.stringify(response));

      } catch (error) {
        console.error(`Error processing brain MCP message from user ${userId}:`, error);
        const errorResponse = {
          jsonrpc: '2.0',
          id: message?.id || null,
          error: { code: -32603, message: error instanceof Error ? error.message : 'Unknown error' }
        };
        ws.send(JSON.stringify(errorResponse));
      }
    });

    ws.on('close', () => {
      console.error(`Brain MCP WebSocket disconnected for user: ${userId}`);
    });

    ws.on('error', (error) => {
      console.error(`Brain MCP WebSocket error for user ${userId}:`, error);
    });

  } catch (error) {
    console.error('WebSocket connection error:', error);
    ws.close(1011, 'Internal server error');
  }
});

// Import brain tool processor
async function processBrainToolCall(toolName: string, args: any, userId: string): Promise<any> {
  const { processBrainTool } = await import('./brain-processor.js');
  return processBrainTool(toolName, args, userId);
}

// Server startup and shutdown functions
let httpServer: any = null;export async function startHttpServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      httpServer = server.listen(serverConfig.port, () => {
        console.error(`🧠 Elasticsearch Brain MCP Server started on port ${serverConfig.port}`);
        console.error(`📊 Environment: ${serverConfig.environment}`);
        console.error(`🔗 Health check: http://localhost:${serverConfig.port}/health`);
        console.error(`🧠 Stream endpoint: http://localhost:${serverConfig.port}/stream`);
        console.error(`🛠️ Available tools: 32 brain tools`);
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
    if (httpServer) {
      httpServer.close(() => {
        console.error('🧠 Elasticsearch Brain MCP Server stopped');
        resolve();
      });
    } else {
      resolve();
    }
  });
}