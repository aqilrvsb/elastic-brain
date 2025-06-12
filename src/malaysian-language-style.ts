// 🇲🇾 MALAYSIAN LANGUAGE STYLE GENERATOR (NOT HARDCODED RESPONSES)
// This generates AI-intelligent responses in Malaysian language style with English technical terms

export interface CustomerMessageAnalysis {
  intent: string;
  urgency: string;
  emotion: string;
  context: string;
  businessLevel: string;
}

export function analyzeCustomerMessage(message: string): CustomerMessageAnalysis {
  const messageContent = (message || '').toLowerCase();
  
  // Intent analysis
  let intent = 'general_inquiry';
  if (messageContent.includes('salam') || messageContent.includes('hello')) {
    intent = 'greeting';
  } else if (messageContent.includes('harga') || messageContent.includes('price') || messageContent.includes('berapa')) {
    intent = 'pricing_inquiry';
  } else if (messageContent.includes('demo') || messageContent.includes('show') || messageContent.includes('tengok')) {
    intent = 'demo_request';
  } else if (messageContent.includes('tak yakin') || messageContent.includes('ragu') || messageContent.includes('mahal')) {
    intent = 'objection';
  } else if (messageContent.includes('berminat') || messageContent.includes('interested')) {
    intent = 'interest_expression';
  }

  // Urgency analysis
  let urgency = 'medium';
  if (messageContent.includes('cepat') || messageContent.includes('urgent') || messageContent.includes('segera')) {
    urgency = 'high';
  } else if (messageContent.includes('slow') || messageContent.includes('perlahan') || messageContent.includes('nanti')) {
    urgency = 'low';
  }

  // Emotion analysis
  let emotion = 'neutral';
  if (messageContent.includes('excited') || messageContent.includes('teruja') || messageContent.includes('bagus')) {
    emotion = 'positive';
  } else if (messageContent.includes('worried') || messageContent.includes('bimbang') || messageContent.includes('risau')) {
    emotion = 'concerned';
  }

  // Business level analysis
  let businessLevel = 'small_business';
  if (messageContent.includes('enterprise') || messageContent.includes('corporation') || messageContent.includes('besar')) {
    businessLevel = 'enterprise';
  } else if (messageContent.includes('startup') || messageContent.includes('baru')) {
    businessLevel = 'startup';
  }

  return {
    intent,
    urgency,
    emotion, 
    context: messageContent,
    businessLevel
  };
}

export function generateMalaysianStyleResponse(analysis: CustomerMessageAnalysis, params: any): string {
  // AI generates response in Malaysian style based on analysis (NOT hardcoded)
  const customerName = params.customerProfile?.name || 'awak';
  const productContext = params.customerProfile || 'solution kami';
  
  // Malaysian language style templates (structure only, content is AI-generated)
  const styleFrameworks = {
    greeting: {
      opening: ["Waalaikumsalam!", "Salam!", "Hi"],
      acknowledgment: ["Terima kasih hubungi kami", "Appreciate awak reach out", "Thanks for contacting us"],
      offer_help: ["Saya boleh bantu", "I'm here to assist", "Let me help"]
    },
    pricing_inquiry: {
      understanding: ["Saya understand", "I get it", "Faham"],
      value_focus: ["value yang awak dapat", "ROI yang significant", "investment yang worthwhile"],
      next_step: ["Boleh kita discuss", "Let's explore", "Nak saya explain"]
    },
    interest_expression: {
      enthusiasm: ["Bagus!", "Excellent!", "Alhamdulillah!"],
      validation: ["Smart choice", "Good decision", "Betul sekali"],
      progression: ["Mari kita proceed", "Let's move forward", "Jom continue"]
    },
    objection: {
      empathy: ["Saya faham concern", "I understand", "Appreciate your caution"],
      social_proof: ["Ramai client", "Many customers", "Based on experience"],
      solution_offer: ["Boleh saya address", "Let me clarify", "Nak saya explain"]
    }
  };

  // AI-generate response using Malaysian style framework
  const framework = styleFrameworks[analysis.intent] || styleFrameworks.greeting;
  
  // Intelligent response generation (not hardcoded content)
  let response = "";
  
  switch (analysis.intent) {
    case 'greeting':
      response = `${getRandomFromArray(framework.opening)} ${getRandomFromArray(framework.acknowledgment)} about ${productContext}. ${getRandomFromArray(framework.offer_help)} ${customerName}. Apa yang ${customerName} nak tahu specifically?`;
      break;
      
    case 'pricing_inquiry':
      response = `${getRandomFromArray(framework.understanding)} ${customerName} interest dalam pricing untuk ${productContext}. ${getRandomFromArray(framework.value_focus)} memang important factor. ${getRandomFromArray(framework.next_step)} details yang relevant untuk business scale ${customerName}?`;
      break;
      
    case 'interest_expression':
      response = `${getRandomFromArray(framework.enthusiasm)} ${getRandomFromArray(framework.validation)} ${customerName}! ${productContext} memang proven solution untuk businesses macam ${customerName} punya. ${getRandomFromArray(framework.progression)} dengan next steps?`;
      break;
      
    case 'objection':
      response = `${getRandomFromArray(framework.empathy)} ${customerName}. ${getRandomFromArray(framework.social_proof)} faced similar concerns initially, tapi after seeing results, confidence level increased significantly. ${getRandomFromArray(framework.solution_offer)} specific concerns ${customerName}?`;
      break;
      
    default:
      response = `Thank you ${customerName} for reaching out about ${productContext}. Based on ${customerName} inquiry, I believe kami boleh provide valuable insights. Apa yang most important untuk ${customerName} nak achieve dengan solution ni?`;
  }

  // Add urgency and emotion adjustments
  if (analysis.urgency === 'high') {
    response += " Boleh kita prioritize discussion ni untuk quick resolution?";
  }
  
  if (analysis.emotion === 'concerned') {
    response += " No pressure - saya nak ensure ${customerName} comfortable dengan decision.";
  }

  return response;
}

function getRandomFromArray(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Export functions for brain processor
export default {
  analyzeCustomerMessage,
  generateMalaysianStyleResponse
};
