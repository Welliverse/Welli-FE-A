import { useRef } from "react";
import { CameraIcon } from "@/components/icons";
import "@/components/layout/layout.css";

interface RecentPhoto {
  key: string;
  src?: string;
  emoji?: string;
}

interface PhotoCaptureAreaProps {
  /** 뷰파인더 가이드가 이미 포함된 실제 사진(피부 촬영 화면 등) */
  previewSrc?: string;
  /** 실사 배경 대신 쓸 이모지 + CSS 가이드 오버레이(식사 촬영 화면 등) */
  previewEmoji?: string;
  onCapture: (file: File) => void;
  recentPhotos: RecentPhoto[];
  disabled?: boolean;
}

// 식사/피부 기록 화면 공통 카메라 캡처 UI. 버튼을 누르면 숨겨진 파일 입력을 열어
// 실제 카메라 촬영/갤러리 선택 파일을 받아온다(모바일 브라우저에서 capture 속성이 카메라를 바로 연다).
export function PhotoCaptureArea({ previewSrc, previewEmoji, onCapture, recentPhotos, disabled }: PhotoCaptureAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) onCapture(file);
  }

  return (
    <div>
      <div className="photo-capture-frame">
        {previewSrc ? (
          <img src={previewSrc} alt="" className="photo-capture-bg" />
        ) : (
          <>
            <span className="photo-capture-emoji-bg">{previewEmoji}</span>
            <span className="photo-capture-guide" />
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button
        type="button"
        className="primary-button photo-capture-btn"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <CameraIcon size={18} /> {disabled ? "분석하는 중..." : "사진 찍고 AI 분석하기"}
      </button>

      <section>
        <h2 className="page-section-title photo-capture-recent-title">최근 기록 사진</h2>
        <div className="photo-capture-recent-grid">
          {recentPhotos.map((photo) =>
            photo.src ? (
              <img src={photo.src} alt="" className="photo-capture-recent-thumb" key={photo.key} />
            ) : (
              <span className="photo-capture-recent-thumb photo-capture-recent-thumb--emoji" key={photo.key}>
                {photo.emoji}
              </span>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
