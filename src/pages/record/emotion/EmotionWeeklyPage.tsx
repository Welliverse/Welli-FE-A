import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DetailHeader } from "@/components/layout/DetailHeader";
import { PeriodTabs, type Period } from "@/components/layout/PeriodTabs";
import { WeekNav } from "@/components/layout/WeekNav";
import { WeeklyChart, type WeeklyChartDay, type MoodLevel } from "@/components/layout/WeeklyChart";
import HomeToolbar from "@/pages/home/HomeToolbar";
import { addDays, formatWeekRange, getWeekStart, getWeekdayLabels } from "@/pages/history/dateUtils";
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

// 일~토 요일별 데모 패턴(감정 값/코멘트). 실제 날짜는 이번 주 기준으로 매번 계산됨.
const DAY_PATTERNS: { value: number; mood: MoodLevel; note: string }[] = [
  { value: 90, mood: "good", note: "기분이 좋았어요!" },
  { value: 40, mood: "bad", note: "화가 났어요." },
  { value: 60, mood: "neutral", note: "평온한 하루였어요." },
  { value: 38, mood: "bad", note: "화가 났어요." },
  { value: 88, mood: "good", note: "기분이 좋았어요!" },
  { value: 58, mood: "neutral", note: "평온한 하루였어요." },
  { value: 55, mood: "neutral", note: "평온한 하루였어요." },
];

export default function EmotionWeeklyPage() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("주간");
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));

  const weekLabels = getWeekdayLabels();
  const weekDays: EmotionDay[] = useMemo(
    () =>
      DAY_PATTERNS.map((pattern, i) => {
        const date = addDays(weekStart, i);
        return { label: weekLabels[i], date: `${date.getMonth() + 1}/${date.getDate()}`, ...pattern };
      }),
    [weekStart, weekLabels],
  );

  const goodCount = weekDays.filter((d) => d.mood === "good").length;
  const neutralCount = weekDays.filter((d) => d.mood === "neutral").length;
  const badCount = weekDays.filter((d) => d.mood === "bad").length;

  function showNotReady() {
    setNotice("아직 준비 중인 화면이에요.");
    window.setTimeout(() => setNotice(null), 1500);
  }

  return (
    <div className="page">
      <DetailHeader title="주간 감정 기록" />

      <div className="page-content weekly-header">
        <PeriodTabs value={period} onChange={setPeriod} enabledPeriods={["주간", "월간", "연간"]} />
        {period === "주간" ? (
          <WeekNav
            label={formatWeekRange(weekStart)}
            onPrev={() => setWeekStart((prev) => addDays(prev, -7))}
            onNext={() => setWeekStart((prev) => addDays(prev, 7))}
          />
        ) : (
          <p className="emotion-period-notice">{period} 감정 데이터는 아직 준비 중이에요.</p>
        )}

        <div className="card">
          <WeeklyChart days={weekDays} />
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
                <b>{goodCount}일</b>
              </li>
              <li>
                <span>
                  <span className="emotion-dot emotion-dot--neutral" /> 보통이었던 날
                </span>
                <b>{neutralCount}일</b>
              </li>
              <li>
                <span>
                  <span className="emotion-dot emotion-dot--bad" /> 힘들었던 날
                </span>
                <b>{badCount}일</b>
              </li>
            </ul>
          </div>
        </div>

        <section>
          <h2 className="page-section-title" style={{ marginBottom: 12 }}>
            요일별 감정 기록
          </h2>
          <div className="day-mood-list">
            {weekDays.map((day) => (
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
