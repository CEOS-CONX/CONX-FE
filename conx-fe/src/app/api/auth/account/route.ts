import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { BACKEND_ENDPOINTS, COOKIE_CONFIG } from '@/constants/api';

const API_BASE_URL = process.env.API_BASE_URL;

// 회원 탈퇴 — 백엔드 DELETE /api/v1/account/me 프록시. 성공 시 인증 쿠키 삭제(로그아웃과 동일)
export async function DELETE(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  const backendRes = await fetch(`${API_BASE_URL}${BACKEND_ENDPOINTS.AUTH.DELETE_ACCOUNT}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!backendRes.ok) {
    const error = await backendRes.json().catch(() => ({ message: '회원 탈퇴에 실패했습니다.' }));
    return NextResponse.json(
      { message: error.message ?? '회원 탈퇴에 실패했습니다.' },
      { status: backendRes.status },
    );
  }

  // 성공 → 인증 쿠키 만료
  const res = NextResponse.json({ success: true });
  const clear = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 0,
  };
  res.cookies.set(COOKIE_CONFIG.ACCESS_TOKEN.name, '', {
    ...clear,
    path: COOKIE_CONFIG.ACCESS_TOKEN.path,
  });
  res.cookies.set(COOKIE_CONFIG.USER.name, '', { ...clear, path: COOKIE_CONFIG.USER.path });
  res.cookies.set(COOKIE_CONFIG.REFRESH_TOKEN.name, '', {
    ...clear,
    path: COOKIE_CONFIG.REFRESH_TOKEN.path,
  });
  return res;
}
