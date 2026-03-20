'use client';

import { ChangeEvent, InvalidEvent, useEffect, useMemo, useState } from 'react';

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

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
  const [errorMessage, setErrorMessage] = useState('');

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
    event.currentTarget.setCustomValidity('');
    const selected = Array.from(event.target.files ?? []);

    const hasOversizedFile = selected.some((file) => file.size > MAX_UPLOAD_SIZE_BYTES);
    if (hasOversizedFile) {
      setFiles([]);
      setErrorMessage('Ukuran gambar maksimal 5MB per file. Silakan pilih file yang lebih kecil.');
      event.currentTarget.value = '';
      return;
    }

    setErrorMessage('');
    setFiles(selected);
  }

  function handleInvalid(event: InvalidEvent<HTMLInputElement>) {
    if (event.currentTarget.validity.valueMissing) {
      event.currentTarget.setCustomValidity('File gambar wajib diisi sebelum menyimpan.');
      setErrorMessage('File gambar wajib diisi sebelum menyimpan.');
    }
  }

  return (
    <div className={className}>
      <div className="mb-3 flex items-center gap-2">
        <label className="block text-sm font-bold text-slate-900">{label}</label>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
            required
              ? 'bg-rose-100 text-rose-700'
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          {required ? 'Wajib' : 'Opsional'}
        </span>
      </div>
      <label className="flex items-center justify-center w-full px-4 py-4 border border-slate-300 border-solid rounded-xl bg-white cursor-pointer hover:bg-slate-50 transition-colors">
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700">Klik untuk upload foto</p>
          <p className="text-xs text-slate-500 mt-1">
            {hint || (multiple ? 'Bisa pilih lebih dari satu foto' : 'Pilih satu foto')} (maks. 5MB/file)
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
          onInvalid={handleInvalid}
        />
      </label>

      {errorMessage ? (
        <p className="mt-2 text-xs font-semibold text-rose-700">{errorMessage}</p>
      ) : null}

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
