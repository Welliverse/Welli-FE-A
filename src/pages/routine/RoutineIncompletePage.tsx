import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import mascotFail from "@/assets/mascots/mascot-levelup-fail.png";
import "@/pages/home/home.css";
import "@/pages/routine/routine.css";

const STEP_DELAY_MS = 1800;

// 레벨업.png -> 레벨업-1.png: 루틴을 다 못했을 때 순서대로 보여주는 2단계 결과 화면.
export default function RoutineIncompletePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (step !== 0) return;
    const timer = window.setTimeout(() => setStep(1), STEP_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [step]);

  function handleSetReminder() {
    setNotice("내일 알림이 설정되었어요.");
    window.setTimeout(() => navigate("/routine"), 1200);
  }

  return (
    <div className="page levelup-page levelup-page--fail">
      <h1 className="levelup-title">루틴 미실천</h1>
      <img src={mascotFail} alt="" className="levelup-mascot" />

      {step === 0 ? (
        <div className="levelup-bottom">
          <p className="levelup-desc">
            오늘 루틴을 놓쳤어요
            <br />
            컨디션이 조금 낮아졌어요
          </p>
          <div className="levelup-xp-card">
            <div>
              <p className="levelup-xp-label">다음 단계까지</p>
              <p className="levelup-xp-text">100 / 1,200 EXP</p>
            </div>
            <div className="levelup-xp-col-right">
              <span className="levelup-xp-badge">Lv.13</span>
              <p className="levelup-xp-stage">지친 강아지</p>
            </div>
            <div className="levelup-xp-progress-track">
              <div className="levelup-xp-progress-fill" style={{ width: "8%" }} />
            </div>
          </div>
        </div>
      ) : (
        <div className="levelup-bottom">
          <p className="levelup-desc">
            내일은 함께 다시
            <br />
            시작해봐요!
          </p>
          <button type="button" className="primary-button" style={{ width: "100%" }} onClick={handleSetReminder}>
            🔔 내일 알림 설정
          </button>
          {notice && <p className="home-toast">{notice}</p>}
        </div>
      )}
    </div>
  );
}
