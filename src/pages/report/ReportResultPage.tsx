import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { analysisApi, type AnalysisResult } from "@/api/analysis";
import dogFaceWink from "@/assets/icons/dog-face-wink.png";
import "@/pages/report/report.css";

// BE 분석 응답(AnalysisResponse)은 conditionScore/conditionDelta/feedbackText 등 종합 값만 주고
// 피부/운동/스트레스/영양/수면처럼 항목별 세부 점수는 내려주지 않는다 — 레이더 차트는 그래서
// 여전히 데모용 정적 값. 종합 점수/증감/코멘트만 실제 응답으로 교체.
const RADAR_AXES = [
  { key: "skin", label: "피부", value: 88 },
  { key: "exercise", label: "운동", value: 78 },
  { key: "stress", label: "스트레스", value: 68 },
  { key: "nutrition", label: "영양", value: 74 },
  { key: "sleep", label: "수면", value: 90 },
];

const CX = 100;
const CY = 96;
const RADIUS = 68;

function axisPoint(index: number, fraction: number) {
  const angle = ((-90 + index * 72) * Math.PI) / 180;
  return { x: CX + RADIUS * fraction * Math.cos(angle), y: CY + RADIUS * fraction * Math.sin(angle) };
}

function ringPoints(fraction: number) {
  return RADAR_AXES.map((_, i) => {
    const { x, y } = axisPoint(i, fraction);
    return `${x},${y}`;
  }).join(" ");
}

function dataPoints() {
  return RADAR_AXES.map((axis, i) => {
    const { x, y } = axisPoint(i, axis.value / 100);
    return `${x},${y}`;
  }).join(" ");
}

export default function ReportResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState<AnalysisResult | null>(
    (location.state as { result?: AnalysisResult } | null)?.result ?? null,
  );

  useEffect(() => {
    if (result) return;
    // 로딩 화면을 거치지 않고 이 페이지로 바로 들어온 경우(예: 새로고침) 최신 분석 결과를 조회.
    analysisApi
      .getLatest()
      .then(setResult)
      .catch(() => {
        // 조회 실패 시 아래 정적 기본값(82/+8/코멘트)이 그대로 보임.
      });
  }, [result]);

  const score = result?.conditionScore ?? 82;
  const delta = result?.conditionDelta ?? 8;
  const comment = result?.feedbackText ?? "수면 점수가 개선되고 있어요!\n꾸준히 유지하면 더 좋아질 거예요 😌";

  return (
    <div className="page">
      <DetailHeader title="AI 건강 분석" />

      <div className="page-content">
        <div className="card report-score-card">
          <p className="report-score-label">종합 점수</p>
          <p className="report-score-value">
            {score}
            <small> / 100</small>
          </p>
          <p className="report-score-delta">
            지난주 대비 <strong>{delta >= 0 ? `+${delta}` : delta}</strong>
          </p>
        </div>

        <div className="card report-radar-card">
          <svg viewBox="0 0 200 190" className="report-radar-chart">
            <defs>
              <linearGradient id="reportRadarFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8b7bff" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#6957e0" stopOpacity="0.55" />
              </linearGradient>
            </defs>

            {[0.33, 0.66, 1].map((fraction) => (
              <polygon key={fraction} points={ringPoints(fraction)} className="report-radar-grid" />
            ))}

            {RADAR_AXES.map((axis, i) => {
              const { x, y } = axisPoint(i, 1);
              return <line key={axis.key} x1={CX} y1={CY} x2={x} y2={y} className="report-radar-axis" />;
            })}

            <polygon points={dataPoints()} className="report-radar-data" />

            {RADAR_AXES.map((axis, i) => {
              const { x, y } = axisPoint(i, 1.26);
              return (
                <text key={axis.key} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="report-radar-label">
                  {axis.label}
                </text>
              );
            })}
          </svg>
        </div>

        <div className="report-comment-card">
          <img src={dogFaceWink} alt="" className="report-comment-avatar" />
          <p className="report-comment-text">
            {comment.split("\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
        </div>

        <button type="button" className="primary-button" onClick={() => navigate("/report/levelup")}>
          확인
        </button>
      </div>
    </div>
  );
}
