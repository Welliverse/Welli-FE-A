import { addDays, isSameDay } from "@/pages/history/dateUtils";
import { latestOf, type HealthRecord } from "@/api/records";

export type DayStatus = "good" | "normal" | "bad";

export interface DailyExerciseRecord {
  day: string;
  date: string;
  minutes: number;
  calories: number;
  status: DayStatus;
  logged: boolean;
}

export const MOCK_GOAL_MINUTES = 30;

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function statusFor(minutes: number): DayStatus {
  if (minutes <= 0) return "bad";
  return minutes >= 30 ? "good" : minutes >= 15 ? "normal" : "bad";
}

// weekStart(그 주의 일요일) 기준 7일 각각에, 그날 저장된 EXERCISE 기록 중 가장 최근 것의
// 운동 시간/칼로리를 매핑(같은 날 다시 저장해도 합산하지 않고 최신 값으로 대체).
export function buildWeekData(weekStart: Date, records: HealthRecord[]): DailyExerciseRecord[] {
  return WEEKDAY_LABELS.map((day, i) => {
    const date = addDays(weekStart, i);
    const dayRecords = records.filter((r) => isSameDay(new Date(r.recordedAt), date));
    const latest = latestOf(dayRecords);
    const minutes = Number(latest?.value.durationMinutes) || 0;
    const calories = Number(latest?.value.estimatedCalories) || 0;
    return {
      day,
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      minutes,
      calories,
      status: statusFor(minutes),
      logged: dayRecords.length > 0,
    };
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
