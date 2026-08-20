import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeToolbar from "@/pages/home/HomeToolbar";
import { DateChip } from "@/components/layout/DateChip";
import { formatMonthDay } from "@/pages/history/dateUtils";
import { recordsApi, type RecordType } from "@/api/records";
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
  type: RecordType;
}

const CATEGORIES: RecordCategory[] = [
  { key: "skin", label: "피부", icon: skinIcon, path: "/record/skin", type: "SKIN_PHOTO" },
  { key: "sleep", label: "수면", icon: sleepIcon, path: "/record/sleep", type: "SLEEP" },
  { key: "water", label: "물", icon: waterIcon, path: "/record/water", type: "WATER" },
  { key: "emotion", label: "감정", icon: emotionIcon, path: "/record/emotion", type: "STRESS_EMOTION" },
  { key: "exercise", label: "운동", icon: exerciseIcon, path: "/record/exercise", type: "EXERCISE" },
  { key: "meal", label: "식사", icon: mealIcon, path: "/record/meal", type: "MEAL" },
];

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

// 오늘 기록 허브: 6개 기록 카테고리를 선택해 각 상세 기록 화면으로 진입. 체크 배지는 오늘 실제로
// 저장된 기록 유형을 서버에서 조회해 표시한다(더 이상 클릭으로 임의 토글하지 않음).
export default function RecordHubPage() {
  const navigate = useNavigate();
  const [doneKeys, setDoneKeys] = useState<Set<string>>(new Set());
  const todayLabel = useMemo(() => `${formatMonthDay(new Date())} · 오늘`, []);

  useEffect(() => {
    let cancelled = false;
    recordsApi
      .list()
      .then((records) => {
        if (cancelled) return;
        const todaysTypes = new Set(records.filter((r) => isToday(r.recordedAt)).map((r) => r.type));
        const done = new Set(CATEGORIES.filter((c) => todaysTypes.has(c.type)).map((c) => c.key));
        setDoneKeys(done);
      })
      .catch(() => {
        // 목록 조회 실패는 조용히 무시 — 완료 배지가 비어 있는 상태로 남을 뿐 기록 자체는 가능해야 함.
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
                <span
                  className={`record-hub-check ${done ? "record-hub-check--done" : ""}`}
                  aria-label={`${category.label} 기록 ${done ? "완료" : "미완료"}`}
                >
                  {done ? "✓" : ""}
                </span>
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
