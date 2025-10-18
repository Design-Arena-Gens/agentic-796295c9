"use client";

import { useEffect, useRef, useState } from 'react';
import { ArrowUpCircle, StopCircle } from 'lucide-react';

export function Composer({ onSend, onStop, isStreaming }: { onSend: (text: string) => void; onStop: () => void; isStreaming: boolean }) {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = Math.min(el.scrollHeight, 260) + 'px';
  }, [value]);

  function submit() {
    if (!value.trim() || isStreaming) return;
    onSend(value.trim());
    setValue('');
  }

  return (
    <div className="rounded-2xl border border-border bg-[#0E0E11] p-2 shadow-soft">
      <textarea
        ref={ref}
        className="w-full bg-transparent outline-none resize-none px-3 py-2 text-sm placeholder:text-mutedForeground"
        placeholder="Send a message…"
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
      />
      <div className="flex items-center justify-between px-2">
        <div className="text-[11px] text-mutedForeground">Shift+Enter for newline</div>
        {isStreaming ? (
          <button onClick={onStop} className="inline-flex items-center gap-1.5 text-xs rounded-md px-2 py-1.5 border border-border hover:bg-[#1A1A1D]">
            <StopCircle className="size-4" /> Stop
          </button>
        ) : (
          <button onClick={submit} className="inline-flex items-center gap-1.5 text-xs rounded-md px-2 py-1.5 bg-primary text-primary-foreground hover:opacity-90">
            <ArrowUpCircle className="size-4" /> Send
          </button>
        )}
      </div>
    </div>
  );
}
