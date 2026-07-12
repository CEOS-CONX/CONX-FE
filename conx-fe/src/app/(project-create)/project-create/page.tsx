import type { Metadata } from 'next';
import ProjectCreateForm from '@/components/project-create/ProjectCreateForm';

export const metadata: Metadata = {
  title: '프로젝트 등록하기',
};

export default function ProjectCreatePage() {
  return <ProjectCreateForm />;
}
