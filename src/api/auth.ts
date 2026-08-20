import { apiClient, ApiError, BASE_URL, USE_MOCK } from "@/api/client";

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

// BE /auth/login 응답에는 onboardingCompleted가 내려오지 않는다(FE-B 확인) —
// 로그인 직후 /users/me를 한 번 더 호출해서 프로필이 채워졌는지로 판단한다.
interface RawLoginResponse {
  accessToken: string;
  userId: number;
  email: string;
  nickname: string;
}

interface RawUserMeResponse {
  userId: number;
  email: string;
  nickname: string;
  age: number | null;
  gender: string | null;
  healthGoal: string | null;
}

async function fetchOnboardingCompleted(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return false;
    const data: RawUserMeResponse = await res.json();
    return Boolean(data.age && data.gender && data.healthGoal);
  } catch {
    // 조회 실패해도 로그인 자체는 막지 않고 온보딩부터 다시 타게 한다.
    return false;
  }
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
  const raw = await apiClient.post<RawLoginResponse>("/auth/login", credentials);
  const onboardingCompleted = await fetchOnboardingCompleted(raw.accessToken);
  return {
    accessToken: raw.accessToken,
    user: {
      userId: raw.userId,
      email: raw.email,
      nickname: raw.nickname,
      onboardingCompleted,
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
