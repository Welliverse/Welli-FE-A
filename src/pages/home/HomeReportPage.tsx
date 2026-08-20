import { useNavigate } from "react-router-dom";
import welliLogo from "@/assets/welli-logo.svg";
import characterWave from "@/assets/character-wave.png";
import mascotSad from "@/assets/mascots/mascot-sad.png";
import { BellIcon } from "@/pages/home/HomeIcons";
import NextLevelCard from "@/pages/home/NextLevelCard";
import BadgeCard from "@/pages/home/BadgeCard";
import { mockCondition, mockLevel, mockBadges, mockDailyReport } from "@/pages/home/homeMockData";
import { TIME_BACKGROUNDS, getTimeOfDay } from "@/pages/home/timeOfDay";
import "@/pages/home/home.css";

// 홈2(좋음)/홈3(나쁨): 오늘의 컨디션에 따라 캐릭터·코멘트가 달라지는 일일 리포트.
// 홈1 상단 AI 코멘트 배너를 탭하면 진입하고, 화면을 탭하면 홈으로 돌아간다.
export default function HomeReportPage() {
  const navigate = useNavigate();
  const mood = mockCondition.status === "좋음" ? "good" : "bad";
  const report = mockDailyReport[mood];
  const mascot = mood === "good" ? characterWave : mascotSad;
  const timeOfDay = getTimeOfDay();

  return (
    <div className={`home-page home-report-page home-page--${timeOfDay}`} onClick={() => navigate("/home")}>
      <div className="home-bg" aria-hidden="true">
        <img src={TIME_BACKGROUNDS[timeOfDay]} alt="" />
      </div>
      <header className="home-header">
        <img src={welliLogo} alt="Welli" className="home-logo" />
        <div className="home-header-actions">
          <span className="home-icon-btn" aria-hidden="true">
            <BellIcon />
          </span>
        </div>
      </header>

      <div className="home-report-message">{report.message}</div>

      <div className="home-character home-report-mascot">
        <img src={mascot} alt="" />
      </div>

      <div className="home-cards">
        <NextLevelCard data={{ ...mockLevel, stageName: report.stageName }} />
      </div>

      <BadgeCard items={mockBadges} />
    </div>
  );
}
