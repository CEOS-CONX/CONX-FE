'use client';

// ⚠️ 임시 데모 페이지 — Tag / TagInput 확인용. 확정 후 실제 크루 마이페이지로 이동하거나 삭제.
import { useState } from 'react';
import ImageUploader from '@/components/mypage/ImageUploader';
import { type Portfolio } from '@/components/mypage/ImageUploaderInput';
import ImageUploaderSingle from '@/components/mypage/ImageUploaderSingle';
import PortfolioUploadModal from '@/components/mypage/PortfolioUploadModal';
import ProfileImage from '@/components/mypage/ProfileImage';
import SelectableTag from '@/components/mypage/SelectableTag';
import Tag from '@/components/mypage/Tag';
import TagInput from '@/components/mypage/TagInput';
import TagSelectField, { type TagCategory } from '@/components/mypage/TagSelectField';
import TextFieldLabeled from '@/components/mypage/TextFieldLabeled';
import TextFieldPhone from '@/components/mypage/TextFieldPhone';
import TextFieldTagInput from '@/components/mypage/TextFieldTagInput';
import TextFieldUpload from '@/components/mypage/TextFieldUpload';

const STRENGTH_OPTIONS: TagCategory[] = [
  {
    category: '기획 · 문제 해결',
    tags: [
      '기획부터 실행까지',
      '문제 정의 중심',
      '리서치 기반',
      '사용자 경험 중심',
      '새로운 관점 제안',
      '전략적 방향 제안',
    ],
  },
  {
    category: '브랜드 · 비즈니스 이해',
    tags: ['브랜드 맥락 이해', '비즈니스 관점', '운영까지 고려', '현실 조건 반영'],
  },
  {
    category: '실행 · 구현',
    tags: ['빠른 실행력', '반복 개선', '일정 준수'],
  },
  {
    category: '디테일 · 커뮤니케이션',
    tags: ['디테일까지 고려', '명확한 커뮤니케이션', '꼼꼼한 문서화', '일관된 결과 관리'],
  },
];

// 데모용 가짜 이미지 (CEOS 느낌)
const FAKE_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='84' height='84'%3E%3Crect width='84' height='84' fill='%23312e81'/%3E%3Ctext x='42' y='48' font-size='16' fill='white' text-anchor='middle' font-family='sans-serif' font-weight='bold'%3ECEOS%3C/text%3E%3C/svg%3E";

const SELECTABLE = ['기획', '디자인', '마케팅', '영상편집', '개발', '브랜딩'];

