import { OnboardingLayout } from "@/pages/onboarding/OnboardingLayout";
import type { HealthGoalCode } from "@/api/profile";

const HEALTH_GOAL_OPTIONS: { value: HealthGoalCode; label: string; emoji: string }[] = [
  { value: "SKIN_CARE", label: "피부 관리", emoji: "✨" },
  { value: "SLEEP", label: "수면 개선", emoji: "😴" },
  { value: "WEIGHT_MANAGEMENT", label: "체중 관리", emoji: "⚖️" },
  { value: "HEALTHY_HABIT", label: "생활 습관", emoji: "🌱" },
];

interface HealthGoalStepProps {
  selected: HealthGoalCode | null;
  onSelect: (goal: HealthGoalCode) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export default function HealthGoalStep({
  selected,
  onSelect,
  onSubmit,
  onBack,
  isSubmitting,
  error,
}: HealthGoalStepProps) {
  return (
    <OnboardingLayout
      step={2}
      totalSteps={3}
      title="건강 목표를 골라주세요"
      subtitle="하나를 선택해주세요"
      onBack={onBack}
      footer={
        <>
          {error && <p className="onboarding-form-error">{error}</p>}
          <button
            type="button"
            className="onboarding-submit"
            disabled={selected === null || isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? "저장하는 중..." : "웰리 캐릭터 만들기"}
          </button>
        </>
      }
    >
      <div className="onboarding-option-grid">
        {HEALTH_GOAL_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`onboarding-option-card${selected === option.value ? " selected" : ""}`}
            onClick={() => onSelect(option.value)}
          >
            <span className="onboarding-option-icon">{option.emoji}</span>
            {option.label}
          </button>
        ))}
      </div>
    </OnboardingLayout>
  );
}
