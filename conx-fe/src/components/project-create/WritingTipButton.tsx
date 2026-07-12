'use client';

import { useState } from 'react';
import IconWritingTip from '@/assets/icons/icon_writingTip.svg';
import { Tooltip } from '@/components/common/Tooltip';
import WritingTipPanel from '@/components/project-create/WritingTipPanel';

interface WritingTipButtonProps {
  activeField?: string;
}

export default function WritingTipButton({ activeField }: WritingTipButtonProps) {
  const [showTooltip, setShowTooltip] = useState(true);
  const [showPanel, setShowPanel] = useState(false);

  if (showPanel) {
    return <WritingTipPanel activeField={activeField} onClose={() => setShowPanel(false)} />;
  }

  return (
    <>
      <div className="fixed top-18 left-0 z-10 h-[calc(100vh-72px)] w-22.5 bg-white pt-3 pr-4 pl-3" />

      <div className="fixed top-21 left-3 z-10">
        <button
          type="button"
          onClick={() => {
            setShowTooltip(false);
            setShowPanel(true);
          }}
          className="hover:bg-conx-opacity-gray-6 flex cursor-pointer flex-col items-center gap-1 rounded-md bg-white px-2 pt-2 pb-1.5"
        >
          <IconWritingTip className="size-6" />
          <span className="text-kor-body-1-bold text-conx-common-black">작성 팁</span>
        </button>
      </div>

      {showTooltip && (
        <div className="fixed top-23 left-19.5 z-10">
          <Tooltip
            text={`작성 팁을 참고하면 더 적합한 크루와\n매칭될 가능성이 높아져요.`}
            onClose={() => setShowTooltip(false)}
          />
        </div>
      )}
    </>
  );
}
