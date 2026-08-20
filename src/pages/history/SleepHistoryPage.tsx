import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeToolbar from "@/pages/home/HomeToolbar";
import HistoryCalendar from "@/pages/history/HistoryCalendar";
import { buildWeekData, computeWeeklySleepSummary, formatDuration } from "@/pages/history/sleepHistoryMockData";
import { addDays, formatWeekRange, getWeekStart } from "@/pages/history/dateUtils";
import { recordsApi, type HealthRecord } from "@/api/records";
import "@/pages/home/home.css";
import "@/pages/history/sleepHistory.css";

const CHART_MAX_MINUTES = 600;

export default function SleepHistoryPage() {
  const navigate = useNavigate();
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [records, setRecords] = useState<HealthRecord[]>([]);

  useEffect(() => {
    recordsApi
      .list()
      .then((all) => setRecords(all.filter((r) => r.type === "SLEEP")))
      .catch(() => setRecords([]));
  }, []);

  const weekRecords = useMemo(() => buildWeekData(weekStart, records), [weekStart, records]);
  const prevWeekRecords = useMemo(() => buildWeekData(addDays(weekStart, -7), records), [weekStart, records]);
  const summary = useMemo(
    () => computeWeeklySleepSummary(weekRecords, prevWeekRecords),
    [weekRecords, prevWeekRecords],
  );

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

  const deltaUp = summary.deltaMinutes >= 0;

  return (
    <div className="sleep-history-page">
      <header className="sleep-history-header">
        <button type="button" className="sleep-history-back" onClick={() => navigate(-1)} aria-label="이전으로">
          ‹
        </button>
        <h1>주간 수면 기록</h1>
        <span className="sleep-history-header-spacer" aria-hidden="true" />
      </header>

      <div className="sleep-history-date-section">
        <div className="sleep-history-date-nav">
          <button type="button" onClick={goToPrevWeek} aria-label="이전 주">
            ‹
          </button>
          <button
            type="button"
            className="sleep-history-date-label"
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

      <div className="sleep-history-lower-section">
        <p className="sleep-history-section-title">이번 주 수면 요약</p>

        <div className="sleep-history-chart-card">
          <div className="sleep-history-bars">
            {weekRecords.map((record) => (
              <div className="sleep-history-bar-col" key={record.date}>
                <div className={`sleep-history-bar-track sleep-history-bar-track--${record.status}`}>
                  <div
                    className={`sleep-history-bar-fill sleep-history-bar-fill--${record.status}`}
                    style={{ height: `${Math.min(100, (record.minutes / CHART_MAX_MINUTES) * 100)}%` }}
                  />
                </div>
                <span className="sleep-history-bar-day">{record.day}</span>
                <span className="sleep-history-bar-date">{record.date}</span>
              </div>
            ))}
          </div>

          <div className="sleep-history-legend">
            <span className="sleep-history-legend-item">
              <span className="sleep-history-legend-dot sleep-history-legend-dot--good" />
              매우 좋음
            </span>
            <span className="sleep-history-legend-item">
              <span className="sleep-history-legend-dot sleep-history-legend-dot--normal" />
              보통
            </span>
            <span className="sleep-history-legend-item">
              <span className="sleep-history-legend-dot sleep-history-legend-dot--bad" />
              부족
            </span>
          </div>

          <div className="sleep-history-total-card">
            <p className="sleep-history-total-label">평균 수면</p>
            <p className="sleep-history-total-value">{formatDuration(summary.avgMinutes)}</p>
            <p className="sleep-history-total-delta">
              지난 주 보다 {Math.abs(summary.deltaMinutes)}분{" "}
              <span className={`sleep-history-delta-arrow${deltaUp ? "" : " sleep-history-delta-arrow--down"}`}>
                {deltaUp ? "↑" : "↓"}
              </span>
            </p>
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
