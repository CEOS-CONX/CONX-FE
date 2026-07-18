'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DropdownCompact from '@/components/common/DropdownCompact/DropdownCompact';
import { DropdownCalendar } from '@/components/common/DropdownCalendar';
import Pagination from '@/components/common/Pagination/Pagination';
import TableHeader from '@/components/workspace/TableHeader';
import TableCell from '@/components/workspace/TableCell';
import TagIndicator from '@/components/workspace/TagIndicator';
import type { WorkspaceTask } from '@/types/workspace';

const STATUS_OPTIONS = [
  { value: 'blue', label: '확인 필요' },
  { value: 'green', label: '진행 중' },
  { value: 'gray', label: '완료' },
];

const ROWS_PER_PAGE = 10;

interface TaskTableSectionProps {
  tasks: WorkspaceTask[];
}

function getTaskUrl(task: WorkspaceTask): string {
  if (task.taskType === 'settlement') return '/crew-workspace/settlement';
  return `/crew-workspace/project-tasks/${task.projectId ?? ''}`;
}

export default function TaskTableSection({ tasks }: TaskTableSectionProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(tasks.length / ROWS_PER_PAGE));
  const pagedTasks = tasks.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);
  const isEmpty = tasks.length === 0;

  return (
    <section className="flex w-full flex-col items-center gap-2.25">
      <div className="flex w-full items-start justify-between">
        <h2 className="text-kor-heading-3-bold text-conx-common-black">지금 필요한 작업</h2>
        <div className="flex items-center gap-2">
          <DropdownCompact size="sm" options={STATUS_OPTIONS} placeholder="진행 상태" />
          <DropdownCalendar size="sm" align="right" placeholder="등록일" />
        </div>
      </div>

      <div className={`flex w-full flex-col items-center ${isEmpty ? 'gap-16' : 'gap-9'}`}>
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{ width: 192 }} />
            <col style={{ width: 150 }} />
            <col style={{ width: 526 }} />
            <col style={{ width: 153 }} />
            <col style={{ width: 158 }} />
          </colgroup>
          <thead>
            <tr>
              <TableHeader label="작업명" type="first" />
              <TableHeader label="진행 상태" type="middle" />
              <TableHeader label="프로젝트명" type="middle" />
              <TableHeader label="브랜드명" type="middle" />
              <TableHeader label="등록일" type="last" />
            </tr>
          </thead>
          {!isEmpty && (
            <tbody>
              {pagedTasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => router.push(getTaskUrl(task))}
                  className="hover:bg-conx-opacity-gray-6 active:bg-conx-opacity-gray-30 cursor-pointer"
                >
                  <TableCell type="text">{task.taskName}</TableCell>
                  <TableCell type="tag">
                    <TagIndicator type={task.indicatorType} label={task.indicatorLabel} />
                  </TableCell>
                  <TableCell type="text">{task.projectName}</TableCell>
                  <TableCell type="text">{task.brandName}</TableCell>
                  <TableCell type="date">{task.registeredDate}</TableCell>
                </tr>
              ))}
            </tbody>
          )}
        </table>

        {isEmpty && (
          <p className="text-kor-heading-3-semibold text-conx-gray-500">
            아직 해야할 작업이 없습니다.
          </p>
        )}

        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </section>
  );
}
