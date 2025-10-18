export type Role = 'user' | 'assistant' | 'system';

export type AgentMessage = {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
};

export type Conversation = {
  id: string;
  title: string;
  updatedAt: number;
  messages: AgentMessage[];
};
