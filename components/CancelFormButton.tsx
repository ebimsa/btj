'use client';

import type { MouseEvent } from 'react';

interface CancelFormButtonProps {
  label?: string;
  className?: string;
}

export default function CancelFormButton({
  label = 'Batal',
  className = 'h-11 min-w-32 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50',
}: CancelFormButtonProps) {
  function handleCancel(event: MouseEvent<HTMLButtonElement>) {
    const button = event.currentTarget;
    const form = button.closest('form');

    if (form) {
      const fileInputs = form.querySelectorAll<HTMLInputElement>('input[type="file"]');
      fileInputs.forEach((input) => {
        input.value = '';
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });

      form.reset();
      const details = form.closest('details');
      if (details) {
        details.removeAttribute('open');
      }
    }
  }

  return (
    <button type="button" className={className} onClick={handleCancel}>
      {label}
    </button>
  );
}
