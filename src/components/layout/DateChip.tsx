import { CalendarIcon } from "@/components/icons";
import "@/components/layout/layout.css";

interface DateChipProps {
  label: string;
}

// "8월 10일 · 오늘" 형태의 날짜 표시 필. 기록 상세 화면 상단에서 공통으로 사용.
export function DateChip({ label }: DateChipProps) {
  return (
    <div className="date-chip">
      <CalendarIcon size={16} />
      <span>{label}</span>
    </div>
  );
}
