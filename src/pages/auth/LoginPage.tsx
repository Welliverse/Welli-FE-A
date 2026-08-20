import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/pages/auth/AuthLayout";
import { validateEmail, validatePassword } from "@/pages/auth/validation";
import { authApi } from "@/api/auth";
import { ApiError } from "@/api/client";
import { useAuthStore } from "@/store/authStore";

interface FieldErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showSignupSuccess, setShowSignupSuccess] = useState(
    Boolean((location.state as { signupSuccess?: boolean } | null)?.signupSuccess),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setShowSignupSuccess(false);

    const errors: FieldErrors = {
      email: validateEmail(email) ?? undefined,
      password: validatePassword(password) ?? undefined,
    };
    setFieldErrors(errors);
    if (errors.email || errors.password) return;

    setIsSubmitting(true);
    try {
      const { accessToken, user } = await authApi.login({ email, password });
      setAuth(user, accessToken);
      navigate(user.onboardingCompleted ? "/home" : "/onboarding");
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Welli"
      subtitle={
        <>
          내 건강을 위한
          <br />
          <span className="auth-subtitle-accent">AI 맞춤 파트너</span>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {showSignupSuccess && (
          <p className="auth-form-success">회원가입이 완료되었습니다. 로그인해주세요.</p>
        )}
        {formError && <p className="auth-form-error">{formError}</p>}

        <div className="auth-field-group">
          <div className="auth-field">
            <input
              id="email"
              type="email"
              autoComplete="email"
              aria-label="이메일"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
            />
            {fieldErrors.email && <p className="auth-field-error">{fieldErrors.email}</p>}
          </div>

          <div className="auth-field">
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-label="비밀번호"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
            />
            {fieldErrors.password && <p className="auth-field-error">{fieldErrors.password}</p>}
          </div>
        </div>

        <button type="submit" className="auth-submit" disabled={isSubmitting}>
          {isSubmitting ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className="auth-links-row">
        <button
          type="button"
          className="auth-link-muted"
          onClick={() => setFormError("비밀번호 찾기는 아직 준비 중입니다.")}
        >
          비밀번호 찾기
        </button>
        <Link to="/signup" className="auth-link-primary">
          회원가입
        </Link>
      </div>
    </AuthLayout>
  );
}
