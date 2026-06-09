import Link from 'next/link';
import { Card } from '@/components/common/Card';
import { HomeTextIconButton } from '@/components/home/HomeTextIconButton';

// 일단 5개씩 placeholder. 나중에 API/필터링 결과로 교체.
const MOCK_PROJECTS = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  imageSrc: 'https://placehold.co/337x203/f5f5f5/f5f5f5.png',
  imageAlt: `프로젝트 이미지 ${i + 1}`,
  title: '프로젝트 이름',
  subtitle: '기업명',
  category1: '카테고리',
  category2: '프로젝트 유형',
  startDate: '2000.00.00',
  endDate: '2000.00.00',
}));

const MOCK_CREWS = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  imageSrc: 'https://placehold.co/337x203/f5f5f5/f5f5f5.png',
  imageAlt: `크루 이미지 ${i + 1}`,
  title: '크루명',
  subtitle: '캐치프레이즈',
  category1: '활동 분야',
  category2: '크루 유형',
  rating: 0.0,
  totalCount: 0,
}));

export default function BrowseSection() {
  return (
    <section id="browse" className="bg-conx-gray-50 pt-25">
      <div className="mx-auto max-w-[1600px]">
        {/* 상단 소개 텍스트 */}
        <div className="flex flex-col gap-6 pt-7 pl-[90px]">
          <h3 className="text-kor-title-3-bold text-conx-primary-400">둘러보기</h3>
          <h4 className="text-kor-display-3-bold text-black">
            프로젝트 유형과 크루 특성에 따라
            <br />
            확인할 수 있습니다
          </h4>
        </div>

        {/* 프로젝트 */}
        <div className="mt-12">
          <h5 className="text-kor-heading-2-semibold text-conx-common-black mb-3 pl-[90px]">
            프로젝트
          </h5>
          <div className="flex gap-6 overflow-x-auto pl-[90px]">
            {MOCK_PROJECTS.map((card) => (
              <Link
                key={card.id}
                href={`/projects/${card.id}`}
                className="w-[200px] shrink-0 min-[1200px]:w-[242px] min-[1600px]:w-[337px]"
              >
                <Card
                  imageSrc={card.imageSrc}
                  imageAlt={card.imageAlt}
                  title={card.title}
                  subtitle={card.subtitle}
                  category1={card.category1}
                  category2={card.category2}
                  startDate={card.startDate}
                  endDate={card.endDate}
                />
              </Link>
            ))}
            <div className="flex shrink-0 items-center pr-[90px] pb-[90px]">
              <Link href="/projects">
                <HomeTextIconButton>더보기</HomeTextIconButton>
              </Link>
            </div>
          </div>
        </div>

        {/* 크루 */}
        <div className="mt-10 pb-20">
          <h5 className="text-kor-heading-2-semibold text-conx-common-black mb-3 pl-[90px]">
            크루
          </h5>
          <div className="flex gap-6 overflow-x-auto pl-[90px]">
            {MOCK_CREWS.map((card) => (
              <Link
                key={card.id}
                href={`/crews/${card.id}`}
                className="w-[200px] shrink-0 min-[1200px]:w-[242px] min-[1600px]:w-[337px]"
              >
                <Card
                  imageSrc={card.imageSrc}
                  imageAlt={card.imageAlt}
                  title={card.title}
                  subtitle={card.subtitle}
                  category1={card.category1}
                  category2={card.category2}
                  rating={card.rating}
                  totalCount={card.totalCount}
                />
              </Link>
            ))}
            <div className="flex shrink-0 items-center pr-[90px] pb-[90px]">
              <Link href="/crews">
                <HomeTextIconButton>더보기</HomeTextIconButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
