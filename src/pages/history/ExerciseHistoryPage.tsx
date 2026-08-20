import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeToolbar from "@/pages/home/HomeToolbar";
import HistoryCalendar from "@/pages/history/HistoryCalendar";
import { buildWeekData, computeExerciseHighlights } from "@/pages/history/exerciseHistoryMockData";
import { addDays, formatWeekRange, getWeekStart } from "@/pages/history/dateUtils";
import { CheckGlyph, FlameGlyph, ShoeGlyph } from "@/pages/history/ExerciseHighlightIcons";
import { recordsApi, type HealthRecord } from "@/api/records";
import "@/pages/home/home.css";
import "@/pages/history/exerciseHistory.css";

const CHART_MAX_MINUTES = 75;

export default function ExerciseHistoryPage() {
  const navigate = useNavigate();
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [records, setRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    recordsApi
      .list()
      .then((all) => setRecords(all.filter((r) => r.type === "EXERCISE")))
      .catch(() => setRecords([]));
  }, []);

  const weekRecords = useMemo(() => buildWeekData(weekStart, records), [weekStart, records]);
  const highlights = useMemo(() => computeExerciseHighlights(weekRecords), [weekRecords]);

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
    <div className="exercise-history-page">
      <header className="exercise-history-header">
        <button type="button" className="exercise-history-back" onClick={() => navigate(-1)} aria-label="이전으로">
          ‹
        </button>
        <h1>주간 운동 기록</h1>
        <span className="exercise-history-header-spacer" aria-hidden="true" />
      </header>

      <div className="exercise-history-date-section">
        <div className="exercise-history-date-nav">
          <button type="button" onClick={goToPrevWeek} aria-label="이전 주">
            ‹
          </button>
          <button
            type="button"
            className="exercise-history-date-label"
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

      <div className="exercise-history-lower-section">
        <p className="exercise-history-section-title">이번 주 운동 요약</p>

        <div className="exercise-history-chart-card">
          <div className="exercise-history-bars">
            {weekRecords.map((record) => (
              <div className="exercise-history-bar-col" key={record.date}>
                <div className={`exercise-history-bar-track exercise-history-bar-track--${record.status}`}>
                  <div
                    className={`exercise-history-bar-fill exercise-history-bar-fill--${record.status}`}
                    style={{ height: `${Math.min(100, (record.minutes / CHART_MAX_MINUTES) * 100)}%` }}
                  />
                </div>
                <span className="exercise-history-bar-day">{record.day}</span>
                <span className="exercise-history-bar-date">{record.date}</span>
              </div>
            ))}
          </div>

          <div className="exercise-history-legend">
            <span className="exercise-history-legend-item">
              <span className="exercise-history-legend-dot exercise-history-legend-dot--good" />
              매우 좋음
            </span>
            <span className="exercise-history-legend-item">
              <span className="exercise-history-legend-dot exercise-history-legend-dot--normal" />
              보통
            </span>
            <span className="exercise-history-legend-item">
              <span className="exercise-history-legend-dot exercise-history-legend-dot--bad" />
              부족
            </span>
          </div>
        </div>

        <p className="exercise-history-section-title exercise-history-section-title--highlight">이번 주 하이라이트</p>

        <div className="exercise-history-highlight-card">
          <div className="exercise-history-highlight-row">
            <span className="exercise-history-highlight-left">
              <span className="exercise-history-highlight-icon exercise-history-highlight-icon--time">
                <CheckGlyph />
              </span>
              <span className="exercise-history-highlight-label">
                {highlights.topTime.day}요일에 가장 오래 운동했어요
              </span>
            </span>
            <span className="exercise-history-highlight-value">{highlights.topTime.minutes}분</span>
          </div>
          <div className="exercise-history-highlight-row">
            <span className="exercise-history-highlight-left">
              <span className="exercise-history-highlight-icon exercise-history-highlight-icon--calorie">
                <FlameGlyph />
              </span>
              <span className="exercise-history-highlight-label">
                {highlights.topCalorie.day}요일에 가장 많은 칼로리를 소모했어요
              </span>
            </span>
            <span className="exercise-history-highlight-value">{highlights.topCalorie.calories}kcal</span>
          </div>
          <div className="exercise-history-highlight-row">
            <span className="exercise-history-highlight-left">
              <span className="exercise-history-highlight-icon exercise-history-highlight-icon--streak">
                <ShoeGlyph />
              </span>
              <span className="exercise-history-highlight-label">
                {highlights.streakDays}일 연속 운동을 달성했어요 🎉
              </span>
            </span>
            <span className="exercise-history-highlight-value">최고예요!</span>
          </div>
        </div>

        <div className="home-toolbar-wrap">
          <HomeToolbar
            active="record"
            onSelect={(key) => {
              if (key === "home") navigate("/home");
              else if (key === "routine") navigate("/routine");
              else if (key === "my") navigate("/mypage");
            }}
          />
        </div>
      </div>
    </div>
  );
}
