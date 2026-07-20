import Accordion from '@/components/workspace/Accordion';
import IconCheckboxChecked from '@/assets/icons/icon_checkbox_checked.svg';
import IconCheckboxDefault from '@/assets/icons/icon_checkbox_default.svg';
import type { SubmissionItem } from '@/types/workspace';

interface SubmissionCriteriaSectionProps {
  items: SubmissionItem[];
  onToggle?: (index: number) => void;
}

export default function SubmissionCriteriaSection({
  items,
  onToggle,
}: SubmissionCriteriaSectionProps) {
  return (
    <Accordion title="제출 기준" subtitle="기업이 보는 제출 기준과 동일한 항목입니다.">
      <div className="flex flex-col gap-4 p-4">
        {items.map((item, i) => {
          const content = (
            <>
              {item.checked ? (
                <IconCheckboxChecked className="size-5.5 shrink-0" />
              ) : (
                <IconCheckboxDefault className="size-5.5 shrink-0" />
              )}
              <span className="text-kor-body-1-medium text-conx-common-black">{item.label}</span>
            </>
          );

          return onToggle ? (
            <button
              key={item.label}
              type="button"
              onClick={() => onToggle(i)}
              className="flex cursor-pointer items-start gap-1 text-left"
            >
              {content}
            </button>
          ) : (
            <div key={item.label} className="flex items-start gap-1">
              {content}
            </div>
          );
        })}
      </div>
    </Accordion>
  );
}
