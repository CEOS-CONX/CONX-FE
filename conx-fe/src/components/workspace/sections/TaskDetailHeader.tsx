import Link from 'next/link';
import IconArrowLeftStroke from '@/assets/icons/icon_arrowLeft_stroke.svg';
import Button from '@/components/common/Button/Button';

interface TaskDetailHeaderProps {
  projectTitle: string;
  brandName: string;
  managerName: string;
  email: string;
  projectId: string;
}

export default function TaskDetailHeader({
  projectTitle,
  brandName,
  managerName,
  email,
  projectId,
}: TaskDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/crew-workspace/project-tasks"
        className="text-kor-body-1-semibold text-conx-gray-450 flex w-29.5 items-center"
      >
        <IconArrowLeftStroke className="size-7.5 p-1.5" />
        프로젝트 현황
      </Link>

      <div className="flex flex-col gap-8">
        <h1 className="text-kor-display-3-bold text-conx-common-black">{projectTitle}</h1>

        <div className="flex items-end justify-between">
          <div className="flex gap-20">
            <div className="flex flex-col gap-1.75">
              <span className="text-kor-label-1-medium text-conx-gray-400">브랜드명</span>
              <span className="text-kor-body-1-semibold text-conx-common-black">{brandName}</span>
            </div>
            <div className="flex flex-col gap-1.75">
              <span className="text-kor-label-1-medium text-conx-gray-400">담당자명</span>
              <span className="text-kor-body-1-semibold text-conx-common-black">{managerName}</span>
            </div>
            <div className="flex flex-col gap-1.75">
              <span className="text-kor-label-1-medium text-conx-gray-400">이메일주소</span>
              <span className="text-kor-body-1-semibold text-conx-common-black">{email}</span>
            </div>
          </div>
          <Link href={`/projects/${projectId}`}>
            <Button variant="tertiary" className="h-10 w-40">
              프로젝트 상세페이지
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
