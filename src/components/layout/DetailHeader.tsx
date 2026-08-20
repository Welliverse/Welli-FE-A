import { useNavigate } from "react-router-dom";
import { CalendarIcon, ChevronLeftIcon } from "@/components/icons";
import "@/components/layout/layout.css";

interface DetailHeaderProps {
  title: string;
  onCalendarClick?: () => void;
}

// 뒤로가기 + 제목 + (선택) 오른쪽 캘린더 버튼. 물/감정/수면/운동/식사/피부 기록 화면과 분석 결과 화면에서 공통으로 사용.
export function DetailHeader({ title, onCalendarClick }: DetailHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="detail-header">
      <button type="button" className="detail-header-icon-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
        <ChevronLeftIcon />
      </button>
      <h1 className="detail-header-title">{title}</h1>
      {onCalendarClick ? (
        <button type="button" className="detail-header-icon-btn" onClick={onCalendarClick} aria-label="주간 기록 보기">
          <CalendarIcon />
        </button>
      ) : (
        <span className="detail-header-icon-spacer" aria-hidden="true" />
      )}
    </header>
  );
}
