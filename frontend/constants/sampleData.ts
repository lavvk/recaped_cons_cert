import type { RecapedEventInfo } from "./abi";

export type SampleMaterial = {
  kind: string;
  description: string;
  href: string;
};

export type SampleEvent = RecapedEventInfo & {
  isSample: true;
  code: string;
  materials: SampleMaterial[];
  scannedAtDoor: boolean;
};

const demoDayTime = Math.floor(
  new Date("2026-05-09T00:00:00").getTime() / 1000
);

const babHacksTime = Math.floor(
  new Date("2026-03-14T00:00:00").getTime() / 1000
);

const mantleEventTime = Math.floor(
  new Date("2026-04-28T00:00:00").getTime() / 1000
);

// Generic fallback material list for on-chain events that don't ship a custom
// `materials` array. The real href comes from the event's `materialsURI`.
export const SAMPLE_MATERIALS: { kind: string; description: string }[] = [
  { kind: "Slides", description: "Presentation deck used during the talk." },
  { kind: "GitHub Repo", description: "Starter code and finished examples." },
  { kind: "Docs", description: "Curated reading list and references." },
  { kind: "Recording", description: "Session recording (when available)." },
];

export const SAMPLE_EVENTS: SampleEvent[] = [
  {
    id: 1001n,
    organizer: "0x1111111111111111111111111111111111111111",
    title: "demo day ...",
    description: "idk this is just an example event",
    category: "Workshop",
    materialsURI: "https://github.com/your-org/solidity-workshop",
    eventCodeHash: "SOLIDITY101",
    capacity: 80n,
    attendeeCount: 42n,
    startTime: BigInt(demoDayTime),
    closed: false,
    isSample: true,
    code: "hello123",
    scannedAtDoor: false,
    materials: [
      {
        kind: "Slides",
        description: "Workshop deck (Google Slides)",
        href: "https://docs.google.com/presentation/d/1oa3GcBDAPhRcUWLuLN1LWpsaF6FiOWS40wryGfNDnV0/edit?usp=sharing",
      },
      {
        kind: "GitHub Repo",
        description: "Starter + finished code",
        href: "https://github.com/your-org/solidity-workshop",
      },
      {
        kind: "Docs",
        description: "Reading list & references",
        href: "https://hardhat.org/tutorial",
      },
    ],
  },
  {
    id: 1002n,
    organizer: "0x2222222222222222222222222222222222222222",
    title: "bab hacks",
    description: "idk example again",
    category: "Hackathon",
    materialsURI: "https://github.com/your-org/hackathon-kickoff",
    eventCodeHash: "HACK2026",
    capacity: 200n,
    attendeeCount: 120n,
    startTime: BigInt(babHacksTime),
    closed: false,
    isSample: true,
    code: "bab2026",
    scannedAtDoor: true,
    materials: [
      {
        kind: "Slides",
        description: "Hackathon kickoff deck",
        href: "https://docs.google.com/presentation/d/1oa3GcBDAPhRcUWLuLN1LWpsaF6FiOWS40wryGfNDnV0/edit?usp=sharing",
      },
      {
        kind: "GitHub Repo",
        description: "Hackathon starter repo",
        href: "https://github.com/your-org/hackathon-kickoff",
      },
      {
        kind: "Docs",
        description: "Rules, judging, and resources",
        href: "https://ethglobal.com/guides",
      },
    ],
  },
  {
    id: 1003n,
    organizer: "0x3333333333333333333333333333333333333333",
    title: "mantle event",
    description: "sample mantle event",
    category: "Networking",
    materialsURI: "https://github.com/your-org/mantle-event",
    eventCodeHash: "MANTLE2026",
    capacity: 100n,
    attendeeCount: 55n,
    startTime: BigInt(mantleEventTime),
    closed: false,
    isSample: true,
    code: "mantle123",
    scannedAtDoor: true,
    materials: [
      {
        kind: "Slides",
        description: "Mantle event slides",
        href: "https://docs.google.com/presentation/d/1oa3GcBDAPhRcUWLuLN1LWpsaF6FiOWS40wryGfNDnV0/edit?usp=sharing",
      },
      {
        kind: "GitHub Repo",
        description: "Mantle demo repo",
        href: "https://github.com/your-org/mantle-event",
      },
      {
        kind: "Docs",
        description: "Mantle docs",
        href: "https://docs.mantle.xyz",
      },
    ],
  },
];