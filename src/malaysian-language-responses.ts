// MALAYSIAN LANGUAGE AI RESPONSE GENERATION - ADDED TO BRAIN PROCESSOR

// Generate AI response from learned patterns - BAHASA MALAYSIA REQUIRED
function generateMalaysianAIResponse(type: string, context: any, learnedPatterns: any[] = []): any {
  const malaysianLanguageRule = "MANDATORY: All responses in Bahasa Malaysia with casual, relatable tone. Use English for technical terms only. NO Indonesian terms.";
  
  if (learnedPatterns.length > 0) {
    // Use learned patterns with Malaysian language adaptation
    const bestPattern = learnedPatterns[0];
    return {
      response: generateContextualMalaysianResponse(bestPattern.extractedPattern.responseStrategy, context),
      source: 'learned_intelligence_malaysian',
      confidence: bestPattern.metadata?.successRate || 0.85,
      patternId: bestPattern._id,
      learnable: true,
      language: 'bahasa_malaysia',
      tone: 'casual_relatable'
    };
  } else {
    // Generate contextual AI response in Bahasa Malaysia
    return {
      response: generateContextualMalaysianResponse(null, context, type),
      source: 'ai_generation_malaysian',
      confidence: 0.75,
      willLearnFromOutcome: true,
      learnable: true,
      language: 'bahasa_malaysia',
      tone: 'casual_relatable'
    };
  }
}

// Generate Malaysian language responses based on context and intent
function generateContextualMalaysianResponse(learnedStrategy: string = null, context: any, responseType: string = 'general'): string {
  const customerMessage = context.customerMessage || '';
  const nicheId = context.nicheId || context.productName || 'produk kami';
  const industry = context.customerProfile?.industry || context.industry || 'business';
  const customerName = context.customerProfile?.name || 'awak';
  
  // Determine customer intent for appropriate Malaysian response
  const intent = extractIntentFromData({ message: customerMessage });
  const objectionType = extractObjectionType({ message: customerMessage });
  
  if (learnedStrategy) {
    // Adapt learned strategy with Malaysian context
    return `[Berdasarkan strategi proven success] Untuk ${nicheId}, pengalaman kami dengan customer ${industry} yang similar menunjukkan: ${adaptStrategyToMalaysian(learnedStrategy, context)}. Dalam situasi ${customerName} ni, approach terbaik ialah focus pada value yang specific untuk keperluan awak.`;
  }
  
  // Generate fresh Malaysian response based on intent
  switch (intent) {
    case 'pricing_inquiry':
      if (objectionType === 'price_concern') {
        return `Saya faham ${customerName} concern pasal investment ni. Memang normal untuk ${industry} company nak make sure every ringgit worth it. ${nicheId} ni actually designed untuk generate ROI yang significant - ramai client kami tengok balik modal dalam 3-6 bulan je. Nak saya show calculation macam mana ${nicheId} boleh save cost dan increase revenue untuk business awak?`;
      } else {
        return `Terima kasih ${customerName} tanya tentang investment ${nicheId}! Untuk ${industry} sector, kami ada package yang specifically tailored. Pricing dia based on value yang awak akan dapat - bukan just features. Boleh saya tahu sikit tentang scale business awak supaya saya boleh recommend package yang paling sesuai?`;
      }
      
    case 'information_request':
      return `Bagus ${customerName} research dulu sebelum decide! ${nicheId} ni memang proven solution untuk ${industry} industry. Kami dah bantu 100+ companies similar dengan awak achieve results yang remarkable. Yang best pasal ${nicheId} ialah ia customizable untuk specific needs awak. Apa aspek yang paling awak nak tahu detail?`;
      
    case 'purchase_intent':
      return `Alhamdulillah! ${customerName} dah buat decision yang tepat dengan pilih ${nicheId}. Ramai client kami dari ${industry} dah proven tremendous success dengan system ni. Sekarang jom kita proceed dengan onboarding yang proper - saya akan personally guide awak step by step untuk ensure smooth implementation. Bila awak ready untuk start?`;
      
    case 'demo_request':
      return `Perfect! Demo ${nicheId} memang best way untuk ${customerName} tengok sendiri power dia. Saya boleh customized demo specifically untuk ${industry} use case awak. Usually 15-20 minit je, tapi awak akan dapat clear picture macam mana ${nicheId} transform business operations. Bila slot yang convenient untuk awak?`;
      
    case 'comparison_request':
      return `Smart move ${customerName}! Memang kena compare properly sebelum invest. ${nicheId} unique sebab kami tak just provide tool - kami provide complete solution dengan ongoing support. Competitor lain mostly generic, tapi kami specialize untuk ${industry} specific requirements. Nak saya breakdown key differentiators yang will matter untuk business awak?`;
      
    case 'general_inquiry':
      if (customerMessage.toLowerCase().includes('salam') || customerMessage.toLowerCase().includes('hello')) {
        return `Waalaikumsalam ${customerName}! Terima kasih hubungi kami tentang ${nicheId}. Saya excited nak share dengan awak macam mana ${nicheId} boleh transform ${industry} operations awak. Kami dah bantu banyak companies achieve results yang beyond expectations. Apa yang paling awak curious about ${nicheId}?`;
      } else {
        return `Hi ${customerName}! Thanks for reaching out tentang ${nicheId}. Saya di sini untuk bantu awak dengan all the information yang awak need. Our system dah proven track record dengan ${industry} companies, dan results dia consistently impressive. What specific aspect of ${nicheId} awak nak explore first?`;
      }
      
    default:
      return `Terima kasih ${customerName} for your interest dalam ${nicheId}! Sebagai solution yang specifically designed untuk ${industry} sector, kami confident ${nicheId} akan bring significant value untuk business awak. Ramai client kami dah experience remarkable improvements. Apa yang awak most interested to know about ${nicheId} capabilities?`;
  }
}

