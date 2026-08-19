import { addDays } from "@/pages/history/dateUtils";

export type DayStatus = "good" | "normal" | "bad";

export interface DailyEmotionRecord {
  day: string;
  date: string;
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

// weekStart(그 주의 일요일) 기준으로 날짜별 감정 상태를 결정적으로 생성 — 같은 주는 항상
// 같은 그래프가 보이고, 주가 바뀌면 다른 값이 보이도록 날짜 문자열을 해시해서 사용.
export function generateWeekData(weekStart: Date): DailyEmotionRecord[] {
  return WEEKDAY_LABELS.map((day, i) => {
    const date = addDays(weekStart, i);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const bucket = hashString(key) % 3;
    const status: DayStatus = bucket === 0 ? "good" : bucket === 1 ? "normal" : "bad";
    return { day, date: `${date.getMonth() + 1}/${date.getDate()}`, status };
  });
}
