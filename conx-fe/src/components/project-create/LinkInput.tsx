'use client';

import { useRef, useState } from 'react';
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
import IconLink from '@/assets/icons/icon_linkAngled.svg';
import IconError from '@/assets/icons/icon_error.svg';
import { IconButton } from '@/components/common/IconButton';
import Modal from '@/components/common/Modal/Modal';
import Toast from '@/components/common/Toast/Toast';
import type { LinkItem } from '@/types/project';

interface LinkInputProps {
  value: LinkItem[];
  onChange: (items: LinkItem[]) => void;
  error?: string;
}

function createEmptyLink(): LinkItem {
  return {
    id: crypto.randomUUID(),
    name: '',
    url: '',
    description: '',
  };
}

function isLinkFilled(item: LinkItem) {
  return !!(item.name || item.url || item.description);
}

interface LinkCardProps {
  item: LinkItem;
  isLast: boolean;
  onUpdate: (id: string, field: keyof LinkItem, value: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

function SortableLinkCard(props: LinkCardProps) {
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
      <LinkCard {...props} dragListeners={listeners} dragAttributes={attributes} />
    </div>
  );
}

interface LinkCardInternalProps extends LinkCardProps {
  dragListeners?: ReturnType<typeof useSortable>['listeners'];
  dragAttributes?: ReturnType<typeof useSortable>['attributes'];
}

function LinkCard({
  item,
  isLast,
  onUpdate,
  onDelete,
  onAdd,
  dragListeners,
  dragAttributes,
}: LinkCardInternalProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const filled = isLinkFilled(item);

  const borderClass = urlError
    ? 'border-conx-red-500'
    : isFocused
      ? 'border-conx-primary-300'
      : filled
        ? 'border-conx-gray-400'
        : 'border-conx-gray-150';

  const iconColor = 'text-conx-gray-300';

  function isValidUrl(url: string): boolean {
    if (!url) return true;
    try {
      const parsed = new URL(`https://${url}`);
      // 도메인에 최소 하나의 . 필요 (예: example.com)
      return parsed.hostname.includes('.');
    } catch {
      return false;
    }
  }

  function handleBlur(e: React.FocusEvent) {
    if (!cardRef.current?.contains(e.relatedTarget)) {
      setIsFocused(false);
      setUrlError(!!item.url && !isValidUrl(item.url));
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
          className={`relative flex w-full cursor-pointer flex-col gap-3 overflow-hidden rounded-md border bg-white p-4 ${borderClass}`}
          onClick={() => setIsFocused(true)}
          onBlur={handleBlur}
        >
          {isHovered && (
            <div className="absolute top-4 right-4">
              <IconButton
                variant="trash"
                onClick={() => onDelete(item.id)}
                aria-label="링크 삭제"
              />
            </div>
          )}
          {isFocused ? (
            <>
              <div className="flex items-start gap-1">
                <IconLink className={`size-5.5 shrink-0 ${iconColor}`} />
                <input
                  type="text"
                  placeholder="링크명"
                  autoFocus
                  value={item.name}
                  onChange={(e) => onUpdate(item.id, 'name', e.target.value)}
                  className="text-kor-body-1-medium text-conx-common-black placeholder:text-conx-gray-300 flex-1 outline-none"
                />
              </div>
              <div className="flex flex-col gap-3 pl-6.5">
                <div className="flex items-start">
                  <span className="font-jakarta text-eng-body-1-medium text-conx-gray-300 shrink-0">
                    https://
                  </span>
                  <input
                    type="text"
                    placeholder=""
                    value={item.url}
                    onChange={(e) => onUpdate(item.id, 'url', e.target.value)}
                    className="text-eng-body-1-medium font-jakarta text-conx-common-black flex-1 outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="추가 설명이 필요하다면 적어주세요."
                  value={item.description}
                  onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
                  className="text-kor-body-1-medium text-conx-common-black placeholder:text-conx-gray-300 w-full outline-none"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-1">
                <IconLink className={`size-5.5 shrink-0 ${iconColor}`} />
                <span
                  className={`text-kor-body-1-semibold ${filled && item.name ? 'text-conx-common-black' : 'text-conx-gray-300'}`}
                >
                  {item.name || '링크명'}
                </span>
              </div>
              <div className="flex flex-col gap-3 pl-6.5">
                <p
                  className={`font-jakarta text-eng-body-1-medium ${filled && item.url ? 'text-conx-common-black' : 'text-conx-gray-300'}`}
                >
                  {item.url ? `https://${item.url}` : 'https://'}
                </p>
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
      {urlError && (
        <p className="text-kor-label-1-medium text-conx-red-500 flex items-center gap-1 self-start">
          <IconError className="h-4 w-4 shrink-0" />
          링크 형식이 올바르지 않습니다
        </p>
      )}
      {isHovered && isLast && <IconButton variant="plus" onClick={onAdd} aria-label="링크 추가" />}
    </div>
  );
}

export default function LinkInput({ value, onChange, error }: LinkInputProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const hasItems = value.length > 0;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleAdd() {
    onChange([...value, createEmptyLink()]);
  }

  function handleUpdate(id: string, field: keyof LinkItem, fieldValue: string) {
    onChange(value.map((item) => (item.id === id ? { ...item, [field]: fieldValue } : item)));
  }

  function handleDeleteRequest(id: string) {
    if (value.length === 1) {
      const target = value.find((item) => item.id === id);
      if (target && !isLinkFilled(target)) {
        setShowToast(true);
        return;
      }
    }
    setDeleteTargetId(id);
  }

  function handleDelete(id: string) {
    if (value.length === 1) {
      onChange(
        value.map((item) =>
          item.id === id ? { ...item, name: '', url: '', description: '' } : item,
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
    <div className="flex w-full flex-col gap-2.5">
      <span className="text-kor-body-1-semibold text-conx-common-black">링크</span>

      {hasItems ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={value.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-3">
              {value.map((item, index) => (
                <SortableLinkCard
                  key={item.id}
                  item={item}
                  isLast={index === value.length - 1}
                  onUpdate={handleUpdate}
                  onDelete={(id) => handleDeleteRequest(id)}
                  onAdd={handleAdd}
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
          <div className="flex items-start gap-1">
            <IconLink className="text-conx-gray-300 size-5.5 shrink-0" />
            <span className="text-kor-body-1-semibold text-conx-gray-300">링크명</span>
          </div>
          <div className="flex flex-col gap-3 pl-6.5">
            <p className="font-jakarta text-eng-body-1-medium text-conx-gray-300">https://</p>
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

      {showToast && (
        <Toast
          message="입력된 정보가 없습니다"
          duration={5000}
          onClose={() => setShowToast(false)}
        />
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
