import { apiClient, ApiError, USE_MOCK } from "@/api/client";

export interface AuthUser {
  userId: number;
  email: string;
  nickname: string;
  onboardingCompleted: boolean;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface SignupResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

// BE 명세: 로그인 응답은 { accessToken, userId, email, nickname, onboardingCompleted }
// 형태로 평평하게(flat) 내려온다 — user로 감싸져 오지 않음. FE 내부에서는 다루기 편하도록
// LoginResponse.user로 묶어주고, 이 변환은 authApi.login 안에서만 처리한다.
interface LoginApiResponse {
  accessToken: string;
  userId: number;
  email: string;
  nickname: string;
  onboardingCompleted: boolean;
}

const MOCK_DELAY_MS = 500;
const MOCK_USERS_KEY = "welli_mock_users";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type MockUser = {
  userId: number;
  email: string;
  password: string;
  nickname: string;
  onboardingCompleted: boolean;
};

function loadMockUsers(): Record<string, MockUser> {
  const raw = localStorage.getItem(MOCK_USERS_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveMockUsers(users: Record<string, MockUser>) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

async function mockSignup({ email, password, nickname }: SignupRequest): Promise<SignupResponse> {
  await wait(MOCK_DELAY_MS);
  const users = loadMockUsers();
  if (users[email]) {
    throw new ApiError(400, "DUPLICATE_EMAIL", "이미 가입된 이메일입니다.");
  }
  const userId = Date.now();
  users[email] = { userId, email, password, nickname, onboardingCompleted: false };
  saveMockUsers(users);
  return { message: "회원가입이 완료되었습니다." };
}

async function mockLogin({ email, password }: LoginRequest): Promise<LoginResponse> {
  await wait(MOCK_DELAY_MS);
  const users = loadMockUsers();
  const found = users[email];
  if (!found || found.password !== password) {
    throw new ApiError(403, "INVALID_CREDENTIALS", "이메일 또는 비밀번호가 올바르지 않습니다.");
  }
  return {
    accessToken: `mock-token-${found.userId}`,
    user: {
      userId: found.userId,
      email: found.email,
      nickname: found.nickname,
      onboardingCompleted: found.onboardingCompleted,
    },
  };
}

// PATCH /users/me/profile 저장 성공 시 BE가 onboardingCompleted를 true로 바꾸는 것과
// 동일하게, mock 저장소에도 반영 — 로그아웃 후 재로그인해도 값이 유지되도록.
export function markMockOnboardingCompleted(userId: number) {
  const users = loadMockUsers();
  const entry = Object.values(users).find((u) => u.userId === userId);
  if (entry) {
    entry.onboardingCompleted = true;
    saveMockUsers(users);
  }
}

async function realLogin(credentials: LoginRequest): Promise<LoginResponse> {
  const raw = await apiClient.post<LoginApiResponse>("/auth/login", credentials);
  return {
    accessToken: raw.accessToken,
    user: {
      userId: raw.userId,
      email: raw.email,
      nickname: raw.nickname,
      onboardingCompleted: raw.onboardingCompleted,
    },
  };
}

// FE-A 담당: 로그인/회원가입. BE 연동 전까지 USE_MOCK=true로 localStorage 기반 mock 인증 사용.
// 회원가입 응답은 완료 메시지만 오고 토큰이 없음(BE 명세) — 가입 후 자동 로그인 불가, 로그인 화면으로 유도.
export const authApi = {
  signup: (credentials: SignupRequest) =>
    USE_MOCK ? mockSignup(credentials) : apiClient.post<SignupResponse>("/auth/signup", credentials),
  login: (credentials: LoginRequest) => (USE_MOCK ? mockLogin(credentials) : realLogin(credentials)),
};
