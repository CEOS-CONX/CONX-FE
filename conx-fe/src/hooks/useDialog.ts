import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * 모달/다이얼로그 공용 접근성 훅.
 * - Esc로 닫기
 * - 뒤 배경 스크롤 잠금
 * - 열릴 때 모달 내부 첫 포커서블로 포커스 이동
 * - Tab 포커스를 모달 안에 가둠(포커스 트랩)
 * - 닫힐 때 직전 포커스 요소로 복귀
 *
 * 반환한 ref를 다이얼로그 컨테이너(role="dialog")에 붙여 사용.
 */
export function useDialog<T extends HTMLElement = HTMLDivElement>(onClose: () => void) {
  const ref = useRef<T>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []);

    // 열릴 때 내부 첫 포커서블(없으면 컨테이너)로 포커스 이동
    (focusables()[0] ?? ref.current)?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      previousFocus?.focus();
    };
  }, []);

  return ref;
}
