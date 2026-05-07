/**
 * SMART-GRAM AI Service
 * Handles secure communication with LLM providers (Groq/Llama)
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const aiService = {
  /**
   * Generates crop suggestions based on environmental factors
   */
  async getCropSuggestion(temp: number, humidity: number, season: string) {
    const API_KEY = process.env.GROQ_API_KEY;
    if (!API_KEY) {
      console.warn('AI_API_KEY_MISSING, falling back to mock data');
      return 'RECOMMENDED: Paddy | ALTERNATIVE: Millets | REASON: The temperature and humidity are ideal for growing paddy. | TIP: Ensure proper water management during the growth cycle.';
    }

    const prompt = `Temperature: ${temp}°C, Humidity: ${humidity}%, Season: ${season}. 
    Suggest one ideal crop and one alternative. Give a brief reason and one farming tip. 
    Format: RECOMMENDED: [Crop Name] | ALTERNATIVE: [Crop Name] | REASON: [Short Text] | TIP: [Short Text]`;

    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: 'You are a professional South Indian agriculture expert.' }, { role: 'user', content: prompt }],
        temperature: 0.5,
      }),
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content || 'Paddy - Season is perfect.';
  },

  /**
   * Handles chatbot Q&A
   */
  async getChatResponse(message: string, language: string) {
    const API_KEY = process.env.GROQ_API_KEY;
    if (!API_KEY) {
      console.warn('CHATBOT_API_KEY_MISSING, falling back to mock response');
      return "Hello! I am currently operating offline. Please contact the Municipal Office directly at 0424-2256111 for assistance.";
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const systemPrompt = `You are the SmartGram Administrative Assistant, a specialized digital helper for the SMART-GRAM village platform in Erode, Tamil Nadu. 
    
    Current Context:
    - Today's Date: ${dateStr}
    - Local Time: ${timeStr}
    - Location: Erode, Tamil Nadu (South Village Sector)

    Administrative Contact Details you MUST provide if asked:
    1. Village Administrative Officer (VAO): Mr. S. Rangasamy (Contact for land records & certificates).
    2. Panchayat President: Mrs. K. Lakshmi (Contact for village development & infrastructure).
    3. Municipal Office: Main Road, Near Bus Stand, Erode South.
    4. Working Hours: 10:00 AM to 5:00 PM (Monday to Saturday).
    5. Helpline: 0424-2256111

    Your Primary Role:
    1. Provide contact information for village administrators and officers.
    2. Assist citizens with the status of their submitted complaints.
    3. Guide users on how to apply for Government Schemes (e.g., provide eligibility info).
    4. Inform users about office hours and location of the Municipal Office.
    5. Help with official matters related to Water supply schedules and Healthcare drives managed by the administration.

    Language: ${language}. Be official, polite, and extremely precise with names and contact details.`;

    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: message }],
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content;
  },

  /**
   * Categorizes a complaint using AI
   */
  async categorizeComplaint(description: string) {
    const API_KEY = process.env.GROQ_API_KEY;
    if (!API_KEY) return 'Others';

    const systemPrompt = `You are a village support classifier. Categorize the user complaint into exactly one of these: Water, Agriculture, Healthcare, or Others. 
    Only output the single word category name.`;

    try {
      const res = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: description }],
          temperature: 0.1,
        }),
      });
      const data = await res.json();
      const result = data.choices?.[0]?.message?.content?.trim() || 'Others';
      return ['Water', 'Agriculture', 'Healthcare', 'Others'].includes(result) ? result : 'Others';
    } catch (e) {
      return 'Others';
    }
  }
};
