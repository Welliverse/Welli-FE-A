import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeToolbar from "@/pages/home/HomeToolbar";
import { DateChip } from "@/components/layout/DateChip";
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
  done: boolean;
}

const CATEGORIES: RecordCategory[] = [
  { key: "skin", label: "피부", icon: skinIcon, path: "/record/skin", done: true },
  { key: "sleep", label: "수면", icon: sleepIcon, path: "/record/sleep", done: true },
  { key: "water", label: "물", icon: waterIcon, path: "/record/water", done: true },
  { key: "emotion", label: "감정", icon: emotionIcon, path: "/record/emotion", done: true },
  { key: "exercise", label: "운동", icon: exerciseIcon, path: "/record/exercise", done: false },
  { key: "meal", label: "식사", icon: mealIcon, path: "/record/meal", done: false },
];

// 오늘 기록 허브: 6개 기록 카테고리를 선택해 각 상세 기록 화면으로 진입.
export default function RecordHubPage() {
  const navigate = useNavigate();
  const doneCount = CATEGORIES.filter((c) => c.done).length;
  const [notice, setNotice] = useState<string | null>(null);

  function showNotReady() {
    setNotice("아직 준비 중인 화면이에요.");
    window.setTimeout(() => setNotice(null), 1500);
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
            {doneCount}/{CATEGORIES.length} <b>완료</b>
          </span>
        </div>

        <DateChip label="8월 10일 · 오늘" />

        <div className="record-hub-grid">
          {CATEGORIES.map((category) => (
            <button
              key={category.key}
              type="button"
              className={`record-hub-card ${category.done ? "record-hub-card--done" : ""}`}
              onClick={() => navigate(category.path)}
            >
              {category.done && <span className="record-hub-check">✓</span>}
              <img src={category.icon} alt="" className="record-hub-icon" />
              <span className="record-hub-label">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {notice && <p className="home-toast">{notice}</p>}

      <div className="home-toolbar-wrap">
        <HomeToolbar
          active="record"
          onSelect={(key) => {
            if (key === "home") navigate("/home");
            else if (key === "my") navigate("/mypage");
            else if (key !== "record") showNotReady();
          }}
        />
      </div>
    </div>
  );
}
