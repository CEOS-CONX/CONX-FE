'use client';

import IconError from '@/assets/icons/icon_error.svg';
import ImageCard from './ImageCard';

interface ImageUploaderSingleProps {
  label: string;
  src?: string;
  onSelect?: (file: File) => void;
  onRemove?: () => void;
  onEdit?: () => void;
  error?: string;
  accept?: string;
  placeholder?: string;
}

export default function ImageUploaderSingle({
  label,
  src,
  onSelect,
  onRemove,
  onEdit,
  error,
  accept,
  placeholder,
}: ImageUploaderSingleProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-kor-label-1-medium text-conx-gray-350">{label}</span>

      <ImageCard
        src={src}
        onSelect={onSelect}
        onRemove={onRemove}
        onEdit={onEdit}
        error={!!error}
        accept={accept}
        placeholder={placeholder}
      />

      {error && (
        <p className="text-kor-label-1-medium text-conx-red-500 flex items-center gap-1">
          <IconError className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
