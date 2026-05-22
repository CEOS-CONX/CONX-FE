'use client';
import { useState } from 'react';
import { RadioButton } from '@/components/common/RadioButton';
import { TextLineButton } from '@/components/common/TextLineButton';
import { SearchBar } from '@/components/common/SearchBar';
import { Dropdown } from '@/components/common/Dropdown';
import { DropdownCalendar } from '@/components/common/DropdownCalendar';

export default function Home() {
  const [agreed, setAgreed] = useState(false);
  const [orgType, setOrgType] = useState<'club' | 'union' | 'lab'>();

  const options = [
    { value: 'club', label: '동아리' },
    { value: 'union', label: '학생회' },
    { value: 'lab', label: '학회' },
  ];

  return (
    <div className="flex flex-1 items-center justify-center">
      <h1 className="text-2xl font-semibold">CONX</h1>
      <SearchBar />
      <Dropdown options={options} placeholder="유형 선택" onChange={(v) => console.log(v)} />
      <DropdownCalendar
        onChange={(range) => {
          console.log(range.start, range.end);
        }}
      />
      <div className="space-y-10 p-10">
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
