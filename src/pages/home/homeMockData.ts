import badgeStreak from "@/assets/icons/badge-streak.png";
import badgeWater from "@/assets/icons/badge-water.png";
import badgeRoutine from "@/assets/icons/badge-routine.png";

// TODO(BE): 홈 화면 데이터 연동 전 mock. 실제 API 나오면 이 파일만 교체.

export interface ConditionStat {
  label: string;
  value: number; // 0~100
  warningValue?: number; // 0~100, value를 넘어서는 초과분을 경고색으로 표시
}

export interface ConditionData {
  status: string;
  emoji: string;
  stats: ConditionStat[];
}

export const mockCondition: ConditionData = {
  status: "좋음",
  emoji: "😊",
  stats: [
    { label: "수분", value: 66, warningValue: 88 },
    { label: "영양", value: 72 },
    { label: "에너지", value: 55 },
    { label: "마음", value: 80 },
  ],
};

export const mockDailyMessage = "오늘 피부 광채가 88%예요! 꿀잠 잔 보람이 있네요✨";

export interface RoutineItem {
  id: string;
  title: string;
  subtitle: string;
  done: boolean;
}

export const mockRoutines: RoutineItem[] = [
  { id: "1", title: "비타민C 세럼 바르기", subtitle: "피부 개선 루틴 · 아침", done: true },
  { id: "2", title: "따뜻한 물 한 잔 마시기", subtitle: "수분 섭취 · 상시", done: false },
];

export interface LevelData {
  level: number;
  currentExp: number;
  maxExp: number;
  stageName: string;
}

export const mockLevel: LevelData = {
  level: 13,
  currentExp: 820,
  maxExp: 1200,
  stageName: "건강한 강아지",
};

export interface BadgeItem {
  id: string;
  label: string;
  icon: string;
}

export const mockBadges: BadgeItem[] = [
  { id: "streak", label: "7일 연속", icon: badgeStreak },
  { id: "water", label: "수분 마스터", icon: badgeWater },
  { id: "routine", label: "루틴 챔피언", icon: badgeRoutine },
];

export interface DailyReport {
  mood: "good" | "bad";
  message: string;
  stageName: string;
}

export const mockDailyReport: Record<"good" | "bad", DailyReport> = {
  good: {
    mood: "good",
    message:
      "오늘은 수면이 잘 지켜져서 피부가 한결 맑아졌어요! 물 섭취도 충분하고, 가벼운 운동까지! 스트레스가 조금 늘었지만 내일은 더 좋은 하루가 될 거예요!",
    stageName: "건강한 강아지",
  },
  bad: {
    mood: "bad",
    message:
      "오늘은 수면이 잘 지켜지지 못한 것 같아요... 😢 피부도 지치고, 기운도 떨어졌어요. 너무 자책하지 마세요! 내일은 조금 더 잘 지켜보자구요. 작은 변화가 큰 차이를 만들어요!",
    stageName: "피곤한 강아지",
  },
};
