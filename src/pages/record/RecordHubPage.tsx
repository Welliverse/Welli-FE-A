import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeToolbar from "@/pages/home/HomeToolbar";
import { DateChip } from "@/components/layout/DateChip";
import { formatMonthDay } from "@/pages/history/dateUtils";
import skinIcon from "@/assets/icons/skin.png";
import sleepIcon from "@/assets/icons/sleep.png";
import waterIcon from "@/assets/icons/water.png";
import emotionIcon from "@/assets/icons/emotion.png";
import exerciseIcon from "@/assets/icons/exercise.png";
import mealIcon from "@/assets/icons/meal.png";
import "@/pages/home/home.css";
import "@/pages/record/record-hub.css";

interface RecordCategory {
  key: string;
  label: string;
  icon: string;
  path: string;
}

const CATEGORIES: RecordCategory[] = [
  { key: "skin", label: "피부", icon: skinIcon, path: "/record/skin" },
  { key: "sleep", label: "수면", icon: sleepIcon, path: "/record/sleep" },
  { key: "water", label: "물", icon: waterIcon, path: "/record/water" },
  { key: "emotion", label: "감정", icon: emotionIcon, path: "/record/emotion" },
  { key: "exercise", label: "운동", icon: exerciseIcon, path: "/record/exercise" },
  { key: "meal", label: "식사", icon: mealIcon, path: "/record/meal" },
];

const DEFAULT_DONE_KEYS = ["skin", "sleep", "water", "emotion"];

// 오늘 기록 허브: 6개 기록 카테고리를 선택해 각 상세 기록 화면으로 진입. 체크 배지는 사용자가 직접 토글 가능.
export default function RecordHubPage() {
  const navigate = useNavigate();
  const [doneKeys, setDoneKeys] = useState<Set<string>>(() => new Set(DEFAULT_DONE_KEYS));
  const todayLabel = useMemo(() => `${formatMonthDay(new Date())} · 오늘`, []);

  function toggleDone(key: string) {
    setDoneKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="page">
      <div className="page-content record-hub-content">
        <div className="record-hub-heading">
          <div>
            <h1 className="record-hub-title">오늘 기록</h1>
            <p className="record-hub-subtitle">기록할 항목을 선택해주세요</p>
          </div>
          <span className="record-hub-badge">
            {doneKeys.size}/{CATEGORIES.length} <b>완료</b>
          </span>
        </div>

        <DateChip label={todayLabel} />

        <div className="record-hub-grid">
          {CATEGORIES.map((category) => {
            const done = doneKeys.has(category.key);
            return (
              <div
                key={category.key}
                className={`record-hub-card ${done ? "record-hub-card--done" : ""}`}
                onClick={() => navigate(category.path)}
              >
                <button
                  type="button"
                  className={`record-hub-check ${done ? "record-hub-check--done" : ""}`}
                  aria-pressed={done}
                  aria-label={`${category.label} 기록 완료 여부`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDone(category.key);
                  }}
                >
                  {done ? "✓" : ""}
                </button>
                <img src={category.icon} alt="" className="record-hub-icon" />
                <span className="record-hub-label">{category.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="home-toolbar-wrap">
        <HomeToolbar
          active="record"
          onSelect={(key) => {
            if (key === "home") navigate("/home");
            else if (key === "routine") navigate("/routine");
            else if (key === "my") navigate("/mypage");
          }}
        />
      </div>
    </div>
  );
}
