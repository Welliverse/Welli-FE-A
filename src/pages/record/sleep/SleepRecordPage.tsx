import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { DateChip } from "@/components/layout/DateChip";
import { ChevronRightIcon, SunIcon } from "@/components/icons";
import { TimePickerSheet, type TimeValue } from "@/pages/record/sleep/TimePickerSheet";
import { formatMonthDay } from "@/pages/history/dateUtils";
import { recordsApi } from "@/api/records";
import { ApiError } from "@/api/client";
import sleepMoonIcon from "@/assets/icons/sleep.png";
import moodTired from "@/assets/icons/mood-tired.png";
import moodOkay from "@/assets/icons/mood-okay.png";
import moodRefreshed from "@/assets/icons/mood-refreshed.png";
import moodPerfect from "@/assets/icons/mood-perfect.png";
import "@/pages/record/sleep/sleep.css";

const QUALITY_OPTIONS = [
  { key: "tired", label: "피곤해요", icon: moodTired },
  { key: "okay", label: "적당해요", icon: moodOkay },
  { key: "refreshed", label: "개운해요", icon: moodRefreshed },
  { key: "perfect", label: "완벽해요", icon: moodPerfect },
];

function toHour24({ period, hour }: TimeValue) {
  return period === "오전" ? (hour === 12 ? 0 : hour) : hour === 12 ? 12 : hour + 12;
}

function toMinutes(value: TimeValue) {
  return toHour24(value) * 60 + value.minute;
}

function formatTime({ period, hour, minute }: TimeValue) {
  return `${period} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export default function SleepRecordPage() {
  const navigate = useNavigate();
  const [sleepTime, setSleepTime] = useState<TimeValue>({ period: "오후", hour: 11, minute: 30 });
  const [wakeTime, setWakeTime] = useState<TimeValue>({ period: "오전", hour: 7, minute: 30 });
  const [openSheet, setOpenSheet] = useState<"sleep" | "wake" | null>(null);
  const [quality, setQuality] = useState("okay");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalMinutes = useMemo(() => {
    const diff = toMinutes(wakeTime) - toMinutes(sleepTime);
    return ((diff % 1440) + 1440) % 1440;
  }, [sleepTime, wakeTime]);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const todayLabel = useMemo(() => `${formatMonthDay(new Date())} · 오늘`, []);

  async function handleSave() {
    setError(null);
    setIsSubmitting(true);
    try {
      // 일어난 시간을 오늘로 고정하고, 거기서 총 수면 시간만큼 거슬러 올라가 잠든 시각을 계산
      // (자정을 넘겨도 날짜 경계가 자동으로 맞춰짐).
      const wakeAt = new Date();
      wakeAt.setHours(toHour24(wakeTime), wakeTime.minute, 0, 0);
      const sleepAt = new Date(wakeAt.getTime() - totalMinutes * 60000);
      await recordsApi.create("SLEEP", {
        sleepAt: sleepAt.toISOString(),
        wakeAt: wakeAt.toISOString(),
        durationMinutes: totalMinutes,
        quality,
      });
      navigate("/record");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page">
      <DetailHeader title="수면 기록" onCalendarClick={() => navigate("/history/sleep")} />

      <div className="page-content">
        <DateChip label={todayLabel} />
        <h2 className="page-section-title sleep-title">어젯밤 수면을 기록해요</h2>

        <div className="card sleep-time-card">
          <button type="button" className="sleep-time-row" onClick={() => setOpenSheet("sleep")}>
            <img src={sleepMoonIcon} alt="" className="sleep-time-icon" />
            <span className="sleep-time-info">
              <span className="sleep-time-label">잠든 시간</span>
              <span className="sleep-time-value">{formatTime(sleepTime)}</span>
            </span>
            <ChevronRightIcon className="sleep-time-chevron" />
          </button>
          <div className="sleep-time-divider" />
          <button type="button" className="sleep-time-row" onClick={() => setOpenSheet("wake")}>
            <SunIcon className="sleep-time-icon sleep-time-icon--sun" />
            <span className="sleep-time-info">
              <span className="sleep-time-label">일어난 시간</span>
              <span className="sleep-time-value">{formatTime(wakeTime)}</span>
            </span>
            <ChevronRightIcon className="sleep-time-chevron" />
          </button>
        </div>

        <div className="sleep-total-box">
          <span className="sleep-total-label">총 수면</span>
          <span className="sleep-total-value">
            {hours}시간 {String(minutes).padStart(2, "0")}분
          </span>
        </div>

        <section>
          <h2 className="page-section-title sleep-quality-title">수면의 질은 어땠나요?</h2>
          <div className="sleep-quality-grid">
            {QUALITY_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`sleep-quality-card ${quality === option.key ? "sleep-quality-card--active" : ""}`}
                onClick={() => setQuality(option.key)}
              >
                <img src={option.icon} alt={option.label} />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </section>

        {error && <p className="record-error">{error}</p>}
        <button type="button" className="primary-button" disabled={isSubmitting} onClick={handleSave}>
          {isSubmitting ? "저장하는 중..." : "수면 기록 저장"}
        </button>
      </div>

      {openSheet === "sleep" && (
        <TimePickerSheet
          title="잠든 시간"
          value={sleepTime}
          onChange={setSleepTime}
          onClose={() => setOpenSheet(null)}
          previewLabel={(v) => `🌙 ${formatTime(v)}에 잠들었어요`}
        />
      )}
      {openSheet === "wake" && (
        <TimePickerSheet
          title="일어난 시간"
          value={wakeTime}
          onChange={setWakeTime}
          onClose={() => setOpenSheet(null)}
          previewLabel={(v) => `☀️ ${formatTime(v)}에 일어났어요`}
        />
      )}
    </div>
  );
}
