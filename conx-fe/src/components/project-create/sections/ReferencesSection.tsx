import FileUploader from '@/components/project-create/FileUploader';
import LinkInput from '@/components/project-create/LinkInput';
import type { ProjectCreateFormData } from '@/types/project';

interface ReferencesSectionProps {
  form: Pick<ProjectCreateFormData, 'referenceFiles' | 'links'>;
  onUpdate: <K extends keyof ProjectCreateFormData>(
    key: K,
    value: ProjectCreateFormData[K],
  ) => void;
  onFieldFocus?: (field: string) => void;
}

export default function ReferencesSection({
  form,
  onUpdate,
  onFieldFocus,
}: ReferencesSectionProps) {
  return (
    <section className="flex w-full flex-col gap-7">
      <h2 className="text-kor-heading-1-bold text-conx-common-black">참고 자료</h2>

      <div className="flex flex-col gap-9">
        <div
          onFocus={() => onFieldFocus?.('파일')}
          onClick={(e) => {
            e.stopPropagation();
            onFieldFocus?.('파일');
          }}
        >
          <FileUploader
            value={form.referenceFiles}
            onChange={(items) => onUpdate('referenceFiles', items)}
          />
        </div>
        <div
          onFocus={() => onFieldFocus?.('링크')}
          onClick={(e) => {
            e.stopPropagation();
            onFieldFocus?.('링크');
          }}
        >
          <LinkInput value={form.links} onChange={(items) => onUpdate('links', items)} />
        </div>
      </div>
    </section>
  );
}
