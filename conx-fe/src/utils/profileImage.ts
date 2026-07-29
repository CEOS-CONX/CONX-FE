// 기본 프로필 이미지 (CONX 4종). 사용자가 이미지를 등록하지 않은 경우 seed로 1개를 고정 배정.
export const DEFAULT_PROFILE_IMAGES = [
  '/images/image_profileDefaultC.png',
  '/images/image_profileDefaultO.png',
  '/images/image_profileDefaultN.png',
  '/images/image_profileDefaultX.png',
] as const;

// 문자열 seed용 간단 해시 (숫자 id가 아닐 때만 사용)
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

// seed(엔티티 id) → 0~3. 같은 seed면 항상 같은 값 (새로고침·재접속 불변).
function seedToIndex(seed?: number | string | null): number {
  if (seed == null || seed === '') return 0; // seed 없으면 첫 번째로 폴백
  const num = typeof seed === 'number' ? seed : Number(seed);
  const base = Number.isFinite(num) ? Math.trunc(num) : hashString(String(seed));
  return (
    ((base % DEFAULT_PROFILE_IMAGES.length) + DEFAULT_PROFILE_IMAGES.length) %
    DEFAULT_PROFILE_IMAGES.length
  );
}

// seed 기반 기본 프로필 이미지 경로. 같은 seed → 항상 같은 이미지.
export function defaultProfileImage(seed?: number | string | null): string {
  return DEFAULT_PROFILE_IMAGES[seedToIndex(seed)];
}

// 업로드한 이미지가 있으면 그것을, 없으면 seed 기반 기본 이미지를 반환.
export function resolveProfileImage(
  uploaded?: string | null,
  seed?: number | string | null,
): string {
  return uploaded && uploaded.trim() ? uploaded : defaultProfileImage(seed);
}
