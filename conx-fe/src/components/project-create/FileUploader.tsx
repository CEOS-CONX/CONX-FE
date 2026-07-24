'use client';

import { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import IconFilePlus from '@/assets/icons/icon_filePlus.svg';
import IconError from '@/assets/icons/icon_error.svg';
import { IconButton } from '@/components/common/IconButton';
import Modal from '@/components/common/Modal/Modal';
import Toast from '@/components/common/Toast/Toast';
import type { FileUploadItem } from '@/types/project';
import { uploadFile } from '@/components/project-create/utils/projectApi';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

interface FileUploaderProps {
  value: FileUploadItem[];
  onChange: (items: FileUploadItem[]) => void;
  error?: string;
}

function createEmptyFileItem(): FileUploadItem {
  return {
    id: crypto.randomUUID(),
    file: null,
    name: '',
    size: 0,
    description: '',
    fileId: null,
    fileUrl: '',
  };
}

function isFileItemFilled(item: FileUploadItem) {
  return !!(item.file || item.name || item.description);
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function getFileExtension(name: string): string {
  const parts = name.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : '';
}

function formatFileName(item: FileUploadItem): string {
  if (!item.name) return '파일 첨부';
  const ext = getFileExtension(item.name);
  const size = formatFileSize(item.size);
  return `${item.name}[${ext}, ${size}]`;
}

interface FileCardProps {
  item: FileUploadItem;
  isLast: boolean;
  sizeError: boolean;
  onUpdate: (id: string, field: keyof FileUploadItem, value: string | number | File | null) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onFileSelect: (id: string) => void;
  onFileDrop: (id: string, file: File) => void;
}

function SortableFileCard(props: FileCardProps) {
  const { item } = props;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <FileCard {...props} dragListeners={listeners} dragAttributes={attributes} />
    </div>
  );
}

interface FileCardInternalProps extends FileCardProps {
  dragListeners?: ReturnType<typeof useSortable>['listeners'];
  dragAttributes?: ReturnType<typeof useSortable>['attributes'];
}

function FileCard({
  item,
  isLast,
  sizeError,
  onUpdate,
  onDelete,
  onAdd,
  onFileSelect,
  onFileDrop,
  dragListeners,
  dragAttributes,
}: FileCardInternalProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const filled = isFileItemFilled(item);
  const hasFile = !!item.file;

  const borderClass = sizeError
    ? 'border border-conx-red-500'
    : isDragOver
      ? 'border-2 border-dashed border-conx-primary-300 bg-conx-gray-50'
      : isFocused
        ? 'border border-conx-primary-300'
        : filled
          ? 'border border-conx-gray-400'
          : 'border border-conx-gray-150';

  const iconColor = hasFile ? 'text-conx-common-black' : 'text-conx-gray-300';

  function handleBlur(e: React.FocusEvent) {
    if (!cardRef.current?.contains(e.relatedTarget)) {
      setIsFocused(false);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileDrop(item.id, file);
    }
  }

  return (
    <div
      className="-ml-9 flex w-[calc(100%+2.25rem)] flex-col items-center gap-3 pl-9"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex w-full items-start">
        {isHovered && (
          <IconButton
            variant="handle"
            className="hover:bg-conx-primary-100 active:bg-conx-primary-150 absolute top-0 -left-9 cursor-grab bg-transparent active:cursor-grabbing"
            aria-label="순서 변경"
            {...dragListeners}
            {...dragAttributes}
          />
        )}
        <div
          ref={cardRef}
          className={`relative flex w-full cursor-pointer flex-col gap-3 overflow-hidden rounded-md bg-white p-4 ${borderClass}`}
          onClick={() => setIsFocused(true)}
          onBlur={handleBlur}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isHovered && (
            <div className="absolute top-4 right-4 flex items-start gap-2">
              {hasFile && (
                <IconButton
                  variant="edit"
                  onClick={() => onFileSelect(item.id)}
                  aria-label="파일 변경"
                />
              )}
              <IconButton
                variant="trash"
                onClick={() => onDelete(item.id)}
                aria-label="파일 삭제"
              />
            </div>
          )}
          {isFocused ? (
            <>
              <div className="flex items-center gap-1">
                <IconFilePlus className={`size-5.5 shrink-0 ${iconColor}`} />
                {hasFile ? (
                  <span className="text-kor-body-1-semibold text-conx-common-black">
                    {formatFileName(item)}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileSelect(item.id);
                    }}
                    className="text-kor-body-1-semibold text-conx-gray-300 cursor-pointer"
                  >
                    파일 첨부
                  </button>
                )}
              </div>
              <div className="pl-6.5">
                <input
                  type="text"
                  autoFocus={!hasFile}
                  placeholder="추가 설명이 필요하다면 적어주세요."
                  value={item.description}
                  onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
                  className="text-kor-body-1-medium text-conx-common-black placeholder:text-conx-gray-300 w-full outline-none"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <IconFilePlus className={`size-5.5 shrink-0 ${iconColor}`} />
                <span
                  className={`text-kor-body-1-semibold ${hasFile ? 'text-conx-common-black' : 'text-conx-gray-300'}`}
                >
                  {hasFile ? formatFileName(item) : '파일 첨부'}
                </span>
              </div>
              <div className="pl-6.5">
                <p
                  className={`text-kor-body-1-medium ${filled && item.description ? 'text-conx-common-black' : 'text-conx-gray-300'}`}
                >
                  {item.description || '추가 설명이 필요하다면 적어주세요.'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      {sizeError && (
        <p className="text-kor-label-1-medium text-conx-red-500 flex items-start gap-1 self-start">
          <IconError className="h-4 w-4 shrink-0" />
          파일 용량을 초과했습니다
        </p>
      )}
      {isHovered && isLast && <IconButton variant="plus" onClick={onAdd} aria-label="파일 추가" />}
    </div>
  );
}

export default function FileUploader({ value, onChange, error }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [targetItemId, setTargetItemId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [sizeErrorId, setSizeErrorId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const hasItems = value.length > 0;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function showToastMessage(message: string) {
    setToastMessage(message);
    setShowToast(true);
  }

  function handleAdd() {
    onChange([...value, createEmptyFileItem()]);
  }

  function handleFileSelect(id: string) {
    setTargetItemId(id);
    inputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setSizeErrorId(targetItemId);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    setSizeErrorId(null);

    if (targetItemId) {
      // 먼저 로컬 상태 업데이트 (파일명 표시)
      onChange(
        value.map((item) =>
          item.id === targetItemId ? { ...item, file, name: file.name, size: file.size } : item,
        ),
      );

      // 서버에 즉시 업로드
      try {
        const uploaded = await uploadFile(file);
        onChange(
          valueRef.current.map((item) =>
            item.id === targetItemId ? { ...item, fileUrl: uploaded.fileUrl } : item,
          ),
        );
      } catch (err) {
        setSizeErrorId(targetItemId);
      }

      setTargetItemId(null);
    }

    if (inputRef.current) inputRef.current.value = '';
  }

  async function handleFileDrop(id: string, file: File) {
    if (file.size > MAX_FILE_SIZE) {
      setSizeErrorId(id);
      return;
    }
    setSizeErrorId(null);

    onChange(
      value.map((item) =>
        item.id === id ? { ...item, file, name: file.name, size: file.size } : item,
      ),
    );

    try {
      const uploaded = await uploadFile(file);
      onChange(
        valueRef.current.map((item) =>
          item.id === id ? { ...item, fileUrl: uploaded.fileUrl } : item,
        ),
      );
    } catch {
      setSizeErrorId(id);
    }
  }

  function handleUpdate(
    id: string,
    field: keyof FileUploadItem,
    fieldValue: string | number | File | null,
  ) {
    onChange(value.map((item) => (item.id === id ? { ...item, [field]: fieldValue } : item)));
  }

  function handleDeleteRequest(id: string) {
    if (value.length === 1) {
      const target = value.find((item) => item.id === id);
      if (target && !isFileItemFilled(target)) {
        showToastMessage('입력된 정보가 없습니다');
        return;
      }
    }
    setDeleteTargetId(id);
  }

  function handleDelete(id: string) {
    if (value.length === 1) {
      onChange(
        value.map((item) =>
          item.id === id
            ? { ...item, file: null, name: '', size: 0, description: '', fileId: null, fileUrl: '' }
            : item,
        ),
      );
    } else {
      onChange(value.filter((item) => item.id !== id));
    }
    setDeleteTargetId(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = value.findIndex((item) => item.id === active.id);
      const newIndex = value.findIndex((item) => item.id === over.id);
      onChange(arrayMove(value, oldIndex, newIndex));
    }
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-kor-body-1-semibold text-conx-common-black">파일</span>
        <p className="text-kor-label-1-medium text-conx-gray-450">
          파일을 끌고 오거나 &apos;파일 첨부&apos;를 눌러 추가해주세요(50mb 이하)
        </p>
      </div>

      {hasItems ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={value.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-3">
              {value.map((item, index) => (
                <SortableFileCard
                  key={item.id}
                  item={item}
                  isLast={index === value.length - 1}
                  sizeError={sizeErrorId === item.id}
                  onUpdate={handleUpdate}
                  onDelete={(id) => handleDeleteRequest(id)}
                  onAdd={handleAdd}
                  onFileSelect={handleFileSelect}
                  onFileDrop={handleFileDrop}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <button
          type="button"
          onClick={handleAdd}
          className="border-conx-gray-150 flex w-full cursor-pointer flex-col gap-3 overflow-hidden rounded-md border bg-white p-4 text-left"
        >
          <div className="flex items-center gap-1">
            <IconFilePlus className="text-conx-gray-300 size-5.5 shrink-0" />
            <span className="text-kor-body-1-semibold text-conx-gray-300">파일 첨부</span>
          </div>
          <div className="pl-6.5">
            <p className="text-kor-body-1-medium text-conx-gray-300">
              추가 설명이 필요하다면 적어주세요.
            </p>
          </div>
        </button>
      )}

      {error && (
        <p className="text-kor-label-1-medium text-conx-red-500 flex items-center gap-1">
          <IconError className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      <input ref={inputRef} type="file" onChange={handleFileChange} className="hidden" />

      {showToast && (
        <Toast message={toastMessage} duration={5000} onClose={() => setShowToast(false)} />
      )}

      {deleteTargetId && (
        <Modal
          title="삭제하시겠습니까?"
          subtitle="입력한 정보가 모두 삭제됩니다"
          primaryLabel="삭제하기"
          onPrimaryClick={() => handleDelete(deleteTargetId)}
          onClose={() => setDeleteTargetId(null)}
        />
      )}
    </div>
  );
}
