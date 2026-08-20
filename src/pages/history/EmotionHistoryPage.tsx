import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeToolbar from "@/pages/home/HomeToolbar";
import HistoryCalendar from "@/pages/history/HistoryCalendar";
import {
  generateWeekData,
  computeWeeklyEmotionSummary,
  getEmotionOverallMessage,
  type DayStatus,
} from "@/pages/history/emotionHistoryMockData";
import { addDays, formatWeekRange, getWeekStart } from "@/pages/history/dateUtils";
import dogFaceGood from "@/assets/icons/dog-face-good.png";
import dogFaceNeutral from "@/assets/icons/dog-face-neutral.png";
import dogFaceBad from "@/assets/icons/dog-face-bad.png";
import "@/pages/home/home.css";
import "@/pages/history/emotionHistory.css";

const OVERALL_FACE: Record<DayStatus, string> = {
  good: dogFaceGood,
  normal: dogFaceNeutral,
  bad: dogFaceBad,
};

export default function EmotionHistoryPage() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [calendarOpen, setCalendarOpen] = useState(false);

  const weekRecords = useMemo(() => generateWeekData(weekStart), [weekStart]);
  const summary = useMemo(() => computeWeeklyEmotionSummary(weekRecords), [weekRecords]);

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
    <div className="emotion-history-page">
      <header className="emotion-history-header">
        <button type="button" className="emotion-history-back" onClick={() => navigate(-1)} aria-label="이전으로">
          ‹
        </button>
        <h1>주간 감정 기록</h1>
        <span className="emotion-history-header-spacer" aria-hidden="true" />
      </header>

      <div className="emotion-history-date-section">
        <div className="emotion-history-date-nav">
          <button type="button" onClick={goToPrevWeek} aria-label="이전 주">
            ‹
          </button>
          <button
            type="button"
            className="emotion-history-date-label"
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

      <div className="emotion-history-lower-section">
        <div className="emotion-history-chart-card">
          <div className="emotion-history-bars">
            {weekRecords.map((record) => (
              <div className="emotion-history-bar-col" key={record.date}>
                <div className="emotion-history-bar-track">
                  <div className={`emotion-history-bar-fill emotion-history-bar-fill--${record.status}`} />
                </div>
                <span className="emotion-history-bar-day">{record.day}</span>
                <span className="emotion-history-bar-date">{record.date}</span>
              </div>
            ))}
          </div>

          <div className="emotion-history-legend">
            <span className="emotion-history-legend-item">
              <span className="emotion-history-legend-dot emotion-history-legend-dot--good" />
              매우 좋음
            </span>
            <span className="emotion-history-legend-item">
              <span className="emotion-history-legend-dot emotion-history-legend-dot--normal" />
              보통
            </span>
            <span className="emotion-history-legend-item">
              <span className="emotion-history-legend-dot emotion-history-legend-dot--bad" />
              부족
            </span>
          </div>
        </div>

        <p className="emotion-history-section-title">이번 주 요약</p>

        <div className="emotion-history-summary-card">
          <div className="emotion-history-summary-face">
            <img src={OVERALL_FACE[summary.overall]} alt="" />
            <p>
              전반적으로
              <br />
              <b>{getEmotionOverallMessage(summary.overall)}</b>
            </p>
          </div>
          <div className="emotion-history-summary-stats">
            <div className="emotion-history-summary-stat emotion-history-summary-stat--good">
              <span className="emotion-history-summary-stat-left">
                <span className="emotion-history-summary-dot emotion-history-summary-dot--good" />
                좋았던 날
              </span>
              <b>{summary.goodCount}일</b>
            </div>
            <div className="emotion-history-summary-stat emotion-history-summary-stat--normal">
              <span className="emotion-history-summary-stat-left">
                <span className="emotion-history-summary-dot emotion-history-summary-dot--normal" />
                보통이었던 날
              </span>
              <b>{summary.normalCount}일</b>
            </div>
            <div className="emotion-history-summary-stat emotion-history-summary-stat--bad">
              <span className="emotion-history-summary-stat-left">
                <span className="emotion-history-summary-dot emotion-history-summary-dot--bad" />
                힘들었던 날
              </span>
              <b>{summary.badCount}일</b>
            </div>
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
