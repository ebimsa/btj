'use client';

import { useFormStatus } from 'react-dom';

interface LogoutSubmitButtonProps {
  className?: string;
}

export default function LogoutSubmitButton({ className = '' }: LogoutSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`shrink-0 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-2 text-white shadow-md transition-all hover:bg-slate-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-75 ${className}`}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Keluar...
        </span>
      ) : (
        '🚪 Keluar'
      )}
    </button>
  );
}
