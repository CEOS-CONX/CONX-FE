'use client';
import { useState } from 'react';
import { RadioButton } from '@/components/common/RadioButton';
import { TextLineButton } from '@/components/common/TextLineButton';
import { SearchBar } from '@/components/common/SearchBar';
import { DropdownCompact } from '@/components/common/DropdownCompact';
import { DropdownCalendar } from '@/components/common/DropdownCalendar';
import { TextFieldInput } from '@/components/common/TextFieldInput';
import { TextFieldMembership } from '@/components/common/TextFieldMembership';
import { DropdownForm } from '@/components/common/DropdownForm';

const Timer = <span className="text-kor-body-1-medium text-conx-gray-600">0:00</span>;

const ValidCheck = (
  <svg viewBox="0 0 24 24" fill="none" className="text-conx-primary-500 h-6 w-6">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path
      d="M8 12l3 3 5-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Home() {
  const [agreed, setAgreed] = useState(false);
  const [orgType, setOrgType] = useState<'club' | 'union' | 'lab'>();

  const options = [
    { value: 'club', label: '동아리' },
    { value: 'union', label: '학생회' },
    { value: 'lab', label: '학회' },
  ];

  return (
    <div className="flex flex-1 flex-col items-start gap-8 p-10">
      <h1 className="text-2xl font-semibold">CONX</h1>
      <SearchBar />
      {/* 드롭다운 컴팩트 */}
      <div className="flex flex-wrap gap-4">
        <DropdownCompact
          type="line"
          options={options}
          placeholder="line"
          className="w-60"
          onChange={(v) => console.log(v)}
        />
        <DropdownCompact
          type="ghost"
          options={options}
          placeholder="ghost"
          onChange={(v) => console.log(v)}
        />
        <DropdownCalendar
          onChange={(range) => {
            console.log(range.start, range.end);
          }}
        />
      </div>

      {/* TextFieldInput — 가로: 사이즈(lg/md/sm), 상태는 인터랙션/prop으로 */}
      <section className="space-y-4">
        <h2 className="text-kor-heading-3-bold">TextFieldInput</h2>
        <div className="flex flex-wrap gap-6">
          {/* Default → 마우스 올리면 Hover, 클릭하면 Focused, 입력하면 Type */}
          <TextFieldInput
            size="lg"
            required
            label="레이블"
            helperText="도움말 텍스트"
            placeholder="플레이스 홀더"
          />
          {/* Filled */}
          <TextFieldInput
            size="md"
            required
            label="레이블"
            helperText="도움말 텍스트"
            placeholder="플레이스 홀더"
            defaultValue="입력한 정보"
          />
          {/* Error */}
          <TextFieldInput
            size="sm"
            required
            label="레이블"
            helperText="도움말 텍스트"
            defaultValue="입력 완료 정보"
            error="에러메세지"
          />
        </div>
      </section>

      {/* TextFieldMembership — 좌: 인증번호(타이머+재전송), 우: 비밀번호 확인(체크) */}
      <section className="space-y-4">
        <h2 className="text-kor-heading-3-bold">TextFieldMembership</h2>
        <div className="grid w-[1000px] grid-cols-2 gap-x-12 gap-y-6">
          {/* 인증번호 - default */}
          <TextFieldMembership
            placeholder="인증번호 6자리를 입력해주세요"
            suffix={Timer}
            action={<TextLineButton>인증번호 재전송</TextLineButton>}
          />
          {/* 비밀번호 - default */}
          <TextFieldMembership type="password" placeholder="비밀번호를 한 번 더 입력해주세요" />

          {/* 인증번호 - filled */}
          <TextFieldMembership
            defaultValue="123456"
            placeholder="인증번호 6자리를 입력해주세요"
            suffix={Timer}
            action={<TextLineButton>인증번호 재전송</TextLineButton>}
          />
          {/* 비밀번호 - filled + 일치 체크 */}
          <TextFieldMembership type="password" defaultValue="123456" suffix={ValidCheck} />

          {/* 인증번호 - error */}
          <TextFieldMembership
            defaultValue="입력 완료 정보"
            error="인증번호가 맞지 않습니다"
            suffix={Timer}
            action={<TextLineButton>인증번호 재전송</TextLineButton>}
          />
          {/* 비밀번호 - error */}
          <TextFieldMembership
            type="password"
            defaultValue="123456"
            error="비밀번호가 서로 일치하지 않습니다"
          />
        </div>
      </section>

      {/* DropdownForm — 가로: 사이즈(lg/md/sm) 고정폭, 클릭하면 열림 */}
      <section className="space-y-4">
        <h2 className="text-kor-heading-3-bold">DropdownForm</h2>
        <div className="flex flex-wrap items-start gap-6">
          {/* Default → 클릭하면 Focused(열림) */}
          <DropdownForm
            size="lg"
            required
            label="레이블"
            helperText="도움말 텍스트"
            options={options}
            onChange={(v) => console.log(v)}
          />
          {/* Filled */}
          <DropdownForm
            size="md"
            required
            label="레이블"
            helperText="도움말 텍스트"
            options={options}
            defaultValue="club"
            onChange={(v) => console.log(v)}
          />
          {/* Error */}
          <DropdownForm
            size="sm"
            required
            label="레이블"
            helperText="도움말 텍스트"
            options={options}
            error="에러메세지"
          />
        </div>
      </section>

      <div className="space-y-10">
        {/* 1. 체크박스 용도 */}
        <section>
          <h2 className="text-kor-heading-3-bold mb-3">체크박스 패턴</h2>
          <RadioButton checked={agreed} onChange={setAgreed}>
            개인정보 처리방침에 동의합니다
          </RadioButton>
          <p className="text-conx-gray-450 mt-2">
            현재값: <strong>{agreed ? '동의함' : '미동의'}</strong>
          </p>
        </section>

        {/* 2. 라디오 그룹 용도 */}
        <section>
          <h2 className="text-kor-heading-3-bold mb-3">라디오 그룹 패턴</h2>
          <div className="flex flex-col gap-2">
            <RadioButton checked={orgType === 'club'} onChange={() => setOrgType('club')}>
              동아리
            </RadioButton>
            <RadioButton checked={orgType === 'union'} onChange={() => setOrgType('union')}>
              학생회
            </RadioButton>
            <RadioButton checked={orgType === 'lab'} onChange={() => setOrgType('lab')}>
              학회
            </RadioButton>
          </div>
          <p className="text-conx-gray-450 mt-2">
            선택: <strong>{orgType ?? '없음'}</strong>
          </p>
        </section>

        {/* 3. TextLineButton */}
        <section>
          <h2 className="text-kor-heading-3-bold mb-3">TextLineButton</h2>
          <TextLineButton onClick={() => alert('재전송!')}>인증번호 재전송</TextLineButton>
          <p className="text-conx-caption-1-medium text-conx-gray-450 mt-2">
            마우스 올려보면 hover, 클릭 누르고 있으면 active 색이 보여요
          </p>
        </section>

        {/* 4. disabled 확인 */}
        <section>
          <h2 className="text-kor-heading-3-bold mb-3">비활성 상태</h2>
          <div className="flex flex-col gap-3">
            <RadioButton checked={false} onChange={() => {}} disabled>
              비활성 옵션
            </RadioButton>
            <TextLineButton disabled>비활성 링크</TextLineButton>
          </div>
        </section>
      </div>
    </div>
  );
}
