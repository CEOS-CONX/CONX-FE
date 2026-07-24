'use client';

import { useState } from 'react';
import Button from '@/components/common/Button/Button';
import Modal from '@/components/common/Modal/Modal';
import FileUploader from '@/components/project-create/FileUploader';
import LinkInput from '@/components/project-create/LinkInput';
import IconError from '@/assets/icons/icon_error.svg';
import type { FileUploadItem } from '@/types/project';
import type { LinkItem } from '@/types/project';

interface ResultUploadSectionProps {
  projectId: string;
  onCancel: () => void;
  onSubmit: () => void;
}

export default function ResultUploadSection({
  projectId,
  onCancel,
  onSubmit,
}: ResultUploadSectionProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmitConfirm() {
    setShowConfirm(false);
    setIsSubmitting(true);
    try {
      const payload = {
        subject: title,
        content,
        fileLinks: files.filter((f) => f.fileUrl).map((f) => f.fileUrl),
        links: links
          .filter((l) => l.url)
          .map((l) => ({
            linkName: l.name,
            link: l.url,
            explanation: l.description || undefined,
          })),
      };
      const res = await fetch(`/api/crews/projects/${projectId}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        onSubmit();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.message ?? '결과물 제출에 실패했습니다.');
      }
    } catch {
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleTitleBlur() {
    if (!title.trim()) setTitleError(true);
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTitle(e.target.value);
    if (e.target.value.trim()) setTitleError(false);
  }

  function handleSubmitClick() {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }
    setShowConfirm(true);
  }

  return (
    <div className="border-conx-gray-150 flex w-264.5 flex-col gap-7 rounded-md border px-15 py-14.5">
      <h2 className="text-kor-heading-3-bold text-conx-common-black">결과물 업로드</h2>

      <div className="flex flex-col gap-8 pt-4.75">
        {/* 제목 */}
        <div className="flex flex-col gap-3">
          <label className="text-kor-body-1-semibold text-conx-common-black">
            제목
            <span className="bg-conx-red-500 mt-0.5 ml-1 inline-block h-1 w-1 rounded-full align-top" />
          </label>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              placeholder="제목을 입력해주세요."
              className={`text-kor-body-1-medium text-conx-common-black placeholder:text-conx-gray-300 h-14 rounded-md border px-4 outline-none ${
                titleError
                  ? 'border-conx-red-500'
                  : 'border-conx-gray-150 not-placeholder-shown:border-conx-gray-400'
              }`}
            />
            {titleError && (
              <p className="text-kor-label-1-medium text-conx-red-500 flex items-center gap-1">
                <IconError className="size-4 shrink-0" />
                제목을 입력해주세요.
              </p>
            )}
          </div>
        </div>

        {/* 내용 */}
        <div className="flex flex-col gap-3">
          <label className="text-kor-body-1-semibold text-conx-common-black">내용</label>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="공유할 사항이 있다면 적어주세요."
            className="text-kor-body-1-medium border-conx-gray-150 text-conx-common-black placeholder:text-conx-gray-300 not-placeholder-shown:border-conx-gray-400 h-14 rounded-md border p-4 outline-none"
          />
        </div>

        {/* 파일 */}
        <FileUploader value={files} onChange={setFiles} />

        {/* 링크 */}
        <LinkInput value={links} onChange={setLinks} />
      </div>

      {/* 하단 버튼 */}
      <div className="flex items-center justify-end gap-1.75">
        <Button variant="tertiary" onClick={() => setShowCancelConfirm(true)}>
          작성 취소
        </Button>
        <Button variant="primary" disabled={isSubmitting} onClick={handleSubmitClick}>
          {isSubmitting ? '제출 중...' : '제출하기'}
        </Button>
      </div>

      {showConfirm && (
        <Modal
          title="결과물을 제출하시겠습니까?"
          subtitle={
            <>
              제출이 완료되면 결과물과 작성한 내용은 수정할 수 없습니다.
              <br />
              제출 전 내용을 다시 한번 확인해 주세요.
            </>
          }
          primaryLabel="제출하기"
          onPrimaryClick={handleSubmitConfirm}
          onClose={() => setShowConfirm(false)}
        />
      )}

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
    </div>
  );
}
