'use client';

import ImageUploaderInput, { type Portfolio } from './ImageUploaderInput';

interface ImageUploaderProps {
  label?: string;
  helperText?: string;
  value: Portfolio[];
  onChange: (value: Portfolio[]) => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
  sortable?: boolean;
}

// Img_Uploader — 라벨 + 도움말 + ImageUploaderInput (포트폴리오 다중)
export default function ImageUploader({
  label = '포트폴리오',
  helperText,
  value,
  onChange,
  onAdd,
  onEdit,
  sortable,
}: ImageUploaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-kor-body-1-semibold text-conx-common-black">{label}</span>
        {helperText && <p className="text-kor-label-1-medium text-conx-gray-450">{helperText}</p>}
      </div>
      <ImageUploaderInput
        value={value}
        onChange={onChange}
        onAdd={onAdd}
        onEdit={onEdit}
        sortable={sortable}
      />
    </div>
  );
}
