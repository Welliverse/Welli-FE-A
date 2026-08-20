import { addDays, isSameDay } from "@/pages/history/dateUtils";
import type { HealthRecord } from "@/api/records";

export type DayStatus = "good" | "normal" | "bad";

export interface DailyMealRecord {
  day: string;
  date: string;
  score: number;
  status: DayStatus;
  logged: boolean;
}

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function scoreToStatus(score: number): DayStatus {
  if (score >= 80) return "good";
  if (score >= 60) return "normal";
  return "bad";
}

// BE에 식사 사진 AI 채점 기능이 없어 기록의 실제 영양 점수를 받아올 수 없음 — 대신 그날
// MEAL 기록을 실제로 저장했는지 여부만 확인 가능(기록함 100점 / 안 함 0점)으로 근사한다.
// AI 채점 엔드포인트가 생기면 이 근사치를 실제 점수로 교체하면 됨.
export function buildWeekData(weekStart: Date, records: HealthRecord[]): DailyMealRecord[] {
  return WEEKDAY_LABELS.map((day, i) => {
    const date = addDays(weekStart, i);
    const logged = records.some((r) => isSameDay(new Date(r.recordedAt), date));
    const score = logged ? 100 : 0;
    return { day, date: `${date.getMonth() + 1}/${date.getDate()}`, score, status: scoreToStatus(score), logged };
  });
}

// 기록이 없는 날은 평균 계산에서 제외(기록 안 한 날을 0점으로 넣으면 평균이 비정상적으로 낮아짐).
export function computeWeeklyMealSummary(records: DailyMealRecord[]) {
  const logged = records.filter((r) => r.logged);
  if (logged.length === 0) return { avgScore: 0, status: scoreToStatus(0) };
  const avgScore = Math.round(logged.reduce((sum, r) => sum + r.score, 0) / logged.length);
  return { avgScore, status: scoreToStatus(avgScore) };
}

export function getMealTierInfo(status: DayStatus) {
  if (status === "good") {
    return { label: "좋음", desc: "균형 잡힌 식단을 아주 잘 유지하고 있어요!" };
  }
  if (status === "normal") {
    return { label: "보통", desc: "균형 잡힌 식단을 유지하고 있어요!" };
  }
  return { label: "주의", desc: "이번 주 식단을 조금 더 신경써보세요." };
}
