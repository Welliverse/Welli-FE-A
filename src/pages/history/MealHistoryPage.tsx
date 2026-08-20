import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeToolbar from "@/pages/home/HomeToolbar";
import HistoryCalendar from "@/pages/history/HistoryCalendar";
import { buildWeekData, computeWeeklyMealSummary, getMealTierInfo } from "@/pages/history/mealHistoryMockData";
import { addDays, formatWeekRange, getWeekStart } from "@/pages/history/dateUtils";
import { SmileyGlyph } from "@/pages/history/MealScoreIcon";
import { recordsApi, type HealthRecord } from "@/api/records";
import "@/pages/home/home.css";
import "@/pages/history/mealHistory.css";

const RING_RADIUS = 30;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function MealHistoryPage() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [records, setRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    recordsApi
      .list()
      .then((all) => setRecords(all.filter((r) => r.type === "MEAL")))
      .catch(() => setRecords([]));
  }, []);

  const weekRecords = useMemo(() => buildWeekData(weekStart, records), [weekStart, records]);
  const summary = useMemo(() => computeWeeklyMealSummary(weekRecords), [weekRecords]);
  const tier = getMealTierInfo(summary.status);
  const ringOffset = RING_CIRCUMFERENCE * (1 - summary.avgScore / 100);

  function showNotReady() {
    setNotice("아직 준비 중인 화면이에요.");
    window.setTimeout(() => setNotice(null), 1500);
  }

  function goToPrevWeek() {
    setWeekStart((prev) => addDays(prev, -7));
  }

  function goToNextWeek() {
    setWeekStart((prev) => addDays(prev, 7));
  }

  function handleSelectDate(date: Date) {
    setWeekStart(date);
    setCalendarOpen(false);
  }

  return (
    <div className="meal-history-page">
      <header className="meal-history-header">
        <button type="button" className="meal-history-back" onClick={() => navigate(-1)} aria-label="이전으로">
          ‹
        </button>
        <h1>주간 식사 기록</h1>
        <span className="meal-history-header-spacer" aria-hidden="true" />
      </header>

      <div className="meal-history-date-section">
        <div className="meal-history-date-nav">
          <button type="button" onClick={goToPrevWeek} aria-label="이전 주">
            ‹
          </button>
          <button
            type="button"
            className="meal-history-date-label"
            onClick={() => setCalendarOpen((prev) => !prev)}
            aria-expanded={calendarOpen}
          >
            {formatWeekRange(weekStart)}
          </button>
          <button type="button" onClick={goToNextWeek} aria-label="다음 주">
            ›
          </button>
        </div>
        {calendarOpen && <HistoryCalendar selectedWeekStart={weekStart} onSelectDate={handleSelectDate} />}
      </div>

      <div className="meal-history-lower-section">
        <p className="meal-history-section-title">이번 주 식사 요약</p>

        <div className="meal-history-chart-card">
          <div className="meal-history-bars">
            {weekRecords.map((record) => (
              <div className="meal-history-bar-col" key={record.date}>
                <div className={`meal-history-bar-track meal-history-bar-track--${record.status}`}>
                  <div
                    className={`meal-history-bar-fill meal-history-bar-fill--${record.status}`}
                    style={{ height: `${record.score}%` }}
                  />
                </div>
                <span className="meal-history-bar-day">{record.day}</span>
                <span className="meal-history-bar-date">{record.date}</span>
              </div>
            ))}
          </div>

          <div className="meal-history-legend">
            <span className="meal-history-legend-item">
              <span className="meal-history-legend-dot meal-history-legend-dot--good" />
              매우 좋음
            </span>
            <span className="meal-history-legend-item">
              <span className="meal-history-legend-dot meal-history-legend-dot--normal" />
              보통
            </span>
            <span className="meal-history-legend-item">
              <span className="meal-history-legend-dot meal-history-legend-dot--bad" />
              부족
            </span>
          </div>
        </div>

        <p className="meal-history-section-title">주간 식사 평가</p>

        <div className="meal-history-score-card">
          <div className="meal-history-score-left">
            <p className="meal-history-score-label">이번 주 평균 점수</p>
            <p className="meal-history-score-value">
              {summary.avgScore}
              <span className="meal-history-score-max"> / 100</span>
            </p>
            <p className="meal-history-score-tier">{tier.label}</p>
            <p className="meal-history-score-desc">{tier.desc}</p>
          </div>
          <div className="meal-history-score-ring">
            <svg width="73" height="73" viewBox="0 0 73 73">
              <circle cx="36.5" cy="36.5" r={RING_RADIUS} fill="none" stroke="var(--welli-purple-20)" strokeWidth="8" />
              <circle
                cx="36.5"
                cy="36.5"
                r={RING_RADIUS}
                fill="none"
                stroke="#7a69fc"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={ringOffset}
                transform="rotate(-90 36.5 36.5)"
              />
            </svg>
            <span className="meal-history-score-ring-icon">
              <SmileyGlyph />
            </span>
          </div>
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
    </div>
  );
}
