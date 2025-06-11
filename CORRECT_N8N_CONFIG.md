# 🎯 CORRECT n8n MCP Client Configuration (Based on Working Facebook Pattern)

## ✅ **Use These EXACT Settings in n8n MCP Client Node:**

### **Connection Type:** 
```
HTTP Streamable
```

### **HTTP Stream URL:**
```
https://elastic-brain-production.up.railway.app/mcp/staff-YOUR_STAFF_ID
```

### **Messages Post Endpoint:**
```
https://elastic-brain-production.up.railway.app/mcp/staff-YOUR_STAFF_ID
```

⚠️ **CRITICAL**: Both URLs use `/mcp/` (NOT `/stream/`)

### **Examples for Different Staff:**
- **Alice**: 
  - HTTP Stream URL: `https://elastic-brain-production.up.railway.app/mcp/staff-alice-123`
  - Messages Post Endpoint: `https://elastic-brain-production.up.railway.app/mcp/staff-alice-123`

- **Bob**: 
  - HTTP Stream URL: `https://elastic-brain-production.up.railway.app/mcp/staff-bob-456`
  - Messages Post Endpoint: `https://elastic-brain-production.up.railway.app/mcp/staff-bob-456`

### **Additional Settings:**
- **HTTP Connection Timeout**: `60000`
- **Headers** (if available): `{"Content-Type": "application/json"}`

---

## 🔧 **What Changed:**

### ❌ **Previous (Wrong):**
- HTTP Stream URL: `/stream/staff-alice-123`
- Messages Post Endpoint: `/stream/staff-alice-123`

### ✅ **Now (Correct):**
- HTTP Stream URL: `/mcp/staff-alice-123`
- Messages Post Endpoint: `/mcp/staff-alice-123`

---

## 🧪 **Test After Railway Deploys (2-3 minutes):**

1. **Update your n8n MCP Client** with the `/mcp/` URLs
2. **Test connection** - should show "Connected" status
3. **List tools** - should show 32 brain tools available
4. **Test simple tool**: Use `get_time_utc` to verify

---

## 📋 **Example n8n Workflow Test:**

```json
{
  "nodes": [
    {
      "name": "Test Brain MCP",
      "type": "n8n-nodes-base.mcpClient",
      "parameters": {
        "method": "tools/call",
        "params": {
          "name": "get_time_utc",
          "arguments": {}
        }
      }
    }
  ]
}
```

---

**🎯 This should fix the "connection cannot be established" error by using the exact same URL pattern as the working Facebook MCP!**
