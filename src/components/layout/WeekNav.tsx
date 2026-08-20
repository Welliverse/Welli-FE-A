import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import "@/components/layout/layout.css";

interface WeekNavProps {
  label: string;
  onPrev?: () => void;
  onNext?: () => void;
}

// "8월 4일 - 8월 10일" 주간 범위 네비게이션.
export function WeekNav({ label, onPrev, onNext }: WeekNavProps) {
  return (
    <div className="week-nav">
      <button type="button" className="week-nav-btn" onClick={onPrev} aria-label="이전 주">
        <ChevronLeftIcon size={20} />
      </button>
      <span className="week-nav-label">{label}</span>
      <button type="button" className="week-nav-btn" onClick={onNext} aria-label="다음 주">
        <ChevronRightIcon size={20} />
      </button>
    </div>
  );
}
