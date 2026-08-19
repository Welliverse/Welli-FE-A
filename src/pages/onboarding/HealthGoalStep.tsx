import { OnboardingLayout } from "@/pages/onboarding/OnboardingLayout";
import type { HealthGoalCode } from "@/api/profile";

const HEALTH_GOAL_OPTIONS: { value: HealthGoalCode; label: string; emoji: string }[] = [
  { value: "skinCare", label: "피부 관리", emoji: "✨" },
  { value: "sleepImprovement", label: "수면 개선", emoji: "😴" },
  { value: "exerciseHabit", label: "운동 습관", emoji: "💪" },
  { value: "dietManagement", label: "식단 관리", emoji: "🥗" },
  { value: "stressManagement", label: "스트레스 관리", emoji: "🧘" },
  { value: "hydration", label: "수분 섭취", emoji: "💧" },
];

interface HealthGoalStepProps {
  selected: HealthGoalCode[];
  onToggle: (goal: HealthGoalCode) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export default function HealthGoalStep({
  selected,
  onToggle,
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
      subtitle="여러 개 선택할 수 있어요"
      onBack={onBack}
      footer={
        <>
          {error && <p className="onboarding-form-error">{error}</p>}
          <button
            type="button"
            className="onboarding-submit"
            disabled={selected.length === 0 || isSubmitting}
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
            className={`onboarding-option-card${selected.includes(option.value) ? " selected" : ""}`}
            onClick={() => onToggle(option.value)}
          >
            <span className="onboarding-option-icon">{option.emoji}</span>
            {option.label}
          </button>
        ))}
      </div>
    </OnboardingLayout>
  );
}
