import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import mascotScan from "@/assets/mascots/mascot-report-scan.png";
import "@/pages/report/report.css";

// AI 분석 로딩중.png: 기록을 모아 AI가 분석하는 동안 보여주는 진행률 화면.
export default function ReportLoadingPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tick = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 100));
    }, 180);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    // 이 화면을 히스토리에 남기면 뒤로가기 시 다시 진행률이 돌며 결과로 튕겨나가므로 replace로 넘어간다.
    const timeout = setTimeout(() => navigate("/report/result", { replace: true }), 400);
    return () => clearTimeout(timeout);
  }, [progress, navigate]);

  return (
    <div className="page report-loading-page">
      <div className="report-loading-head">
        <h1 className="report-loading-title">AI가 분석하고 있어요</h1>
        <p className="report-loading-subtitle">조금만 기다려 주세요!</p>
      </div>

      <img src={mascotScan} alt="" className="report-loading-mascot" />

      <div className="report-loading-progress">
        <p className="report-loading-progress-label">기록을 연결하는 중...</p>
        <div className="report-progress-row">
          <div className="report-progress-track">
            <div className="report-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="report-progress-percent">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
