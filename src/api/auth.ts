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

// BE 명세: 201 Created, { userId, email, nickname } — 토큰은 안 옴(자동 로그인 없음).
export interface SignupResponse {
  userId: number;
  email: string;
  nickname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

// BE /auth/login 응답도 onboardingCompleted를 평평하게(flat) 내려준다 — user로
// 감싸져 오지 않으므로 FE 내부용 LoginResponse.user 형태로 여기서만 변환한다.
interface RawLoginResponse {
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
  return { userId, email, nickname };
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
  const raw = await apiClient.post<RawLoginResponse>("/auth/login", credentials);
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
