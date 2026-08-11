import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

// FE-A 담당 홈 화면 placeholder. 캐릭터 상태 시각화 + 오늘의 추천 루틴 요약은 다음 작업에서 구현.
export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div style={{ padding: 32 }}>
      <h1>홈 (placeholder)</h1>
      <p>{user?.email}님 환영합니다.</p>
      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        로그아웃
      </button>
    </div>
  );
}