export default function TagDemoPage() {
  const [tags, setTags] = useState(['기획', '디자인', '마케팅']);
  const [editableTags, setEditableTags] = useState(['영상편집', '썸네일']);
  const [picked, setPicked] = useState<string[]>(['디자인']);
  const [fieldTags, setFieldTags] = useState<string[]>([]);
  const [fieldTags2, setFieldTags2] = useState<string[]>(['레이블', '태그명']);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [text1, setText1] = useState('');
  const [phone, setPhone] = useState('');
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([
    { id: 'p1', imageLink: FAKE_IMG, name: '앱 서비스 UX/UI 리디자인' },
    { id: 'p2', imageLink: FAKE_IMG, name: 'SNS 캠페인 포트폴리오' },
  ]);
  const [pfSortable, setPfSortable] = useState(true);

  function togglePick(t: string) {
    setPicked((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  return (
    <div className="flex w-[600px] flex-col gap-10">
      <h1 className="text-kor-title-1-bold text-conx-common-black">Tag / TagInput 데모</h1>

      {/* 개별 상태 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-kor-heading-3-bold text-conx-common-black">태그 상태</h2>
        <div className="flex flex-col gap-3">
          <Row label="removable — X hover 시 하이라이트, 클릭 시 삭제">
            <Tag label="레이블" variant="removable" onRemove={() => {}} />
          </Row>
          <Row label="editable — 라벨 hover 하이라이트, 클릭 시 편집">
            <Tag label="레이블" variant="editable" onRemove={() => {}} onEdit={() => {}} />
          </Row>
        </div>
      </section>

      {/* 라이브 입력 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-kor-heading-3-bold text-conx-common-black">TagInput (입력 후 Enter)</h2>
        <TagInput value={tags} onChange={setTags} placeholder="키워드 입력 후 Enter" />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-kor-heading-3-bold text-conx-common-black">TagInput — editable 태그</h2>
        <TagInput
          value={editableTags}
          onChange={setEditableTags}
          variant="editable"
          placeholder="전문분야 입력 후 Enter"
        />
      </section>

      {/* Selectable — 제공 리스트에서 고르기 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-kor-heading-3-bold text-conx-common-black">
          SelectableTag (클릭해 선택 · 선택됨=진한색)
        </h2>
        <div className="flex flex-wrap gap-2">
          {SELECTABLE.map((t) => (
            <SelectableTag
              key={t}
              label={t}
              selected={picked.includes(t)}
              onToggle={() => togglePick(t)}
            />
          ))}
        </div>
        <p className="text-kor-label-1-medium text-conx-gray-450">
          선택됨: {picked.join(', ') || '없음'}
        </p>
      </section>

      {/* TextField_TagInput — 방향 A (TagInput 재사용 래퍼) */}
      <section className="flex flex-col gap-6">
        <h2 className="text-kor-heading-3-bold text-conx-common-black">TextFieldTagInput</h2>
        <TextFieldTagInput
          id="field-tags-1"
          label="타이틀"
          helperText="도움말 텍스트"
          value={fieldTags}
          onChange={setFieldTags}
        />
        <TextFieldTagInput
          id="field-tags-2"
          label="타이틀"
          helperText="도움말 텍스트"
          value={fieldTags2}
          onChange={setFieldTags2}
        />
      </section>

      {/* TextFieldLabeled / TextFieldPhone */}
      <section className="flex w-[440px] flex-col gap-6">
        <h2 className="text-kor-heading-3-bold text-conx-common-black">
          TextFieldLabeled / TextFieldPhone
        </h2>
        <TextFieldLabeled
          id="tf1"
          label="레이블"
          value={text1}
          onChange={setText1}
          maxLength={35}
        />
        <TextFieldLabeled
          id="tf-err"
          label="레이블"
          value="내용을 입력해주세요"
          onChange={() => {}}
          maxLength={35}
          error="에러메세지"
        />
        <TextFieldPhone id="tf-phone" label="레이블" value={phone} onChange={setPhone} />
      </section>

      {/* TextFieldUpload */}
      <section className="flex w-[440px] flex-col gap-6">
        <h2 className="text-kor-heading-3-bold text-conx-common-black">
          TextFieldUpload (hover 해보세요)
        </h2>
        <TextFieldUpload id="up1" label="레이블" onSelect={() => {}} />
        <TextFieldUpload
          id="up2"
          label="레이블"
          fileName="첨부 파일명[jpg, 1.2MB]"
          onSelect={() => {}}
          onRemove={() => {}}
        />
        <TextFieldUpload
          id="up3"
          label="레이블"
          fileName="첨부 파일명"
          error="에러메세지"
          onSelect={() => {}}
        />
      </section>

      {/* ImageUploaderSingle (①ImageCard + ②Single) */}
      <section className="flex flex-col gap-6">
        <h2 className="text-kor-heading-3-bold text-conx-common-black">
          ImageUploaderSingle (빈칸 / 채움 / 에러)
        </h2>
        <ImageUploaderSingle label="썸네일 이미지" onSelect={() => {}} />
        <ImageUploaderSingle
          label="썸네일 이미지"
          src={FAKE_IMG}
          onSelect={() => {}}
          onRemove={() => {}}
        />
        <ImageUploaderSingle label="썸네일 이미지" error="에러메세지" onSelect={() => {}} />
      </section>

      {/* ImageUploader — 포트폴리오 다중 (dnd-kit 정렬) */}
      <section className="flex flex-col gap-4">
        <h2 className="text-kor-heading-3-bold text-conx-common-black">
          ImageUploader (포트폴리오 · 드래그 정렬)
        </h2>
        <label className="text-kor-label-1-medium text-conx-gray-450 flex items-center gap-2">
          <input
            type="checkbox"
            checked={pfSortable}
            onChange={(e) => setPfSortable(e.target.checked)}
          />
          sortable
        </label>
        <ImageUploader
          label="포트폴리오"
          helperText="이미지를 끌고 오거나 칸을 눌러 첨부해주세요(50mb 이하)"
          value={portfolios}
          onChange={setPortfolios}
          onAdd={() => setShowPortfolioModal(true)}
          onEdit={() => setShowPortfolioModal(true)}
          sortable={pfSortable}
        />
        {showPortfolioModal && (
          <PortfolioUploadModal
            onClose={() => setShowPortfolioModal(false)}
            onSubmit={(d) => {
              setPortfolios((prev) => [
                ...prev,
                { id: `p${Date.now()}`, imageLink: FAKE_IMG, name: d.name },
              ]);
              setShowPortfolioModal(false);
            }}
          />
        )}
      </section>

      {/* TagSelectField — 입력창 클릭 시 드롭다운 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-kor-heading-3-bold text-conx-common-black">
          TagSelectField (입력창 클릭 → 드롭다운)
        </h2>
        <TagSelectField
          id="strengths"
          label="핵심 강점"
          helperText="크루만의 차별화된 협업 방식과 강점을 키워드로 표현해보세요"
          value={strengths}
          onChange={setStrengths}
          options={STRENGTH_OPTIONS}
        />
        <p className="text-kor-label-1-medium text-conx-gray-450">
          선택: {strengths.join(', ') || '없음'}
        </p>
      </section>

      {/* ProfileImage — 기본 이미지 / filled */}
      <section className="flex flex-col gap-4">
        <h2 className="text-kor-heading-3-bold text-conx-common-black">
          ProfileImage (hover 해보세요)
        </h2>
        <div className="flex items-start gap-10">
          <div className="flex flex-col gap-2">
            <span className="text-kor-label-1-medium text-conx-gray-450">
              기본 이미지 (filled=false)
            </span>
            <ProfileImage onEdit={() => {}} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-kor-label-1-medium text-conx-gray-450">
              유저 이미지 (filled=true)
            </span>
            <ProfileImage src={FAKE_IMG} onEdit={() => {}} onRemove={() => {}} />
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-kor-label-1-medium text-conx-gray-450 w-64 shrink-0">{label}</span>
      {children}
    </div>
  );
}
