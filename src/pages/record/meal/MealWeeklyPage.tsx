import { useMemo, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { PeriodTabs } from "@/components/layout/PeriodTabs";
import { WeekNav } from "@/components/layout/WeekNav";
import { WeeklyChart, type WeeklyChartDay, type MoodLevel } from "@/components/layout/WeeklyChart";
import HomeToolbar from "@/pages/home/HomeToolbar";
import { addDays, formatWeekRange, getWeekStart, getWeekdayLabels } from "@/pages/history/dateUtils";
import "@/pages/home/home.css";
import "@/pages/record/weekly-shared.css";
import "@/pages/record/meal/meal.css";

// 요일별 데모 패턴(식사 점수). 실제 날짜는 이번 주 기준으로 매번 계산됨.
const DAY_PATTERNS: { value: number; mood: MoodLevel }[] = [
  { value: 85, mood: "good" },
  { value: 38, mood: "bad" },
  { value: 55, mood: "neutral" },
  { value: 34, mood: "bad" },
  { value: 82, mood: "good" },
  { value: 58, mood: "neutral" },
  { value: 60, mood: "neutral" },
];

const DIET_SUMMARY = [
  { icon: "🥬", label: "채소 섭취", value: "좋음", tone: "good" as const },
  { icon: "🐟", label: "단백질 섭취", value: "보통", tone: "neutral" as const },
  { icon: "💧", label: "수분 섭취", value: "보통", tone: "neutral" as const },
  { icon: "🥓", label: "가공식품 섭취", value: "주의", tone: "bad" as const },
];

export default function MealWeeklyPage() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));

  const weekLabels = getWeekdayLabels();
  const weekDays: WeeklyChartDay[] = useMemo(
    () =>
      DAY_PATTERNS.map((pattern, i) => {
        const date = addDays(weekStart, i);
        return { label: weekLabels[i], date: `${date.getMonth() + 1}/${date.getDate()}`, ...pattern };
      }),
    [weekStart, weekLabels],
  );

  function showNotReady() {
    setNotice("아직 준비 중인 화면이에요.");
    window.setTimeout(() => setNotice(null), 1500);
  }

  return (
    <div className="page">
      <DetailHeader title="주간 식사 기록" />

      <div className="page-content weekly-header">
        <PeriodTabs />
        <WeekNav
          label={formatWeekRange(weekStart)}
          onPrev={() => setWeekStart((prev) => addDays(prev, -7))}
          onNext={() => setWeekStart((prev) => addDays(prev, 7))}
        />

        <div className="card">
          <h2 className="page-section-title">이번 주 식사 요약</h2>
          <WeeklyChart days={weekDays} />
        </div>

        <section>
          <h2 className="page-section-title" style={{ marginBottom: 10 }}>
            주간 식사 평가
          </h2>
          <div className="card meal-score-card">
            <div>
              <p className="meal-score-caption">이번 주 평균 점수</p>
              <p className="meal-score-value">
                74 <small>/ 100</small>
              </p>
              <p className="meal-score-tag">보통</p>
              <p className="meal-score-desc">균형 잡힌 식단을 유지하고 있어요!</p>
            </div>
            <div className="meal-score-gauge" style={{ "--gauge": "74%" } as CSSProperties}>
              <span>🙂</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="page-section-title" style={{ marginBottom: 10 }}>
            이번 주 식단 요약
          </h2>
          <div className="meal-diet-grid">
            {DIET_SUMMARY.map((item) => (
              <div className="meal-diet-card" key={item.label}>
                <span className="meal-diet-icon">{item.icon}</span>
                <div>
                  <p className="meal-diet-label">{item.label}</p>
                  <p className={`meal-diet-value meal-diet-value--${item.tone}`}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {notice && <p className="home-toast">{notice}</p>}

      <div className="home-toolbar-wrap">
        <HomeToolbar
          active="record"
          onSelect={(key) => {
            if (key === "home") navigate("/home");
            else if (key === "my") navigate("/mypage");
            else if (key !== "record") showNotReady();
          }}
        />
      </div>
    </div>
  );
}
