import { apiClient, ApiError, USE_MOCK } from "@/api/client";
import { markMockOnboardingCompleted } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";

// BE 명세: FEMALE만 예시로 확인됨 — MALE/OTHER는 같은 대문자 스네이크 표기 관례를
// 따른 추정치. 실제 값 다르면 여기만 교체하면 됨.
export type Gender = "FEMALE" | "MALE" | "OTHER";

// BE 명세: healthGoal은 다중 선택 배열이 아니라 단일 enum 값.
export type HealthGoalCode = "SKIN_CARE" | "SLEEP" | "WEIGHT_MANAGEMENT" | "HEALTHY_HABIT";

export interface UpdateProfileRequest {
  age: number;
  gender: Gender;
  healthGoal: HealthGoalCode;
}

const MOCK_DELAY_MS = 400;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mockUpdateProfile(payload: UpdateProfileRequest): Promise<void> {
  await wait(MOCK_DELAY_MS);
  if (!payload.age || payload.age < 1) {
    throw new ApiError(400, "INVALID_AGE", "나이를 확인해주세요.");
  }
  const userId = useAuthStore.getState().user?.userId;
  if (userId) markMockOnboardingCompleted(userId);
  localStorage.setItem("welli_mock_profile", JSON.stringify(payload));
}

// FE-A 담당: 온보딩. PATCH /users/me/profile은 인증 필요 — apiClient가
// authStore 토큰을 자동으로 Authorization 헤더에 첨부하므로 별도 처리 불필요.
// 응답 바디가 없어도 우리 쪽 세션 상태를 낙관적으로 true로 갱신해준다.
export const profileApi = {
  updateProfile: async (payload: UpdateProfileRequest) => {
    if (USE_MOCK) {
      await mockUpdateProfile(payload);
    } else {
      await apiClient.patch<void>("/users/me/profile", payload);
    }
    useAuthStore.getState().markOnboardingCompleted();
  },
};
