import { addDays, isSameDay } from "@/pages/history/dateUtils";
import { latestOf, type HealthRecord } from "@/api/records";

export type DayStatus = "good" | "normal" | "bad";

export interface DailyWaterRecord {
  day: string;
  date: string;
  valueMl: number;
  status: DayStatus;
  logged: boolean;
}

export const MOCK_GOAL_ML = 2000;

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function statusFor(valueMl: number): DayStatus {
  if (valueMl <= 0) return "bad";
  return valueMl >= 1800 ? "good" : valueMl >= 1200 ? "normal" : "bad";
}

// weekStart(그 주의 일요일) 기준 7일 각각에, 그날 저장된 WATER 기록 중 가장 최근 것의 amountMl을
// 매핑(물 섭취 화면은 "오늘 총 섭취량"을 다시 저장하는 방식이라 합산하면 저장할 때마다 값이 부풀어남).
export function buildWeekData(weekStart: Date, records: HealthRecord[]): DailyWaterRecord[] {
  return WEEKDAY_LABELS.map((day, i) => {
    const date = addDays(weekStart, i);
    const dayRecords = records.filter((r) => isSameDay(new Date(r.recordedAt), date));
    const valueMl = Number(latestOf(dayRecords)?.value.amountMl) || 0;
    return {
      day,
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      valueMl,
      status: statusFor(valueMl),
      logged: dayRecords.length > 0,
    };
  });
}

// 최고/최저 기록은 기록이 있는 날 중에서만 뽑는다(기록 안 한 날의 0ml이 "최저 기록"으로 잡히지 않도록).
export function computeWaterStats(records: DailyWaterRecord[]) {
  const logged = records.filter((r) => r.logged);
  const pool = logged.length > 0 ? logged : records;
  const highest = pool.reduce((max, r) => (r.valueMl > max.valueMl ? r : max));
  const lowest = pool.reduce((min, r) => (r.valueMl < min.valueMl ? r : min));
  const goalAchievedDays = records.filter((r) => r.valueMl >= MOCK_GOAL_ML).length;
  return { highest, lowest, goalAchievedDays };
}
