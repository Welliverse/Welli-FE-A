import { useState } from "react";
import "@/components/layout/layout.css";

const PERIODS = ["주간", "월간", "연간"] as const;
export type Period = (typeof PERIODS)[number];

interface PeriodTabsProps {
  value?: Period;
  onChange?: (period: Period) => void;
}

// 주간/월간/연간 토글. 월간·연간 데이터는 아직 없어 주간만 실제 동작하고 나머지는 비활성 처리.
export function PeriodTabs({ value = "주간", onChange }: PeriodTabsProps) {
  const [selected, setSelected] = useState<Period>(value);

  return (
    <div className="period-tabs">
      {PERIODS.map((period) => (
        <button
          key={period}
          type="button"
          className={`period-tab ${selected === period ? "period-tab--active" : ""}`}
          disabled={period !== "주간"}
          onClick={() => {
            setSelected(period);
            onChange?.(period);
          }}
        >
          {period}
        </button>
      ))}
    </div>
  );
}
