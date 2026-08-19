import type { ReactNode } from "react";
import { OnboardingProgress } from "@/pages/onboarding/OnboardingProgress";
import "@/pages/onboarding/onboarding.css";

interface OnboardingLayoutProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  onBack?: () => void;
}

export function OnboardingLayout({ step, totalSteps, title, subtitle, children, footer, onBack }: OnboardingLayoutProps) {
  return (
    <div className="onboarding-page">
      <div className="onboarding-header-row">
        {onBack && (
          <button type="button" className="onboarding-back" onClick={onBack} aria-label="이전 단계로">
            ‹
          </button>
        )}
        <OnboardingProgress total={totalSteps} current={step} />
      </div>
      <h1 className="onboarding-title">{title}</h1>
      <p className="onboarding-subtitle">{subtitle}</p>
      <div className="onboarding-content">{children}</div>
      <div className="onboarding-footer">{footer}</div>
    </div>
  );
}
