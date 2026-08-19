import type { LevelData } from "@/pages/home/homeMockData";

export default function NextLevelCard({ data }: { data: LevelData }) {
  const percent = Math.min(100, Math.round((data.currentExp / data.maxExp) * 100));

  return (
    <div className="home-card level-card">
      <div className="level-row">
        <div className="level-col">
          <p className="level-title">다음 단계까지</p>
          <p className="level-exp-text">
            {data.currentExp.toLocaleString()} / {data.maxExp.toLocaleString()} EXP
          </p>
        </div>
        <div className="level-col level-col-right">
          <span className="level-badge">Lv.{data.level}</span>
          <p className="level-stage">{data.stageName}</p>
        </div>
      </div>
      <div className="level-progress-track">
        <div className="level-progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
