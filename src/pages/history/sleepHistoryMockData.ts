import { addDays, isSameDay } from "@/pages/history/dateUtils";
import { latestOf, type HealthRecord } from "@/api/records";

export type DayStatus = "good" | "normal" | "bad";

export interface DailySleepRecord {
  day: string;
  date: string;
  minutes: number;
  status: DayStatus;
  logged: boolean;
}

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function statusFor(minutes: number): DayStatus {
  if (minutes <= 0) return "bad";
  return minutes >= 420 ? "good" : minutes >= 330 ? "normal" : "bad";
}

// weekStart(그 주의 일요일) 기준 7일 각각에, 그날 저장된 SLEEP 기록 중 가장 최근 것의
// durationMinutes를 매핑(같은 날 여러 번 저장해도 합산하지 않고 최신 값으로 대체).
// 기록이 없는 날은 0분/"bad"로 표시(막대는 비어있게)하되, logged: false로 표시해 평균 계산에서 제외한다.
export function buildWeekData(weekStart: Date, records: HealthRecord[]): DailySleepRecord[] {
  return WEEKDAY_LABELS.map((day, i) => {
    const date = addDays(weekStart, i);
    const dayRecords = records.filter((r) => isSameDay(new Date(r.recordedAt), date));
    const minutes = Number(latestOf(dayRecords)?.value.durationMinutes) || 0;
    return {
      day,
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      minutes,
      status: statusFor(minutes),
      logged: dayRecords.length > 0,
    };
  });
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}시간 ${mins}분`;
}

// "총 수면" 카드용 — 이번 주 평균 수면 시간과, 지난 주 평균 대비 증감(분).
// 기록이 없는 날은 평균 계산에서 제외(기록 안 한 날을 0분으로 넣으면 평균이 비정상적으로 낮아짐).
export function computeWeeklySleepSummary(currentWeek: DailySleepRecord[], previousWeek: DailySleepRecord[]) {
  const avgMinutes = averageLogged(currentWeek);
  const prevAvgMinutes = averageLogged(previousWeek);
  return { avgMinutes, deltaMinutes: avgMinutes - prevAvgMinutes };
}

function averageLogged(records: DailySleepRecord[]): number {
  const logged = records.filter((r) => r.logged);
  if (logged.length === 0) return 0;
  return Math.round(logged.reduce((sum, r) => sum + r.minutes, 0) / logged.length);
}
