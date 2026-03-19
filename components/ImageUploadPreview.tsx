'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';

interface ImageUploadPreviewProps {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  multiple?: boolean;
  className?: string;
}

export default function ImageUploadPreview({
  name,
  label,
  hint,
  required = false,
  multiple = false,
  className = '',
}: ImageUploadPreviewProps) {
  const [files, setFiles] = useState<File[]>([]);

  const previewUrls = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    setFiles(selected);
  }

  return (
    <div className={className}>
      <label className="block text-sm font-bold text-slate-900 mb-3">{label}</label>
      <label className="flex items-center justify-center w-full px-4 py-4 border border-slate-300 border-solid rounded-xl bg-white cursor-pointer hover:bg-slate-50 transition-colors">
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700">Klik untuk upload foto</p>
          <p className="text-xs text-slate-500 mt-1">
            {hint || (multiple ? 'Bisa pilih lebih dari satu foto' : 'Pilih satu foto')}
          </p>
        </div>
        <input
          name={name}
          type="file"
          accept="image/*"
          required={required}
          multiple={multiple}
          className="hidden"
          onChange={handleChange}
        />
      </label>

      {previewUrls.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-emerald-700 mb-2">Preview upload:</p>
          <div className="flex flex-wrap gap-2">
            {previewUrls.map((url, index) => (
              <div key={`${url}-${index}`} className="w-16 h-16 rounded-lg border border-emerald-200 overflow-hidden bg-emerald-50">
                <img src={url} alt="preview" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
