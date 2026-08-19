import { addDays } from "@/pages/history/dateUtils";

export type DayStatus = "good" | "normal" | "bad";

export interface DailyExerciseRecord {
  day: string;
  date: string;
  minutes: number;
  calories: number;
  status: DayStatus;
}

// 나중에 운동 기록 화면에서 저장한 실제 값(운동 시간, 소모 칼로리)으로 대체될 mock 데이터.
export const MOCK_GOAL_MINUTES = 30;

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
// 운동 시간(minutes)이 막대 높이를 결정하고, 소모 칼로리는 시간에 대략 비례하도록 계산.
export function generateWeekData(weekStart: Date): DailyExerciseRecord[] {
  return WEEKDAY_LABELS.map((day, i) => {
    const date = addDays(weekStart, i);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const hash = hashString(key);
    const minutes = hash % 61; // 0~60분
    const calories = Math.round(minutes * 7 + (hash % 40));
    const status: DayStatus = minutes >= 30 ? "good" : minutes >= 15 ? "normal" : "bad";
    return { day, date: `${date.getMonth() + 1}/${date.getDate()}`, minutes, calories, status };
  });
}

// "이번 주 하이라이트" 리스트용 — 가장 오래 운동한 날, 가장 많은 칼로리를 태운 날,
// 그리고 그 주 안에서 가장 긴 연속 운동일수(상태가 "부족"이 아닌 날이 이어진 최대 길이).
export function computeExerciseHighlights(records: DailyExerciseRecord[]) {
  const topTime = records.reduce((max, r) => (r.minutes > max.minutes ? r : max));
  const topCalorie = records.reduce((max, r) => (r.calories > max.calories ? r : max));

  let streak = 0;
  let maxStreak = 0;
  for (const r of records) {
    if (r.status !== "bad") {
      streak += 1;
      maxStreak = Math.max(maxStreak, streak);
    } else {
      streak = 0;
    }
  }

  return { topTime, topCalorie, streakDays: maxStreak };
}