// Adapt learned strategies to natural Malaysian language
function adaptStrategyToMalaysian(strategy: string, context: any): string {
  const nicheId = context.nicheId || context.productName || 'solution kami';
  const industry = context.industry || 'business';
  
  // Transform strategy into natural Malaysian expression
  if (strategy.includes('data_driven')) {
    return `approach yang focus pada data dan proof concrete. Untuk ${industry} industry, client kami selalu appreciate bila kami show real numbers dan case studies`;
  } else if (strategy.includes('relationship_building')) {
    return `build relationship dulu sebelum proceed. Dalam ${industry} sector, trust dan rapport memang crucial untuk long-term partnership`;
  } else if (strategy.includes('value_demonstration')) {
    return `demonstrate clear value proposition. ${nicheId} advantage untuk ${industry} companies kena explain dengan practical examples`;
  } else {
    return `approach yang personalized untuk situation specific. Experience kami dengan ${industry} clients show yang customized strategy selalu give better results`;
  }
}

// Malaysian language objection handling
function generateMalaysianObjectionResponse(objectionData: any): string {
  const objectionType = objectionData.objectionType || 'general';
  const customerProfile = objectionData.customerProfile || {};
  const nicheId = objectionData.nicheId || 'produk kami';
  const industry = customerProfile.industry || 'business';
  
  switch (objectionType) {
    case 'price_concern':
      return `Saya totally understand ${customerProfile.name || 'awak'} concern about investment ni. Memang kena careful dengan budget, especially untuk ${industry} company. ${nicheId} pricing dia actually reflect value yang comprehensive awak akan dapat. Majority client kami tengok ROI dalam first quarter itself. Nak saya show breakdown macam mana investment ni actually save money dalam long run?`;
      
    case 'timing_concern':
      return `I appreciate ${customerProfile.name || 'awak'} being honest about timing. Memang sometimes market conditions atau internal priorities affected decision timing. Good news is ${nicheId} flexible untuk accommodate different implementation schedules. Ramai client start dengan pilot program dulu. Boleh kita explore option yang suit current situation awak?`;
      
    case 'decision_delay':
      return `No pressure ${customerProfile.name || 'awak'}! Memang important take time untuk proper evaluation. Decision macam ni affect whole ${industry} operations, so kena thorough. Saya boleh provide additional information atau arrange session dengan technical team untuk address any specific concerns. What additional clarity awak need untuk move forward confidently?`;
      
    case 'competition_concern':
      return `Smart approach ${customerProfile.name || 'awak'} - memang kena compare options yang available. ${nicheId} position kami dalam market quite unique sebab focus specifically pada ${industry} requirements. Competitor lain mostly generic solutions. Nak saya show side-by-side comparison macam mana ${nicheId} address specific challenges yang common dalam ${industry}?`;
      
    default:
      return `Saya appreciate ${customerProfile.name || 'awak'} sharing concern ni dengan saya. Feedback dari potential clients always valuable untuk kami improve. ${nicheId} designed specifically untuk address common pain points dalam ${industry} sector. Boleh awak elaborate sikit what specific aspect yang awak concerned about? Saya confident kami boleh find solution yang work untuk awak.`;
  }
}
