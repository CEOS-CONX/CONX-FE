'use client';

import { useEffect, useRef, useState } from 'react';
import IconClose from '@/assets/icons/icon_delete.svg';
import { useDialog } from '@/hooks/useDialog';
import { fileDownloadUrl } from '@/utils/download';

interface FilePreviewModalProps {
  fileName: string;
  /** 미리보기 대상 파일 URL (S3 등). PDF면 pdf.js로 페이지를 이미지로 렌더한다. 아직 연동 전이면 생략 가능. */
  url?: string;
  /** 확장자 (없으면 fileName 에서 추출) */
  extension?: string;
  onClose: () => void;
  /** 다운로드 버튼 노출 여부 (포트폴리오 등 다운로드 불가 자료는 false) */
  downloadable?: boolean;
}

const PAGE_WIDTH = 938; // 미리보기 페이지 폭(px) — 디자인 고정값
const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'avif'];

type RenderedPage = { src: string; ratio: number }; // ratio = height / width

type Status = 'pending' | 'loading' | 'ready' | 'error' | 'unsupported';

// 다운로드 버튼(secondary variant 스타일을 <a> 로 재현 — 버튼 안엔 앵커를 못 넣으므로)
const DOWNLOAD_CLASS =
  'text-kor-body-1-semibold inline-flex cursor-pointer items-center justify-center gap-1 rounded-md px-3 py-2 bg-conx-primary-200 text-conx-common-black hover:bg-conx-primary-300 active:bg-conx-primary-400';

