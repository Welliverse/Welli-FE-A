import { useNavigate } from "react-router-dom";
import { DetailHeader } from "@/components/layout/DetailHeader";
import dogFaceWink from "@/assets/icons/dog-face-wink.png";
import "@/pages/report/report.css";

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

  return (
    <div className="page">
      <DetailHeader title="AI 건강 분석" />

      <div className="page-content">
        <div className="card report-score-card">
          <p className="report-score-label">종합 점수</p>
          <p className="report-score-value">
            82<small> / 100</small>
          </p>
          <p className="report-score-delta">
            지난주 대비 <strong>+8</strong>
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
            수면 점수가 개선되고 있어요!
            <br />
            꾸준히 유지하면 더 좋아질 거예요 😌
          </p>
        </div>

        <button type="button" className="primary-button" onClick={() => navigate("/report/levelup")}>
          확인
        </button>
      </div>
    </div>
  );
}
