'use client';

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import IconDragHandle from '@/assets/icons/icon_dragHandle.svg';
import IconPlus from '@/assets/icons/icon_plus.svg';
import ImageCard from './ImageCard';

export interface Portfolio {
  id: string;
  imageLink?: string; // 썸네일
  name: string;
  fileLink?: string; // pdf
}

interface ImageUploaderInputProps {
  value: Portfolio[];
  onChange: (value: Portfolio[]) => void;
  /** 등록/추가 → 업로드 모달 열기 */
  onAdd: () => void;
  /** 특정 포폴 편집(모달) */
  onEdit: (id: string) => void;
  /** 드래그 순서변경 + 드래그핸들·초록+ 노출 */
  sortable?: boolean;
}

function CardWithCaption({
  pf,
  onEdit,
  onRemove,
}: {
  pf: Portfolio;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex w-[240px] flex-col gap-3">
      <ImageCard
        src={pf.imageLink}
        onEdit={onEdit}
        onRemove={onRemove}
        className="h-[144px] w-[240px]"
      />
      <p className="text-kor-body-1-bold text-conx-common-black truncate">{pf.name}</p>
    </div>
  );
}

// 드래그핸들 + 카드
function SortableItem({
  pf,
  onEdit,
  onRemove,
}: {
  pf: Portfolio;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: pf.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-3">
      <button
        type="button"
        aria-label="순서 이동"
        {...attributes}
        {...listeners}
        className="shrink-0 cursor-grab touch-none py-1"
      >
        <IconDragHandle className="h-6 w-6" />
      </button>
      <CardWithCaption pf={pf} onEdit={onEdit} onRemove={onRemove} />
    </div>
  );
}

export default function ImageUploaderInput({
  value,
  onChange,
  onAdd,
  onEdit,
  sortable = false,
}: ImageUploaderInputProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const onRemove = (id: string) => onChange(value.filter((p) => p.id !== id));

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const oldIndex = value.findIndex((p) => p.id === active.id);
      const newIndex = value.findIndex((p) => p.id === over.id);
      onChange(arrayMove(value, oldIndex, newIndex));
    }
  }

  const cards = value.map((pf) =>
    sortable ? (
      <SortableItem
        key={pf.id}
        pf={pf}
        onEdit={() => onEdit(pf.id)}
        onRemove={() => onRemove(pf.id)}
      />
    ) : (
      <CardWithCaption
        key={pf.id}
        pf={pf}
        onEdit={() => onEdit(pf.id)}
        onRemove={() => onRemove(pf.id)}
      />
    ),
  );

  // 0개: 등록 카드만 / 1개↑: 등록된 포폴 카드들(+ sortable이면 초록+)
  if (value.length === 0) {
    return (
      <ImageCard
        placeholder="포트폴리오 등록"
        icon={<IconPlus className="[&_path]:stroke-conx-gray-300 h-6 w-6" />}
        onEmptyClick={onAdd}
        className="h-[144px] w-[240px]"
      />
    );
  }

  return (
    <div className="flex flex-wrap items-start gap-3">
      {sortable ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={value.map((p) => p.id)} strategy={horizontalListSortingStrategy}>
            {cards}
          </SortableContext>
        </DndContext>
      ) : (
        cards
      )}

      {/* 초록 + (add more) — 카드 세로중앙, sortable일 때 노출 */}
      {sortable && (
        <div className="flex h-[144px] items-center">
          <button
            type="button"
            aria-label="포트폴리오 추가"
            onClick={onAdd}
            className="bg-conx-primary-100 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full"
          >
            <IconPlus className="h-[22px] w-[22px]" />
          </button>
        </div>
      )}
    </div>
  );
}
