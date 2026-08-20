import { useAuthStore } from "@/store/authStore";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

// BE API 준비 전까지는 mock으로 동작. .env에 VITE_USE_MOCK=false 넣으면 실제 API 호출.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

// BE 공통 에러 응답: { status, code, message, path } 평평한 구조로 통일됨
// (인증 401 / 권한 403 / 검증 400 INVALID_REQUEST / 서버 500 INTERNAL_SERVER_ERROR 전부 동일 포맷).
interface ApiErrorBody {
  status?: number;
  code?: string;
  message?: string;
  path?: string;
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let body: ApiErrorBody = {};
    try {
      body = await res.json();
    } catch {
      // 응답 본문이 없거나 JSON이 아닌 경우 기본 메시지로 대체
    }
    throw new ApiError(res.status, body.code ?? "UNKNOWN", body.message ?? "요청 처리 중 오류가 발생했습니다.");
  }

  if (res.status === 204) return undefined as T;
  // 일부 BE 엔드포인트는 200이면서 바디가 비어 있거나(PATCH /users/me/profile),
  // JSON이 아닌 순수 텍스트를 그대로 내려준다(예: /auth/signup은
  // Content-Type: text/plain으로 인용부호 없는 문자열을 반환) — 이런 경우
  // JSON.parse가 곧바로 파싱 에러를 던지므로 Content-Type을 먼저 확인한다.
  const text = await res.text();
  if (!text) return undefined as T;
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return text as unknown as T;
  return JSON.parse(text) as T;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = useAuthStore.getState().token;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  return handleResponse<T>(res);
}

// 피부 사진 업로드(POST /records/skin-photo)처럼 multipart/form-data가 필요한 요청 전용.
// Content-Type은 브라우저가 boundary를 채워 자동 설정하므로 직접 지정하지 않는다.
async function requestForm<T>(path: string, formData: FormData): Promise<T> {
  const token = useAuthStore.getState().token;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  return handleResponse<T>(res);
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  postForm: <T>(path: string, formData: FormData) => requestForm<T>(path, formData),
};
