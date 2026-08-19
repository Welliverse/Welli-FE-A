const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const next = startOfDay(date);
  next.setDate(next.getDate() + days);
  return next;
}

// 해당 날짜가 속한 주의 일요일을 반환.
export function getWeekStart(date: Date): Date {
  return addDays(date, -date.getDay());
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function formatWeekRange(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 6);
  const startText = `${weekStart.getMonth() + 1}월 ${weekStart.getDate()}일`;
  const endText =
    weekStart.getMonth() === weekEnd.getMonth()
      ? `${weekEnd.getDate()}일`
      : `${weekEnd.getMonth() + 1}월 ${weekEnd.getDate()}일`;
  return `${startText} - ${endText}`;
}

export function formatMonthDay(date: Date): string {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export function formatMonthYear(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
}

export function getWeekdayLabels(): string[] {
  return WEEKDAY_LABELS;
}

// 달력 그리드용: 해당 월이 걸쳐 있는 주의 일요일부터 시작해 6주(42일)를 채운다.
export function getMonthGrid(monthDate: Date): Date[] {
  const firstOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const gridStart = getWeekStart(firstOfMonth);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}
