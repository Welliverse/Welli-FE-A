import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { DateChip } from "@/components/layout/DateChip";
import { FlameIcon, MinusIcon, PlusIcon } from "@/components/icons";
import { formatMonthDay } from "@/pages/history/dateUtils";
import "@/pages/record/exercise/exercise.css";

const EXERCISE_TYPES = [
  { key: "walk", label: "걷기", emoji: "🚶", rate: 4 },
  { key: "run", label: "달리기", emoji: "🏃", rate: 7.1 },
  { key: "bike", label: "자전거", emoji: "🚴", rate: 6 },
  { key: "weight", label: "웨이트", emoji: "🏋️", rate: 5.5 },
  { key: "yoga", label: "요가", emoji: "🧘", rate: 3 },
  { key: "etc", label: "기타", emoji: "⋯", rate: 4 },
] as const;

const DURATION_PRESETS = [15, 30, 45, 60];
const INTENSITY_OPTIONS = [
  { key: "low", label: "낮음", mult: 0.85 },
  { key: "mid", label: "보통", mult: 1 },
  { key: "high", label: "높음", mult: 1.2 },
] as const;

export default function ExerciseRecordPage() {
  const navigate = useNavigate();
  const [type, setType] = useState<(typeof EXERCISE_TYPES)[number]["key"]>("run");
  const [duration, setDuration] = useState(45);
  const [intensity, setIntensity] = useState<(typeof INTENSITY_OPTIONS)[number]["key"]>("mid");

  const calories = useMemo(() => {
    const rate = EXERCISE_TYPES.find((t) => t.key === type)?.rate ?? 4;
    const mult = INTENSITY_OPTIONS.find((i) => i.key === intensity)?.mult ?? 1;
    return Math.round(rate * duration * mult);
  }, [type, duration, intensity]);
  const todayLabel = useMemo(() => `${formatMonthDay(new Date())} · 오늘`, []);

  return (
    <div className="page">
      <DetailHeader title="운동 기록" onCalendarClick={() => navigate("/history/exercise")} />

      <div className="page-content">
        <DateChip label={todayLabel} />
        <h2 className="page-section-title">오늘 어떤 운동을 했나요?</h2>

        <section>
          <h3 className="exercise-subtitle">운동 종류</h3>
          <div className="exercise-type-grid">
            {EXERCISE_TYPES.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`exercise-type-card ${type === item.key ? "exercise-type-card--active" : ""}`}
                onClick={() => setType(item.key)}
              >
                <span className="exercise-type-emoji">{item.emoji}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="exercise-subtitle">운동 시간</h3>
          <div className="exercise-duration-stepper">
            <button
              type="button"
              className="exercise-stepper-btn"
              onClick={() => setDuration((d) => Math.max(5, d - 5))}
              aria-label="시간 줄이기"
            >
              <MinusIcon />
            </button>
            <span className="exercise-duration-value">
              {duration}
              <small>분</small>
            </span>
            <button
              type="button"
              className="exercise-stepper-btn"
              onClick={() => setDuration((d) => Math.min(180, d + 5))}
              aria-label="시간 늘리기"
            >
              <PlusIcon />
            </button>
          </div>
          <div className="exercise-duration-presets">
            {DURATION_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`exercise-preset-chip ${duration === preset ? "exercise-preset-chip--active" : ""}`}
                onClick={() => setDuration(preset)}
              >
                {preset}분
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="exercise-subtitle">운동 강도</h3>
          <div className="exercise-intensity-grid">
            {INTENSITY_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`exercise-intensity-chip ${intensity === option.key ? "exercise-intensity-chip--active" : ""}`}
                onClick={() => setIntensity(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <div className="exercise-calorie-box">
          <span className="exercise-calorie-icon">
            <FlameIcon size={24} />
          </span>
          <div>
            <p className="exercise-calorie-label">예상 소모 칼로리</p>
            <p className="exercise-calorie-value">
              약 {calories} <small>kcal</small>
            </p>
          </div>
        </div>

        <button type="button" className="primary-button" onClick={() => navigate("/record")}>
          운동 기록 저장
        </button>
      </div>
    </div>
  );
}
