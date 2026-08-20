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
  onCapture: () => void;
  recentPhotos: RecentPhoto[];
}

// 식사/피부 기록 화면 공통 카메라 캡처 UI. 실제 카메라 연동 전이라 정적 이미지/이모지로 미리보기를 대신함.
export function PhotoCaptureArea({ previewSrc, previewEmoji, onCapture, recentPhotos }: PhotoCaptureAreaProps) {
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

      <button type="button" className="primary-button photo-capture-btn" onClick={onCapture}>
        <CameraIcon size={18} /> 사진 찍고 AI 분석하기
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
