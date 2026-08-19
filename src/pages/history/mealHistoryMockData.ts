import { addDays } from "@/pages/history/dateUtils";

export type DayStatus = "good" | "normal" | "bad";

export interface DailyMealRecord {
  day: string;
  date: string;
  score: number;
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

function scoreToStatus(score: number): DayStatus {
  if (score >= 80) return "good";
  if (score >= 60) return "normal";
  return "bad";
}

// weekStart(그 주의 일요일) 기준으로 날짜별 AI 식단 점수를 결정적으로 생성 — 같은 주는
// 항상 같은 그래프가 보이고, 주가 바뀌면 다른 값이 보이도록 날짜 문자열을 해시해서 사용.
// TODO(BE): 실제로는 /records에 저장된 MEAL 기록의 AI 채점 결과(0~100점)를 받아와야 함.
export function generateWeekData(weekStart: Date): DailyMealRecord[] {
  return WEEKDAY_LABELS.map((day, i) => {
    const date = addDays(weekStart, i);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const score = 40 + (hashString(key) % 61);
    return { day, date: `${date.getMonth() + 1}/${date.getDate()}`, score, status: scoreToStatus(score) };
  });
}

export function computeWeeklyMealSummary(records: DailyMealRecord[]) {
  const avgScore = Math.round(records.reduce((sum, r) => sum + r.score, 0) / records.length);
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
