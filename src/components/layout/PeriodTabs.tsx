import { useState } from "react";
import "@/components/layout/layout.css";

const PERIODS = ["주간", "월간", "연간"] as const;
export type Period = (typeof PERIODS)[number];

interface PeriodTabsProps {
  value?: Period;
  onChange?: (period: Period) => void;
  /** 실제로 클릭 가능하게 둘 기간. 나머지는 데이터가 없어 비활성 처리. 기본값은 주간만 활성화. */
  enabledPeriods?: Period[];
}

// 주간/월간/연간 토글. enabledPeriods에 없는 기간은 데이터가 없어 비활성 처리.
export function PeriodTabs({ value = "주간", onChange, enabledPeriods = ["주간"] }: PeriodTabsProps) {
  const [selected, setSelected] = useState<Period>(value);

  return (
    <div className="period-tabs">
      {PERIODS.map((period) => (
        <button
          key={period}
          type="button"
          className={`period-tab ${selected === period ? "period-tab--active" : ""}`}
          disabled={!enabledPeriods.includes(period)}
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
