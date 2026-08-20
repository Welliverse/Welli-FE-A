import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { DateChip } from "@/components/layout/DateChip";
import { PhotoCaptureArea } from "@/components/layout/PhotoCaptureArea";
import { formatMonthDay } from "@/pages/history/dateUtils";
import { recordsApi } from "@/api/records";
import { ApiError } from "@/api/client";
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
  const todayLabel = useMemo(() => `${formatMonthDay(new Date())} · 오늘`, []);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCapture(file: File) {
    setError(null);
    setIsUploading(true);
    try {
      const record = await recordsApi.uploadSkinPhoto(file);
      navigate("/record/skin/result", { state: { record } });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "업로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="page">
      <DetailHeader title="피부 상태 기록" />

      <div className="page-content">
        <DateChip label={todayLabel} />
        <PhotoCaptureArea
          previewSrc={viewfinder}
          recentPhotos={RECENT_PHOTOS}
          onCapture={handleCapture}
          disabled={isUploading}
        />
        {error && <p className="record-error">{error}</p>}
      </div>
    </div>
  );
}
