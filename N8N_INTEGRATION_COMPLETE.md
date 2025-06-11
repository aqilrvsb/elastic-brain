# 🧠 Elasticsearch Brain MCP Server - n8n Integration Guide

## ✅ PRODUCTION STATUS: LIVE AND READY

**🎯 Production URL**: `https://elastic-brain-production.up.railway.app`
**🧠 Total Tools Available**: 32 brain tools
**👥 Multi-tenant**: STAFF_ID based routing
**🔗 n8n Ready**: HTTP Stream MCP compatible

---

## 🚀 Quick Setup for n8n

### Step 1: Configure n8n MCP Client Node

1. **Add MCP Client Node** to your n8n workflow
2. **Select Connection Type**: `HTTP Streamable`
3. **Configure endpoints**:

#### **HTTP Stream URL:**
```
https://elastic-brain-production.up.railway.app/stream/staff-{YOUR_STAFF_ID}
```

#### **Messages Post Endpoint:**  
```
https://elastic-brain-production.up.railway.app/mcp/staff-{YOUR_STAFF_ID}
```

#### **Example for Staff Member Alice:**
- Stream URL: `https://elastic-brain-production.up.railway.app/stream/staff-alice-123`
- Post URL: `https://elastic-brain-production.up.railway.app/mcp/staff-alice-123`

#### **HTTP Connection Timeout:**
```
60000
```

#### **Additional Headers (Optional):**
```json
{
  "Content-Type": "application/json",
  "User-Agent": "N8N-MCP-Client"
}
```

---

## 🧠 32 Brain Tools Available

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
11. `cross_zone_relations` - Link knowledge across zones

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

### **Utility Tools (1 tool)**
33. `get_time_utc` - Get current UTC time

---

## 📋 n8n Workflow Examples

### **Example 1: Store Customer Information**
```json
{
  "nodes": [
    {
      "name": "Store Customer",
      "type": "n8n-nodes-base.mcpClient", 
      "parameters": {
        "method": "tools/call",
        "params": {
          "name": "create_entities",
          "arguments": {
            "entities": [
              {
                "name": "John Doe",
                "entityType": "Customer",
                "observations": [
                  "Interested in premium package",
                  "Budget around $5000",
                  "Prefers email communication"
                ]
              }
            ],
            "memory_zone": "staff-alice-123"
          }
        }
      }
    }
  ]
}
```

### **Example 2: Search Customer History**
```json
{
  "name": "Search Customers",
  "type": "n8n-nodes-base.mcpClient",
  "parameters": {
    "method": "tools/call", 
    "params": {
      "name": "search_nodes",
      "arguments": {
        "query": "premium package budget 5000",
        "memory_zone": "staff-alice-123",
        "informationNeeded": "Find similar customers",
        "reason": "Identify sales patterns"
      }
    }
  }
}
```

### **Example 3: Sales Intelligence Analysis**
```json
{
  "name": "Generate Analytics",
  "type": "n8n-nodes-base.mcpClient",
  "parameters": {
    "method": "tools/call",
    "params": {
      "name": "performance_analytics", 
      "arguments": {
        "timeframe": 30,
        "memory_zone": "staff-alice-123"
      }
    }
  }
}
```

### **Example 4: WhatsApp Integration Workflow**
```json
{
  "nodes": [
    {
      "name": "WhatsApp Trigger",
      "type": "n8n-nodes-base.webhook"
    },
    {
      "name": "Extract Staff ID",
      "type": "n8n-nodes-base.set", 
      "parameters": {
        "values": {
          "string": [
            {
              "name": "staffId", 
              "value": "staff-{{ $json.phone_number }}"
            }
          ]
        }
      }
    },
    {
      "name": "Store Conversation",
      "type": "n8n-nodes-base.mcpClient",
      "parameters": {
        "method": "tools/call",
        "params": {
          "name": "conversation_analysis",
          "arguments": {
            "conversation_data": {
              "customer_name": "{{ $json.customer_name }}",
              "channel": "WhatsApp", 
              "message_content": "{{ $json.message }}",
              "sentiment": "neutral"
            },
            "memory_zone": "{{ $json.staffId }}"
          }
        }
      }
    }
  ]
}
```

