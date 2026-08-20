import { apiClient, USE_MOCK } from "@/api/client";

// 실제 배포 서버의 /v3/api-docs(OpenAPI)로 확인한 RoutineResponse.routineType enum 값.
export type RoutineType = "WATER" | "SLEEP" | "EXERCISE" | "MEDITATION" | "SKINCARE" | "DIET";

export interface Routine {
  routineId: number;
  routineType: RoutineType;
  priority: number;
  recommendedAt: string;
  completed: boolean;
}

// routineType별 표시용 아이콘/제목/부제 — 홈 화면과 루틴 탭이 공유.
export const ROUTINE_DISPLAY: Record<RoutineType, { title: string; subtitle: string }> = {
  WATER: { title: "수분 섭취", subtitle: "물 2L 마시기" },
  SLEEP: { title: "수면 습관", subtitle: "11시 전에 잠들기" },
  EXERCISE: { title: "가벼운 운동", subtitle: "30분 걷기" },
  MEDITATION: { title: "마음챙김", subtitle: "명상 10분 하기" },
  SKINCARE: { title: "피부 관리", subtitle: "스킨케어 루틴 실천하기" },
  DIET: { title: "균형 식단", subtitle: "오늘 식사 기록하기" },
};

const MOCK_ROUTINES_KEY = "welli_mock_routines";
const MOCK_DELAY_MS = 300;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function defaultMockRoutines(): Routine[] {
  const today = new Date().toISOString().slice(0, 10);
  return [
    { routineId: 1, routineType: "SLEEP", priority: 1, recommendedAt: today, completed: false },
    { routineId: 2, routineType: "WATER", priority: 2, recommendedAt: today, completed: false },
    { routineId: 3, routineType: "MEDITATION", priority: 3, recommendedAt: today, completed: false },
  ];
}

function loadMockRoutines(): Routine[] {
  const raw = localStorage.getItem(MOCK_ROUTINES_KEY);
  return raw ? JSON.parse(raw) : defaultMockRoutines();
}

function saveMockRoutines(routines: Routine[]) {
  localStorage.setItem(MOCK_ROUTINES_KEY, JSON.stringify(routines));
}

async function mockGetRecommendations(): Promise<Routine[]> {
  await wait(MOCK_DELAY_MS);
  return loadMockRoutines();
}

async function mockComplete(id: number): Promise<Routine> {
  await wait(MOCK_DELAY_MS);
  const routines = loadMockRoutines();
  const target = routines.find((r) => r.routineId === id);
  if (!target) throw new Error("Routine not found");
  target.completed = true;
  saveMockRoutines(routines);
  return target;
}

// FE-A 담당 아님(원래 FE-B 영역)이지만 브랜치가 병합돼 같이 연동. 인증 필요.
export const routineApi = {
  getRecommendations: () =>
    USE_MOCK ? mockGetRecommendations() : apiClient.get<Routine[]>("/routines/recommendations"),
  complete: (id: number) => (USE_MOCK ? mockComplete(id) : apiClient.post<Routine>(`/routines/${id}/complete`)),
};
