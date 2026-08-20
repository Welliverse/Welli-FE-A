import { useLocation, useNavigate } from "react-router-dom";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { BASE_URL } from "@/api/client";
import type { HealthRecord } from "@/api/records";
import skinThumb1 from "@/assets/icons/skin-thumb-1.png";
import skinMoisture from "@/assets/icons/skin-moisture.png";
import skinOil from "@/assets/icons/skin-oil.png";
import skinTexture from "@/assets/icons/skin-texture.png";
import skinSpots from "@/assets/icons/skin-spots.png";
import skinElasticity from "@/assets/icons/skin-elasticity.png";
import "@/pages/record/skin/skin.css";

// BE에 피부 사진 AI 분석(수분/유분/잡티 등 세부 점수) 엔드포인트가 없음 — POST /records/skin-photo는
// 사진 저장만 하고 HealthRecordResponse.value에 분석 결과를 담아 돌려주지 않는다.
// 사진은 실제 업로드분(SkinRecordPage에서 넘어온 record.photoUrl)이고, 아래 세부 점수는 여전히 데모용 정적 값.
const DETAILS = [
  { key: "moisture", icon: skinMoisture, label: "수분", percent: 78, status: "양호", tone: "good" as const },
  { key: "oil", icon: skinOil, label: "유분", percent: 58, status: "보통", tone: "neutral" as const },
  { key: "texture", icon: skinTexture, label: "피부결", percent: 60, status: "보통", tone: "neutral" as const },
  { key: "spots", icon: skinSpots, label: "잡티", percent: 40, status: "주의", tone: "bad" as const },
  { key: "elasticity", icon: skinElasticity, label: "탄력", percent: 62, status: "보통", tone: "neutral" as const },
];

const CARE_TAGS = ["미백 케어", "자외선 차단", "수분 보충", "피부결 케어"];

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}. ${pad(d.getMonth() + 1)}. ${pad(d.getDate())} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function SkinResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const record = (location.state as { record?: HealthRecord } | null)?.record;
  const photoSrc = record?.photoUrl ? `${BASE_URL}${record.photoUrl}` : skinThumb1;
  const dateLabel = record ? formatDateTime(record.recordedAt) : "2026. 05. 10 · 09:41";

  return (
    <div className="page">
      <DetailHeader title="분석 결과" />

      <div className="page-content">
        <p className="skin-result-date">{dateLabel}</p>

        <div className="card skin-result-header">
          <img src={photoSrc} alt="" className="skin-result-thumb" />
          <div>
            <p className="skin-result-score-label">종합 피부 점수</p>
            <p className="skin-result-score">
              72 <small>/ 100</small>
            </p>
            <p className="skin-result-score-tag">보통</p>
            <p className="skin-result-score-desc">피부 관리가 필요한 상태예요.</p>
          </div>
        </div>

        <section>
          <h2 className="page-section-title" style={{ marginBottom: 10 }}>
            세부 분석 결과
          </h2>
          <div className="card skin-detail-list">
            {DETAILS.map((detail) => (
              <div className="skin-detail-row" key={detail.key}>
                <img src={detail.icon} alt="" className="skin-detail-icon" />
                <span className="skin-detail-label">{detail.label}</span>
                <div className="skin-detail-track">
                  <div className={`skin-detail-fill skin-detail-fill--${detail.tone}`} style={{ width: `${detail.percent}%` }} />
                </div>
                <span className={`skin-detail-status skin-detail-status--${detail.tone}`}>{detail.status}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="skin-comment-card">
          <p className="skin-comment-title">AI 코멘트</p>
          <p className="skin-comment-desc">
            피부결은 전반적으로 양호하지만, 잡티가 다소 관찰돼요.
            <br />
            자외선 차단과 미백 케어를 함께 관리해보세요.
          </p>
        </div>

        <section>
          <h2 className="page-section-title" style={{ marginBottom: 10 }}>
            추천 케어
          </h2>
          <div className="skin-care-tags">
            {CARE_TAGS.map((tag) => (
              <span className="skin-care-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </section>

        <button type="button" className="primary-button" onClick={() => navigate("/record")}>
          분석 기록 저장
        </button>
      </div>
    </div>
  );
}
