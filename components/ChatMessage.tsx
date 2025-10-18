"use client";

import type { AgentMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function ChatMessage({ message }: { message: AgentMessage }) {
  const isUser = message.role === 'user';
  return (
    <div className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="size-8 rounded-md bg-[#17171A] border border-border flex items-center justify-center shrink-0">
          <Bot className="size-4 text-primary" />
        </div>
      )}
      <div
        className={cn(
          'max-w-[70ch] rounded-2xl px-3 py-2 border text-sm prose',
          isUser ? 'bg-primary text-primary-foreground border-transparent' : 'bg-accent border-border'
        )}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
        ) : (
          <ReactMarkdown>{message.content || '…'}</ReactMarkdown>
        )}
      </div>
      {isUser && (
        <div className="size-8 rounded-md bg-[#17171A] border border-border flex items-center justify-center shrink-0">
          <User className="size-4 text-foreground" />
        </div>
      )}
    </div>
  );
}
