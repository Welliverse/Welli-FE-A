import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AgeStep from "@/pages/onboarding/AgeStep";
import GenderStep from "@/pages/onboarding/GenderStep";
import HealthGoalStep from "@/pages/onboarding/HealthGoalStep";
import { profileApi, type Gender, type HealthGoalCode } from "@/api/profile";
import { ApiError } from "@/api/client";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [age, setAge] = useState(26);
  const [gender, setGender] = useState<Gender | null>(null);
  const [healthGoal, setHealthGoal] = useState<HealthGoalCode | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleFinish() {
    if (!gender || !healthGoal) return;
    setFormError(null);
    setIsSubmitting(true);
    try {
      await profileApi.updateProfile({ age, gender, healthGoal });
      navigate("/character-creation");
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === 0) {
    return <AgeStep age={age} onChange={setAge} onNext={() => setStep(1)} />;
  }

  if (step === 1) {
    return <GenderStep gender={gender} onChange={setGender} onNext={() => setStep(2)} onBack={() => setStep(0)} />;
  }

  return (
    <HealthGoalStep
      selected={healthGoal}
      onSelect={setHealthGoal}
      onSubmit={handleFinish}
      onBack={() => setStep(1)}
      isSubmitting={isSubmitting}
      error={formError}
    />
  );
}
