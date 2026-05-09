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
  // Demo-only: if true, any connected wallet is treated as having had their
  // QR ticket scanned at the door, so materials unlock automatically. If
  // false, the wallet shows up as "not scanned" and materials stay locked.
  scannedAtDoor: boolean;
};

const baseTime = Math.floor(Date.now() / 1000);

// ---------------------------------------------------------------------------
// EDIT THESE EVENTS
// ---------------------------------------------------------------------------
// - title / description / category: shown on the event card and detail page
// - code: the password an attendee types to "verify" and unlock materials
// - materials: list of files/links unlocked after verifying
//   (kind = label, description = subtitle, href = real URL to the file/repo)
// - capacity / attendeeCount / startTime: cosmetic for the demo
// ---------------------------------------------------------------------------

export const SAMPLE_EVENTS: SampleEvent[] = [
  {
    id: 1001n,
    organizer: "0x1111111111111111111111111111111111111111",
    title: "dev edu ...",
    description:
      "idk this is just an example event",
    category: "Workshop",
    materialsURI: "https://github.com/your-org/solidity-workshop",
    eventCodeHash: "SOLIDITY101",
    capacity: 80n,
    attendeeCount: 42n,
    startTime: BigInt(baseTime + 3 * 86400),
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
    description:
      "idk example again",
    category: "Hackathon",
    materialsURI: "https://github.com/your-org/hackathon-kickoff",
    eventCodeHash: "HACK2026",
    capacity: 200n,
    attendeeCount: 120n,
    startTime: BigInt(baseTime + 7 * 86400),
    closed: false,
    isSample: true,
    code: "HACK2026",
    scannedAtDoor: true,
    materials: [
      {
        kind: "Slides",
        description: "Kickoff deck",
        href: "https://docs.google.com/presentation/d/1oa3GcBDAPhRcUWLuLN1LWpsaF6FiOWS40wryGfNDnV0/edit?usp=sharing",
      },
      {
        kind: "GitHub Repo",
        description: "Team starter template",
        href: "https://github.com/your-org/hackathon-starter",
      },
      {
        kind: "Rules & Judging",
        description: "Hackathon rulebook PDF",
        href: "https://example.com/hackathon-rules.pdf",
      },
    ],
  },
  {
    id: 1003n,
    organizer: "0x3333333333333333333333333333333333333333",
    title: "mantle workshop",
    description:
      "idk example again",
    category: "Career",
    materialsURI: "https://example.com/resume-guide",
    eventCodeHash: "RESUME2026",
    capacity: 30n,
    attendeeCount: 18n,
    startTime: BigInt(baseTime + 1 * 86400),
    closed: false,
    isSample: true,
    code: "RESUME2026",
    scannedAtDoor: true,
    materials: [
      {
        kind: "Slides",
        description: "Resume best-practices deck",
        href: "https://docs.google.com/presentation/d/REPLACE_ME/edit",
      },
      {
        kind: "Template",
        description: "Editable resume template",
        href: "https://docs.google.com/document/d/REPLACE_ME/edit",
      },
    ],
  },
  
];

// Generic fallback material list (for on-chain events that don't have a custom
// materials array). Replace the href on the event detail page with the real link.
export const SAMPLE_MATERIALS = [
  { kind: "Slides", description: "Presentation deck used during the talk." },
  { kind: "GitHub Repo", description: "Starter code and finished examples." },
  { kind: "Docs", description: "Curated reading list and references." },
  { kind: "Recording", description: "Session recording (when available)." },
];

// Default code used by on-chain events created via the demo flow.
export const DEMO_EVENT_CODE = "examplecode";
