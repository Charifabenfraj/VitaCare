'use client';

import { useRef, useState } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

export default function ImageUpload({ value, onChange, label = 'Image', required = false }: ImageUploadProps) {
  const [mode, setMode] = useState<'url' | 'file'>('url');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onChange(data.data.url);
      } else {
        setError(data.error || 'Erreur lors de l\'upload');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Erreur lors de l\'upload du fichier');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-[#4a4a4a]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex bg-[#F9F8F6] rounded-lg p-1">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              mode === 'url'
                ? 'bg-white text-[#96A78D] shadow-sm'
                : 'text-[#6a6a6a] hover:text-[#4a4a4a]'
            }`}
          >
            URL
          </button>
          <button
            type="button"
            onClick={() => setMode('file')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              mode === 'file'
                ? 'bg-white text-[#96A78D] shadow-sm'
                : 'text-[#6a6a6a] hover:text-[#4a4a4a]'
            }`}
          >
            Fichier
          </button>
        </div>
      </div>

      {mode === 'url' ? (
        <div>
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 border border-[#D9CFC7] rounded-lg focus:ring-2 focus:ring-[#96A78D] focus:border-transparent"
            placeholder="https://example.com/image.jpg"
            required={required && !value}
          />
          <p className="text-xs text-[#B6AE9F] mt-1">
            Utilisez une URL d&apos;image externe (Cloudinary, Imgur, Unsplash, etc.)
          </p>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            uploading
              ? 'border-[#96A78D] bg-[#96A78D]/5'
              : 'border-[#D9CFC7] hover:border-[#96A78D] hover:bg-[#F9F8F6]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileUpload}
            className="hidden"
          />
          {uploading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#96A78D] border-t-transparent"></div>
              <span className="text-sm text-[#96A78D]">Upload en cours...</span>
            </div>
          ) : (
            <div>
              <svg className="w-8 h-8 mx-auto text-[#B6AE9F] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-[#6a6a6a]">Cliquez pour choisir une image</p>
              <p className="text-xs text-[#B6AE9F] mt-1">JPG, PNG, WebP, GIF (max 5MB)</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Preview */}
      {value && (
        <div className="relative">
          <div className="h-32 bg-[#F9F8F6] rounded-lg overflow-hidden">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