---

## 🔧 Testing Your Setup

### **Test 1: Health Check**
```bash
curl https://elastic-brain-production.up.railway.app/health
```

### **Test 2: List All Tools**
```bash
curl -X POST https://elastic-brain-production.up.railway.app/stream/staff-test-123 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":1}'
```

### **Test 3: Simple Tool Call**
```bash
curl -X POST https://elastic-brain-production.up.railway.app/mcp/staff-test-123 \
  -H "Content-Type: application/json" \
  -d '{"method":"get_time_utc","params":{}}'
```

### **Test 4: Create Test Entity**
```bash
curl -X POST https://elastic-brain-production.up.railway.app/mcp/staff-test-123 \
  -H "Content-Type: application/json" \
  -d '{
    "method": "create_entities",
    "params": {
      "entities": [{
        "name": "Test Customer",
        "entityType": "Customer", 
        "observations": ["Test customer for n8n integration"]
      }],
      "memory_zone": "staff-test-123"
    }
  }'
```

---

## 🆘 Troubleshooting n8n Integration

### **❌ "Connection cannot be established"**
✅ **Solutions:**
- Verify STAFF_ID is included in URLs
- Check HTTP Stream URL format: `/stream/staff-{YOUR_ID}`
- Ensure Messages Post Endpoint: `/mcp/staff-{YOUR_ID}`
- Increase timeout to 60000ms

### **❌ "Tools not found"**
✅ **Solutions:**
- Test `tools/list` method first
- Verify tool names match exactly (case-sensitive)
- Use proper MCP protocol format

### **❌ "STAFF_ID required"**
✅ **Solutions:**
- Include STAFF_ID in URL path: `/mcp/staff-alice-123`
- Or use X-Staff-ID header
- Or include sessionId in request body

### **❌ "Memory zone errors"**
✅ **Solutions:**
- memory_zone parameter defaults to STAFF_ID
- Create zones with `create_zone` tool first
- Use `list_zones` to see available zones

---

## 📊 Multi-tenant Architecture

### **STAFF_ID Based Routing**
- Each staff member gets isolated memory zones
- Format: `staff-{unique-identifier}`
- Examples: `staff-alice-123`, `staff-bob-456`

### **Memory Isolation**
- Staff can only access their own data
- Cross-zone relations possible with proper permissions
- Secure multi-tenant operation

### **Scalability**
- Supports 200 concurrent staff members
- Auto-cleanup of inactive sessions
- Elasticsearch Cloud backend for performance

---

## 🎯 Business Use Cases

### **WhatsApp Sales Intelligence**
1. **Store customer conversations** → `conversation_analysis`
2. **Track objections and responses** → `objection_handling`
3. **Generate AI recommendations** → `response_suggestions`
4. **Monitor performance** → `performance_analytics`

### **Knowledge Management**
1. **Create customer profiles** → `customer_profiling`
2. **Link related information** → `create_relations`
3. **Search with AI** → `smart_search_ranking`
4. **Context-aware retrieval** → `context_aware_retrieval`

### **Team Collaboration**
1. **Share successful patterns** → `copy_entities`
2. **Merge team knowledge** → `merge_zones`
3. **Track team performance** → `pattern_recognition`

---

## ✅ Success Indicators

🟢 **n8n shows successful MCP connection**
🟢 **`tools/list` returns 32 brain tools**
🟢 **Tool calls execute successfully**
🟢 **Customer data persists across conversations**
🟢 **Search returns relevant results**
🟢 **Memory zones isolate staff data**

---

## 🚀 Production Ready Features

✅ **Live Production URL**: `elastic-brain-production.up.railway.app`
✅ **32 Brain Tools**: Complete knowledge graph management
✅ **n8n Compatible**: HTTP Stream MCP protocol
✅ **Multi-tenant**: STAFF_ID isolation
✅ **Elasticsearch Backend**: Production-grade storage
✅ **Auto-deploy**: GitHub → Railway integration
✅ **Health Monitoring**: `/health` endpoint
✅ **Error Handling**: Robust error responses

**🎉 Your n8n workflows now have persistent AI memory!**

Each of your 200 marketers gets isolated brain zones with complete WhatsApp sales intelligence capabilities.
