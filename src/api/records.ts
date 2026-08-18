// 건강 기록 관련 타입. API명세서 POST/GET /records, POST /records/skin-photo 기준.
// SLEEP, SKIN_PHOTO는 명세서 예시에 그대로 나온 확정값. WATER/EMOTION/EXERCISE/MEAL은
// 명세서에 예시가 없어 관례상 임시 지정한 값 — BE 확정되면 이 파일만 고치면 됨.
export type RecordType = "SLEEP" | "SKIN_PHOTO" | "WATER" | "EMOTION" | "EXERCISE" | "MEAL";

export interface HealthRecord {
  recordId: number;
  type: RecordType;
  value: Record<string, unknown>;
  photoUrl: string | null;
  recordedAt: string;
}

export interface RecordCategory {
  type: RecordType;
  label: string;
}

export const RECORD_CATEGORIES: RecordCategory[] = [
  { type: "SKIN_PHOTO", label: "피부" },
  { type: "SLEEP", label: "수면" },
  { type: "WATER", label: "수분" },
  { type: "EMOTION", label: "감정" },
  { type: "EXERCISE", label: "운동" },
  { type: "MEAL", label: "식사" },
];
