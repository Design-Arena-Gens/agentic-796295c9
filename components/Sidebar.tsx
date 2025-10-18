"use client";

import { cn } from '@/lib/utils';
import { MessageSquare, Plus, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';

export type Conversation = {
  id: string;
  title: string;
  updatedAt: number;
};

export function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <aside className="h-dvh bg-[linear-gradient(180deg,#0C0C0F_0%,#0A0A0C_100%)] text-sm">
      <div className="h-14 border-b border-border flex items-center justify-between px-3">
        <div className="font-medium">Conversations</div>
        <button
          onClick={onNew}
          className="inline-flex items-center gap-2 rounded-[10px] bg-accent px-2 py-1.5 hover:bg-[#202025] border border-border"
        >
          <Plus className="size-4" />
        </button>
      </div>
      <div className="p-2 space-y-1 overflow-auto h-[calc(100dvh-3.5rem-3.5rem)]">
        {conversations.length === 0 && (
          <div className="text-mutedForeground text-xs px-2 py-6">No conversations yet</div>
        )}
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={cn(
              'w-full flex items-center gap-2 rounded-[10px] px-2 py-2 hover:bg-accent border border-transparent',
              activeId === c.id ? 'bg-accent border-border' : ''
            )}
            title={new Date(c.updatedAt).toLocaleString()}
          >
            <MessageSquare className="size-4 text-mutedForeground" />
            <span className="truncate text-left flex-1">{c.title}</span>
            {confirmDelete === c.id ? (
              <button
                className="text-red-400 text-xs hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  // Remove conversation via custom event to parent hook
                  const event = new CustomEvent('agentic:delete-conversation', { detail: { id: c.id } });
                  window.dispatchEvent(event);
                  setConfirmDelete(null);
                }}
              >
                Confirm
              </button>
            ) : (
              <button
                className="rounded-md p-1 hover:bg-[#1c1c1f]"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(c.id);
                  setTimeout(() => setConfirmDelete(null), 2000);
                }}
                title="Delete"
              >
                <Trash2 className="size-4 text-mutedForeground" />
              </button>
            )}
          </button>
        ))}
      </div>
      <div className="h-14 border-t border-border flex items-center justify-between px-3 text-mutedForeground">
        <div className="text-xs">v0.1.0</div>
        <button className="inline-flex items-center gap-1.5 rounded-[8px] px-2 py-1.5 hover:bg-[#202025]">
          <Settings className="size-4" />
        </button>
      </div>
    </aside>
  );
}
