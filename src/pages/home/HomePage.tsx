import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import welliLogo from "@/assets/welli-logo.svg";
import characterWave from "@/assets/character-wave.png";
import homeBackground from "@/assets/home-background.png";
import { BellIcon } from "@/pages/home/HomeIcons";
import HomeCarousel from "@/pages/home/HomeCarousel";
import HomeToolbar from "@/pages/home/HomeToolbar";
import ConditionCard from "@/pages/home/ConditionCard";
import RoutineCard from "@/pages/home/RoutineCard";
import NextLevelCard from "@/pages/home/NextLevelCard";
import { mockCondition, mockRoutines, mockLevel } from "@/pages/home/homeMockData";
import "@/pages/home/home.css";

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [notice, setNotice] = useState<string | null>(null);

  function showNotReady() {
    setNotice("아직 준비 중인 화면이에요.");
    window.setTimeout(() => setNotice(null), 1500);
  }

  return (
    <div className="home-page">
      <div className="home-bg" aria-hidden="true">
        <img src={homeBackground} alt="" />
      </div>
      <header className="home-header">
        <img src={welliLogo} alt="Welli" className="home-logo" />
        <div className="home-header-actions">
          <button type="button" className="home-icon-btn" aria-label="알림" onClick={showNotReady}>
            <BellIcon />
          </button>
        </div>
      </header>

      <div className="home-character">
        <img src={characterWave} alt={user?.nickname ?? "웰리"} />
      </div>

      {notice && <p className="home-toast">{notice}</p>}

      <HomeCarousel
        pages={[
          <ConditionCard key="condition" data={mockCondition} />,
          <RoutineCard key="routine" items={mockRoutines} onViewAll={showNotReady} />,
          <NextLevelCard key="level" data={mockLevel} />,
        ]}
      />

      <div className="home-toolbar-wrap">
        <HomeToolbar
          active="home"
          onSelect={(key) => {
            if (key === "my") navigate("/mypage");
            else if (key !== "home") showNotReady();
          }}
        />
      </div>
    </div>
  );
}
