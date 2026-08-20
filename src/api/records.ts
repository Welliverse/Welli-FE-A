import { apiClient, USE_MOCK } from "@/api/client";

// 건강 기록 관련 타입. 실제 배포 서버의 /v3/api-docs(OpenAPI)로 확인한
// HealthRecordCreateRequest.type enum 값 그대로 사용.
export type RecordType = "SLEEP" | "SKIN_PHOTO" | "WATER" | "STRESS_EMOTION" | "EXERCISE" | "MEAL";

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
  { type: "STRESS_EMOTION", label: "감정" },
  { type: "EXERCISE", label: "운동" },
  { type: "MEAL", label: "식사" },
];

// BE는 저장할 때마다 새 기록을 추가만 하고(수정/덮어쓰기 API 없음) 같은 날 여러 번 저장해도 합쳐주지
// 않는다. 기록 화면들은 "오늘의 현재 값"을 다시 저장하는 UX(예: 물 섭취량 슬라이더)라서, 하루 안에서
// 여러 번 저장했다면 그 날의 대표값은 합계가 아니라 가장 최근에 저장한 기록으로 봐야 한다.
export function latestOf(records: HealthRecord[]): HealthRecord | undefined {
  return records.reduce<HealthRecord | undefined>(
    (latest, r) => (!latest || r.recordedAt > latest.recordedAt ? r : latest),
    undefined,
  );
}

const MOCK_RECORDS_KEY = "welli_mock_records";
const MOCK_DELAY_MS = 300;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadMockRecords(): HealthRecord[] {
  const raw = localStorage.getItem(MOCK_RECORDS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveMockRecords(records: HealthRecord[]) {
  localStorage.setItem(MOCK_RECORDS_KEY, JSON.stringify(records));
}

async function mockCreateRecord(
  type: RecordType,
  value: Record<string, unknown>,
  photoUrl: string | null,
): Promise<HealthRecord> {
  await wait(MOCK_DELAY_MS);
  const records = loadMockRecords();
  const record: HealthRecord = { recordId: Date.now(), type, value, photoUrl, recordedAt: new Date().toISOString() };
  records.push(record);
  saveMockRecords(records);
  return record;
}

async function mockListRecords(): Promise<HealthRecord[]> {
  await wait(MOCK_DELAY_MS);
  return loadMockRecords();
}

// FE-A 담당 아님(원래 FE-B 영역)이지만 브랜치가 병합돼 이 저장소에 화면이 같이 들어와 있어
// 실서버 연동까지 함께 진행. 인증 필요 — apiClient가 토큰 자동 첨부.
export const recordsApi = {
  create: (type: RecordType, value: Record<string, unknown>, photoUrl: string | null = null) =>
    USE_MOCK
      ? mockCreateRecord(type, value, photoUrl)
      : apiClient.post<HealthRecord>("/records", { type, value, photoUrl }),
  list: () => (USE_MOCK ? mockListRecords() : apiClient.get<HealthRecord[]>("/records")),
  // SKIN_PHOTO 전용 — multipart/form-data, key는 반드시 "photo".
  uploadSkinPhoto: (file: File) => {
    if (USE_MOCK) {
      return mockCreateRecord("SKIN_PHOTO", { description: "피부 사진 기록" }, URL.createObjectURL(file));
    }
    const form = new FormData();
    form.append("photo", file);
    return apiClient.postForm<HealthRecord>("/records/skin-photo", form);
  },
};
