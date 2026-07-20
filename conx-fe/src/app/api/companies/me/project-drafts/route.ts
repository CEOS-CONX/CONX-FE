import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_BASE_URL;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value;
}

export async function GET() {
  const accessToken = await getToken();
  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }

  const backendRes = await fetch(`${API_BASE_URL}/api/v1/companies/me/project-drafts`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await backendRes.json().catch(() => ({
    message: '임시저장 불러오기에 실패했습니다.',
  }));

  if (!backendRes.ok) {
    return NextResponse.json(
      { message: data.message ?? '임시저장 불러오기에 실패했습니다.' },
      { status: backendRes.status },
    );
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const accessToken = await getToken();
  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }

  const body = await request.json();

  const backendRes = await fetch(`${API_BASE_URL}/api/v1/companies/me/project-drafts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json().catch(() => ({
    message: '임시저장에 실패했습니다.',
  }));

  if (!backendRes.ok) {
    return NextResponse.json(
      { message: data.message ?? '임시저장에 실패했습니다.' },
      { status: backendRes.status },
    );
  }

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const accessToken = await getToken();
  if (!accessToken) {
    return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
  }

  const body = await request.json();

  const backendRes = await fetch(`${API_BASE_URL}/api/v1/companies/me/project-drafts`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = await backendRes.json().catch(() => ({
    message: '임시저장 수정에 실패했습니다.',
  }));

  if (!backendRes.ok) {
    return NextResponse.json(
      { message: data.message ?? '임시저장 수정에 실패했습니다.' },
      { status: backendRes.status },
    );
  }

  return NextResponse.json(data);
}
