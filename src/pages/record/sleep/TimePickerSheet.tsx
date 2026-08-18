import "@/pages/record/sleep/sleep.css";

export interface TimeValue {
  period: "오전" | "오후";
  hour: number;
  minute: number;
}

interface TimePickerSheetProps {
  title: string;
  value: TimeValue;
  previewLabel: (value: TimeValue) => string;
  onChange: (value: TimeValue) => void;
  onClose: () => void;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

// 잠든 시간 / 일어난 시간을 고르는 바텀시트. 목업의 휠 피커를 select 3개로 단순화.
export function TimePickerSheet({ title, value, previewLabel, onChange, onClose }: TimePickerSheetProps) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-header">
          <button type="button" className="sheet-text-btn" onClick={onClose}>
            취소
          </button>
          <span className="sheet-title">{title}</span>
          <button type="button" className="sheet-text-btn sheet-text-btn--primary" onClick={onClose}>
            완료
          </button>
        </div>

        <div className="sheet-picker-row">
          <select
            className="sheet-select"
            value={value.period}
            onChange={(e) => onChange({ ...value, period: e.target.value as TimeValue["period"] })}
          >
            <option value="오전">오전</option>
            <option value="오후">오후</option>
          </select>
          <select
            className="sheet-select"
            value={value.hour}
            onChange={(e) => onChange({ ...value, hour: Number(e.target.value) })}
          >
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <select
            className="sheet-select"
            value={value.minute}
            onChange={(e) => onChange({ ...value, minute: Number(e.target.value) })}
          >
            {MINUTES.map((m) => (
              <option key={m} value={m}>
                {String(m).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>

        <p className="sheet-preview">{previewLabel(value)}</p>
      </div>
    </div>
  );
}
