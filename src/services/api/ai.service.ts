import axios from 'axios';

const AI_API_URL = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8000';

export interface AiChatRequest {
  message: string;
  context?: any;
  userId?: string;
  language?: string;
}

export interface AiChatResponse {
  response: string;
  entities?: any;
  intent?: string;
  confidence?: number;
}

export const aiService = {
  async sendMessage(payload: AiChatRequest): Promise<AiChatResponse> {
    try {
      const response = await axios.post(`${AI_API_URL}/chat`, payload);
      return response.data;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  },

  async analyzeBooking(bookingId: string) {
     const response = await axios.post(`${AI_API_URL}/analyze/booking/${bookingId}`);
     return response.data;
  },
  
  async getOptimizationSuggestions(terminalId: string) {
      const response = await axios.get(`${AI_API_URL}/optimize/terminal/${terminalId}`);
      return response.data;
  }
};
