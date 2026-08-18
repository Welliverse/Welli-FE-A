import { useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { PeriodTabs } from "@/components/layout/PeriodTabs";
import { WeekNav } from "@/components/layout/WeekNav";
import { WeeklyChart, type WeeklyChartDay } from "@/components/layout/WeeklyChart";
import HomeToolbar from "@/pages/home/HomeToolbar";
import "@/pages/home/home.css";
import "@/pages/record/weekly-shared.css";
import "@/pages/record/meal/meal.css";

const WEEK_DAYS: WeeklyChartDay[] = [
  { label: "일", date: "8/4", value: 85, mood: "good" },
  { label: "월", date: "8/5", value: 38, mood: "bad" },
  { label: "화", date: "8/6", value: 55, mood: "neutral" },
  { label: "수", date: "8/7", value: 34, mood: "bad" },
  { label: "목", date: "8/8", value: 82, mood: "good" },
  { label: "금", date: "8/9", value: 58, mood: "neutral" },
  { label: "토", date: "8/10", value: 60, mood: "neutral" },
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

  function showNotReady() {
    setNotice("아직 준비 중인 화면이에요.");
    window.setTimeout(() => setNotice(null), 1500);
  }

  return (
    <div className="page">
      <DetailHeader title="주간 식사 기록" />

      <div className="page-content weekly-header">
        <PeriodTabs />
        <WeekNav label="8월 4일 - 8월 10일" />

        <div className="card">
          <h2 className="page-section-title">이번 주 식사 요약</h2>
          <WeeklyChart days={WEEK_DAYS} />
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
