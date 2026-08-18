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
