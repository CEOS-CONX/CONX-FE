'use client';

import { useState } from 'react';
import Button from '@/components/common/Button/Button';
import Modal from '@/components/common/Modal/Modal';
import FileUploader from '@/components/project-create/FileUploader';
import LinkInput from '@/components/project-create/LinkInput';
import type { FileUploadItem, LinkItem } from '@/types/project';

interface FeedbackFormProps {
  projectId: string;
  submissionId: string;
  onCancel: () => void;
  onSubmit?: () => void;
}

export default function FeedbackForm({
  projectId,
  submissionId,
  onCancel,
  onSubmit,
}: FeedbackFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const hasInput = content.trim().length > 0 || files.length > 0 || links.length > 0;

  async function handleSubmit() {
    setShowSubmitConfirm(false);
    setIsSubmitting(true);
    try {
      const payload = {
        content,
        files: files
          .filter((f) => f.fileUrl)
          .map((f) => ({
            originalName: f.name,
            fileLinks: f.fileUrl,
            explanation: f.description || undefined,
          })),
        links: links
          .filter((l) => l.url)
          .map((l) => ({
            linkName: l.name,
            link: l.url,
            explanation: l.description || undefined,
          })),
      };
      const res = await fetch(
        `/api/companies/me/projects/${projectId}/submissions/${submissionId}/feedback`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );
      if (res.ok) {
        onSubmit?.();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.message ?? '피드백 등록에 실패했습니다.');
      }
    } catch {
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="border-conx-primary-300 flex w-264.75 flex-col gap-11.5 rounded-md border px-15 py-14.5">
      <h3 className="text-kor-heading-3-bold text-conx-common-black">피드백</h3>

      <div className="flex flex-col items-end gap-7">
        <div className="flex w-full flex-col gap-8">
          {/* 내용 */}
          <div className="flex flex-col gap-3">
            <label className="text-kor-body-1-semibold text-conx-common-black">내용</label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="공유할 사항이 있다면 적어주세요."
              className="text-kor-body-1-medium border-conx-gray-150 hover:border-conx-gray-300 focus:border-conx-primary-300 not-placeholder-shown:border-conx-gray-400 text-conx-common-black placeholder:text-conx-gray-300 h-14 rounded-md border p-4 outline-none"
            />
          </div>

          {/* 파일 */}
          <FileUploader value={files} onChange={setFiles} />

          {/* 링크 */}
          <LinkInput value={links} onChange={setLinks} />
        </div>

        {/* 버튼 */}
        <div className="flex items-start gap-1.75">
          <Button
            variant="tertiary"
            disabled={!hasInput}
            onClick={() => setShowCancelConfirm(true)}
          >
            작성 취소
          </Button>
          <Button
            variant="primary"
            disabled={isSubmitting}
            onClick={() => setShowSubmitConfirm(true)}
          >
            {isSubmitting ? '제출 중...' : '보내기'}
          </Button>
        </div>
      </div>

      {showCancelConfirm && (
        <Modal
          title="작성을 취소하시겠습니까?"
          subtitle="작성하신 내용은 복구할 수 없습니다."
          primaryLabel="나가기"
          onPrimaryClick={() => {
            setShowCancelConfirm(false);
            onCancel();
          }}
          onClose={() => setShowCancelConfirm(false)}
        />
      )}
      {showSubmitConfirm && (
        <Modal
          title="피드백을 제출하시겠습니까?"
          subtitle={
            <>
              제출이 완료되면 결과물과 작성한 내용은 수정할 수 없습니다.
              <br />
              제출 전 내용을 다시 한번 확인해 주세요.
            </>
          }
          primaryLabel="제출하기"
          onPrimaryClick={handleSubmit}
          onClose={() => setShowSubmitConfirm(false)}
        />
      )}
    </div>
  );
}
