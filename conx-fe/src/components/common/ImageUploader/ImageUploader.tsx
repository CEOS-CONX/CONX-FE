'use client';

import { useEffect, useRef, useState } from 'react';
import IconImage from '@/assets/icons/icon_image.svg';
import IconError from '@/assets/icons/icon_error.svg';
import { IconButton } from '@/components/common/IconButton';
import Toast from '@/components/common/Toast/Toast';
import Modal from '@/components/common/Modal/Modal';
import type { ProjectImage } from '@/types/project';
import { uploadFile } from '@/components/project-create/utils/projectApi';

interface ImageUploaderProps {
  value: ProjectImage[];
  onChange: (images: ProjectImage[]) => void;
  label?: string;
  helperText?: string;
  error?: string;
}

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export default function ImageUploader({
  value,
  onChange,
  label,
  helperText,
  error,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [targetSlotId, setTargetSlotId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [sizeErrorId, setSizeErrorId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const hasImages = value.length > 0;
  const isFull = value.length >= MAX_IMAGES;

  function addEmptySlot() {
    if (isFull) {
      setShowToast(true);
      return;
    }
    const newSlot: ProjectImage = {
      id: crypto.randomUUID(),
      file: null,
      preview: '',
      fileId: null,
      fileUrl: '',
    };
    onChange([...value, newSlot]);
  }

  async function fillSlot(id: string, file: File) {
    const preview = URL.createObjectURL(file);

    // 로컬 미리보기 즉시 표시
    onChange(value.map((img) => (img.id === id ? { ...img, file, preview } : img)));

    // 서버에 즉시 업로드
    try {
      const uploaded = await uploadFile(file);
      onChange(
        valueRef.current.map((img) =>
          img.id === id ? { ...img, file, preview, fileUrl: uploaded.fileUrl } : img,
        ),
      );
    } catch {
      setSizeErrorId(id);
    }
  }

  function handleSlotClick(id: string) {
    setTargetSlotId(id);
    inputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setSizeErrorId(targetSlotId);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    setSizeErrorId(null);

    if (targetSlotId) {
      const target = value.find((img) => img.id === targetSlotId);
      if (target?.preview) URL.revokeObjectURL(target.preview);
      fillSlot(targetSlotId, file);
      setTargetSlotId(null);
    }

    if (inputRef.current) inputRef.current.value = '';
  }

  function handleSlotDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    setDraggingId(id);
  }

  function handleSlotDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDraggingId(null);
  }

  function handleSlotDrop(e: React.DragEvent, id: string) {
    e.preventDefault();
    setDraggingId(null);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) {
      if (file.size > MAX_FILE_SIZE) {
        setSizeErrorId(id);
        return;
      }
      setSizeErrorId(null);
      const target = value.find((img) => img.id === id);
      if (target?.preview) URL.revokeObjectURL(target.preview);
      fillSlot(id, file);
    }
  }

  function handleInitialDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDraggingId('initial');
  }

  function handleInitialDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDraggingId(null);
  }

  async function handleInitialDrop(e: React.DragEvent) {
    e.preventDefault();
    setDraggingId(null);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith('image/')) {
      if (file.size > MAX_FILE_SIZE) {
        setSizeErrorId('initial');
        return;
      }
      setSizeErrorId(null);
      const id = crypto.randomUUID();
      const newImage: ProjectImage = {
        id,
        file,
        preview: URL.createObjectURL(file),
        fileId: null,
        fileUrl: '',
      };
      onChange([...value, newImage]);

      try {
        const uploaded = await uploadFile(file);
        onChange(
          valueRef.current.map((img) =>
            img.id === id ? { ...img, fileUrl: uploaded.fileUrl } : img,
          ),
        );
      } catch {
        setSizeErrorId(id);
      }
    }
  }

  function handleInitialClick() {
    const id = crypto.randomUUID();
    const newSlot: ProjectImage = { id, file: null, preview: '', fileId: null, fileUrl: '' };
    onChange([...value, newSlot]);
    setTimeout(() => {
      setTargetSlotId(id);
      inputRef.current?.click();
    }, 0);
  }

  function handleRemove(id: string) {
    const target = value.find((img) => img.id === id);
    if (target?.preview) URL.revokeObjectURL(target.preview);
    onChange(value.filter((img) => img.id !== id));
    setHoveredId(null);
    setDeleteTargetId(null);
  }

  function getSlotLabel(index: number) {
    return index === 0 ? '대표 이미지' : '이미지';
  }

  return (
    <div className="flex flex-col gap-3">
      {(label || helperText) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <span className="text-kor-body-1-semibold text-conx-common-black">{label}</span>
          )}
          {helperText && <p className="text-kor-label-1-medium text-conx-gray-450">{helperText}</p>}
        </div>
      )}

      <div className="flex items-center gap-3">
        {hasImages ? (
          value.map((img, index) => {
            const isHovered = hoveredId === img.id;
            const isDragTarget = draggingId === img.id;
            const isEmpty = !img.preview;
            return (
              <div
                key={img.id}
                className="flex items-center gap-3"
                onMouseEnter={() => setHoveredId(img.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {isHovered && (
                  <IconButton variant="handle" className="self-start" aria-label="순서 변경" />
                )}
                {isEmpty ? (
                  <button
                    type="button"
                    onClick={() => handleSlotClick(img.id)}
                    onDragOver={(e) => handleSlotDragOver(e, img.id)}
                    onDragLeave={handleSlotDragLeave}
                    onDrop={(e) => handleSlotDrop(e, img.id)}
                    className={`flex size-44.5 cursor-pointer flex-col items-center justify-center gap-1.25 overflow-hidden rounded-md bg-white ${
                      sizeErrorId === img.id
                        ? 'border-conx-red-500 border'
                        : isDragTarget
                          ? 'border-conx-primary-300 bg-conx-gray-50 border-2 border-dashed'
                          : isHovered
                            ? 'border-conx-primary-300 border'
                            : 'border-conx-gray-150 border'
                    }`}
                  >
                    <IconImage className="size-6" />
                    <span className="text-kor-body-1-medium text-conx-gray-300">
                      {getSlotLabel(index)}
                    </span>
                  </button>
                ) : (
                  <div
                    className={`bg-conx-gray-50 relative size-44.5 overflow-hidden rounded-md border ${
                      isHovered || isDragTarget ? 'border-conx-primary-300' : 'border-conx-gray-400'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.preview}
                      alt="프로젝트 이미지"
                      className="size-full object-cover"
                    />
                    {isHovered && (
                      <div className="absolute top-2.75 right-3.25 flex flex-col gap-2">
                        <IconButton
                          variant="trash"
                          onClick={() => setDeleteTargetId(img.id)}
                          aria-label="이미지 삭제"
                        />
                        <IconButton
                          variant="edit"
                          onClick={() => handleSlotClick(img.id)}
                          aria-label="이미지 변경"
                        />
                      </div>
                    )}
                  </div>
                )}
                {isHovered && (
                  <IconButton variant="plus" onClick={addEmptySlot} aria-label="이미지 추가" />
                )}
              </div>
            );
          })
        ) : (
          <button
            type="button"
            onClick={handleInitialClick}
            onDragOver={handleInitialDragOver}
            onDragLeave={handleInitialDragLeave}
            onDrop={handleInitialDrop}
            className={`flex size-44.5 cursor-pointer flex-col items-center justify-center gap-1.25 overflow-hidden rounded-md ${
              sizeErrorId === 'initial'
                ? 'border-conx-red-500 border bg-white'
                : draggingId === 'initial'
                  ? 'border-conx-primary-300 bg-conx-gray-50 border-2 border-dashed'
                  : 'border-conx-gray-150 border bg-white'
            }`}
          >
            <IconImage className="size-6" />
            <span className="text-kor-body-1-medium text-conx-gray-300">대표 이미지</span>
          </button>
        )}
      </div>

      {(error || sizeErrorId) && (
        <p className="text-kor-label-1-medium text-conx-red-500 flex items-center gap-1">
          <IconError className="h-4 w-4 shrink-0" />
          {error || '파일 용량을 초과했습니다'}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {showToast && (
        <Toast
          message="이미지를 더 추가할 수 없습니다"
          duration={5000}
          onClose={() => setShowToast(false)}
        />
      )}

      {deleteTargetId && (
        <Modal
          title="삭제하시겠습니까?"
          subtitle="입력한 정보가 모두 삭제됩니다"
          primaryLabel="삭제하기"
          onPrimaryClick={() => handleRemove(deleteTargetId)}
          onClose={() => setDeleteTargetId(null)}
        />
      )}
    </div>
  );
}
