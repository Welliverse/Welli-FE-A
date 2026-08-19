import { CheckIcon, ChevronRightIcon } from "@/pages/home/HomeIcons";
import type { RoutineItem } from "@/pages/home/homeMockData";

interface RoutineCardProps {
  items: RoutineItem[];
  onViewAll: () => void;
}

export default function RoutineCard({ items, onViewAll }: RoutineCardProps) {
  return (
    <div className="home-card routine-card">
      <div className="routine-header">
        <p className="routine-title">오늘의 맞춤 루틴</p>
        <button type="button" className="routine-view-all" onClick={onViewAll}>
          전체보기 <ChevronRightIcon size={12} />
        </button>
      </div>
      <ul className="routine-list">
        {items.map((item) => (
          <li key={item.id} className="routine-item">
            <span className={`routine-check${item.done ? " done" : ""}`}>{item.done && <CheckIcon size={11} />}</span>
            <div className="routine-text">
              <p className="routine-item-title">{item.title}</p>
              <p className="routine-item-subtitle">{item.subtitle}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
