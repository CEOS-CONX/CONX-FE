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
import IconError from '@/assets/icons/icon_error.svg';
import { IconButton } from '@/components/common/IconButton';
import Modal from '@/components/common/Modal/Modal';
import Toast from '@/components/common/Toast/Toast';
import type { OutcomeItem } from '@/types/project';

interface TextFieldOutcomeProps {
  value: OutcomeItem[];
  onChange: (items: OutcomeItem[]) => void;
  error?: string;
}

function createEmptyOutcome(): OutcomeItem {
  return {
    id: crypto.randomUUID(),
    platform: '',
    contentType: '',
    count: 0,
    finalSubmission: '',
    description: '',
  };
}

function DividerVertical() {
  return (
    <div className="flex items-center px-0.5">
      <div className="bg-conx-gray-200 h-3 w-px rounded-full" />
    </div>
  );
}

function isItemFilled(item: OutcomeItem) {
  return !!(
    item.platform ||
    item.contentType ||
    item.count > 0 ||
    item.finalSubmission ||
    item.description
  );
}

interface OutcomeCardProps {
  item: OutcomeItem;
  isLast: boolean;
  onUpdate: (id: string, field: keyof OutcomeItem, value: string | number) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

function SortableOutcomeCard(props: OutcomeCardProps) {
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
      <OutcomeCard {...props} dragListeners={listeners} dragAttributes={attributes} />
    </div>
  );
}

interface OutcomeCardInternalProps extends OutcomeCardProps {
  dragListeners?: ReturnType<typeof useSortable>['listeners'];
  dragAttributes?: ReturnType<typeof useSortable>['attributes'];
}

function OutcomeCard({
  item,
  isLast,
  onUpdate,
  onDelete,
  onAdd,
  dragListeners,
  dragAttributes,
}: OutcomeCardInternalProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const filled = isItemFilled(item);

  const borderClass =
    isHovered || isFocused
      ? 'border-conx-primary-300'
      : filled
        ? 'border-conx-gray-400'
        : 'border-conx-gray-150';

  function handleBlur(e: React.FocusEvent) {
    if (!cardRef.current?.contains(e.relatedTarget)) {
      setIsFocused(false);
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
            <IconButton
              variant="trash"
              onClick={() => onDelete(item.id)}
              className="absolute top-4 right-4"
              aria-label="결과물 삭제"
            />
          )}
          {isFocused ? (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="플랫폼명"
                  autoFocus
                  value={item.platform}
                  onChange={(e) => onUpdate(item.id, 'platform', e.target.value)}
                  className="text-kor-body-1-semibold text-conx-common-black placeholder:text-conx-gray-300 w-[4em] shrink-0 outline-none"
                />
                <DividerVertical />
                <input
                  type="text"
                  placeholder="콘텐츠 유형"
                  value={item.contentType}
                  onChange={(e) => onUpdate(item.id, 'contentType', e.target.value)}
                  className="text-kor-body-1-semibold text-conx-common-black placeholder:text-conx-gray-300 w-[5.25em] shrink-0 outline-none"
                />
                <DividerVertical />
                <span className="text-kor-body-1-semibold text-conx-gray-300 shrink-0">
                  {item.count}개
                </span>
                <DividerVertical />
                <input
                  type="text"
                  placeholder="최종 제출물"
                  value={item.finalSubmission}
                  onChange={(e) => onUpdate(item.id, 'finalSubmission', e.target.value)}
                  className="text-kor-body-1-semibold text-conx-common-black placeholder:text-conx-gray-300 w-[5.25em] shrink-0 outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="결과물에 반드시 포함되어야 하는 내용이나 전달 기준이 있다면 작성해주세요."
                value={item.description}
                onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
                className="text-kor-body-1-medium text-conx-common-black placeholder:text-conx-gray-300 w-full outline-none"
              />
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span
                  className={`text-kor-body-1-semibold shrink-0 whitespace-nowrap ${filled && item.platform ? 'text-conx-common-black' : 'text-conx-gray-300'}`}
                >
                  {item.platform || '플랫폼명'}
                </span>
                <DividerVertical />
                <span
                  className={`text-kor-body-1-semibold shrink-0 whitespace-nowrap ${filled && item.contentType ? 'text-conx-common-black' : 'text-conx-gray-300'}`}
                >
                  {item.contentType || '콘텐츠 유형'}
                </span>
                <DividerVertical />
                <span className="text-kor-body-1-semibold text-conx-gray-300 shrink-0 whitespace-nowrap">
                  {item.count}개
                </span>
                <DividerVertical />
                <span
                  className={`text-kor-body-1-semibold shrink-0 whitespace-nowrap ${filled && item.finalSubmission ? 'text-conx-common-black' : 'text-conx-gray-300'}`}
                >
                  {item.finalSubmission || '최종 제출물'}
                </span>
              </div>
              <p
                className={`text-kor-body-1-medium whitespace-nowrap ${filled && item.description ? 'text-conx-common-black' : 'text-conx-gray-300'}`}
              >
                {item.description ||
                  '결과물에 반드시 포함되어야 하는 내용이나 전달 기준이 있다면 작성해주세요.'}
              </p>
            </>
          )}
        </div>
      </div>
      {isHovered && isLast && (
        <IconButton variant="plus" onClick={onAdd} aria-label="결과물 추가" />
      )}
    </div>
  );
}

export default function TextFieldOutcome({ value, onChange, error }: TextFieldOutcomeProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const hasItems = value.length > 0;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleAdd() {
    onChange([...value, createEmptyOutcome()]);
  }

  function handleUpdate(id: string, field: keyof OutcomeItem, fieldValue: string | number) {
    onChange(value.map((item) => (item.id === id ? { ...item, [field]: fieldValue } : item)));
  }

  function handleDeleteRequest(id: string) {
    if (value.length === 1) {
      const target = value.find((item) => item.id === id);
      if (target && !isItemFilled(target)) {
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
          item.id === id
            ? {
                ...item,
                platform: '',
                contentType: '',
                count: 0,
                finalSubmission: '',
                description: '',
              }
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
    <div className="flex w-full flex-col gap-2.5">
      <div className="flex gap-0.5">
        <span className="text-kor-body-1-semibold text-conx-common-black">결과물</span>
        <span className="bg-conx-red-500 mt-0.5 inline-block h-1 w-1 rounded-full" />
      </div>

      {hasItems ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={value.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-3">
              {value.map((item, index) => (
                <SortableOutcomeCard
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
          className="border-conx-gray-150 flex w-full cursor-pointer flex-col items-start gap-3 overflow-hidden rounded-md border bg-white p-4 text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-kor-body-1-semibold text-conx-gray-300">플랫폼명</span>
            <DividerVertical />
            <span className="text-kor-body-1-semibold text-conx-gray-300">콘텐츠 유형</span>
            <DividerVertical />
            <span className="text-kor-body-1-semibold text-conx-gray-300">0개</span>
            <DividerVertical />
            <span className="text-kor-body-1-semibold text-conx-gray-300">최종 제출물</span>
          </div>
          <p className="text-kor-body-1-medium text-conx-gray-300">
            결과물에 반드시 포함되어야 하는 내용이나 전달 기준이 있다면 작성해주세요.
          </p>
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
