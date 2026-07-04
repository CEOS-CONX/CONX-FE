import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const userCookie = cookieStore.get('user')?.value;
  let user = null;
  try {
    user = userCookie ? JSON.parse(userCookie) : null;
  } catch {
    // 파싱 실패 시 null
  }

  return NextResponse.json({ authenticated: true, user });
}
