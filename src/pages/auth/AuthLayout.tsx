import type { ReactNode } from "react";
import welliLogo from "@/assets/welli-logo.svg";
import "@/pages/auth/auth.css";

interface AuthLayoutProps {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-header">
        <img className="auth-logo" src={welliLogo} alt={title} />
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
