import { apiClient, ApiError, USE_MOCK } from "@/api/client";

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

const MOCK_DELAY_MS = 500;
const MOCK_USERS_KEY = "welli_mock_users";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type MockUser = { id: string; email: string; password: string };

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
  const id = crypto.randomUUID();
  users[email] = { id, email, password };
  saveMockUsers(users);
  return { user: { id, email }, token: `mock-token-${id}` };
}

async function mockLogin({ email, password }: AuthCredentials): Promise<AuthResponse> {
  await wait(MOCK_DELAY_MS);
  const users = loadMockUsers();
  const found = users[email];
  if (!found || found.password !== password) {
    throw new ApiError(401, "INVALID_CREDENTIALS", "이메일 또는 비밀번호가 올바르지 않습니다.");
  }
  return { user: { id: found.id, email: found.email }, token: `mock-token-${found.id}` };
}

// FE-A 담당: 로그인/회원가입. BE 연동 전까지 USE_MOCK=true로 localStorage 기반 mock 인증 사용.
export const authApi = {
  signup: (credentials: AuthCredentials) =>
    USE_MOCK ? mockSignup(credentials) : apiClient.post<AuthResponse>("/auth/signup", credentials),
  login: (credentials: AuthCredentials) =>
    USE_MOCK ? mockLogin(credentials) : apiClient.post<AuthResponse>("/auth/login", credentials),
};
