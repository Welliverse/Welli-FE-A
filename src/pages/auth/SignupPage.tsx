import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/pages/auth/AuthLayout";
import { validateEmail, validateNickname, validatePassword } from "@/pages/auth/validation";
import { authApi } from "@/api/auth";
import { ApiError } from "@/api/client";

interface FieldErrors {
  nickname?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
}

export default function SignupPage() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const errors: FieldErrors = {
      nickname: validateNickname(nickname) ?? undefined,
      email: validateEmail(email) ?? undefined,
      password: validatePassword(password) ?? undefined,
      passwordConfirm:
        password && passwordConfirm !== password ? "비밀번호가 일치하지 않습니다." : undefined,
    };
    setFieldErrors(errors);
    if (errors.nickname || errors.email || errors.password || errors.passwordConfirm) return;

    setIsSubmitting(true);
    try {
      await authApi.signup({ email, password, nickname: nickname.trim() });
      // 회원가입 응답에는 토큰이 없어서 자동 로그인이 불가 — 로그인 화면으로 이동
      navigate("/login", { state: { signupSuccess: true } });
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Welli" subtitle="몇 가지만 입력하면 바로 시작할 수 있어요">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {formError && <p className="auth-form-error">{formError}</p>}

        <div className="auth-field-group">
          <div className="auth-field">
            <input
              id="nickname"
              type="text"
              autoComplete="nickname"
              aria-label="닉네임"
              placeholder="닉네임 입력"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              aria-invalid={Boolean(fieldErrors.nickname)}
            />
            {fieldErrors.nickname && <p className="auth-field-error">{fieldErrors.nickname}</p>}
          </div>

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
              autoComplete="new-password"
              aria-label="비밀번호"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
            />
            {fieldErrors.password && <p className="auth-field-error">{fieldErrors.password}</p>}
          </div>

          <div className="auth-field">
            <input
              id="passwordConfirm"
              type="password"
              autoComplete="new-password"
              aria-label="비밀번호 확인"
              placeholder="비밀번호 확인"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              aria-invalid={Boolean(fieldErrors.passwordConfirm)}
            />
            {fieldErrors.passwordConfirm && <p className="auth-field-error">{fieldErrors.passwordConfirm}</p>}
          </div>
        </div>

        <button type="submit" className="auth-submit" disabled={isSubmitting}>
          {isSubmitting ? "가입하는 중..." : "회원가입"}
        </button>
      </form>

      <p className="auth-switch">
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </p>
    </AuthLayout>
  );
}
