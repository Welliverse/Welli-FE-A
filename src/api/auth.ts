import { apiClient, ApiError, USE_MOCK } from "@/api/client";

export interface AuthUser {
  userId: number;
  email: string;
  nickname?: string;
  onboardingCompleted?: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

// 실제 BE 응답 스키마 (Swagger: LoginResponse) — accessToken이 user 정보와 같은 레벨에 있음
interface LoginResponseBody {
  accessToken: string;
  userId: number;
  email: string;
  nickname?: string;
  onboardingCompleted?: boolean;
}

// 실제 BE 응답 스키마 (Swagger: SignupResponse) — 토큰이 없음, 회원가입만 하고 로그인은 별도 호출
interface SignupResponseBody {
  userId: number;
  email: string;
  nickname?: string;
}

function toAuthUser(body: LoginResponseBody | SignupResponseBody): AuthUser {
  return {
    userId: body.userId,
    email: body.email,
    nickname: body.nickname,
    onboardingCompleted: "onboardingCompleted" in body ? body.onboardingCompleted : undefined,
  };
}

const MOCK_DELAY_MS = 500;
const MOCK_USERS_KEY = "welli_mock_users";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type MockUser = { userId: number; email: string; password: string };

function loadMockUsers(): Record<string, MockUser> {
  const raw = localStorage.getItem(MOCK_USERS_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveMockUsers(users: Record<string, MockUser>) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

async function mockSignup({ email, password }: AuthCredentials): Promise<AuthResponse> {
  await wait(MOCK_DELAY_MS);
  const users = loadMockUsers();
  if (users[email]) {
    throw new ApiError(409, "EMAIL_TAKEN", "이미 가입된 이메일입니다.");
  }
  const userId = Date.now();
  users[email] = { userId, email, password };
  saveMockUsers(users);
  return { user: { userId, email }, token: `mock-token-${userId}` };
}

async function mockLogin({ email, password }: AuthCredentials): Promise<AuthResponse> {
  await wait(MOCK_DELAY_MS);
  const users = loadMockUsers();
  const found = users[email];
  if (!found || found.password !== password) {
    throw new ApiError(401, "INVALID_CREDENTIALS", "이메일 또는 비밀번호가 올바르지 않습니다.");
  }
  return { user: { userId: found.userId, email: found.email }, token: `mock-token-${found.userId}` };
}

async function realSignup(credentials: AuthCredentials): Promise<AuthResponse> {
  await apiClient.post<SignupResponseBody>("/auth/signup", credentials);
  // BE 회원가입 응답에는 토큰이 없어서, 가입 직후 같은 자격증명으로 로그인해 토큰을 받아옴
  return realLogin(credentials);
}

async function realLogin(credentials: AuthCredentials): Promise<AuthResponse> {
  const body = await apiClient.post<LoginResponseBody>("/auth/login", credentials);
  return { user: toAuthUser(body), token: body.accessToken };
}

// FE-A 담당: 로그인/회원가입. BE 연동 전까지 USE_MOCK=true로 localStorage 기반 mock 인증 사용.
export const authApi = {
  signup: (credentials: AuthCredentials) => (USE_MOCK ? mockSignup(credentials) : realSignup(credentials)),
  login: (credentials: AuthCredentials) => (USE_MOCK ? mockLogin(credentials) : realLogin(credentials)),
};
