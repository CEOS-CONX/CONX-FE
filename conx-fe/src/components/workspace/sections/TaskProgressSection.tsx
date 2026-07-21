import Accordion from '@/components/workspace/Accordion';
import Timeline from '@/components/workspace/Timeline';
import type { ProgressStep } from '@/types/workspace';

interface TaskProgressSectionProps {
  steps: ProgressStep[];
}

export default function TaskProgressSection({ steps }: TaskProgressSectionProps) {
  return (
    <Accordion title="진행 단계" openClassName="mb-7">
      <div className="flex flex-col p-4">
        {steps.map((step, i) => (
          <Timeline
            key={step.label}
            type={step.type}
            label={step.label}
            date={step.date}
            number={i + 1}
            showLine={i < steps.length - 1}
          />
        ))}
      </div>
    </Accordion>
  );
}
