'use client';

import { useState } from 'react';
import IconFile from '@/assets/icons/icon_file.svg';
import IconLink from '@/assets/icons/icon_link.svg';
import IconArrowRightStroke from '@/assets/icons/icon_arrowRight_stroke.svg';
import FilePreviewModal from '@/components/projects/detail/FilePreviewModal';
import type { ResultItem, ResultFileItem, ResultLinkItem } from '@/types/workspace';

function FilesBlock({
  files,
  hasFilesAbove,
}: {
  files: ResultFileItem[];
  hasFilesAbove?: boolean;
}) {
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  return (
    <div className={`flex flex-col gap-2 ${hasFilesAbove ? 'pt-5' : 'pt-13'}`}>
      <h4 className="text-kor-body-1-semibold text-conx-common-black">파일</h4>
      <div className="flex flex-col gap-2">
        {files.map((file, i) => (
          <div
            key={i}
            className={`bg-conx-gray-50 flex flex-col gap-1 rounded-md px-4 ${file.description ? 'pt-2 pb-4' : 'py-6.5'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconFile className="text-conx-common-black size-5.5 shrink-0" />
                <span className="text-kor-body-1-semibold text-conx-gray-550">{file.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewFile(file.name)}
                  className="text-kor-body-1-semibold text-conx-common-black hover:bg-conx-opacity-gray-6 active:bg-conx-opacity-gray-30 flex cursor-pointer items-center gap-1 rounded-md px-3 py-2"
                >
                  미리보기
                  <IconArrowRightStroke className="size-4.5" />
                </button>
                <button
                  type="button"
                  className="text-kor-body-1-bold text-conx-common-black hover:bg-conx-opacity-gray-6 active:bg-conx-opacity-gray-30 flex cursor-pointer items-center gap-1 rounded-md px-3 py-2"
                >
                  다운로드
                  <IconArrowRightStroke className="size-4.5" />
                </button>
              </div>
            </div>
            {file.description && (
              <span className="text-kor-body-1-medium text-conx-gray-550 pl-6.5">
                {file.description}
              </span>
            )}
          </div>
        ))}
      </div>
      {previewFile && (
        <FilePreviewModal fileName={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );
}

function LinksBlock({
  links,
  hasFilesAbove,
}: {
  links: ResultLinkItem[];
  hasFilesAbove?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-2 ${hasFilesAbove ? 'pt-5' : 'pt-13'}`}>
      <h4 className="text-kor-body-1-semibold text-conx-common-black">링크</h4>
      <div className="flex flex-col gap-2">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-conx-gray-50 hover:bg-conx-gray-100 active:bg-conx-gray-150 flex cursor-pointer flex-col gap-3 rounded-md p-4 transition-colors"
          >
            <div className="flex items-start gap-1">
              <IconLink className="text-conx-common-black size-5.5 shrink-0" />
              <span className="text-kor-body-1-semibold text-conx-gray-550">{link.label}</span>
            </div>
            <span className="text-eng-body-1-medium text-conx-gray-550 pl-6.5">{link.url}</span>
            {link.description && (
              <span className="text-kor-body-1-medium text-conx-gray-550 pl-6.5">
                {link.description}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

interface ResultDetailSectionProps {
  result: ResultItem;
  onBack: () => void;
}

export default function ResultDetailSection({ result, onBack }: ResultDetailSectionProps) {
  const hasFiles = !!result.files?.length;
  const hasFeedbackFiles = !!result.feedback?.files?.length;

  return (
    <div className="flex flex-col gap-5">
      {/* 원본 결과물 카드 */}
      <div className="border-conx-gray-150 flex w-264.75 flex-col rounded-md border px-15 py-14.5">
        <div className="border-conx-gray-150 flex items-center justify-between border-b pb-7">
          <h3 className="text-kor-body-1-semibold text-conx-common-black">{result.title}</h3>
          <span className="text-kor-label-1-semibold text-conx-gray-400 shrink-0">
            {result.registeredDate}
          </span>
        </div>

        {result.content && (
          <div className="text-kor-body-1-medium text-conx-common-black pt-7 whitespace-pre-line">
            {result.content}
          </div>
        )}

        {result.files && result.files.length > 0 && <FilesBlock files={result.files} />}

        {result.links && result.links.length > 0 && (
          <LinksBlock links={result.links} hasFilesAbove={hasFiles} />
        )}
      </div>

      {/* 피드백 카드 */}
      {result.feedback && (
        <div className="border-conx-primary-300 flex w-264.75 flex-col rounded-md border px-15 py-14.5">
          <div className="border-conx-gray-150 flex items-center justify-between border-b pb-7">
            <h3 className="text-kor-heading-3-bold text-conx-common-black">피드백</h3>
            <span className="text-kor-label-1-semibold text-conx-gray-400 shrink-0">
              {result.feedback.date}
            </span>
          </div>

          <div className="text-kor-body-1-medium text-conx-common-black pt-7 whitespace-pre-line">
            {result.feedback.content}
          </div>

          {result.feedback.files && result.feedback.files.length > 0 && (
            <FilesBlock files={result.feedback.files} />
          )}

          {result.feedback.links && result.feedback.links.length > 0 && (
            <LinksBlock links={result.feedback.links} hasFilesAbove={hasFeedbackFiles} />
          )}
        </div>
      )}
    </div>
  );
}
