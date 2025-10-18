import { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function nanoid(prefix = ''): string {
  const id = Math.random().toString(36).slice(2, 10);
  return prefix ? `${prefix}_${id}` : id;
}

export function dialogStyles(open: boolean): string {
  return cn(
    'fixed inset-0 z-50 grid place-items-start pt-24 px-4 bg-black/60 backdrop-blur-[2px] transition-opacity',
    open ? 'opacity-100' : 'opacity-0 pointer-events-none'
  );
}
