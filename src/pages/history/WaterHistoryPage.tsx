import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeToolbar from "@/pages/home/HomeToolbar";
import HistoryCalendar from "@/pages/history/HistoryCalendar";
import { generateWeekData, computeWaterStats } from "@/pages/history/waterHistoryMockData";
import { addDays, formatWeekRange, getWeekStart } from "@/pages/history/dateUtils";
import "@/pages/home/home.css";
import "@/pages/history/waterHistory.css";

const CHART_MAX_ML = 2500;

export default function WaterHistoryPage() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [calendarOpen, setCalendarOpen] = useState(false);

  const weekRecords = useMemo(() => generateWeekData(weekStart), [weekStart]);
  const stats = useMemo(() => computeWaterStats(weekRecords), [weekRecords]);

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
                <div className="water-history-bar-track">
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
