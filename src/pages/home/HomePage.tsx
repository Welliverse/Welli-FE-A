import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import welliLogo from "@/assets/welli-logo.svg";
import characterWave from "@/assets/character-wave.png";
import { BellIcon, MoonIcon } from "@/pages/home/HomeIcons";
import HomeToolbar from "@/pages/home/HomeToolbar";
import ConditionCard from "@/pages/home/ConditionCard";
import RoutineCard from "@/pages/home/RoutineCard";
import NextLevelCard from "@/pages/home/NextLevelCard";
import { mockCondition, mockRoutines, mockLevel, mockDailyMessage } from "@/pages/home/homeMockData";
import { TIME_BACKGROUNDS, getTimeOfDay } from "@/pages/home/timeOfDay";
import "@/pages/home/home.css";

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [notice, setNotice] = useState<string | null>(null);
  const [routines, setRoutines] = useState(mockRoutines);
  const timeOfDay = getTimeOfDay();

  function showNotReady() {
    setNotice("아직 준비 중인 화면이에요.");
    window.setTimeout(() => setNotice(null), 1500);
  }

  function toggleRoutine(id: string) {
    setRoutines((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  }

  return (
    <div className={`home-page home-page--${timeOfDay}`}>
      <div className="home-bg" aria-hidden="true">
        <img src={TIME_BACKGROUNDS[timeOfDay]} alt="" />
      </div>
      <header className="home-header">
        <img src={welliLogo} alt="Welli" className="home-logo" />
        <div className="home-header-actions">
          {timeOfDay === "night" && <MoonIcon />}
          <button type="button" className="home-icon-btn" aria-label="알림" onClick={showNotReady}>
            <BellIcon />
          </button>
        </div>
      </header>

      <button type="button" className="home-message-bubble" onClick={() => navigate("/home/report")}>
        {mockDailyMessage}
      </button>

      <button type="button" className="home-character" onClick={() => navigate("/home/report")}>
        <img src={characterWave} alt={user?.nickname ?? "웰리"} />
      </button>

      {notice && <p className="home-toast">{notice}</p>}

      <div className="home-cards">
        <ConditionCard data={mockCondition} />
        <RoutineCard items={routines} onToggle={toggleRoutine} onViewAll={showNotReady} />
        <NextLevelCard data={mockLevel} />
      </div>

      <div className="home-toolbar-wrap">
        <HomeToolbar
          active="home"
          onSelect={(key) => {
            if (key === "record") navigate("/record");
            else if (key === "routine") navigate("/routine");
            else if (key === "my") navigate("/mypage");
          }}
        />
      </div>
    </div>
  );
}
