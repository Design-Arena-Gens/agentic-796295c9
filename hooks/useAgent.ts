"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Conversation as ConversationType, AgentMessage } from '@/lib/types';
import { nanoid } from '@/lib/utils';

export function useAgent() {
  const [conversations, setConversations] = useState<ConversationType[]>(() => [
    { id: nanoid('c'), title: 'General', updatedAt: Date.now(), messages: [] },
  ]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => conversations[0]?.id ?? null);
  const [isStreaming, setIsStreaming] = useState(false);
  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) ?? null,
    [conversations, activeConversationId]
  );

  useEffect(() => {
    const onDelete = (e: Event) => {
      const id = (e as CustomEvent).detail.id as string;
      setConversations((prev) => prev.filter((c) => c.id !== id));
      setActiveConversationId((cur) => (cur === id ? prevFirstId() : cur));
    };
    window.addEventListener('agentic:delete-conversation', onDelete as EventListener);
    return () => window.removeEventListener('agentic:delete-conversation', onDelete as EventListener);
  }, []);

  function prevFirstId() {
    return conversations[0]?.id ?? null;
  }

  function newConversation() {
    const id = nanoid('c');
    const next: ConversationType = { id, title: 'New Chat', updatedAt: Date.now(), messages: [] };
    setConversations((prev) => [next, ...prev]);
    setActiveConversationId(id);
  }

  function setActiveConversation(id: string) {
    setActiveConversationId(id);
  }

  async function sendMessage(text: string) {
    if (!activeConversation) return;
    const userMsg: AgentMessage = { id: nanoid('m'), role: 'user', content: text, createdAt: Date.now() };
    const assistantMsg: AgentMessage = { id: nanoid('m'), role: 'assistant', content: '', createdAt: Date.now() };

    setConversations((prev) => prev.map((c) => (c.id === activeConversation.id ? { ...c, messages: [...c.messages, userMsg, assistantMsg], updatedAt: Date.now() } : c)));

    setIsStreaming(true);
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No reader');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversation.id
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === assistantMsg.id ? { ...m, content: m.content + chunk } : m
                  ),
                }
              : c
          )
        );
      }
    } catch (e) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? {
                ...c,
                messages: c.messages.map((m) => (m.id === assistantMsg.id ? { ...m, content: 'Something went wrong.' } : m)),
              }
            : c
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }

  const cancelStreaming = useCallback(() => {
    // For mock stream, a reload of active conversation suffices (no AbortController used here)
    setIsStreaming(false);
  }, []);

  const messages = activeConversation?.messages ?? [];

  return {
    conversations: useMemo(
      () => conversations.sort((a, b) => b.updatedAt - a.updatedAt).map((c) => ({ id: c.id, title: c.title, updatedAt: c.updatedAt })),
      [conversations]
    ),
    activeConversationId,
    messages,
    isStreaming,
    sendMessage,
    newConversation,
    setActiveConversation,
    cancelStreaming,
  } as const;
}
