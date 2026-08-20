import homeBgDay from "@/assets/home-bg-day.png";
import homeBgEvening from "@/assets/home-bg-evening.png";
import homeBgNight from "@/assets/home-bg-night.png";

export type TimeOfDay = "day" | "evening" | "night";

export const TIME_BACKGROUNDS: Record<TimeOfDay, string> = {
  day: homeBgDay,
  evening: homeBgEvening,
  night: homeBgNight,
};

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 18) return "day";
  if (hour >= 18 && hour < 20) return "evening";
  return "night";
}
