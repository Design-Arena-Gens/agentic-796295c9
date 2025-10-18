"use client";

import { useMemo, useRef } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatMessage } from '@/components/ChatMessage';
import { Composer } from '@/components/Composer';
import { CommandPalette } from '@/components/CommandPalette';
import { useAgent } from '@/hooks/useAgent';
import { Plus, Rocket, Loader2 } from 'lucide-react';

export default function Page() {
  const {
    conversations,
    activeConversationId,
    messages,
    isStreaming,
    sendMessage,
    newConversation,
    setActiveConversation,
    cancelStreaming,
  } = useAgent();

  const listRef = useRef<HTMLDivElement>(null);

  const Empty = useMemo(
    () => (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto size-12 rounded-full bg-accent flex items-center justify-center shadow-soft">
            <Rocket className="size-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-medium">Start a new conversation</h2>
            <p className="text-sm text-mutedForeground">Ask anything. Use ⌘K for commands.</p>
          </div>
          <button
            onClick={newConversation}
            className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="size-4" /> New chat
          </button>
        </div>
      </div>
    ),
    [newConversation]
  );

  return (
    <div className="container-app">
      <Sidebar
        conversations={conversations}
        activeId={activeConversationId}
        onNew={newConversation}
        onSelect={setActiveConversation}
      />

      <div className="flex flex-col h-dvh border-l border-border bg-[radial-gradient(85rem_85rem_at_120%_-20%,rgba(110,86,207,.15),transparent_60%)]">
        <div className="h-14 shrink-0 border-b border-border flex items-center justify-between px-4">
          <div className="font-medium">Agentic</div>
          <div className="text-xs text-mutedForeground">⌘K</div>
        </div>

        <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-4">
          {messages.length === 0 ? (
            Empty
          ) : (
            messages.map((m) => <ChatMessage key={m.id} message={m} />)
          )}
          {isStreaming && (
            <div className="flex items-center gap-2 text-xs text-mutedForeground">
              <Loader2 className="size-3 animate-spin" /> Generating response…
            </div>
          )}
        </div>

        <div className="border-t border-border p-3">
          <Composer onSend={sendMessage} onStop={cancelStreaming} isStreaming={isStreaming} />
        </div>
      </div>

      <CommandPalette onNewChat={newConversation} />
    </div>
  );
}
