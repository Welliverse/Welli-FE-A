import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { OnboardingLayout } from "@/pages/onboarding/OnboardingLayout";

const MIN_AGE = 14;
const MAX_AGE = 100;
const AGE_OPTIONS = Array.from({ length: MAX_AGE - MIN_AGE + 1 }, (_, i) => MIN_AGE + i);
const ITEM_HEIGHT = 43;
const WHEEL_PAD = ITEM_HEIGHT * 2; // 5개 행이 보이도록 위아래 2행씩 여백

interface AgeStepProps {
  age: number;
  onChange: (age: number) => void;
  onNext: () => void;
}

export default function AgeStep({ age, onChange, onNext }: AgeStepProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();
  const [inputValue, setInputValue] = useState(String(age));

  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;
    wheel.scrollTop = (age - MIN_AGE) * ITEM_HEIGHT;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setInputValue(String(age));
  }, [age]);

  function scrollToAge(nextAge: number, smooth: boolean) {
    wheelRef.current?.scrollTo({ top: (nextAge - MIN_AGE) * ITEM_HEIGHT, behavior: smooth ? "smooth" : "auto" });
  }

  // 휠이 최종적으로 멈춘 위치만 나이의 유일한 소스로 삼는다. 클릭/직접입력에서
  // 즉시 onChange를 부르고 별도로 scrollTo도 하면, 스크롤 애니메이션 도중에
  // 잡히는 중간 스크롤 위치가 debounce로 뒤늦게 덮어써서 값이 튀는 문제가 있었음.
  function handleWheelScroll() {
    const wheel = wheelRef.current;
    if (!wheel) return;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      const index = Math.min(Math.max(Math.round(wheel.scrollTop / ITEM_HEIGHT), 0), AGE_OPTIONS.length - 1);
      const nextAge = AGE_OPTIONS[index];
      if (nextAge !== age) onChange(nextAge);
    }, 120);
  }

  function selectAge(nextAge: number) {
    if (nextAge === age) return;
    scrollToAge(nextAge, true);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function commitInput() {
    const parsed = Number(inputValue);
    if (!Number.isFinite(parsed)) {
      setInputValue(String(age));
      return;
    }
    const clamped = Math.min(Math.max(Math.round(parsed), MIN_AGE), MAX_AGE);
    setInputValue(String(clamped));
    if (clamped === age) return;
    scrollToAge(clamped, true);
  }

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") e.currentTarget.blur();
  }

  return (
    <OnboardingLayout
      step={0}
      totalSteps={3}
      title="나이를 알려주세요"
      subtitle="맞춤 건강 루틴에 활용돼요"
      footer={
        <button type="button" className="onboarding-submit" onClick={onNext}>
          다음으로
        </button>
      }
    >
      <div className="age-card">
        <p className="age-label">나이</p>
        <div className="age-value-row">
          <input
            type="number"
            className="age-value-input"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={commitInput}
            onKeyDown={handleInputKeyDown}
            aria-label="나이 직접 입력"
          />
          <span className="age-value-unit">세</span>
        </div>
        <div className="age-wheel" ref={wheelRef} onScroll={handleWheelScroll}>
          <div style={{ height: WHEEL_PAD }} />
          {AGE_OPTIONS.map((option) => (
            <div
              key={option}
              className={`age-wheel-item${option === age ? " active" : ""}`}
              onClick={() => selectAge(option)}
            >
              {option}
            </div>
          ))}
          <div style={{ height: WHEEL_PAD }} />
        </div>
      </div>
    </OnboardingLayout>
  );
}
