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
});// Test endpoint to verify all 32 tools are accessible
app.get('/tools/list/:staffId?', async (req, res) => {
  try {
    const { getBrainToolsList } = await import('./brain-tools.js');
    const brainTools = getBrainToolsList();
    const staffId = req.params.staffId || 'test-staff';
    
    // Group tools by category for better visibility
    const toolsByCategory = {
      'Core Memory Operations (8 tools)': brainTools.filter(t => 
        ['create_entities', 'update_entities', 'delete_entities', 'search_nodes', 'open_nodes', 'add_observations', 'mark_important', 'get_recent'].includes(t.name)
      ),
      'Relationship Management (3 tools)': brainTools.filter(t => 
        ['create_relations', 'delete_relations', 'cross_zone_relations'].includes(t.name)
      ),
      'Memory Zone Management (8 tools)': brainTools.filter(t => 
        ['list_zones', 'create_zone', 'delete_zone', 'copy_entities', 'move_entities', 'merge_zones', 'zone_stats', 'zone_isolation'].includes(t.name)
      ),
      'AI-Powered Intelligence (4 tools)': brainTools.filter(t => 
        ['inspect_knowledge_graph', 'inspect_files', 'smart_search_ranking', 'context_aware_retrieval'].includes(t.name)
      ),
      'Sales Intelligence Extensions (9 tools)': brainTools.filter(t => 
        ['customer_profiling', 'conversation_analysis', 'objection_handling', 'pattern_recognition', 'conversion_tracking', 'response_suggestions', 'lead_scoring', 'pipeline_management', 'performance_analytics'].includes(t.name)
      ),
      'Utility Tools (1 tool)': brainTools.filter(t => 
        ['get_time_utc'].includes(t.name)
      )
    };
    
    res.json({
      success: true,
      staffId,
      totalTools: brainTools.length,
      toolsByCategory,
      allToolNames: brainTools.map(t => t.name),
      httpStreamEndpoint: `/mcp/${staffId}`,
      httpPostEndpoint: `/mcp/${staffId}`,
      websocketEndpoint: `/ws/${staffId}`,
      testExample: {
        url: `/mcp/${staffId}`,
        method: 'POST',
        body: {
          method: 'get_time_utc',
          params: {}
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test endpoint to verify deployment
app.get('/test-deploy', (req, res) => {
  res.json({
    status: 'deployed',
    timestamp: new Date().toISOString(),
    message: 'Elasticsearch Brain MCP ready for STAFF_ID routing',
    brainTools: 32,
    staffSupported: true
  });
});

// Stream endpoint for n8n MCP Client compatibility (EXACT WORKING PATTERN)
app.get('/stream/:staffId?', (req, res) => {
  const staffId = req.params.staffId;
  
  // Set headers for SSE (Server-Sent Events)
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Send initial connection message - EXACT FORMAT FROM WORKING VERSION
  res.write(`data: {"type":"connection","status":"connected","message":"Brain MCP Server stream ready","staffId":"${staffId || 'none'}","tools":32}\n\n`);

  // Keep connection alive with periodic heartbeat - EXACT PATTERN FROM WORKING VERSION
  const heartbeat = setInterval(() => {
    res.write('data: {"type":"heartbeat","timestamp":"' + new Date().toISOString() + '"}\n\n');
  }, 30000); // Every 30 seconds

  // Clean up on client disconnect - EXACT PATTERN FROM WORKING VERSION
  req.on('close', () => {
    clearInterval(heartbeat);
  });

  req.on('aborted', () => {
    clearInterval(heartbeat);
  });
});

// Handle POST requests to /stream (n8n MCP Client compatibility) - MISSING CRITICAL ENDPOINT
app.post('/stream/:staffId?', async (req, res) => {
  try {
    const { jsonrpc, method, params, id } = req.body;
    
    // Extract staffId from URL, headers, or body - EXACT PATTERN FROM WORKING VERSION
    const staffId = req.params.staffId || 
                   (req.headers['x-staff-id'] as string) || 
                   req.body.sessionId || 
                   req.query.sessionId as string;

    // Handle MCP protocol messages - EXACT PATTERN FROM WORKING VERSION
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
              name: 'elastic-brain-mcp',
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
        // Extract staffId dynamically from multiple sources - WORKING PATTERN
        const toolName = params.name;
        const toolArgs = params.arguments || {};
        
        if (!staffId) {
          return res.json({
            jsonrpc: '2.0',
            id: id,
            error: {
              code: -32602,
              message: 'STAFF_ID required. Add staff ID to URL: /stream/staff-alice-123'
            }
          });
        }
        
        try {
          const result = await processBrainToolCall(toolName, toolArgs, staffId);
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
    console.error('POST /stream error:', error);
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

// Handle POST requests to /stream (n8n MCP Client compatibility)
app.post('/stream/:staffId?', async (req, res) => {
  try {
    const { jsonrpc, method, params, id } = req.body;
    const staffId = req.params.staffId || 
                   (req.headers['x-staff-id'] as string) || 
                   req.body.sessionId || 
                   req.query.sessionId as string ||
                   'default';

    // Debug logging
    console.error(`[DEBUG] POST /stream request: method=${method}, staffId=${staffId}, hasParams=${!!params}`);

    if (!staffId || staffId === 'default') {
      return res.status(400).json({
        jsonrpc: '2.0',
        id: id,
        error: {
          code: -32602,
          message: 'STAFF_ID required. Provide via URL parameter (/stream/STAFF_ID), X-Staff-ID header, or sessionId in body/query.'
        }
      });
    }

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
        // Import and return all 32 brain tools (like original implementation)
        const { getBrainToolsList } = await import('./brain-tools.js');
        const brainTools = getBrainToolsList();
        
        console.error(`[DEBUG] Returning ${brainTools.length} brain tools for staff ${staffId}`);
        console.error(`[DEBUG] Tools available: ${brainTools.map(t => t.name).join(', ')}`);
        
        res.json({
          jsonrpc: '2.0',
          id: id,
          result: { 
            tools: brainTools,
            totalTools: brainTools.length,
            staffId: staffId,
            categories: {
              'Core Memory Operations': 8,
              'Relationship Management': 3, 
              'Memory Zone Management': 8,
              'AI-Powered Intelligence': 4,
              'Sales Intelligence Extensions': 9,
              'Utility Tools': 1
            }
          }
        });
        break;

      case 'tools/call':
        try {
          const toolName = params.name;
          const toolArgs = params.arguments || {};
          
          if (!toolName) {
            return res.json({
              jsonrpc: '2.0',
              id: id,
              error: {
                code: -32602,
                message: 'Tool name is required'
              }
            });
          }

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

// Direct MCP endpoint for staff - MAIN ENDPOINT FOR N8N (matches working Facebook pattern)
app.get('/mcp/:staffId', async (req, res) => {
  // n8n MCP Client first tries GET request for SSE stream
  const staffId = req.params.staffId;
  
  // Set headers for SSE (Server-Sent Events) - EXACT PATTERN FROM WORKING VERSION
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Send initial connection message - EXACT FORMAT FROM WORKING VERSION
  res.write(`data: {"type":"connection","status":"connected","message":"Brain MCP Server stream ready","staffId":"${staffId || 'none'}"}\n\n`);

  // Keep connection alive with periodic heartbeat - EXACT PATTERN FROM WORKING VERSION
  const heartbeat = setInterval(() => {
    res.write('data: {"type":"heartbeat","timestamp":"' + new Date().toISOString() + '"}\n\n');
  }, 30000); // Every 30 seconds

  // Clean up on client disconnect - EXACT PATTERN FROM WORKING VERSION
  req.on('close', () => {
    clearInterval(heartbeat);
  });

  req.on('aborted', () => {
    clearInterval(heartbeat);
  });
});

app.post('/mcp/:staffId', async (req, res) => {
  try {
    const { staffId } = req.params;
    const { method, params, jsonrpc, id } = req.body;

    if (!staffId || staffId === 'undefined') {
      return res.status(400).json({
        error: 'STAFF_ID required',
        message: 'Provide STAFF_ID in URL: /mcp/{STAFF_ID}',
        example: 'POST https://elastic-brain-production.up.railway.app/mcp/staff-alice-123'
      });
    }

    // Handle MCP protocol messages (when called from n8n via MCP Client)
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
            result: { 
              tools: brainTools,
              totalTools: brainTools.length,
              staffId: staffId
            }
          });
          return;

        case 'tools/call':
          const toolName = params.name;
          const toolArgs = params.arguments || {};
          
          if (!toolName) {
            return res.json({
              jsonrpc: '2.0',
              id: id,
              error: { code: -32602, message: 'Tool name is required' }
            });
          }

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

        default:
          res.json({ jsonrpc: '2.0', id: id, result: {} });
          return;
      }
    }

    // Handle direct tool calls (non-MCP format)
    if (method) {
      const response = await processBrainToolCall(method, params || {}, staffId);
      res.json(response);
    } else {
      const toolName = req.body.name || req.body.toolName;
      const toolArgs = req.body.arguments || req.body.params || req.body.args || {};
      
      if (toolName) {
        const response = await processBrainToolCall(toolName, toolArgs, staffId);
        res.json(response);
      } else {
        return res.status(400).json({
          error: 'Tool name required',
          message: 'Provide either "method" or "name" field with the brain tool name',
          availableFormat1: '{"method": "create_entities", "params": {...}}',
          availableFormat2: '{"name": "create_entities", "arguments": {...}}'
        });
      }
    }
  } catch (error) {
    console.error('MCP request error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process brain request',
      details: error instanceof Error ? error.message : 'Unknown error'
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
          
          console.error(`[DEBUG] WebSocket tools/list: Returning ${brainTools.length} brain tools for staff ${staffId}`);
          
          const response = {
            jsonrpc: '2.0',
            id: message.id,
            result: { 
              tools: brainTools,
              totalTools: brainTools.length,
              staffId: staffId,
              transport: 'WebSocket'
            }
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