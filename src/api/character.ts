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

// BE 응답에는 이름/한마디/특징 같은 서사 정보가 없고 숫자 상태값만 온다
// ({characterId, growthStage, growthScore, conditionScore, appearanceState}). 그 텍스트는
// 아직 서버가 못 주는 정보라 화면이 깨지지 않도록 로컬 문구를 그대로 쓰고,
// 실제 캐릭터 생성 호출 자체는 서버에도 반영되도록 같이 보낸다.
// growthScore는 0~100 EXP — 담당자 확인: 100이 되면 growthStage가 오르고 growthScore가 리셋되는 구조.
export interface CharacterState {
  characterId: number;
  growthStage: number;
  growthScore: number;
  conditionScore: number;
  appearanceState: string;
}

async function realCreateCharacter(): Promise<CharacterInfo> {
  await apiClient.post<CharacterState>("/characters", {});
  return MOCK_CHARACTER;
}

const MOCK_CHARACTER_STATE: CharacterState = {
  characterId: 1,
  growthStage: 1,
  growthScore: 65,
  conditionScore: 65,
  appearanceState: "GOOD",
};

async function mockGetCharacter(): Promise<CharacterState> {
  await wait(MOCK_DELAY_MS);
  return MOCK_CHARACTER_STATE;
}

// FE-A 담당: 캐릭터 생성/조회. 인증 필요 — apiClient가 토큰 자동 첨부.
export const characterApi = {
  create: () => (USE_MOCK ? mockCreateCharacter() : realCreateCharacter()),
  getMe: () => (USE_MOCK ? mockGetCharacter() : apiClient.get<CharacterState>("/characters/me")),
};
