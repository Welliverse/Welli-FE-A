import { apiClient, ApiError, USE_MOCK } from "@/api/client";

// 실제 배포 서버의 /v3/api-docs(OpenAPI)로 확인한 AnalysisResponse.
// growthScore/growthScoreDelta는 이번 분석으로 성장 점수가 얼마나/어떻게 변했는지 — conditionScore와
// 같은 패턴("현재 값" + "이번 변화량").
export interface AnalysisResult {
  analysisId: number;
  summary: string;
  feedbackText: string;
  conditionDelta: number;
  conditionScore: number;
  growthScoreDelta: number;
  growthScore: number;
  appearanceState: string;
  analyzedAt: string;
}

const MOCK_LATEST_KEY = "welli_mock_analysis_latest";
const MOCK_DELAY_MS = 800;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mockRun(): Promise<AnalysisResult> {
  await wait(MOCK_DELAY_MS);
  const result: AnalysisResult = {
    analysisId: Date.now(),
    summary: "최근 건강 기록을 분석했습니다.",
    feedbackText: "수면과 수분 섭취를 조금 더 챙겨보세요.",
    conditionDelta: -5,
    conditionScore: 65,
    growthScoreDelta: 0,
    growthScore: 65,
    appearanceState: "NORMAL",
    analyzedAt: new Date().toISOString(),
  };
  localStorage.setItem(MOCK_LATEST_KEY, JSON.stringify(result));
  return result;
}

async function mockGetLatest(): Promise<AnalysisResult> {
  await wait(MOCK_DELAY_MS);
  const raw = localStorage.getItem(MOCK_LATEST_KEY);
  if (!raw) throw new ApiError(404, "NOT_FOUND", "분석 결과가 없습니다. 먼저 분석을 실행해주세요.");
  return JSON.parse(raw);
}

// FE-A 담당 아님(원래 FE-B 영역)이지만 브랜치가 병합돼 같이 연동. 인증 필요.
export const analysisApi = {
  run: () => (USE_MOCK ? mockRun() : apiClient.post<AnalysisResult>("/analysis/run")),
  getLatest: () => (USE_MOCK ? mockGetLatest() : apiClient.get<AnalysisResult>("/analysis/latest")),
};
