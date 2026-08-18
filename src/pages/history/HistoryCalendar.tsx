import { useState } from "react";
import {
  addDays,
  formatMonthYear,
  getMonthGrid,
  getWeekStart,
  getWeekdayLabels,
  isSameDay,
} from "@/pages/history/dateUtils";
import "@/pages/history/historyCalendar.css";

interface HistoryCalendarProps {
  selectedWeekStart: Date;
  onSelectDate: (date: Date) => void;
}

export default function HistoryCalendar({ selectedWeekStart, onSelectDate }: HistoryCalendarProps) {
  const [viewMonth, setViewMonth] = useState(selectedWeekStart);
  const today = new Date();
  const selectedWeekEnd = addDays(selectedWeekStart, 6);

  function goToPrevMonth() {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  }

  function goToNextMonth() {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));
  }

  const days = getMonthGrid(viewMonth);

  return (
    <div className="history-calendar">
      <div className="history-calendar-header">
        <button type="button" onClick={goToPrevMonth} aria-label="이전 달">
          ‹
        </button>
        <span>{formatMonthYear(viewMonth)}</span>
        <button type="button" onClick={goToNextMonth} aria-label="다음 달">
          ›
        </button>
      </div>
      <div className="history-calendar-weekdays">
        {getWeekdayLabels().map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="history-calendar-grid">
        {days.map((date) => {
          const inSelectedWeek = date >= selectedWeekStart && date <= selectedWeekEnd;
          const isOtherMonth = date.getMonth() !== viewMonth.getMonth();
          const isToday = isSameDay(date, today);
          return (
            <button
              key={date.toISOString()}
              type="button"
              className={`history-calendar-day${inSelectedWeek ? " in-week" : ""}${
                isOtherMonth ? " other-month" : ""
              }${isToday ? " today" : ""}`}
              onClick={() => {
                setViewMonth(date);
                onSelectDate(getWeekStart(date));
              }}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
