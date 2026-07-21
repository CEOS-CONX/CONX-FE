import { Button } from '@/components/common/Button';
import IconArrowLeftStroke from '@/assets/icons/icon_arrowLeft_stroke.svg';

interface ProjectCreateNavbarProps {
  hasDraft?: boolean;
  onBack: () => void;
  onSaveDraft: () => void;
  onLoadDraft?: () => void;
  onSubmit: () => void;
}

export default function ProjectCreateNavbar({
  hasDraft,
  onBack,
  onSaveDraft,
  onLoadDraft,
  onSubmit,
}: ProjectCreateNavbarProps) {
  return (
    <nav className="border-conx-gray-100 bg-conx-common-white sticky top-0 z-10 flex h-18 items-center justify-between border-b px-5 py-4">
      <button
        type="button"
        onClick={onBack}
        className="text-kor-body-1-semibold text-conx-common-black hover:bg-conx-opacity-gray-6 flex cursor-pointer items-center gap-1 rounded-md px-3 py-2"
      >
        <IconArrowLeftStroke className="w-4.5" />
        이전 페이지
      </button>

      <h1 className="text-kor-heading-2-bold text-conx-common-black">프로젝트 등록하기</h1>

      <div className="flex items-center gap-3.25">
        <Button variant="tertiary" onClick={hasDraft ? onLoadDraft : onSaveDraft}>
          {hasDraft ? '임시 저장 불러오기' : '임시 저장'}
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          프로젝트 등록
        </Button>
      </div>
    </nav>
  );
}
