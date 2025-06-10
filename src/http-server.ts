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

// Health check endpoint (Railway-optimized)
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

// Root endpoint for Railway health checks
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Elasticsearch Brain MCP Server',
    status: 'running',
    tools: 32,
    endpoints: {
      health: '/health',
      mcp: '/mcp/{STAFF_ID}',
      stream: '/stream/{STAFF_ID}'
    }
  });
});// Test endpoint to verify deployment
app.get('/test-deploy', (req, res) => {
  res.json({
    status: 'deployed',
    timestamp: new Date().toISOString(),
    message: 'Elasticsearch Brain MCP ready for STAFF_ID routing',
    brainTools: 32,
    staffSupported: true
  });
});

// Stream endpoint for n8n MCP Client compatibility (EXACTLY like Facebook MCP)
app.get('/stream/:staffId?', (req, res) => {
  // Set headers for SSE (Server-Sent Events) - EXACT SAME as Facebook MCP
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Send initial connection message - SAME PATTERN as Facebook MCP
  const staffId = req.params.staffId;
  res.write(`data: {"type":"connection","status":"connected","message":"Brain MCP Server stream ready","staffId":"${staffId || 'none'}"}\n\n`);

  // Keep connection alive with periodic heartbeat - EXACT SAME as Facebook MCP
  const heartbeat = setInterval(() => {
    res.write('data: {"type":"heartbeat","timestamp":"' + new Date().toISOString() + '"}\n\n');
  }, 30000); // Every 30 seconds

  // Clean up on client disconnect - EXACT SAME as Facebook MCP
  req.on('close', () => {
    clearInterval(heartbeat);
  });

  req.on('aborted', () => {
    clearInterval(heartbeat);
  });
});

// Handle POST requests to /stream (n8n MCP Client compatibility)
app.post('/stream/:staffId?', async (req, res) => {
  try {
    const { jsonrpc, method, params, id } = req.body;
    const staffId = req.params.staffId || 
                   (req.headers['x-staff-id'] as string) || 
                   'default';

    switch (method) {
      case 'initialize':
        res.json({
          jsonrpc: '2.0',
          id: id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: { tools: {}, resources: {}, prompts: {} },
            serverInfo: { name: 'elastic-brain-mcp', version: '1.0.0', staffId }
          }
        });
        break;      case 'tools/list':
        // Return brain tools directly (like Facebook MCP pattern)
        res.json({
          jsonrpc: '2.0',
          id: id,
          result: {
            tools: [
              { name: 'get_time_utc', description: 'Get current UTC time', inputSchema: { type: 'object', properties: {} } },
              { name: 'create_entities', description: 'Create entities in brain memory', inputSchema: { type: 'object', properties: { entities: { type: 'array' } }, required: ['entities'] } },
              { name: 'search_nodes', description: 'Search brain entities with AI', inputSchema: { type: 'object', properties: { query: { type: 'string' }, informationNeeded: { type: 'string' }, reason: { type: 'string' } }, required: ['query', 'informationNeeded', 'reason'] } },
              { name: 'create_zone', description: 'Create memory zone', inputSchema: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' } }, required: ['name'] } },
              { name: 'list_zones', description: 'List memory zones', inputSchema: { type: 'object', properties: {} } },
              { name: 'inspect_knowledge_graph', description: 'AI-driven knowledge graph inspection', inputSchema: { type: 'object', properties: { information_needed: { type: 'string' }, keywords: { type: 'array' } }, required: ['information_needed', 'keywords'] } }
            ]
          }
        });
        break;

      case 'tools/call':
        try {
          const result = await processBrainToolCall(params.name, params.arguments || {}, staffId);
          res.json({
            jsonrpc: '2.0',
            id: id,
            result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
          });
        } catch (error) {
          res.json({
            jsonrpc: '2.0',
            id: id,
            error: { code: -32603, message: error instanceof Error ? error.message : 'Unknown error' }
          });
        }
        break;

      default:
        res.json({ jsonrpc: '2.0', id: id, result: {} });
    }
  } catch (error) {
    res.status(500).json({
      jsonrpc: '2.0',
      id: req.body?.id || null,
      error: { code: -32603, message: 'Internal error' }
    });
  }
});

// Direct MCP endpoint for staff - NO AUTH NEEDED
app.post('/mcp/:staffId', async (req, res) => {
  try {
    const { staffId } = req.params;
    const { method, params } = req.body;

    if (!staffId || staffId === 'undefined') {
      return res.status(400).json({
        error: 'STAFF_ID required',
        message: 'Provide STAFF_ID in URL: /mcp/{STAFF_ID}'
      });
    }

    const response = await processBrainToolCall(method, params || {}, staffId);
    res.json(response);
  } catch (error) {
    console.error('MCP request error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process brain request'
    });
  }
});// WebSocket server for real-time MCP protocol
const wss = new WebSocketServer({ 
  server,
  path: '/ws',
  maxPayload: 16 * 1024 * 1024
});

wss.on('connection', async (ws: WebSocket, req) => {
  try {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const pathParts = url.pathname.split('/');
    const staffId = pathParts[2] || 'default';

    console.error(`Brain MCP WebSocket connected for staff: ${staffId}`);

    ws.on('message', async (data: WebSocket.Data) => {
      let message: any = null;
      try {
        message = JSON.parse(data.toString());
        
        if (message.method === 'initialize') {
          const response = {
            jsonrpc: '2.0',
            id: message.id,
            result: {
              protocolVersion: '2024-11-05',
              capabilities: { tools: {}, prompts: {}, resources: {} },
              serverInfo: { name: 'elastic-brain-mcp', version: '1.0.0', staffId }
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
          const toolResult = await processBrainToolCall(message.params.name, message.params.arguments || {}, staffId);
          const response = {
            jsonrpc: '2.0',
            id: message.id,
            result: { content: [{ type: 'text', text: JSON.stringify(toolResult, null, 2) }] }
          };
          ws.send(JSON.stringify(response));
          return;
        }

        const response = { jsonrpc: '2.0', id: message.id, result: {} };
        ws.send(JSON.stringify(response));

      } catch (error) {
        console.error(`Error processing brain MCP message from staff ${staffId}:`, error);
        const errorResponse = {
          jsonrpc: '2.0',
          id: message?.id || null,
          error: { code: -32603, message: error instanceof Error ? error.message : 'Unknown error' }
        };
        ws.send(JSON.stringify(errorResponse));
      }
    });

    ws.on('close', () => {
      console.error(`Brain MCP WebSocket disconnected for staff: ${staffId}`);
    });

  } catch (error) {
    console.error('WebSocket connection error:', error);
    ws.close(1011, 'Internal server error');
  }
});// Import brain tool processor
async function processBrainToolCall(toolName: string, args: any, staffId: string): Promise<any> {
  const { processBrainTool } = await import('./brain-processor.js');
  return processBrainTool(toolName, args, staffId);
}

// Server startup and shutdown functions
let httpServer: any = null;

export async function startHttpServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      httpServer = server.listen(serverConfig.port, '0.0.0.0', () => {
        console.error(`🧠 Elasticsearch Brain MCP Server started on port ${serverConfig.port}`);
        console.error(`📊 Environment: ${serverConfig.environment}`);
        console.error(`🔗 Health check: External access enabled`);
        console.error(`🧠 Staff endpoint: /mcp/{STAFF_ID}`);
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
    if (httpServer) {
      httpServer.close(() => {
        staffBrainManager.cleanup();
        console.error('🧠 Elasticsearch Brain MCP Server stopped');
        resolve();
      });
    } else {
      resolve();
    }
  });
}