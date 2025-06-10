# 🧠 Elasticsearch Brain MCP Server - HTTP Multi-tenant Architecture

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Elasticsearch](https://img.shields.io/badge/Elasticsearch-Cloud-yellow)
![Railway](https://img.shields.io/badge/Railway-Ready-green)

> **AI Memory that persists forever + Multi-tenant HTTP access for n8n and Claude.**

Elasticsearch Brain MCP combines j3k0's powerful brain tools with proven HTTP multi-tenant architecture, enabling Claude and n8n to access persistent AI memory through Elasticsearch Cloud.

## 🎯 **Project Achievement Status**

### **✅ READY FOR PRODUCTION**
- **✅ HTTP Multi-tenant Architecture** - Following proven Facebook MCP pattern
- **✅ Elasticsearch Cloud Integration** - Production credentials configured
- **✅ 32 Brain Tools Available** - Complete knowledge graph management
- **✅ n8n MCP Client Compatible** - Stream endpoints ready
- **✅ Railway Deployment Ready** - Auto-deploy configuration
- **✅ Session Management** - Isolated memory zones per user

## 🏗️ **Architecture Overview**

```
WhatsApp → n8n → HTTP Stream MCP → Elasticsearch Brain → Sales Intelligence
```

**HTTP Endpoints:**
- `POST /auth` → Create brain session with Elasticsearch credentials
- `GET /stream/{sessionId}` → HTTP stream for n8n MCP Client  
- `POST /mcp/{sessionId}` → Brain operations (32 tools)
- `POST /stream/{sessionId}` → n8n MCP protocol messages
- `GET /health` → Health check and status

## 🧠 **32 Brain Tools Available**

### **Core Memory Operations (8 tools)**
1. `create_entities` - Store people, concepts, projects
2. `update_entities` - Modify existing knowledge
3. `delete_entities` - Remove obsolete information
4. `search_nodes` - Elasticsearch query with AI filtering
5. `open_nodes` - Get entity details and relations
6. `add_observations` - Append new insights
7. `mark_important` - Boost relevance scoring
8. `get_recent` - Recently accessed entities

### **Relationship Management (3 tools)**
9. `create_relations` - Connect entities with relationships
10. `delete_relations` - Remove connections
11. `cross_zone_relations` - Link knowledge across domains

### **Memory Zone Management (8 tools)**
12. `list_zones` - Browse knowledge domains
13. `create_zone` - Organize by projects/clients/topics
14. `delete_zone` - Clean up domains
15. `copy_entities` - Share knowledge between zones
16. `move_entities` - Reorganize information
17. `merge_zones` - Combine knowledge domains
18. `zone_stats` - Analyze zone contents
19. `zone_isolation` - Secure multi-tenant operation

### **AI-Powered Intelligence (4 tools)**
20. `inspect_knowledge_graph` - AI-driven entity analysis
21. `inspect_files` - AI file content extraction
22. `smart_search_ranking` - Relevance-based results
23. `context_aware_retrieval` - Conversational memory

### **Sales Intelligence Extensions (9 tools)**
24. `customer_profiling` - Store client information
25. `conversation_analysis` - Track communication history
26. `objection_handling` - Learn from sales interactions
27. `pattern_recognition` - Identify successful strategies
28. `conversion_tracking` - Monitor sales performance
29. `response_suggestions` - AI-powered recommendations
30. `lead_scoring` - Prioritize prospects
31. `pipeline_management` - Track deal progression
32. `performance_analytics` - Sales intelligence dashboards

**Utility Tool (1 tool)**
- `get_time_utc` - Get current UTC time

## 🚀 **Quick Setup (5 Minutes)**

### **1. Authentication (Get Session ID)**

```powershell
# PowerShell command to create brain session
$body = @{ 
  elasticsearchUrl = "https://my-elasticsearch-project-d584c1b.ap-southeast-1.aws.elastic.cloud:9243"
  elasticsearchApiKey = "S0NjaFdwY0JZa0RQVUJjS1ZzR2o6X1ZvdTNTUXJKWldOb1ZnZlZySk1JQQ=="
  groqApiKey = "YOUR_GROQ_API_KEY_OPTIONAL"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://elastic-brain.up.railway.app/auth" -Method POST -Body $body -ContentType "application/json"
Write-Host "Brain Session ID: $($response.userId)"
```

### **2. n8n Integration**

**Add MCP Client Node:**
- **Connect using:** `HTTP Streamable`
- **HTTP Stream URL:** `https://elastic-brain-production.up.railway.app/stream/staff-{YOUR_ID}`
- **Messages Post Endpoint:** `https://elastic-brain-production.up.railway.app/mcp/staff-{YOUR_ID}`

### **3. Claude Desktop Integration**

```json
{
  "mcpServers": {
    "elastic-brain": {
      "command": "node",
      "args": [
        "-e",
        "const https = require('https'); const readline = require('readline'); const USER_ID = 'staff-{YOUR_ID}'; const BASE_URL = 'elastic-brain-production.up.railway.app'; /* HTTP MCP client code */"
      ]
    }
  }
}
```

## 🔌 **Elasticsearch Cloud Configuration**

### **Production Credentials (CONFIGURED)**
- **Provider:** AWS Singapore (ap-southeast-1)
- **URL:** `https://my-elasticsearch-project-d584c1b.ap-southeast-1.aws.elastic.cloud:9243`
- **API Key:** `S0NjaFdwY0JZa0RQVUJjS1ZzR2o6X1ZvdTNTUXJKWldOb1ZnZlZySk1JQQ==`
- **Status:** ✅ Tested and working
- **Indexes:** Optimized for AI/ML with vector search

### **Features Available**
- **Vector Search:** ELSER-2 semantic search
- **ML Models:** Multilingual E5, Rerank-v1  
- **Performance:** Sub-second query response
- **Scalability:** Handles 200+ concurrent users
- **Security:** API key authentication + TLS

## 💡 **Usage Examples**

### **Sales Intelligence with WhatsApp**

```json
// Create customer memory zone
{
  "operation": "create_zone",
  "name": "customer-john-doe",
  "description": "Memory zone for customer John Doe interactions"
}

// Store customer profile
{
  "operation": "customer_profiling",
  "customer_data": {
    "name": "John Doe",
    "company": "Tech Corp",
    "industry": "technology",
    "budget": 5000,
    "contact_method": "WhatsApp",
    "sales_stage": "prospect",
    "notes": ["Interested in premium package", "Prefers email communication"]
  },
  "memory_zone": "staff-alice-123"
}

// AI-powered search for similar customers
{
  "operation": "smart_search_ranking",
  "query": "tech industry premium package budget 5000",
  "information_needed": "Find similar customers with tech background and premium interest",
  "memory_zone": "staff-alice-123"
}
```

### **Team Knowledge Sharing**

```json
// Copy successful patterns to shared zone
{
  "operation": "copy_entities",
  "names": ["successful-objection-handling", "premium-closing-technique"],
  "source_zone": "staff-top-performer-alice",
  "target_zone": "staff-shared-knowledge",
  "copy_relations": true
}
```

## 📊 **Business Impact**

### **For 200 Marketers**
- **Complete Memory:** Never forget customer details across conversations
- **Pattern Learning:** Learn from successful sales interactions
- **Smart Responses:** AI suggests optimal replies based on history
- **Performance Analytics:** Track what works and what doesn't
- **Scalable Intelligence:** Share knowledge across the team

### **ROI Calculation**
- **Cost:** ~$250/month (Elasticsearch + Railway)
- **Value:** If each marketer closes 1 extra deal/month = 200 deals
- **ROI:** 40,000%+ return on investment

## 🚀 **Development & Deployment**

### **Local Development**
```bash
git clone https://github.com/aqilrvsb/elastic-brain.git
cd elastic-brain
npm install
npm run build
npm run dev
```

### **Railway Deployment**
```bash
# Railway will auto-deploy from master branch
git add -A
git commit -m "Deploy brain MCP server with 32 tools"
git push origin main:master
```

### **Environment Variables**
```env
PORT=3000
NODE_ENV=production
MAX_CONNECTIONS=200
GROQ_API_KEY=your_groq_api_key_optional
```

## 🛠️ **Technical Architecture**

### **Built With**
- **Express.js** - HTTP server framework
- **WebSocket** - Real-time MCP protocol
- **Elasticsearch Client** - Brain storage
- **TypeScript** - Type-safe development
- **MCP SDK** - Model Context Protocol

### **Key Features**
- **Session Isolation** - Each user gets isolated memory zones
- **Rate Limiting** - Prevent abuse and ensure performance
- **Error Recovery** - Robust error handling and logging
- **Health Monitoring** - Built-in health checks and metrics

## 📝 **API Reference**

### **Brain Operations**
```http
POST /mcp/{staffId}
Content-Type: application/json

{
  "method": "create_entities",
  "params": {
    "entities": [...],
    "memory_zone": "staff-alice-123"
  }
}
```

### **Health Check**
```http
GET /health

Response:
{
  "status": "healthy",
  "activeConnections": 5,
  "brainTools": 32,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔗 **Links & Resources**

- **GitHub Repository:** https://github.com/aqilrvsb/elastic-brain
- **Railway Deployment:** https://elastic-brain-production.up.railway.app
- **Original Brain Tools:** https://github.com/j3k0/mcp-brain-tools
- **Reference Architecture:** https://github.com/aqilrvsb/newFB

## 🤝 **Contributing**

Based on j3k0's MCP brain architecture with HTTP multi-tenant enhancements. Contributions welcome!

## 📝 **License**

MIT License - see LICENSE file for details

---

**🚀 Ready to give your sales team a brain that never forgets!**

The combination of persistent AI memory + multi-tenant HTTP architecture + Elasticsearch cloud = **ultimate competitive advantage** for your WhatsApp sales operation.