export default function FilePreviewModal({
  fileName,
  url,
  extension,
  onClose,
  downloadable = true,
}: FilePreviewModalProps) {
  const dialogRef = useDialog(onClose); // Esc·스크롤 잠금·포커스 트랩/복귀

  const ext = (extension ?? fileName.split('.').pop() ?? '').toLowerCase();
  const isPdf = ext === 'pdf';
  const isImage = IMAGE_EXTS.includes(ext);

  // PDF가 아니면 렌더링 로직이 없으므로 초기 상태로 확정 (effect에서 동기 setState 금지 규칙 회피)
  const [status, setStatus] = useState<Status>(() =>
    !url ? 'pending' : isPdf ? 'loading' : isImage ? 'ready' : 'unsupported',
  );
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const scrollRef = useRef<HTMLDivElement>(null); // 가운데 스크롤 컨테이너

  // ── PDF → 이미지 렌더 (브라우저에서만: pdf.js는 DOMMatrix/Worker 필요 → 동적 import) ──
  useEffect(() => {
    if (!isPdf || !url) return;
    let cancelled = false;

    const pdfUrl = url;
    let loadingTask: { destroy: () => Promise<void> } | null = null;
    (async () => {
      try {
        const pdfjs = await import('pdfjs-dist');
        // 워커는 public/pdf.worker.min.mjs 정적 파일 사용 (Turbopack 워커 번들링 이슈 회피).
        // ⚠️ pdfjs-dist 버전을 올리면 워커도 다시 복사해야 함(버전 불일치 시 로드 실패):
        //   cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/pdf.worker.min.mjs
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

        const task = pdfjs.getDocument({ url: pdfUrl });
        loadingTask = task;
        const doc = await task.promise;
        if (cancelled) return;
        setNumPages(doc.numPages);

        const dpr = Math.min(window.devicePixelRatio || 1, 2); // 선명도 위해 최대 2배
        const rendered: RenderedPage[] = [];
        for (let n = 1; n <= doc.numPages; n++) {
          if (cancelled) break;
          const page = await doc.getPage(n);
          const base = page.getViewport({ scale: 1 });
          const scale = (PAGE_WIDTH / base.width) * dpr;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          await page.render({ canvas, viewport }).promise;
          if (cancelled) break;

          rendered.push({ src: canvas.toDataURL('image/png'), ratio: base.height / base.width });
          setPages([...rendered]); // 점진적 표시 (한 장씩)
          setStatus('ready');
        }
      } catch (e) {
        // 대개 CORS(S3에 Access-Control-Allow-Origin 없음) 또는 URL 접근 불가
        console.error('[FilePreview] PDF 렌더 실패:', e);
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      loadingTask?.destroy();
    };
  }, [isPdf, url]);

  // ── 현재 페이지 추적 (뷰포트에 가장 많이 걸친 페이지) ──
  useEffect(() => {
    if (!isPdf || pages.length === 0) return;
    const root = scrollRef.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top) {
          const n = Number((top.target as HTMLElement).dataset.page);
          if (n) setCurrentPage(n);
        }
      },
      { root, threshold: [0.1, 0.5, 0.9] },
    );
    root.querySelectorAll('[data-page]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [isPdf, pages.length]);

  const scrollToPage = (n: number) => {
    scrollRef.current
      ?.querySelector(`[data-page="${n}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const showThumbnails = isPdf && pages.length > 0;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${fileName} 미리보기`}
      className="bg-conx-opacity-gray-85 z-conx-modal fixed inset-0 flex flex-col"
    >
      {/* ▼ 상단 네브바 (height 72, 좌우 90) */}
      <div className="flex h-[72px] shrink-0 items-center justify-between px-[90px]">
        {/* 왼쪽: X(22px) + 파일명 */}
        <div className="flex min-w-0 items-center gap-7">
          <button
            type="button"
            aria-label="미리보기 닫기"
            onClick={onClose}
            className="shrink-0 cursor-pointer"
          >
            <IconClose className="[&_path]:stroke-conx-common-white h-[22px] w-[22px]" />
          </button>
          <span className="text-kor-heading-2-semibold text-conx-common-white truncate">
            {fileName}
          </span>
        </div>

        {/* 오른쪽: 페이지 인디케이터 + 다운로드 */}
        <div className="flex shrink-0 items-center gap-10">
          {isPdf && (
            <div className="flex items-center gap-2.5">
              <span className="text-kor-label-1-medium text-conx-gray-300">페이지</span>
              <div className="border-conx-gray-300 bg-conx-opacity-gray-30 flex h-8 w-8 items-center justify-center rounded-md border">
                <span className="text-kor-heading-2-semibold text-conx-common-white">
                  {numPages ? currentPage : 0}
                </span>
              </div>
              <span className="text-conx-gray-300">|</span>
              <span className="text-kor-heading-2-semibold text-conx-common-white">{numPages}</span>
            </div>
          )}
          {downloadable && url && (
            <a href={fileDownloadUrl(url, fileName)} download={fileName} className={DOWNLOAD_CLASS}>
              다운로드
            </a>
          )}
        </div>
      </div>

      {/* ▼ 본문: 왼쪽 썸네일 사이드바 + 가운데 미리보기(스크롤) */}
      <div className="flex flex-1 overflow-hidden">
        {/* 썸네일 (PDF 렌더 완료분만) */}
        {showThumbnails && (
          <div className="scrollbar-hide flex w-[150px] shrink-0 flex-col items-center gap-4 overflow-y-auto py-5">
            {pages.map((p, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${i + 1}페이지로 이동`}
                aria-current={currentPage === i + 1 ? 'true' : undefined}
                onClick={() => scrollToPage(i + 1)}
                className={`w-[110px] shrink-0 cursor-pointer overflow-hidden rounded-sm bg-white ${
                  currentPage === i + 1 ? 'ring-conx-primary-200 ring-2' : ''
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt="" className="h-auto w-full" />
              </button>
            ))}
          </div>
        )}

        {/* 미리보기 본문 */}
        <div
          ref={scrollRef}
          className="scrollbar-hide flex flex-1 flex-col items-center gap-4 overflow-y-auto py-6"
        >
          {status === 'pending' && (
            <p className="text-kor-body-1-medium text-conx-gray-300 m-auto text-center">
              미리보기 준비 중입니다.
            </p>
          )}

          {status === 'loading' && (
            <p className="text-kor-body-1-medium text-conx-gray-300 m-auto">
              미리보기를 불러오는 중…
            </p>
          )}

          {status === 'error' && (
            <div className="text-kor-body-1-medium text-conx-gray-300 m-auto text-center">
              <p>미리보기를 불러오지 못했어요.</p>
              <p className="mt-1">
                파일 접근 권한(CORS) 문제일 수 있어요. 다운로드로 확인해 주세요.
              </p>
            </div>
          )}

          {status === 'unsupported' && (
            <p className="text-kor-body-1-medium text-conx-gray-300 m-auto text-center">
              미리보기를 지원하지 않는 형식이에요{ext ? ` (.${ext})` : ''}.
              <br />
              다운로드로 확인해 주세요.
            </p>
          )}

          {status === 'ready' && isImage && url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={`${fileName} 미리보기`}
              className="w-[938px] max-w-full shrink-0 rounded-sm bg-white object-contain"
            />
          )}

          {isPdf &&
            pages.map((p, i) => (
              <div
                key={i}
                data-page={i + 1}
                className="w-[938px] shrink-0 overflow-hidden rounded-sm bg-white"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={`${i + 1}페이지`} className="h-auto w-full" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
