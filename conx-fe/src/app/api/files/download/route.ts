import { type NextRequest, NextResponse } from 'next/server';

const S3_HOSTNAME = process.env.S3_HOSTNAME;

// 파일 다운로드 프록시 — 교차 출처(S3) 파일을 서버에서 받아 attachment 로 다시 내려줌.
// 클라이언트에선 교차 출처 download 속성이 무시돼 저장이 안 되므로, 같은 출처인 이 route 를 거친다.
// GET /api/files/download?url=<S3 파일 URL>&name=<저장할 파일명>
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get('url');
  const fileName = searchParams.get('name') || 'download';

  if (!fileUrl) {
    return NextResponse.json({ message: 'url이 필요합니다.' }, { status: 400 });
  }

  // SSRF 방지: 등록된 S3 호스트의 https URL 만 프록시
  let parsed: URL;
  try {
    parsed = new URL(fileUrl);
  } catch {
    return NextResponse.json({ message: '잘못된 파일 주소입니다.' }, { status: 400 });
  }
  if (!S3_HOSTNAME || parsed.hostname !== S3_HOSTNAME || parsed.protocol !== 'https:') {
    return NextResponse.json({ message: '허용되지 않은 파일 주소입니다.' }, { status: 403 });
  }

  const upstream = await fetch(fileUrl, { cache: 'no-store' }).catch(() => null);
  if (!upstream || !upstream.ok || !upstream.body) {
    return NextResponse.json(
      { message: '파일을 가져오지 못했습니다.' },
      { status: upstream?.status || 502 },
    );
  }

  // 한글 등 비ASCII 파일명 대응: ASCII fallback + RFC 5987 filename*
  const asciiName = fileName.replace(/[^\x20-\x7E]/g, '_').replace(/"/g, '');
  const disposition = `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;

  const headers = new Headers();
  headers.set('Content-Type', upstream.headers.get('content-type') ?? 'application/octet-stream');
  headers.set('Content-Disposition', disposition);
  const len = upstream.headers.get('content-length');
  if (len) headers.set('Content-Length', len);

  return new NextResponse(upstream.body, { status: 200, headers });
}
