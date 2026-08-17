import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import "@/pages/home/home.css";

// 임시 홈 화면 — 캐릭터 상태 시각화, 오늘의 추천 루틴 등 실제 디자인은 다음 작업에서 교체 예정.
export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <p className="home-greeting">{user?.nickname ?? "회원"}님, 안녕하세요 👋</p>
        <button type="button" className="home-logout" onClick={handleLogout}>
          로그아웃
        </button>
      </header>

      <section className="home-card">
        <p className="home-card-title">캐릭터</p>
        <p className="home-card-desc">캐릭터 상태 표시는 홈 화면 디자인이 나오면 반영될 예정이에요.</p>
      </section>

      <section className="home-card">
        <p className="home-card-title">오늘의 추천 루틴</p>
        <p className="home-card-desc">기록을 남기면 맞춤 루틴이 여기에 표시돼요.</p>
      </section>
    </div>
  );
}
