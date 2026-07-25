import { useCallback, useMemo, useRef, useState } from 'react';

/**
 * 파일 첨부 공용 로직 — 숨김 <input type="file"> 트리거 + 드래그드롭.
 * ImageCard / TextFieldUpload / ProfileImage 등에서 공유.
 *
 * 사용:
 *   const { inputRef, dragOver, open, onInputChange, dragProps } = useFileUpload(onSelect);
 *   <input ref={inputRef} type="file" accept={accept} hidden onChange={onInputChange} />
 *   <div {...dragProps} onClick={open}> ... </div>
 */
export function useFileUpload(onSelect?: (file: File) => void) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const open = useCallback(() => inputRef.current?.click(), []);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onSelect?.(file);
      e.target.value = ''; // 같은 파일 다시 선택해도 onChange 발생하도록 초기화
    },
    [onSelect],
  );

  const dragProps = useMemo(
    () => ({
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
      },
      onDragEnter: (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
      },
      onDragLeave: () => setDragOver(false),
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onSelect?.(file);
      },
    }),
    [onSelect],
  );

  return { inputRef, dragOver, open, onInputChange, dragProps };
}
