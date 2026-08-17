import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import OnboardingPage from "@/pages/onboarding/OnboardingPage";
import CharacterCreationPage from "@/pages/character/CharacterCreationPage";
import HomePage from "@/pages/home/HomePage";
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
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
