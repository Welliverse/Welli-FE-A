import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import OnboardingPage from "@/pages/onboarding/OnboardingPage";
import CharacterCreationPage from "@/pages/character/CharacterCreationPage";
import HomePage from "@/pages/home/HomePage";
import MyPage from "@/pages/mypage/MyPage";
import WaterHistoryPage from "@/pages/history/WaterHistoryPage";
import ExerciseHistoryPage from "@/pages/history/ExerciseHistoryPage";
import SleepHistoryPage from "@/pages/history/SleepHistoryPage";
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
      { path: "/mypage", element: <MyPage /> },
      { path: "/history/water", element: <WaterHistoryPage /> },
      { path: "/history/exercise", element: <ExerciseHistoryPage /> },
      { path: "/history/sleep", element: <SleepHistoryPage /> },
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
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
