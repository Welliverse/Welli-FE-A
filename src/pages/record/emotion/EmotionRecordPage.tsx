import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { DateChip } from "@/components/layout/DateChip";
import { formatMonthDay } from "@/pages/history/dateUtils";
import { recordsApi } from "@/api/records";
import { ApiError } from "@/api/client";
import mascotHappy from "@/assets/mascots/mascot-happy.png";
import mascotSad from "@/assets/mascots/mascot-sad.png";
import "@/pages/record/emotion/emotion.css";

const LABELS = ["최악이에요", "별로예요", "보통이에요", "좋아요", "최고예요"];

export default function EmotionRecordPage() {
  const navigate = useNavigate();
  const [value, setValue] = useState(80);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const label = useMemo(() => {
    const index = Math.min(LABELS.length - 1, Math.floor(value / (100 / LABELS.length)));
    return LABELS[index];
  }, [value]);

  const mascot = value >= 50 ? mascotHappy : mascotSad;
  const todayLabel = useMemo(() => `${formatMonthDay(new Date())} · 오늘`, []);

  async function handleSave() {
    setError(null);
    setIsSubmitting(true);
    try {
      await recordsApi.create("STRESS_EMOTION", { moodScore: value });
      navigate("/record");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page">
      <DetailHeader title="감정 기록" onCalendarClick={() => navigate("/history/emotion")} />

      <div className="page-content emotion-content">
        <DateChip label={todayLabel} />

        <h2 className="emotion-question">오늘 기분이 어떠신가요?</h2>

        <div className="emotion-mascot-wrap">
          <img src={mascot} alt={label} className="emotion-mascot" />
        </div>

        <p className="emotion-label">{label}</p>

        <div className="emotion-slider-wrap">
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="emotion-slider"
            aria-label="감정 점수"
          />
          <div className="emotion-slider-scale">
            <span>낮음</span>
            <span>높음</span>
          </div>
        </div>

        {error && <p className="record-error">{error}</p>}
        <button type="button" className="primary-button" disabled={isSubmitting} onClick={handleSave}>
          {isSubmitting ? "저장하는 중..." : "기록하기"}
        </button>
      </div>
    </div>
  );
}
