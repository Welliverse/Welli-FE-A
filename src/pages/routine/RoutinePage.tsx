import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { WeekNav } from "@/components/layout/WeekNav";
import HomeToolbar from "@/pages/home/HomeToolbar";
import { addDays, formatMonthDay } from "@/pages/history/dateUtils";
import waterIcon from "@/assets/icons/water.png";
import sleepIcon from "@/assets/icons/sleep.png";
import exerciseIcon from "@/assets/icons/exercise.png";
import emotionIcon from "@/assets/icons/emotion.png";
import "@/pages/home/home.css";
import "@/pages/routine/routine.css";

interface RoutineItem {
  key: string;
  icon: string;
  title: string;
  subtitle: string;
  done: boolean;
}

const INITIAL_ROUTINES: RoutineItem[] = [
  { key: "water", icon: waterIcon, title: "수분 섭취", subtitle: "물 2L 마시기", done: false },
  { key: "sleep", icon: sleepIcon, title: "수면 습관", subtitle: "11시 전에 잠들기", done: true },
  { key: "exercise", icon: exerciseIcon, title: "가벼운 운동", subtitle: "30분 걷기", done: false },
  { key: "emotion", icon: emotionIcon, title: "마음챙김", subtitle: "명상 10분 하기", done: false },
];

// 맞춤 루틴 탭: 오늘의 추천 루틴 목록. 배지를 눌러 완료 여부를 토글하고,
// 하단 버튼으로 완료/미완료 결과 화면(레벨업 · 루틴 미실천)으로 이동.
export default function RoutinePage() {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState(INITIAL_ROUTINES);
  const [day, setDay] = useState(() => new Date());

  const doneCount = routines.filter((r) => r.done).length;
  const dayLabel = useMemo(() => formatMonthDay(day), [day]);

  function toggleDone(key: string) {
    setRoutines((prev) => prev.map((r) => (r.key === key ? { ...r, done: !r.done } : r)));
  }

  function handleCheckResult() {
    navigate(doneCount === routines.length ? "/routine/complete" : "/routine/incomplete");
  }

  return (
    <div className="page">
      <DetailHeader title="맞춤 루틴" />

      <div className="page-content routine-content">
        <WeekNav label={dayLabel} onPrev={() => setDay((prev) => addDays(prev, -1))} onNext={() => setDay((prev) => addDays(prev, 1))} />

        <h2 className="page-section-title">오늘의 추천 루틴</h2>

        <div className="routine-list">
          {routines.map((routine) => (
            <div className="routine-card" key={routine.key}>
              <img src={routine.icon} alt="" className="routine-card-icon" />
              <div className="routine-card-text">
                <p className="routine-card-title">{routine.title}</p>
                <p className="routine-card-subtitle">{routine.subtitle}</p>
              </div>
              <button
                type="button"
                className={`routine-card-badge ${routine.done ? "routine-card-badge--done" : ""}`}
                onClick={() => toggleDone(routine.key)}
                aria-pressed={routine.done}
                aria-label={`${routine.title} 완료 여부`}
              >
                {routine.done ? "✓" : <>🪙 +100XP</>}
              </button>
            </div>
          ))}
        </div>

        <button type="button" className="primary-button" onClick={handleCheckResult}>
          오늘 루틴 확인하기
        </button>
      </div>

      <div className="home-toolbar-wrap">
        <HomeToolbar
          active="routine"
          onSelect={(key) => {
            if (key === "home") navigate("/home");
            else if (key === "record") navigate("/record");
            else if (key === "my") navigate("/mypage");
          }}
        />
      </div>
    </div>
  );
}
