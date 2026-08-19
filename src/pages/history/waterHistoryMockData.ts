import { addDays } from "@/pages/history/dateUtils";

export type DayStatus = "good" | "normal" | "bad";

export interface DailyWaterRecord {
  day: string;
  date: string;
  valueMl: number;
  status: DayStatus;
}

// 나중에 수분 기록 화면에서 저장한 실제 값으로 대체될 mock 데이터.
export const MOCK_GOAL_ML = 2000;

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// weekStart(그 주의 일요일) 기준으로 날짜별 값을 결정적으로 생성 — 같은 주는 항상
// 같은 그래프가 보이고, 주가 바뀌면 다른 값이 보이도록 날짜 문자열을 해시해서 사용.
export function generateWeekData(weekStart: Date): DailyWaterRecord[] {
  return WEEKDAY_LABELS.map((day, i) => {
    const date = addDays(weekStart, i);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const valueMl = 900 + (hashString(key) % 1401);
    const status: DayStatus = valueMl >= 1800 ? "good" : valueMl >= 1200 ? "normal" : "bad";
    return { day, date: `${date.getMonth() + 1}/${date.getDate()}`, valueMl, status };
  });
}

export function computeWaterStats(records: DailyWaterRecord[]) {
  const highest = records.reduce((max, r) => (r.valueMl > max.valueMl ? r : max));
  const lowest = records.reduce((min, r) => (r.valueMl < min.valueMl ? r : min));
  const goalAchievedDays = records.filter((r) => r.valueMl >= MOCK_GOAL_ML).length;
  return { highest, lowest, goalAchievedDays };
}
