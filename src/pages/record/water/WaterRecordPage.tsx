import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { DateChip } from "@/components/layout/DateChip";
import { MinusIcon, PlusIcon } from "@/components/icons";
import { formatMonthDay } from "@/pages/history/dateUtils";
import { recordsApi } from "@/api/records";
import { ApiError } from "@/api/client";
import waterGlassLarge from "@/assets/icons/water-glass-large.png";
import waterCupHalf from "@/assets/icons/water-cup-half.png";
import waterCupFull from "@/assets/icons/water-cup-full.png";
import waterBottle from "@/assets/icons/water-bottle.png";
import "@/pages/record/water/water.css";

const GOAL_ML = 2000;
const SCALE_MARKS = [2000, 1500, 1000, 500, 0];
const QUICK_ADD = [
  { key: "half", label: "물 반컵", ml: 100, icon: waterCupHalf },
  { key: "full", label: "물 한컵", ml: 250, icon: waterCupFull },
  { key: "bottle", label: "생수 한병", ml: 500, icon: waterBottle },
];

export default function WaterRecordPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(1500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const todayLabel = useMemo(() => `${formatMonthDay(new Date())} · 오늘`, []);

  const nearestMark = useMemo(() => {
    const rounded = Math.round(amount / 500) * 500;
    return Math.min(GOAL_ML, Math.max(0, rounded));
  }, [amount]);

  async function handleSave() {
    setError(null);
    setIsSubmitting(true);
    try {
      await recordsApi.create("WATER", { amountMl: amount });
      navigate("/record");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page">
      <DetailHeader title="물 섭취 기록" onCalendarClick={() => navigate("/history/water")} />

      <div className="page-content">
        <DateChip label={todayLabel} />

        <div className="water-amount">
          <span className="water-amount-value">
            {amount.toLocaleString()} <small>ml</small>
          </span>
          <span className="water-amount-goal">/ {GOAL_ML.toLocaleString()}ml</span>
        </div>

        <div className="water-illustration">
          <img src={waterGlassLarge} alt="물 컵" className="water-illustration-img" />
          <ul className="water-scale">
            {SCALE_MARKS.map((mark) => (
              <li key={mark} className={mark === nearestMark ? "water-scale-mark--active" : undefined}>
                {mark.toLocaleString()}ml
              </li>
            ))}
          </ul>
        </div>

        <section>
          <h2 className="page-section-title water-quick-title">빠르게 추가</h2>
          <div className="water-quick-grid">
            {QUICK_ADD.map((item) => (
              <div className="water-quick-card" key={item.key}>
                <img src={item.icon} alt={item.label} className="water-quick-icon" />
                <span className="water-quick-label">{item.label}</span>
                <span className="water-quick-ml">{item.ml}ml</span>
                <div className="water-quick-actions">
                  <button
                    type="button"
                    className="water-quick-btn water-quick-btn--minus"
                    onClick={() => setAmount((prev) => Math.max(0, prev - item.ml))}
                    aria-label={`${item.label} 빼기`}
                  >
                    <MinusIcon size={16} />
                  </button>
                  <button
                    type="button"
                    className="water-quick-btn water-quick-btn--plus"
                    onClick={() => setAmount((prev) => Math.min(GOAL_ML, prev + item.ml))}
                    aria-label={`${item.label} 추가`}
                  >
                    <PlusIcon size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {error && <p className="record-error">{error}</p>}
        <button type="button" className="primary-button" disabled={isSubmitting} onClick={handleSave}>
          {isSubmitting ? "저장하는 중..." : "물 섭취 기록 저장"}
        </button>
      </div>
    </div>
  );
}
