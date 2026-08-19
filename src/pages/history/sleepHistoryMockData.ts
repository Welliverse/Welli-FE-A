import { addDays } from "@/pages/history/dateUtils";

export type DayStatus = "good" | "normal" | "bad";

export interface DailySleepRecord {
  day: string;
  date: string;
  minutes: number;
  status: DayStatus;
}

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// weekStart(그 주의 일요일) 기준으로 날짜별 수면 시간(분)을 결정적으로 생성 — 같은 주는
// 항상 같은 그래프가 보이고, 주가 바뀌면 다른 값이 보이도록 날짜 문자열을 해시해서 사용.
export function generateWeekData(weekStart: Date): DailySleepRecord[] {
  return WEEKDAY_LABELS.map((day, i) => {
    const date = addDays(weekStart, i);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const hash = hashString(key);
    const minutes = 240 + (hash % 331); // 4시간~9시간 30분
    const status: DayStatus = minutes >= 420 ? "good" : minutes >= 330 ? "normal" : "bad";
    return { day, date: `${date.getMonth() + 1}/${date.getDate()}`, minutes, status };
  });
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}시간 ${mins}분`;
}

// "총 수면" 카드용 — 이번 주 평균 수면 시간과, 지난 주 평균 대비 증감(분).
export function computeWeeklySleepSummary(weekStart: Date, records: DailySleepRecord[]) {
  const avgMinutes = Math.round(records.reduce((sum, r) => sum + r.minutes, 0) / records.length);

  const prevWeekRecords = generateWeekData(addDays(weekStart, -7));
  const prevAvgMinutes = Math.round(prevWeekRecords.reduce((sum, r) => sum + r.minutes, 0) / prevWeekRecords.length);

  return { avgMinutes, deltaMinutes: avgMinutes - prevAvgMinutes };
}
