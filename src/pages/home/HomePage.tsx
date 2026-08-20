import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import welliLogo from "@/assets/welli-logo.svg";
import characterWave from "@/assets/character-wave.png";
import { BellIcon, MoonIcon } from "@/pages/home/HomeIcons";
import HomeToolbar from "@/pages/home/HomeToolbar";
import ConditionCard from "@/pages/home/ConditionCard";
import RoutineCard from "@/pages/home/RoutineCard";
import NextLevelCard from "@/pages/home/NextLevelCard";
import { mockCondition, mockLevel, mockDailyMessage, type ConditionData, type LevelData, type RoutineItem } from "@/pages/home/homeMockData";
import { routineApi, ROUTINE_DISPLAY } from "@/api/routines";
import { recordsApi, latestOf } from "@/api/records";
import { characterApi } from "@/api/character";
import { MOCK_GOAL_ML } from "@/pages/history/waterHistoryMockData";
import { isSameDay } from "@/pages/history/dateUtils";
import { TIME_BACKGROUNDS, getTimeOfDay } from "@/pages/home/timeOfDay";
import "@/pages/home/home.css";

// BE appearanceState는 텍스트 단계명을 안 주고 값 자체도 NORMAL/GOOD 두 개만 실제로 확인됨 —
// 화면이 깨지지 않도록 프론트에서 라벨만 붙인다. 못 보던 값이 오면 기본 문구로 대체.
const STAGE_NAME: Record<string, string> = {
  NORMAL: "평범한 강아지",
  GOOD: "건강한 강아지",
};

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [notice, setNotice] = useState<string | null>(null);
  const [routines, setRoutines] = useState<RoutineItem[]>([]);
  const [condition, setCondition] = useState<ConditionData>(mockCondition);
  const [level, setLevel] = useState<LevelData>(mockLevel);
  const timeOfDay = getTimeOfDay();

  useEffect(() => {
    routineApi
      .getRecommendations()
      .then((list) =>
        setRoutines(
          list.map((r) => ({
            id: String(r.routineId),
            title: ROUTINE_DISPLAY[r.routineType].title,
            subtitle: ROUTINE_DISPLAY[r.routineType].subtitle,
            done: r.completed,
          })),
        ),
      )
      .catch(() => setRoutines([]));
  }, []);

  useEffect(() => {
    // "수분"/"마음"만 오늘 저장된 실제 WATER/STRESS_EMOTION 기록으로 대체 — 영양/에너지는 BE에
    // 대응할 만한 원시 기록 타입이 없어 mock 유지.
    recordsApi
      .list()
      .then((all) => {
        const todayOf = (type: "WATER" | "STRESS_EMOTION") =>
          all.filter((r) => r.type === type && isSameDay(new Date(r.recordedAt), new Date()));
        const amountMl = Number(latestOf(todayOf("WATER"))?.value.amountMl) || 0;
        const waterValue = Math.min(100, Math.round((amountMl / MOCK_GOAL_ML) * 100));
        const moodValue = Math.min(100, Number(latestOf(todayOf("STRESS_EMOTION"))?.value.moodScore) || 0);
        setCondition((prev) => ({
          ...prev,
          stats: prev.stats.map((s) =>
            s.label === "수분" ? { label: "수분", value: waterValue } : s.label === "마음" ? { label: "마음", value: moodValue } : s,
          ),
        }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // growthScore(0~100)가 EXP, 100이 되면 growthStage가 오르고 growthScore가 리셋되는 구조(BE 담당자 확인).
    characterApi
      .getMe()
      .then((c) => {
        setLevel({
          level: c.growthStage,
          currentExp: c.growthScore,
          maxExp: 100,
          stageName: STAGE_NAME[c.appearanceState] ?? mockLevel.stageName,
        });
      })
      .catch(() => {});
  }, []);

  function showNotReady() {
    setNotice("아직 준비 중인 화면이에요.");
    window.setTimeout(() => setNotice(null), 1500);
  }

  async function toggleRoutine(id: string) {
    const target = routines.find((item) => item.id === id);
    if (!target || target.done) return; // BE에 완료 취소 API가 없어 완료는 되돌릴 수 없음.
    try {
      await routineApi.complete(Number(id));
      setRoutines((prev) => prev.map((item) => (item.id === id ? { ...item, done: true } : item)));
    } catch {
      // 실패 시 조용히 무시 — 배지가 미완료 상태로 남아 다시 시도할 수 있음.
    }
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
        <ConditionCard data={condition} />
        <RoutineCard items={routines} onToggle={toggleRoutine} onViewAll={showNotReady} />
        <NextLevelCard data={level} />
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
