import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { DateChip } from "@/components/layout/DateChip";
import { PhotoCaptureArea } from "@/components/layout/PhotoCaptureArea";
import { formatMonthDay } from "@/pages/history/dateUtils";
import mealViewfinder from "@/assets/icons/meal-viewfinder.png";
import mealThumb1 from "@/assets/icons/meal-thumb-1.png";
import mealThumb2 from "@/assets/icons/meal-thumb-2.png";
import mealThumb3 from "@/assets/icons/meal-thumb-3.png";
import mealThumb4 from "@/assets/icons/meal-thumb-4.png";

const RECENT_PHOTOS = [
  { key: "1", src: mealThumb1 },
  { key: "2", src: mealThumb2 },
  { key: "3", src: mealThumb3 },
  { key: "4", src: mealThumb4 },
];

export default function MealRecordPage() {
  const navigate = useNavigate();
  const todayLabel = useMemo(() => `${formatMonthDay(new Date())} · 점심`, []);

  return (
    <div className="page">
      <DetailHeader title="식사 기록" onCalendarClick={() => navigate("/history/meal")} />

      <div className="page-content">
        <DateChip label={todayLabel} />
        <PhotoCaptureArea
          previewSrc={mealViewfinder}
          recentPhotos={RECENT_PHOTOS}
          onCapture={(file) => navigate("/record/meal/result", { state: { file } })}
        />
      </div>
    </div>
  );
}
