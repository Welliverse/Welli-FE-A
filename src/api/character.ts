import { apiClient, USE_MOCK } from "@/api/client";
import characterWelli from "@/assets/character-welli.png";

export interface CharacterInfo {
  character_id: string;
  name: string;
  tagline: string;
  traits: string[];
  imageUrl: string;
}

const MOCK_DELAY_MS = 2400;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// TODO(BE): AI 캐릭터 생성/특징 문구는 아직 실제 연동 전 — mock 데이터로 대체.
// 실제 응답 필드명은 BE 확정되면 여기만 맞추면 됨.
const MOCK_CHARACTER: CharacterInfo = {
  character_id: "mock-character-1",
  name: "웰리",
  tagline: "움직이는 것이 즐거운 활동형",
  traits: ["긍정적이고 활기찬 성격", "변화를 즐기고 기록을 좋아해요", "당신의 건강 파트너가 되어줄게요!"],
  imageUrl: characterWelli,
};

async function mockCreateCharacter(): Promise<CharacterInfo> {
  await wait(MOCK_DELAY_MS);
  return MOCK_CHARACTER;
}

// FE-A 담당: 캐릭터 생성. 인증 필요 — apiClient가 토큰 자동 첨부.
export const characterApi = {
  create: () => (USE_MOCK ? mockCreateCharacter() : apiClient.post<CharacterInfo>("/characters", {})),
};
