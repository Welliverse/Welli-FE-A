import { useNavigate } from "react-router-dom";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { DateChip } from "@/components/layout/DateChip";
import { PhotoCaptureArea } from "@/components/layout/PhotoCaptureArea";
import viewfinder from "@/assets/icons/viewfinder.png";
import skinThumb1 from "@/assets/icons/skin-thumb-1.png";
import skinThumb2 from "@/assets/icons/skin-thumb-2.png";
import skinThumb3 from "@/assets/icons/skin-thumb-3.png";
import skinThumb4 from "@/assets/icons/skin-thumb-4.png";

const RECENT_PHOTOS = [
  { key: "1", src: skinThumb1 },
  { key: "2", src: skinThumb2 },
  { key: "3", src: skinThumb3 },
  { key: "4", src: skinThumb4 },
];

export default function SkinRecordPage() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <DetailHeader title="피부 상태 기록" />

      <div className="page-content">
        <DateChip label="8월 10일 · 오늘" />
        <PhotoCaptureArea
          previewSrc={viewfinder}
          recentPhotos={RECENT_PHOTOS}
          onCapture={() => navigate("/record/skin/result")}
        />
      </div>
    </div>
  );
}
