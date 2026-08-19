import { useNavigate } from "react-router-dom";
import mascotGrow from "@/assets/mascots/mascot-report-levelup.png";
import "@/pages/report/report.css";

// 레벨업3.png: 분석 결과 확인 후 캐릭터가 한 단계 성장했음을 보여주는 화면.
export default function ReportLevelUpPage() {
  const navigate = useNavigate();

  return (
    <div className="page report-levelup-page">
      <h1 className="report-levelup-title">캐릭터가 성장했어요!</h1>
      <img src={mascotGrow} alt="" className="report-levelup-mascot" />
      <div className="report-levelup-bottom">
        <p className="report-levelup-desc">
          새로운 모습으로
          <br />
          한 단계 성장했어요!
        </p>
        <button type="button" className="report-levelup-button" onClick={() => navigate("/mypage")}>
          LEVEL UP ↑
        </button>
      </div>
    </div>
  );
}
