import { Database } from '../database.types';

export type AiAgent = Database['public']['Tables']['ai_agents']['Row'];
export type AiConversationLog = Database['public']['Tables']['ai_conversation_logs']['Row'];
