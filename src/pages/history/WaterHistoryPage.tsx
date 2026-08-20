import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeToolbar from "@/pages/home/HomeToolbar";
import HistoryCalendar from "@/pages/history/HistoryCalendar";
import { buildWeekData, computeWaterStats, MOCK_GOAL_ML } from "@/pages/history/waterHistoryMockData";
import { addDays, formatWeekRange, getWeekStart } from "@/pages/history/dateUtils";
import { recordsApi, type HealthRecord } from "@/api/records";
import "@/pages/home/home.css";
import "@/pages/history/waterHistory.css";

// 그래프 최대치를 목표량(2,000ml)과 동일하게 맞춰서 목표를 채우면 막대가 100% 꽉 차게.
const CHART_MAX_ML = MOCK_GOAL_ML;

export default function WaterHistoryPage() {
  const navigate = useNavigate();
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [records, setRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    recordsApi
      .list()
      .then((all) => setRecords(all.filter((r) => r.type === "WATER")))
      .catch(() => setRecords([]));
  }, []);

  const weekRecords = useMemo(() => buildWeekData(weekStart, records), [weekStart, records]);
  const stats = useMemo(() => computeWaterStats(weekRecords), [weekRecords]);

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
    <div className="water-history-page">
      <header className="water-history-header">
        <button type="button" className="water-history-back" onClick={() => navigate(-1)} aria-label="이전으로">
          ‹
        </button>
        <h1>주간 수분 기록</h1>
        <span className="water-history-header-spacer" aria-hidden="true" />
      </header>

      <div className="water-history-date-section">
        <div className="water-history-date-nav">
          <button type="button" onClick={goToPrevWeek} aria-label="이전 주">
            ‹
          </button>
          <button
            type="button"
            className="water-history-date-label"
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

      <div className="water-history-lower-section">
        <p className="water-history-section-title">이번 주 수분 요약</p>

        <div className="water-history-chart-card">
          <div className="water-history-bars">
            {weekRecords.map((record) => (
              <div className="water-history-bar-col" key={record.date}>
                <div className={`water-history-bar-track water-history-bar-track--${record.status}`}>
                  <div
                    className={`water-history-bar-fill water-history-bar-fill--${record.status}`}
                    style={{ height: `${Math.min(100, (record.valueMl / CHART_MAX_ML) * 100)}%` }}
                  />
                </div>
                <span className="water-history-bar-day">{record.day}</span>
                <span className="water-history-bar-date">{record.date}</span>
              </div>
            ))}
          </div>

          <div className="water-history-legend">
            <span className="water-history-legend-item">
              <span className="water-history-legend-dot water-history-legend-dot--good" />
              매우 좋음
            </span>
            <span className="water-history-legend-item">
              <span className="water-history-legend-dot water-history-legend-dot--normal" />
              보통
            </span>
            <span className="water-history-legend-item">
              <span className="water-history-legend-dot water-history-legend-dot--bad" />
              부족
            </span>
          </div>
        </div>

        <div className="water-history-stats-card">
          <div className="water-history-stat">
            <p className="water-history-stat-label">최고 기록</p>
            <p className="water-history-stat-value">{stats.highest.valueMl.toLocaleString()}ml</p>
            <p className="water-history-stat-sub">{stats.highest.day}요일</p>
          </div>
          <div className="water-history-stat-divider" />
          <div className="water-history-stat">
            <p className="water-history-stat-label">최저 기록</p>
            <p className="water-history-stat-value">{stats.lowest.valueMl.toLocaleString()}ml</p>
            <p className="water-history-stat-sub">{stats.lowest.day}요일</p>
          </div>
          <div className="water-history-stat-divider" />
          <div className="water-history-stat">
            <p className="water-history-stat-label">목표 달성일</p>
            <p className="water-history-stat-value">{stats.goalAchievedDays}일</p>
            <p className="water-history-stat-sub">목표 2,000ml</p>
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
