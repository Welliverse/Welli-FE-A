import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { WeekNav } from "@/components/layout/WeekNav";
import HomeToolbar from "@/pages/home/HomeToolbar";
import { addDays, formatMonthDay } from "@/pages/history/dateUtils";
import { routineApi, ROUTINE_DISPLAY, type Routine, type RoutineType } from "@/api/routines";
import waterIcon from "@/assets/icons/water.png";
import sleepIcon from "@/assets/icons/sleep.png";
import exerciseIcon from "@/assets/icons/exercise.png";
import emotionIcon from "@/assets/icons/emotion.png";
import skinIcon from "@/assets/icons/skin.png";
import mealIcon from "@/assets/icons/meal.png";
import "@/pages/home/home.css";
import "@/pages/routine/routine.css";

const ROUTINE_ICON: Record<RoutineType, string> = {
  WATER: waterIcon,
  SLEEP: sleepIcon,
  EXERCISE: exerciseIcon,
  MEDITATION: emotionIcon,
  SKINCARE: skinIcon,
  DIET: mealIcon,
};

// 맞춤 루틴 탭: 오늘의 추천 루틴 목록. 배지를 눌러 완료 처리하고(완료는 되돌릴 수 없음 — BE에
// 완료 취소 API가 없음), 하단 버튼으로 완료/미완료 결과 화면(레벨업 · 루틴 미실천)으로 이동.
export default function RoutinePage() {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const [day, setDay] = useState(() => new Date());

  useEffect(() => {
    routineApi
      .getRecommendations()
      .then(setRoutines)
      .catch(() => setRoutines([]));
  }, []);

  const doneCount = routines.filter((r) => r.completed).length;
  const dayLabel = useMemo(() => formatMonthDay(day), [day]);

  async function handleToggle(routine: Routine) {
    if (routine.completed || completingId !== null) return;
    setCompletingId(routine.routineId);
    try {
      const updated = await routineApi.complete(routine.routineId);
      setRoutines((prev) => prev.map((r) => (r.routineId === updated.routineId ? updated : r)));
    } catch {
      // 완료 처리 실패는 조용히 무시 — 배지가 미완료 상태로 남아 다시 시도할 수 있음.
    } finally {
      setCompletingId(null);
    }
  }

  function handleCheckResult() {
    navigate(routines.length > 0 && doneCount === routines.length ? "/routine/complete" : "/routine/incomplete");
  }

  return (
    <div className="page">
      <DetailHeader title="맞춤 루틴" />

      <div className="page-content routine-content">
        <WeekNav label={dayLabel} onPrev={() => setDay((prev) => addDays(prev, -1))} onNext={() => setDay((prev) => addDays(prev, 1))} />

        <h2 className="page-section-title">오늘의 추천 루틴</h2>

        <div className="routine-list">
          {routines.map((routine) => {
            const display = ROUTINE_DISPLAY[routine.routineType];
            return (
              <div className="routine-card" key={routine.routineId}>
                <img src={ROUTINE_ICON[routine.routineType]} alt="" className="routine-card-icon" />
                <div className="routine-card-text">
                  <p className="routine-card-title">{display.title}</p>
                  <p className="routine-card-subtitle">{display.subtitle}</p>
                </div>
                <button
                  type="button"
                  className={`routine-card-badge ${routine.completed ? "routine-card-badge--done" : ""}`}
                  onClick={() => handleToggle(routine)}
                  disabled={completingId === routine.routineId}
                  aria-pressed={routine.completed}
                  aria-label={`${display.title} 완료 여부`}
                >
                  {routine.completed ? "✓" : <>🪙 +5 EXP</>}
                </button>
              </div>
            );
          })}
        </div>

        <button type="button" className="primary-button" disabled={routines.length === 0} onClick={handleCheckResult}>
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
