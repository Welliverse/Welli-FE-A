import exerciseHighlightTimeIcon from "@/assets/icons/exercise-highlight-time.png";
import exerciseHighlightCalorieIcon from "@/assets/icons/exercise-highlight-calorie.png";
import exerciseHighlightStreakIcon from "@/assets/icons/exercise-highlight-streak.png";

// 세 아이콘 모두 Figma에서 원 배경+아이콘을 합친 레이어를 8배(144x144)로 내보내기(export)한 원본 PNG.
// 화면에는 18x18로 축소돼서 나오기 때문에(확대되는 일이 없어서) 레티나 화면에서도 화질 손상이 없다.
export function CheckGlyph() {
  return <img src={exerciseHighlightTimeIcon} width={18} height={18} alt="" aria-hidden="true" />;
}

export function FlameGlyph() {
  return <img src={exerciseHighlightCalorieIcon} width={18} height={18} alt="" aria-hidden="true" />;
}

export function ShoeGlyph() {
  return <img src={exerciseHighlightStreakIcon} width={18} height={18} alt="" aria-hidden="true" />;
}
