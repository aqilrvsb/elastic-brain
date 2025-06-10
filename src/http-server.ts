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
      stream: '/stream/{STAFF_ID}',
      mcp: '/mcp/{STAFF_ID}'
    }
  });
});

// Stream endpoint for n8n MCP Client - GET for SSE connection (NO STAFF_ID)
app.get('/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  res.write(`data: {"type":"connection","status":"connected","message":"Brain MCP Server stream ready","tools":32}\n\n`);

  const heartbeat = setInterval(() => {
    res.write('data: {"type":"heartbeat","timestamp":"' + new Date().toISOString() + '"}\n\n');
  }, 30000);

  req.on('close', () => {
    clearInterval(heartbeat);
  });

  req.on('aborted', () => {
    clearInterval(heartbeat);
  });
});

// Handle n8n sending tool calls to wrong endpoint - redirect to correct pattern
app.post('/stream', async (req, res) => {
  console.error(`[ERROR] n8n sent tool call to POST /stream instead of POST /mcp/staffId`);
  console.error(`[ERROR] Request body:`, JSON.stringify(req.body, null, 2));
  
  res.status(400).json({
    error: 'Wrong endpoint',
    message: 'Tool calls should go to /mcp/staff-YOUR_ID, not /stream',
    correction: 'Update Messages Post Endpoint to: https://elastic-brain-production.up.railway.app/mcp/staff-alice-123',
    receivedAt: '/stream',
    shouldBeAt: '/mcp/staff-alice-123'
  });
});

// MCP endpoint for n8n tool calls (Messages Post Endpoint)
app.post('/mcp/:staffId', async (req, res) => {
  try {
    const { staffId } = req.params;
    const { method, params, jsonrpc, id } = req.body;

    console.error(`[DEBUG] POST /mcp/${staffId} - Method: ${method}`);

    if (!staffId || staffId === 'undefined') {
      return res.status(400).json({
        error: 'STAFF_ID required',
        message: 'Provide STAFF_ID in URL: /mcp/{STAFF_ID}'
      });
    }

    // Handle MCP protocol messages
    if (jsonrpc && method) {
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
          return;

        case 'tools/list':
          const { getBrainToolsList } = await import('./brain-tools.js');
          const brainTools = getBrainToolsList();
          
          res.json({
            jsonrpc: '2.0',
            id: id,
            result: { tools: brainTools }
          });
          return;

        case 'tools/call':
          const toolName = params.name;
          const toolArgs = params.arguments || {};
          
          try {
            const result = await processBrainToolCall(toolName, toolArgs, staffId);
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
          return;
      }
    }

    // Handle direct tool calls
    if (method) {
      const response = await processBrainToolCall(method, params || {}, staffId);
      res.json(response);
    } else {
      return res.status(400).json({
        error: 'Method required',
        message: 'Provide method field'
      });
    }
  } catch (error) {
    console.error('MCP request error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process brain request'
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
        console.error(`🧠 Elasticsearch Brain MCP Server started on port ${serverConfig.port}`);
        console.error(`📊 Environment: ${serverConfig.environment}`);
        console.error(`🧠 Staff endpoint: /mcp/{STAFF_ID} and /stream/{STAFF_ID}`);
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
    console.error('🧠 Elasticsearch Brain MCP Server stopped');
    resolve();
  });
}
