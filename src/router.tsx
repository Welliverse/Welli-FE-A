import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import OnboardingPage from "@/pages/onboarding/OnboardingPage";
import CharacterCreationPage from "@/pages/character/CharacterCreationPage";
import HomePage from "@/pages/home/HomePage";
import HomeReportPage from "@/pages/home/HomeReportPage";
import MyPage from "@/pages/mypage/MyPage";
import WaterHistoryPage from "@/pages/history/WaterHistoryPage";
import ExerciseHistoryPage from "@/pages/history/ExerciseHistoryPage";
import SleepHistoryPage from "@/pages/history/SleepHistoryPage";
import EmotionHistoryPage from "@/pages/history/EmotionHistoryPage";
import MealHistoryPage from "@/pages/history/MealHistoryPage";
import RecordHubPage from "@/pages/record/RecordHubPage";
import WaterRecordPage from "@/pages/record/water/WaterRecordPage";
import EmotionRecordPage from "@/pages/record/emotion/EmotionRecordPage";
import EmotionWeeklyPage from "@/pages/record/emotion/EmotionWeeklyPage";
import SleepRecordPage from "@/pages/record/sleep/SleepRecordPage";
import ExerciseRecordPage from "@/pages/record/exercise/ExerciseRecordPage";
import MealRecordPage from "@/pages/record/meal/MealRecordPage";
import MealResultPage from "@/pages/record/meal/MealResultPage";
import MealWeeklyPage from "@/pages/record/meal/MealWeeklyPage";
import SkinRecordPage from "@/pages/record/skin/SkinRecordPage";
import SkinResultPage from "@/pages/record/skin/SkinResultPage";
import RoutinePage from "@/pages/routine/RoutinePage";
import RoutineCompletePage from "@/pages/routine/RoutineCompletePage";
import RoutineIncompletePage from "@/pages/routine/RoutineIncompletePage";
import ReportLoadingPage from "@/pages/report/ReportLoadingPage";
import ReportResultPage from "@/pages/report/ReportResultPage";
import ReportLevelUpPage from "@/pages/report/ReportLevelUpPage";
import { useAuthStore } from "@/store/authStore";

function RequireAuth() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function RootRedirect() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return <Navigate to={isAuthenticated ? "/home" : "/login"} replace />;
}

export const router = createBrowserRouter([
  { path: "/", element: <RootRedirect /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  {
    element: <RequireAuth />,
    children: [
      { path: "/onboarding", element: <OnboardingPage /> },
      { path: "/character-creation", element: <CharacterCreationPage /> },
      { path: "/home", element: <HomePage /> },
      { path: "/home/report", element: <HomeReportPage /> },
      { path: "/mypage", element: <MyPage /> },
      { path: "/history/water", element: <WaterHistoryPage /> },
      { path: "/history/exercise", element: <ExerciseHistoryPage /> },
      { path: "/history/sleep", element: <SleepHistoryPage /> },
      { path: "/history/emotion", element: <EmotionHistoryPage /> },
      { path: "/history/meal", element: <MealHistoryPage /> },
      { path: "/record", element: <RecordHubPage /> },
      { path: "/record/water", element: <WaterRecordPage /> },
      { path: "/record/emotion", element: <EmotionRecordPage /> },
      { path: "/record/emotion/weekly", element: <EmotionWeeklyPage /> },
      { path: "/record/sleep", element: <SleepRecordPage /> },
      { path: "/record/exercise", element: <ExerciseRecordPage /> },
      { path: "/record/meal", element: <MealRecordPage /> },
      { path: "/record/meal/result", element: <MealResultPage /> },
      { path: "/record/meal/weekly", element: <MealWeeklyPage /> },
      { path: "/record/skin", element: <SkinRecordPage /> },
      { path: "/record/skin/result", element: <SkinResultPage /> },
      { path: "/routine", element: <RoutinePage /> },
      { path: "/routine/complete", element: <RoutineCompletePage /> },
      { path: "/routine/incomplete", element: <RoutineIncompletePage /> },
      { path: "/report/loading", element: <ReportLoadingPage /> },
      { path: "/report/result", element: <ReportResultPage /> },
      { path: "/report/levelup", element: <ReportLevelUpPage /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
