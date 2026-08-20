import { apiClient, ApiError, USE_MOCK } from "@/api/client";
import { markMockOnboardingCompleted } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";

export type Gender = "female" | "male" | "other";

// TODO(BE): 건강목표 enum 값이 명세서에 필드명(healthGoal)만 있고 각 항목의
// 실제 코드값은 없어서 임시로 정함 — BE 확정되면 이 값들만 교체하면 됨.
export type HealthGoalCode =
  | "skinCare"
  | "sleepImprovement"
  | "exerciseHabit"
  | "dietManagement"
  | "stressManagement"
  | "hydration";

export interface UpdateProfileRequest {
  age: number;
  gender: Gender;
  healthGoal: HealthGoalCode[];
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
      // BE는 healthGoal을 배열이 아니라 문자열 하나로 받음 — 여러 개 선택한
      // 건강목표는 쉼표로 이어붙여서 보낸다(멀티 선택 UI는 그대로 유지).
      await apiClient.patch<void>("/users/me/profile", {
        age: payload.age,
        gender: payload.gender,
        healthGoal: payload.healthGoal.join(","),
      });
    }
    useAuthStore.getState().markOnboardingCompleted();
  },
};
