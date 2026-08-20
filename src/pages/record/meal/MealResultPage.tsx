import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { recordsApi } from "@/api/records";
import { ApiError } from "@/api/client";
import "@/pages/record/meal/meal.css";

// BE에 식사 사진 AI 분석 엔드포인트가 없음(생성/영양분 인식 불가, 업로드 API도 skin-photo 전용) —
// 아래 메뉴명/칼로리/영양성분은 여전히 데모용 정적 값. 사진은 캡처한 실제 파일을 미리보기로만 보여주고,
// 서버에는 POST /records(type: MEAL)로 이 값들을 그대로 기록한다.
const NUTRIENTS = [
  { label: "탄수화물", value: "18g", percent: "6%" },
  { label: "단백질", value: "22g", percent: "40%" },
  { label: "지방", value: "18g", percent: "33%" },
  { label: "식이섬유", value: "4g", percent: "16%" },
];

export default function MealResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const file = (location.state as { file?: File } | null)?.file;
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function handleSave() {
    setError(null);
    setIsSubmitting(true);
    try {
      await recordsApi.create("MEAL", {
        foodName: "소고기 샐러드",
        calories: 320,
        nutrients: NUTRIENTS,
      });
      navigate("/record");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page">
      <DetailHeader title="분석 결과" />

      <div className="page-content">
        <div className="card meal-result-header">
          {previewUrl ? (
            <img src={previewUrl} alt="" className="meal-result-thumb-img" />
          ) : (
            <span className="meal-result-thumb">🥗</span>
          )}
          <div>
            <p className="meal-result-tag">AI 분석 결과</p>
            <h2 className="meal-result-title">소고기 샐러드</h2>
            <p className="meal-result-desc">신선한 채소와 구운 소고기가 들어간 샐러드예요.</p>
            <span className="meal-result-similarity">유사도 96%</span>
          </div>
        </div>

        <div className="card">
          <div className="meal-calorie-head">
            <h2 className="page-section-title">총 칼로리</h2>
            <span className="meal-status-badge meal-status-badge--neutral">● 보통</span>
          </div>
          <p className="meal-calorie-value">
            320 <small>kcal</small>
          </p>
          <p className="meal-calorie-caption">1일 권장 섭취량의 16%</p>
          <div className="meal-progress-track">
            <div className="meal-progress-fill" style={{ width: "16%" }} />
          </div>
        </div>

        <section>
          <div className="meal-nutrient-head">
            <h2 className="page-section-title">영양 성분</h2>
            <span className="meal-nutrient-caption">1인분 기준</span>
          </div>
          <div className="meal-nutrient-grid">
            {NUTRIENTS.map((n) => (
              <div className="meal-nutrient-card" key={n.label}>
                <span className="meal-nutrient-label">{n.label}</span>
                <span className="meal-nutrient-value">{n.value}</span>
                <span className="meal-nutrient-percent">({n.percent})</span>
              </div>
            ))}
          </div>
          <p className="meal-nutrient-footnote">( ) : 1일 권장 섭취량 대비 비율</p>
        </section>

        <section>
          <h2 className="page-section-title" style={{ marginBottom: 10 }}>
            영양 상태
          </h2>
          <div className="card meal-status-card">
            <span className="meal-status-emoji">🙂</span>
            <div>
              <p className="meal-status-title">균형 잡힌 식사!</p>
              <p className="meal-status-desc">단백질과 식이섬유가 풍부하고 영양 균형이 좋은 식사예요.</p>
            </div>
          </div>
        </section>

        <div className="meal-tip-banner">
          <p className="meal-tip-title">🍴 더 건강하게 즐기는 팁</p>
          <ul>
            <li>드레싱 양을 조절하면 칼로리를 낮출 수 있어요.</li>
            <li>통곡물이나 고구마를 추가하면 포만감이 더 오래가요.</li>
          </ul>
        </div>

        {error && <p className="record-error">{error}</p>}
        <button type="button" className="primary-button" disabled={isSubmitting} onClick={handleSave}>
          {isSubmitting ? "저장하는 중..." : "점심 기록 저장"}
        </button>
      </div>
    </div>
  );
}
