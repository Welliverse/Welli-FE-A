import { useNavigate } from "react-router-dom";
import mascotSuccess from "@/assets/mascots/mascot-levelup-success.png";
import "@/pages/routine/routine.css";

// 레벨업-2.png: 오늘의 루틴을 전부 완료했을 때 보여주는 결과 화면.
export default function RoutineCompletePage() {
  const navigate = useNavigate();

  return (
    <div className="page levelup-page levelup-page--success">
      <h1 className="levelup-title">오늘의 루틴 완료!</h1>
      <img src={mascotSuccess} alt="" className="levelup-mascot" />
      <div className="levelup-bottom">
        <p className="levelup-desc">오늘도 잘 해냈어요!</p>
        <span className="levelup-reward-badge">🌟 +100XP</span>
      </div>
      <button type="button" className="primary-button" style={{ width: "100%" }} onClick={() => navigate("/routine")}>
        확인
      </button>
    </div>
  );
}
