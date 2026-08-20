import { HomeTabIcon, RecordTabIcon, RoutineTabIcon, MyTabIcon } from "@/pages/home/HomeIcons";

const TABS = [
  { key: "home", label: "홈", Icon: HomeTabIcon },
  { key: "record", label: "기록", Icon: RecordTabIcon },
  { key: "routine", label: "루틴", Icon: RoutineTabIcon },
  { key: "my", label: "마이", Icon: MyTabIcon },
] as const;

interface HomeToolbarProps {
  active: string;
  onSelect: (key: string) => void;
}

export default function HomeToolbar({ active, onSelect }: HomeToolbarProps) {
  return (
    <nav className="home-toolbar">
      {TABS.map(({ key, label, Icon }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            type="button"
            className={`home-toolbar-tab${isActive ? " active" : ""}`}
            onClick={() => onSelect(key)}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
