import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { PeriodTabs } from "@/components/layout/PeriodTabs";
import { WeekNav } from "@/components/layout/WeekNav";
import { WeeklyChart, type WeeklyChartDay, type MoodLevel } from "@/components/layout/WeeklyChart";
import HomeToolbar from "@/pages/home/HomeToolbar";
import dogFaceGood from "@/assets/icons/dog-face-good.png";
import dogFaceNeutral from "@/assets/icons/dog-face-neutral.png";
import dogFaceBad from "@/assets/icons/dog-face-bad.png";
import "@/pages/home/home.css";
import "@/pages/record/weekly-shared.css";

interface EmotionDay extends WeeklyChartDay {
  note: string;
}

const MOOD_FACE: Record<MoodLevel, string> = {
  good: dogFaceGood,
  neutral: dogFaceNeutral,
  bad: dogFaceBad,
};

const WEEK_DAYS: EmotionDay[] = [
  { label: "일", date: "8/4", value: 90, mood: "good", note: "기분이 좋았어요!" },
  { label: "월", date: "8/5", value: 40, mood: "bad", note: "화가 났어요." },
  { label: "화", date: "8/6", value: 60, mood: "neutral", note: "평온한 하루였어요." },
  { label: "수", date: "8/7", value: 38, mood: "bad", note: "화가 났어요." },
  { label: "목", date: "8/8", value: 88, mood: "good", note: "기분이 좋았어요!" },
  { label: "금", date: "8/9", value: 58, mood: "neutral", note: "평온한 하루였어요." },
  { label: "토", date: "8/10", value: 55, mood: "neutral", note: "평온한 하루였어요." },
];

const GOOD_COUNT = WEEK_DAYS.filter((d) => d.mood === "good").length;
const NEUTRAL_COUNT = WEEK_DAYS.filter((d) => d.mood === "neutral").length;
const BAD_COUNT = WEEK_DAYS.filter((d) => d.mood === "bad").length;

export default function EmotionWeeklyPage() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState<string | null>(null);

  function showNotReady() {
    setNotice("아직 준비 중인 화면이에요.");
    window.setTimeout(() => setNotice(null), 1500);
  }

  return (
    <div className="page">
      <DetailHeader title="주간 감정 기록" />

      <div className="page-content weekly-header">
        <PeriodTabs />
        <WeekNav label="8월 4일 - 8월 10일" />

        <div className="card">
          <WeeklyChart days={WEEK_DAYS} />
        </div>

        <div className="card emotion-summary-card">
          <h2 className="page-section-title">이번 주 요약</h2>
          <div className="emotion-summary-body">
            <div className="emotion-summary-face">
              <img src={dogFaceGood} alt="" />
              <p>
                전반적으로
                <br />
                <b>좋은 한 주였어요!</b>
              </p>
            </div>
            <ul className="emotion-summary-stats">
              <li>
                <span>
                  <span className="emotion-dot emotion-dot--good" /> 좋았던 날
                </span>
                <b>{GOOD_COUNT}일</b>
              </li>
              <li>
                <span>
                  <span className="emotion-dot emotion-dot--neutral" /> 보통이었던 날
                </span>
                <b>{NEUTRAL_COUNT}일</b>
              </li>
              <li>
                <span>
                  <span className="emotion-dot emotion-dot--bad" /> 힘들었던 날
                </span>
                <b>{BAD_COUNT}일</b>
              </li>
            </ul>
          </div>
        </div>

        <section>
          <h2 className="page-section-title" style={{ marginBottom: 12 }}>
            요일별 감정 기록
          </h2>
          <div className="day-mood-list">
            {WEEK_DAYS.map((day) => (
              <div className="day-mood-row" key={day.date}>
                <span className="day-mood-tag">{day.label}</span>
                <img src={MOOD_FACE[day.mood]} alt="" />
                <span className="day-mood-text">{day.note}</span>
              </div>
            ))}
          </div>
        </section>
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
