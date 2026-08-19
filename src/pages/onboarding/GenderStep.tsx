import { OnboardingLayout } from "@/pages/onboarding/OnboardingLayout";
import type { Gender } from "@/api/profile";

const GENDER_OPTIONS: { value: Gender; label: string; emoji: string }[] = [
  { value: "female", label: "여성", emoji: "👩" },
  { value: "male", label: "남성", emoji: "👨" },
  { value: "other", label: "기타 / 선택 안함", emoji: "🙂" },
];

interface GenderStepProps {
  gender: Gender | null;
  onChange: (gender: Gender) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function GenderStep({ gender, onChange, onNext, onBack }: GenderStepProps) {
  return (
    <OnboardingLayout
      step={1}
      totalSteps={3}
      title="성별을 선택해주세요"
      subtitle="피부 타입 분석에 사용돼요"
      onBack={onBack}
      footer={
        <button type="button" className="onboarding-submit" disabled={!gender} onClick={onNext}>
          다음으로
        </button>
      }
    >
      <div className="onboarding-option-list">
        {GENDER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`onboarding-option-card${gender === option.value ? " selected" : ""}`}
            onClick={() => onChange(option.value)}
          >
            <span className="onboarding-option-icon">{option.emoji}</span>
            {option.label}
          </button>
        ))}
      </div>
    </OnboardingLayout>
  );
}
