import type { ConditionData, ConditionStat } from "@/pages/home/homeMockData";

function StatBar({ stat }: { stat: ConditionStat }) {
  return (
    <div className="condition-row">
      <span className="condition-label">{stat.label}</span>
      <div className="condition-track">
        <div className="condition-fill" style={{ width: `${stat.value}%` }} />
      </div>
    </div>
  );
}

export default function ConditionCard({ data }: { data: ConditionData }) {
  return (
    <div className="home-card condition-card">
      <p className="condition-title">
        현재 컨디션 {data.status} {data.emoji}
      </p>
      <div className="condition-stats">
        {data.stats.map((stat) => (
          <StatBar key={stat.label} stat={stat} />
        ))}
      </div>
    </div>
  );
}
