import { useNavigate } from "react-router-dom";

// FE-A 담당 온보딩 화면 placeholder. 나이·성별·건강 목표 입력 폼(FR-02)은 다음 작업에서 구현.
export default function OnboardingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 32 }}>
      <h1>온보딩 (placeholder)</h1>
      <p>기초 정보 입력 폼은 다음 작업에서 구현됩니다.</p>
      <button onClick={() => navigate("/home")}>홈으로 이동</button>
    </div>
  );
}
