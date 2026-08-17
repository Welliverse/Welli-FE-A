import { useEffect, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { characterApi, type CharacterInfo } from "@/api/character";
import characterOrb from "@/assets/character-orb.png";
import "@/pages/character/character.css";

const FAKE_PROGRESS_DURATION_MS = 2200;

export default function CharacterCreationPage() {
  const navigate = useNavigate();
  const [character, setCharacter] = useState<CharacterInfo | null>(null);
  const [progress, setProgress] = useState(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState("");

  useEffect(() => {
    let cancelled = false;
    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const elapsed = now - start;
      const pct = Math.min(95, Math.round((elapsed / FAKE_PROGRESS_DURATION_MS) * 95));
      if (!cancelled) setProgress(pct);
      if (pct < 95) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    characterApi.create().then((data) => {
      if (cancelled) return;
      setProgress(100);
      setTimeout(() => {
        if (!cancelled) setCharacter(data);
      }, 300);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  function startEditName() {
    if (!character) return;
    setNameDraft(character.name);
    setIsEditingName(true);
  }

  function commitName() {
    const trimmed = nameDraft.trim();
    setCharacter((prev) => (prev && trimmed ? { ...prev, name: trimmed } : prev));
    setIsEditingName(false);
  }

  function handleNameKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") e.currentTarget.blur();
  }

  if (!character) {
    return (
      <div className="character-page">
        <h1 className="character-title">
          나를 닮은 AI 캐릭터를
          <br />
          만들고 있어요
        </h1>
        <div className="character-orb-wrap">
          <img className="character-orb" src={characterOrb} alt="" />
        </div>
        <div className="character-loading-footer">
          <p className="character-loading-text">캐릭터 생성 중...</p>
          <div className="character-progress-row">
            <div className="character-progress-track">
              <div className="character-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="character-progress-percent">{progress}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="character-page">
      <h1 className="character-title character-title-result">짜잔! {character.name}가 탄생했어요 🎉</h1>
      <img className="character-illustration" src={character.imageUrl} alt={character.name} />

      <div className="character-card">
        <div className="character-card-header">
          <div className="character-name-row">
            {isEditingName ? (
              <input
                className="character-name-input"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onBlur={commitName}
                onKeyDown={handleNameKeyDown}
                maxLength={10}
                aria-label="캐릭터 이름"
                autoFocus
              />
            ) : (
              <>
                <span className="character-name">{character.name}</span>
                <button type="button" className="character-edit-btn" onClick={startEditName} aria-label="이름 수정">
                  ✏️
                </button>
              </>
            )}
          </div>
          <p className="character-tagline">{character.tagline}</p>
        </div>

        <div className="character-traits">
          <p className="character-traits-label">특징</p>
          <ul className="character-traits-list">
            {character.traits.map((trait) => (
              <li key={trait}>{trait}</li>
            ))}
          </ul>
        </div>
      </div>

      <button type="button" className="character-start-btn" onClick={() => navigate("/home")}>
        {character.name}와 시작하기
      </button>
    </div>
  );
}
