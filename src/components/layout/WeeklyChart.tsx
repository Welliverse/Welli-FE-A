import dogFaceGood from "@/assets/icons/dog-face-good.png";
import dogFaceNeutral from "@/assets/icons/dog-face-neutral.png";
import dogFaceBad from "@/assets/icons/dog-face-bad.png";
import "@/components/layout/layout.css";

export type MoodLevel = "good" | "neutral" | "bad";

export interface WeeklyChartDay {
  label: string;
  date: string;
  /** 0~100, 막대 채움 비율 */
  value: number;
  mood: MoodLevel;
}

const MOOD_FACE: Record<MoodLevel, string> = {
  good: dogFaceGood,
  neutral: dogFaceNeutral,
  bad: dogFaceBad,
};

interface WeeklyChartProps {
  days: WeeklyChartDay[];
  legend?: [string, string, string];
}

// 주간 기록(수분/감정/수면/운동/식사) 화면에서 공통으로 쓰는 요일별 막대 차트.
export function WeeklyChart({ days, legend = ["매우 좋음", "보통", "부족"] }: WeeklyChartProps) {
  return (
    <div>
      <div className="weekly-chart">
        {days.map((day) => (
          <div className="weekly-chart-col" key={day.date}>
            <div className={`weekly-chart-track weekly-chart-track--${day.mood}`}>
              <div className="weekly-chart-fill" style={{ height: `${day.value}%` }} />
              <img src={MOOD_FACE[day.mood]} alt={day.mood} className="weekly-chart-face" />
            </div>
            <span className="weekly-chart-day">{day.label}</span>
            <span className="weekly-chart-date">{day.date}</span>
          </div>
        ))}
      </div>
      <div className="weekly-chart-legend">
        <span>
          <img src={dogFaceGood} alt="" /> {legend[0]}
        </span>
        <span>
          <img src={dogFaceNeutral} alt="" /> {legend[1]}
        </span>
        <span>
          <img src={dogFaceBad} alt="" /> {legend[2]}
        </span>
      </div>
    </div>
  );
}
