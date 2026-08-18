import { useNavigate } from "react-router-dom";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { DateChip } from "@/components/layout/DateChip";
import { PhotoCaptureArea } from "@/components/layout/PhotoCaptureArea";

const RECENT_PHOTOS = [
  { key: "1", emoji: "🍢" },
  { key: "2", emoji: "🥣" },
  { key: "3", emoji: "🍛" },
  { key: "4", emoji: "🥪" },
];

export default function MealRecordPage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <DetailHeader title="식사 기록" onCalendarClick={() => navigate("/record/meal/weekly")} />

      <div className="page-content">
        <DateChip label="8월 10일 · 점심" />
        <PhotoCaptureArea
          previewEmoji="🥗"
          recentPhotos={RECENT_PHOTOS}
          onCapture={() => navigate("/record/meal/result")}
        />
      </div>
    </div>
  );
}
