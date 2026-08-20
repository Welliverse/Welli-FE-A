import { addDays, isSameDay } from "@/pages/history/dateUtils";
import { latestOf, type HealthRecord } from "@/api/records";

export type DayStatus = "good" | "normal" | "bad";

export interface DailyEmotionRecord {
  day: string;
  date: string;
  moodScore: number;
  status: DayStatus;
  logged: boolean;
}

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

// 기록이 없는 날은 막대에는 moodScore 0("bad")으로 표시하되, logged: false로 남겨 주간 집계에서 제외한다.
function statusFor(moodScore: number): DayStatus {
  if (moodScore >= 60) return "good";
  if (moodScore >= 35) return "normal";
  return "bad";
}

// weekStart(그 주의 일요일) 기준 7일 각각에, 그날 저장된 STRESS_EMOTION 기록 중 가장 최근 것의
// moodScore를 매핑(같은 날 다시 기록하면 최신 기분으로 대체 — 평균 내지 않음).
export function buildWeekData(weekStart: Date, records: HealthRecord[]): DailyEmotionRecord[] {
  return WEEKDAY_LABELS.map((day, i) => {
    const date = addDays(weekStart, i);
    const dayRecords = records.filter((r) => isSameDay(new Date(r.recordedAt), date));
    const moodScore = Number(latestOf(dayRecords)?.value.moodScore) || 0;
    return {
      day,
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      moodScore,
      status: statusFor(moodScore),
      logged: dayRecords.length > 0,
    };
  });
}

// 기록이 없는 날은 좋음/보통/나쁨 집계에서 아예 제외한다(기록 안 한 날들이 "나쁨"으로 몰표를 던져
// 하루만 기록해도 "힘든 한 주"로 나오는 문제를 막기 위함).
export function computeWeeklyEmotionSummary(records: DailyEmotionRecord[]) {
  const logged = records.filter((r) => r.logged);
  const goodCount = logged.filter((r) => r.status === "good").length;
  const normalCount = logged.filter((r) => r.status === "normal").length;
  const badCount = logged.filter((r) => r.status === "bad").length;
  const overall: DayStatus =
    logged.length === 0
      ? "normal"
      : goodCount >= normalCount && goodCount >= badCount
        ? "good"
        : normalCount >= badCount
          ? "normal"
          : "bad";
  return { goodCount, normalCount, badCount, overall };
}

export function getEmotionOverallMessage(overall: DayStatus) {
  if (overall === "good") return "좋은 한 주였어요!";
  if (overall === "normal") return "무난한 한 주였어요!";
  return "힘든 한 주였어요";
}
