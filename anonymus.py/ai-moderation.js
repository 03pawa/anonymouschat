/**
 * AI-based moderation system for detecting inappropriate content
 * This is a simplified implementation that uses keyword-based detection
 * with some contextual analysis to simulate AI moderation
 */

// Expanded list of inappropriate terms with severity levels
const inappropriateTerms = {
  // Severe violations (ban-worthy)
  severe: [
    'kill', 'murder', 'rape', 'terrorist', 'bomb', 'suicide', 
    'pedo', 'pedophile', 'child porn', 'cp', 'csam', 'gore',
    'nazi', 'hitler', 'kike', 'spic', 'chink', 'gook', 'nigger',
    'faggot', 'dyke', 'tranny', 'whore', 'slut', 'rape', 'molest'
  ],
  
  // Moderate violations (disconnect-worthy)
  moderate: [
    'hate', 'violence', 'abuse', 'harass', 'threat', 'stalker',
    'explicit', 'obscene', 'profanity', 'slur', 'insult', 'dumbass',
    'bitch', 'bastard', 'damn', 'hell', 'crap', 'piss', 'asshole',
    'dick', 'cock', 'pussy', 'sex', 'porn', 'xxx', 'nude' , 'fuck'
  ],
  
  // Mild violations (warning-worthy)
  mild: [
    'stupid', 'idiot', 'dumb', 'fool', 'loser', 'weirdo', 'freak',
    'ugly', 'fat', 'skinny', 'short', 'tall', 'old', 'weak'
  ]
};

// Selling-related terms that should result in banning
const sellingTerms = [
  'sell', 'buy', 'purchase', 'trade', 'exchange', 'marketplace',
  'shop', 'store', 'discount', 'deal', 'offer', 'price','rate',
  'payment', 'paypal', 'bitcoin', 'crypto', 'scam', 'fraud',
  'currency', 'drugs', 'weed', 'cocaine', 'heroin', 'meth', 'lsd',
  'mdma', 'ecstasy', 'xanax', 'adderall', 'viagra', 'cialis'
];

// Contextual modifiers that increase severity
const intensifiers = ['very', 'really', 'extremely', 'so', 'super', 'ultra'];
const negations = ['not', 'no', 'never', 'none', 'nobody', 'nothing'];

/**
 * Analyze text for inappropriate content using AI-like detection
 * @param {string} text - The text to analyze
 * @returns {object} Analysis results with severity level and detected terms
 */
function analyzeText(text) {
  if (!text || typeof text !== 'string') {
    return { severity: 'none', detectedTerms: [], score: 0 };
  }
  
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  const detectedTerms = [];
  let severity = 'none';
  let score = 0;
  
  // Check for selling terms (ban-worthy)
  for (const term of sellingTerms) {
    if (lowerText.includes(term)) {
      detectedTerms.push({ term, category: 'selling' });
      severity = 'severe';
      score += 10;
    }
  }
  
  // Check for severe inappropriate terms (ban-worthy)
  for (const term of inappropriateTerms.severe) {
    if (lowerText.includes(term)) {
      detectedTerms.push({ term, category: 'severe' });
      severity = 'severe';
      score += 8;
    }
  }
  
  // Check for moderate inappropriate terms
  for (const term of inappropriateTerms.moderate) {
    if (lowerText.includes(term)) {
      detectedTerms.push({ term, category: 'moderate' });
      if (severity !== 'severe') severity = 'moderate';
      score += 5;
    }
  }
  
  // Check for mild inappropriate terms
  for (const term of inappropriateTerms.mild) {
    if (lowerText.includes(term)) {
      detectedTerms.push({ term, category: 'mild' });
      if (severity === 'none') severity = 'mild';
      score += 2;
    }
  }
  
  // Apply contextual analysis
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    
    // Intensifiers increase severity
    if (intensifiers.includes(word) && i < words.length - 1) {
      score *= 1.5;
    }
    
    // Check for repeated characters (e.g., "shiiiiit")
    if (word.match(/(.)\1{2,}/)) {
      score *= 1.2;
    }
  }
  
  // Adjust score based on text length (shorter texts with bad words are more severe)
  if (lowerText.length < 20 && detectedTerms.length > 0) {
    score *= 1.5;
  }
  
  // Cap the score
  score = Math.min(score, 100);
  
  return { severity, detectedTerms, score };
}

/**
 * Determine action based on analysis results
 * @param {object} analysis - The analysis results from analyzeText
 * @returns {string} Recommended action: 'allow', 'warn', 'disconnect', or 'ban'
 */
function determineAction(analysis) {
  if (analysis.severity === 'severe' || analysis.score >= 30) {
    return 'ban';
  } else if (analysis.severity === 'moderate' || analysis.score >= 15) {
    return 'disconnect';
  } else if (analysis.severity === 'mild' || analysis.score >= 5) {
    return 'warn';
  } else {
    return 'allow';
  }
}

module.exports = {
  analyzeText,
  determineAction
};