export function validateEmail(email: string): string | null {
  if (!email.trim()) return "이메일을 입력해주세요.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "올바른 이메일 형식이 아닙니다.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "비밀번호를 입력해주세요.";
  if (password.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
  return null;
}

export function validateNickname(nickname: string): string | null {
  if (!nickname.trim()) return "닉네임을 입력해주세요.";
  if (nickname.trim().length > 20) return "닉네임은 20자 이내로 입력해주세요.";
  return null;
}
