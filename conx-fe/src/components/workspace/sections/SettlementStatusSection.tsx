'use client';

import { useState } from 'react';
import DropdownTag from '@/components/workspace/DropdownTag';
import type { DropdownTagOption } from '@/components/workspace/DropdownTag';

const SETTLEMENT_OPTIONS: DropdownTagOption[] = [
  { value: 'pending', label: '지급 전', tagType: 'cyan' },
  { value: 'completed', label: '지급 완료', tagType: 'purple' },
];

interface SettlementStatusSectionProps {
  status: string;
  amount: string;
  settlementDate?: string;
}

export default function SettlementStatusSection({
  status,
  amount,
  settlementDate,
}: SettlementStatusSectionProps) {
  const [currentStatus, setCurrentStatus] = useState(status);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-kor-heading-3-semibold text-conx-common-black">정산 상태</h2>
      <div className="bg-conx-gray-50 flex flex-col gap-2 rounded-md p-5">
        <DropdownTag
          options={SETTLEMENT_OPTIONS}
          defaultValue={status}
          onChange={setCurrentStatus}
        />
        <div className="flex items-end gap-1">
          <span className="font-jakarta text-eng-display-3-bold text-conx-common-black tracking-[-0.02em]">
            {amount}
          </span>
          <span className="text-kor-title-3-bold text-conx-common-black">원</span>
        </div>
        <div className="pt-0.5">
          {currentStatus === 'completed' && settlementDate && (
            <span className="text-kor-label-1-semibold text-conx-gray-400">{settlementDate}</span>
          )}
        </div>
      </div>
    </div>
  );
}
