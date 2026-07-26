'use client';

import { useEffect, useRef, useState } from 'react';
import IconClose from '@/assets/icons/icon_delete.svg';
import { CTAButton } from '@/components/common/CTAButton';
import { useDialog } from '@/hooks/useDialog';
import ImageCard from './ImageCard';
import TextFieldLabeled from './TextFieldLabeled';
import TextFieldUpload from './TextFieldUpload';

export interface PortfolioDraft {
  thumbnailFile?: File;
  thumbnailUrl?: string; // 새 파일이 없을 때 유지할 기존 썸네일 URL (빈 값이면 삭제)
  name: string;
  portfolioFile?: File;
  fileLink?: string; // 새 파일이 없을 때 유지할 기존 포트폴리오 파일 URL
}

interface PortfolioUploadModalProps {
  onClose: () => void;
  onSubmit: (draft: PortfolioDraft) => void;
  /** 편집 시 기존 값 (없으면 신규 등록) */
  initial?: { name: string; imageLink?: string; fileLink?: string };
}

export default function PortfolioUploadModal({
  onClose,
  onSubmit,
  initial,
}: PortfolioUploadModalProps) {
  const dialogRef = useDialog<HTMLDivElement>(onClose);
  const isEdit = !!initial;
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbUrl, setThumbUrl] = useState(initial?.imageLink ?? '');
  const [name, setName] = useState(initial?.name ?? '');
  const [pfFile, setPfFile] = useState<File | null>(null);
  const thumbUrlRef = useRef('');
  // 기존 포트폴리오 파일명(표시용) — URL 마지막 세그먼트
  const initialFileName = initial?.fileLink
    ? decodeURIComponent(initial.fileLink.split('/').pop()?.split('?')[0] ?? '')
    : undefined;

  // 썸네일 미리보기 URL — 파일 선택 시점에 생성(effect에서 setState 지양)
  const setThumb = (file: File | null) => {
    if (thumbUrlRef.current) URL.revokeObjectURL(thumbUrlRef.current);
    thumbUrlRef.current = file ? URL.createObjectURL(file) : '';
    setThumbFile(file);
    setThumbUrl(thumbUrlRef.current);
  };

  // 언마운트 시 마지막 URL 정리 (effect는 cleanup만)
  useEffect(
    () => () => {
      if (thumbUrlRef.current) URL.revokeObjectURL(thumbUrlRef.current);
    },
    [],
  );

  // 제목 + 포폴 파일 필수 (썸네일은 nullable). 편집 시엔 기존 파일 유지도 허용
  const canSubmit = name.trim().length > 0 && (!!pfFile || !!initial?.fileLink);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-upload-title"
      onClick={onClose}
      className="bg-conx-opacity-gray-30 z-conx-modal fixed inset-0 flex items-center justify-center px-4 py-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-conx-common-white relative max-h-full w-[648px] shrink-0 overflow-y-auto rounded-md px-6 pt-5 pb-5"
      >
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="hover:bg-conx-opacity-gray-6 absolute top-5 right-6 flex cursor-pointer items-center justify-center rounded-md p-1"
        >
          <IconClose className="[&_path]:stroke-conx-common-black h-6 w-6" />
        </button>

        {/* 헤더 */}
        <h2 id="portfolio-upload-title" className="text-kor-heading-3-bold text-conx-common-black">
          {isEdit ? '포트폴리오 수정' : '포트폴리오 업로드'}
        </h2>
        <p className="text-kor-label-1-medium text-conx-gray-450 mt-1">
          파일을 끌고 오거나 칸을 눌러 첨부해주세요(50mb 이하)
        </p>

        {/* 필드 */}
        <div className="mt-5 flex flex-col gap-7">
          {/* 썸네일 이미지 */}
          <div className="flex flex-col gap-3">
            <label htmlFor="portfolio-thumb" className="text-kor-label-1-medium text-conx-gray-350">
              썸네일 이미지
            </label>
            <ImageCard
              className="aspect-456/273 w-full"
              src={thumbUrl || undefined}
              onSelect={(f) => setThumb(f)}
              onRemove={() => setThumb(null)}
            />
          </div>

          {/* 포트폴리오 제목 */}
          <TextFieldLabeled
            id="portfolio-name"
            label="포트폴리오 제목"
            value={name}
            onChange={setName}
            maxLength={35}
          />

          {/* 포트폴리오 파일 (pdf) */}
          <TextFieldUpload
            id="portfolio-file"
            label="포트폴리오 파일"
            accept=".pdf"
            fileName={pfFile?.name ?? initialFileName}
            onSelect={(f) => setPfFile(f)}
            onRemove={() => setPfFile(null)}
          />
        </div>

        {/* 등록하기 */}
        <CTAButton
          className="mt-10"
          disabled={!canSubmit}
          onClick={() =>
            onSubmit({
              thumbnailFile: thumbFile ?? undefined,
              thumbnailUrl: thumbFile ? undefined : thumbUrl || undefined,
              name: name.trim(),
              portfolioFile: pfFile ?? undefined,
              fileLink: pfFile ? undefined : initial?.fileLink,
            })
          }
        >
          {isEdit ? '수정하기' : '등록하기'}
        </CTAButton>
      </div>
    </div>
  );
}
