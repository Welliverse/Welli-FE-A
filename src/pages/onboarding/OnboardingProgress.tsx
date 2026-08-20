interface OnboardingProgressProps {
  total: number;
  current: number;
}

export function OnboardingProgress({ total, current }: OnboardingProgressProps) {
  return (
    <div className="onboarding-progress">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`onboarding-progress-dot${i === current ? " active" : ""}`} />
      ))}
    </div>
  );
}
