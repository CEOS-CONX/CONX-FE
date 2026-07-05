import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: '리프레시 토큰이 없습니다.' }, { status: 401 });
  }

  // 추후 백엔드 refresh 엔드포인트 연동
  return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}
