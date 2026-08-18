import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { RECORD_CATEGORIES, type RecordType } from "@/api/records";
import mypageAvatar from "@/assets/mypage-avatar.png";
import HomeToolbar from "@/pages/home/HomeToolbar";
import "@/pages/home/home.css";
import "@/pages/mypage/mypage.css";
import {
  AccountIcon,
  HistoryIcon,
  ReportIcon,
  SettingsIcon,
  SupportIcon,
  LogoutIcon,
  ChevronRightIcon,
} from "@/pages/mypage/MyPageIcons";

// 기록 히스토리 화면이 만들어진 카테고리만 연결. 나머지는 "준비 중" 토스트.
const HISTORY_ROUTES: Partial<Record<RecordType, string>> = {
  WATER: "/history/water",
  EXERCISE: "/history/exercise",
  SLEEP: "/history/sleep",
};

export default function MyPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [notice, setNotice] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function showNotReady() {
    setNotice("아직 준비 중인 화면이에요.");
    window.setTimeout(() => setNotice(null), 1500);
  }

  const topMenuItems = [{ key: "account", label: "내 계정", Icon: AccountIcon, onClick: showNotReady }];
  const bottomMenuItems = [
    { key: "report", label: "분석 리포트", Icon: ReportIcon, onClick: showNotReady },
    { key: "settings", label: "설정", Icon: SettingsIcon, onClick: showNotReady },
    { key: "support", label: "고객센터", Icon: SupportIcon, onClick: showNotReady },
    { key: "logout", label: "로그아웃", Icon: LogoutIcon, onClick: handleLogout },
  ];

  return (
    <div className="mypage-page">
      <header className="mypage-header">
        <h1>마이페이지</h1>
      </header>

      <div className="mypage-profile">
        <img className="mypage-avatar" src={mypageAvatar} alt="" />
        <div className="mypage-profile-text">
          <p className="mypage-nickname">{user?.nickname ?? "웰리"}</p>
          <p className="mypage-email">{user?.email ?? ""}</p>
        </div>
      </div>

      {notice && <p className="home-toast">{notice}</p>}

      <div className="mypage-menu">
        {topMenuItems.map(({ key, label, Icon, onClick }) => (
          <button key={key} type="button" className="mypage-menu-item" onClick={onClick}>
            <span className="mypage-menu-item-left">
              <Icon />
              <span className="mypage-menu-label">{label}</span>
            </span>
            <span className="mypage-menu-chevron">
              <ChevronRightIcon />
            </span>
          </button>
        ))}

        <div className="mypage-menu-group">
          <button
            type="button"
            className="mypage-menu-item"
            onClick={() => setHistoryOpen((prev) => !prev)}
            aria-expanded={historyOpen}
          >
            <span className="mypage-menu-item-left">
              <HistoryIcon />
              <span className="mypage-menu-label">기록 히스토리</span>
            </span>
            <span className={`mypage-menu-chevron${historyOpen ? " open" : ""}`}>
              <ChevronRightIcon />
            </span>
          </button>
          {historyOpen && (
            <div className="mypage-history-sublist">
              {RECORD_CATEGORIES.map((category) => (
                <button
                  key={category.type}
                  type="button"
                  className="mypage-history-subitem"
                  onClick={
                    HISTORY_ROUTES[category.type] ? () => navigate(HISTORY_ROUTES[category.type]!) : showNotReady
                  }
                >
                  {category.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {bottomMenuItems.map(({ key, label, Icon, onClick }) => (
          <button key={key} type="button" className="mypage-menu-item" onClick={onClick}>
            <span className="mypage-menu-item-left">
              <Icon />
              <span className="mypage-menu-label">{label}</span>
            </span>
            <span className="mypage-menu-chevron">
              <ChevronRightIcon />
            </span>
          </button>
        ))}
      </div>

      <div className="home-toolbar-wrap">
        <HomeToolbar
          active="my"
          onSelect={(key) => {
            if (key === "home") navigate("/home");
            else if (key !== "my") showNotReady();
          }}
        />
      </div>
    </div>
  );
}
