export const RECAPED_ABI = [
  {
    type: "function",
    name: "createEvent",
    stateMutability: "nonpayable",
    inputs: [
      { name: "title", type: "string" },
      { name: "description", type: "string" },
      { name: "category", type: "string" },
      { name: "materialsURI", type: "string" },
      { name: "eventCodeHash", type: "string" },
      { name: "capacity", type: "uint256" },
      { name: "startTime", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "joinEvent",
    stateMutability: "nonpayable",
    inputs: [{ name: "eventId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "submitAttendanceVerification",
    stateMutability: "nonpayable",
    inputs: [
      { name: "eventId", type: "uint256" },
      { name: "verificationURI", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "approveAttendance",
    stateMutability: "nonpayable",
    inputs: [
      { name: "eventId", type: "uint256" },
      { name: "attendee", type: "address" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "claimSkillBadge",
    stateMutability: "nonpayable",
    inputs: [{ name: "eventId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "nextEventId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getEvent",
    stateMutability: "view",
    inputs: [{ name: "eventId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "organizer", type: "address" },
          { name: "title", type: "string" },
          { name: "description", type: "string" },
          { name: "category", type: "string" },
          { name: "materialsURI", type: "string" },
          { name: "eventCodeHash", type: "string" },
          { name: "capacity", type: "uint256" },
          { name: "attendeeCount", type: "uint256" },
          { name: "startTime", type: "uint256" },
          { name: "closed", type: "bool" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getUserEventIds",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
  },
  {
    type: "function",
    name: "getAttendeeStatus",
    stateMutability: "view",
    inputs: [
      { name: "eventId", type: "uint256" },
      { name: "user", type: "address" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "joined", type: "bool" },
          { name: "verificationSubmitted", type: "bool" },
          { name: "approved", type: "bool" },
          { name: "badgeClaimed", type: "bool" },
          { name: "verificationURI", type: "string" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "hasJoined",
    stateMutability: "view",
    inputs: [
      { name: "eventId", type: "uint256" },
      { name: "user", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "hasVerifiedAttendance",
    stateMutability: "view",
    inputs: [
      { name: "eventId", type: "uint256" },
      { name: "user", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "hasClaimedBadge",
    stateMutability: "view",
    inputs: [
      { name: "eventId", type: "uint256" },
      { name: "user", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "event",
    name: "EventCreated",
    inputs: [
      { name: "eventId", type: "uint256", indexed: true },
      { name: "organizer", type: "address", indexed: true },
      { name: "title", type: "string", indexed: false },
      { name: "category", type: "string", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EventJoined",
    inputs: [
      { name: "eventId", type: "uint256", indexed: true },
      { name: "attendee", type: "address", indexed: true },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AttendanceVerificationSubmitted",
    inputs: [
      { name: "eventId", type: "uint256", indexed: true },
      { name: "attendee", type: "address", indexed: true },
      { name: "verificationURI", type: "string", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AttendanceApproved",
    inputs: [
      { name: "eventId", type: "uint256", indexed: true },
      { name: "attendee", type: "address", indexed: true },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SkillBadgeClaimed",
    inputs: [
      { name: "eventId", type: "uint256", indexed: true },
      { name: "attendee", type: "address", indexed: true },
    ],
    anonymous: false,
  },
] as const;

export type RecapedEventInfo = {
  id: bigint;
  organizer: `0x${string}`;
  title: string;
  description: string;
  category: string;
  materialsURI: string;
  eventCodeHash: string;
  capacity: bigint;
  attendeeCount: bigint;
  startTime: bigint;
  closed: boolean;
};

export type RecapedAttendee = {
  joined: boolean;
  verificationSubmitted: boolean;
  approved: boolean;
  badgeClaimed: boolean;
  verificationURI: string;
};
