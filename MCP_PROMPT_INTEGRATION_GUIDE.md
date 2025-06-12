# 🎯 COMPLETE MCP TOOL INTEGRATION FOR YOUR SALES PROMPT

## 🚀 **n8n Workflow Integration**

### **Node 1: WhatsApp Trigger**
```json
{
  "name": "WhatsApp Webhook",
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "path": "whatsapp",
    "httpMethod": "POST"
  }
}
```

### **Node 2: Extract Customer Data**
```javascript
// Extract WhatsApp message data
const body = $json.body;
const message = body.entry[0]?.changes[0]?.value?.messages[0];

return {
  customerMessage: message?.text?.body || '',
  customerPhone: message?.from || '',
  customerName: body.entry[0]?.changes[0]?.value?.contacts[0]?.profile?.name || '',
  timestamp: new Date().toISOString()
};
```

### **Node 3: Elastic Brain MCP Enhancement**
```json
{
  "name": "Enhance Sales Prompt",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "POST",
    "url": "https://elastic-brain-production.up.railway.app/stream/{{ $json.customerPhone }}",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": {
      "jsonrpc": "2.0",
      "method": "tools/call",
      "params": {
        "name": "enhance_sales_prompt",
        "arguments": {
          "originalPrompt": "{{YOUR_EXISTING_PROMPT_HERE}}",
          "customerMessage": "{{ $json.customerMessage }}",
          "niche": "VITAC",
          "conversationStage": "Problem Identification",
          "customerProfile": {
            "name": "{{ $json.customerName }}",
            "phone": "{{ $json.customerPhone }}"
          },
          "enhancementMode": "intelligence_injection"
        }
      },
      "id": "{{ $json.timestamp }}"
    }
  }
}
```

### **Node 4: Send to ChatGPT with Enhanced Prompt**
```json
{
  "name": "ChatGPT with Enhanced Prompt",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "POST",
    "url": "https://api.openai.com/v1/chat/completions",
    "headers": {
      "Authorization": "Bearer YOUR_OPENAI_API_KEY",
      "Content-Type": "application/json"
    },
    "body": {
      "model": "gpt-4",
      "messages": [
        {
          "role": "system",
          "content": "{{ $json.result.enhancedPrompt }}"
        },
        {
          "role": "user", 
          "content": "{{ $('Extract Customer Data').item(0).json.customerMessage }}"
        }
      ]
    }
  }
}
```

### **Node 5: Send WhatsApp Reply**
```json
{
  "name": "Send WhatsApp Response",
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "POST",
    "url": "https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages",
    "headers": {
      "Authorization": "Bearer YOUR_WHATSAPP_TOKEN",
      "Content-Type": "application/json"
    },
    "body": {
      "messaging_product": "whatsapp",
      "to": "{{ $('Extract Customer Data').item(0).json.customerPhone }}",
      "text": {
        "body": "{{ $json.choices[0].message.content }}"
      }
    }
  }
}
```

---

## 🧠 **EXAMPLE: Enhanced Prompt Output**

### **Input:**
```javascript
{
  "originalPrompt": "Your 7-stage VITAC sales prompt...",
  "customerMessage": "Anak saya kurang selera makan",
  "niche": "VITAC",
  "conversationStage": "Problem Identification"
}
```

### **Output:**
```javascript
{
  "enhancedPrompt": `
You are an intelligent and persuasive sales chatbot designed to guide users effectively through the decision-making process...

[YOUR COMPLETE ORIGINAL PROMPT]

---
🧠 ELASTIC BRAIN INTELLIGENCE FOR THIS CONVERSATION:

NICHE: VITAC
CUSTOMER ANALYSIS: Customer Intent: health_concern (concerned sentiment, high urgency) | Similar customers: 85% success rate with this intent | Malaysian customer: Prefers casual Bahasa Malaysia communication style
RECOMMENDED APPROACH: Based on successful VITAC conversations: Use health-education approach. This has proven effective for similar customers with health_concern intent.
SUCCESS PATTERNS: Success factors from VITAC wins: immediate_relief_focus, health_education, parental_empathy. Incorporate these elements.
OBJECTION ANTICIPATION: Likely objections based on VITAC data: price_concern, timing_concern, effectiveness_doubt. Have resolution strategies ready.
MALAYSIAN CONTEXT: Use casual Bahasa Malaysia with English technical terms | Address customer as 'awak' or 'akak' appropriately | Include cultural elements like 'Alhamdulillah' for positive outcomes | Use 'boleh', 'nak', 'dengan' for natural flow | Malaysian customers appreciate direct but respectful urgency
SUGGESTED ACTIONS: Focus on appetite improvement benefits | Provide immediate value demonstration | Build parental empathy connection

📊 LEARNED INTELLIGENCE:
Based on analysis of similar VITAC conversations, this customer profile suggests:
Use health-education approach combined with immediate relief focus and parental empathy

🎯 OPTIMIZATION GUIDANCE:
Success factors from VITAC wins: immediate_relief_focus, health_education, parental_empathy. Incorporate these elements.

⚠️ POTENTIAL CHALLENGES:
Likely objections based on VITAC data: price_concern, timing_concern, effectiveness_doubt. Have resolution strategies ready.

🇲🇾 CULTURAL CONTEXT:
Use casual Bahasa Malaysia with English technical terms | Address customer as 'awak' or 'akak' appropriately

---
Apply this intelligence to enhance your responses while following your existing stage flow.
  `,
  "intelligence": {
    "customerAnalysis": "Customer Intent: health_concern (concerned sentiment, high urgency)",
    "recommendedStrategy": "Use health-education approach",
    "successPatterns": "immediate_relief_focus, health_education, parental_empathy",
    "confidence": 0.85
  }
}
```

---

## 🎯 **KEY BENEFITS**

### **✅ Your Prompt Enhanced (Not Replaced):**
- Your 7-stage flow **stays exactly the same**
- Your Malaysian language style **preserved**
- Your VITAC knowledge **enhanced with learned patterns**

### **✅ Dynamic Intelligence:**
- **No hardcoding** - works with any niche (VITAC, EXAMA, future products)
- **Real customer data** - learns from your 500+ conversations
- **Improved responses** - based on what actually works

### **✅ Easy Integration:**
- **Single MCP call** in your n8n workflow
- **Drop-in replacement** for your existing system
- **Backward compatible** - works with or without intelligence

---

## 🚀 **IMMEDIATE NEXT STEPS**

1. **Import your VITAC CSV data** using the CSV import tool
2. **Update n8n workflow** with the enhanced prompt node  
3. **Test with real customers** to see improved responses
4. **Monitor results** - should see better conversion rates
5. **Scale to other products** by changing the niche parameter

**Your existing prompt + Elastic Brain intelligence = Smarter sales conversations!** 🎯🧠🚀
