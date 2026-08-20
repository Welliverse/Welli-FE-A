import type { BadgeItem } from "@/pages/home/homeMockData";

export default function BadgeCard({ items }: { items: BadgeItem[] }) {
  return (
    <div className="badge-section">
      <p className="badge-title">획득 배지</p>
      <div className="badge-grid">
        {items.map((badge) => (
          <div className="badge-item" key={badge.id}>
            <img src={badge.icon} alt="" className="badge-icon" />
            <span className="badge-label">{badge.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
