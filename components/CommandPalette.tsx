"use client";

import * as React from 'react';
import { Command } from 'cmdk';
import { dialogStyles } from '@/lib/utils';

export function CommandPalette({ onNewChat }: { onNewChat: () => void }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div data-open={open} className={dialogStyles(open)} onClick={() => setOpen(false)}>
      {open && (
        <div className="mx-auto w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
          <Command label="Command Menu" className="rounded-2xl bg-[#0E0E11] border border-border text-sm">
            <Command.Input placeholder="Type a command or search…" className="w-full px-3 py-3 outline-none bg-transparent" />
            <Command.List className="max-h-80 overflow-auto border-t border-border">
              <Command.Empty className="px-3 py-2 text-mutedForeground">No results found.</Command.Empty>
              <Command.Group heading="General" className="text-mutedForeground">
                <Command.Item
                  onSelect={() => {
                    onNewChat();
                    setOpen(false);
                  }}
                  className="px-3 py-2 text-foreground data-[selected=true]:bg-accent"
                >
                  New Chat
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      )}
    </div>
  );
}
