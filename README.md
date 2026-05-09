# Recaped

**Verify attendance. Keep what you learned.**

## What is Recaped

Recaped is a mobile-first Web3 app that turns every workshop, club meeting, and campus event into a verifiable, reusable learning module. An organizer publishes an event with the materials they actually used. Attendees join with their wallet, prove they showed up, get the materials linked permanently to their address, and claim an on-chain skill badge. Months later they still have the slides, the repo, the recording, and a portable record that they were there.

It is built for students and club organizers — the people who run weekly hack nights, AI reading groups, design jams, and intro-to-X workshops, and who currently lose every artifact two weeks after the event ends. Instead of a Luma RSVP that disappears or a Discord channel that gets muted, Recaped gives the event a permanent home tied to the wallets that attended.

## The problem

Workshop materials scatter across Discord pins, Slack DMs, calendar invites, Notion pages, and Luma event descriptions. Within a semester they are unfindable. Attendance is also untracked — there is no honest answer to "did this person actually show up to the React workshop, or did they just RSVP?" The result is that hard-won learning content has no shelf life and no proof of completion. Recaped reframes each event as a small, durable learning module: one canonical materials link, one verification step, one badge, all bound to the wallet that earned them.

## Why blockchain

The wallet is the account. There is no central Recaped login, no organizer database to trust, and no "did your old club hand off the admin password" problem. A completion record on-chain is portable across apps, verifiable by anyone, and composable — a future hiring page, course prerequisite, or campus quest can read the same badges without asking Recaped for permission. Identity here is the sum of events you attended and skills you claimed, not a profile row in someone's Postgres.

## Architecture

```
recaped/
  contracts/RecapedEvents.sol     # Solidity 0.8.24 contract
  scripts/deploy.ts               # writes frontend/lib/deployed-address.json
  test/RecapedEvents.ts           # 21 passing tests
  hardhat.config.ts
  frontend/                       # Next.js 14 PWA
    app/                          # routes: events, create, profile, skills, about
    components/                   # TopBar, BottomNav, EventCard, BadgeCard, ...
    constants/                    # abi, contract address, sample data
    hooks/useRecaped.ts           # wagmi reads + writes
    lib/                          # format, history (localStorage), deployed-address.json
    public/                       # manifest.json, icons
```

The root is a Hardhat 2 project: contract, deploy script, tests. The `frontend/` directory is a self-contained Next.js 14 app using wagmi 2, viem 2, RainbowKit 2, and Tailwind. The deploy script writes the freshly deployed address into `frontend/lib/deployed-address.json` so the UI picks it up automatically.

## On-chain vs off-chain

| On-chain (`RecapedEvents.sol`)            | Off-chain                                       |
| ----------------------------------------- | ----------------------------------------------- |
| Event metadata (title, category, capacity) | Actual learning materials (only the URI is stored) |
| Joins (`joinEvent`)                       | Proof text content shown in the verify form    |
| Verification submissions                  | UI state and form drafts                       |
| Organizer approvals                       | Sample / demo events for an empty home screen   |
| Skill badge claims                        | Profile + Skills history (localStorage in demo) |

The contract exposes `createEvent`, `joinEvent`, `submitAttendanceVerification`, `approveAttendance`, `claimSkillBadge`, and reads via `getEvent`, `getUserEventIds`, `getAttendeeStatus`, `hasJoined`, `hasVerifiedAttendance`, `hasClaimedBadge`.

## Setup

```bash
cd recaped
npm install
cd frontend && npm install && cd ..
cp .env.example .env                                  # optional, for Sepolia
cp frontend/.env.local.example frontend/.env.local    # optional
```

## Compile and test

```bash
npm run compile
npm test    # 21/21 should pass
```

## Local chain and deploy

Run two terminals.

**Terminal A** — start the local Hardhat node:

```bash
cd ~/Desktop/recaped
npm run node
```

**Terminal B** — deploy the contract and start the frontend:

```bash
cd ~/Desktop/recaped
npm run deploy:local           # writes frontend/lib/deployed-address.json
cd frontend && npm run dev     # http://localhost:3000
```

## Stale cache fix

If the dev server hot-reloads strangely after a deploy or env change:

```bash
rm -rf frontend/.next && cd frontend && npm run dev
```

## Wallet setup — two modes

Recaped supports two wallet configurations. Pick based on whether you want local-only development or the full multi-wallet experience.

### Local demo mode (default)

If `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is **not** set in `frontend/.env.local`, the wallet modal shows only the **injected wallet** — the MetaMask browser extension exposed via `window.ethereum`. There is no QR code, no WalletConnect SDK fallback, and no fake placeholder project id pretending to work. This is the recommended setup for local development.

### Full mode

Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in `frontend/.env.local`. You can get one free at https://cloud.walletconnect.com/. With this set, the modal lights up MetaMask, Coinbase Wallet, WalletConnect (mobile QR), and Rainbow.

A WalletConnect project id is **not required** for local development. Local works with just the MetaMask extension installed.

## MetaMask local Hardhat network

Add a custom network in MetaMask:

- Network name: `Hardhat Local`
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency symbol: `ETH`

Then import an account by pasting one of the 20 private keys printed by `npm run node` when the local chain starts.

## Full demo flow (two MetaMask accounts)

This walks through one event from creation to badge claim. You need two MetaMask accounts — call them A (organizer) and B (attendee).

1. Connect Account A at http://localhost:3000.
2. Go to **Create**. Fill in title, description, category, a materials URI (any link), an event code (default is `RECAPED2026`), capacity, and an optional start time. Hit **Create Event**. The success card appears — click **View event**.
3. Switch MetaMask to Account B and refresh the page. Click **Join Event**.
4. Enter `RECAPED2026` (it is shown directly above the input on the event page) and click **Verify Attendance**.
5. Switch back to Account A. The event page now shows an **Organizer · Approve attendance** panel with an address input. Paste B's address and click **Approve Attendance**.
6. Switch to Account B. The CTA flips to **Claim Skill Badge**. Claim it — the pass card status chip turns fuchsia.
7. Still as B, open `/profile` and `/skills`. The attended event, the materials link, and the claimed badge all show up.

## Sepolia deployment

In `recaped/.env`:

```
SEPOLIA_RPC_URL=...
PRIVATE_KEY=0x...
```

Fund the deployer wallet with Sepolia ETH from any faucet, then:

```bash
npm run deploy:sepolia
```

The deploy script writes the new address to `frontend/lib/deployed-address.json`. If you want to override that from the environment instead, set `NEXT_PUBLIC_CONTRACT_ADDRESS` in the frontend env.

## Vercel deployment

1. Push the repo to GitHub.
2. In Vercel, import the repo and set **Root Directory** to `frontend`.
3. Add environment variables:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS=0x...` (your deployed Sepolia address)
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...` (optional, enables Full mode)
4. Deploy.

## iPhone — Add to Home Screen

Open the deployed URL in Safari on iPhone. Tap the share button, then **Add to Home Screen**. Launch from the home screen icon — it runs standalone with the dark theme and the native-feeling bottom nav.

## Limitations

- The event-code check is enforced in the frontend (`RECAPED2026`). The contract itself just records the verification URI string an attendee submits — it does not validate the code.
- Learning materials are off-chain. Only the URI is stored on-chain.
- Organizer approval requires manually pasting an attendee address. There is no on-chain attendee enumeration.
- Profile and Skills history is read from `localStorage`, so it is per-device for the demo. The event page itself reads directly from the contract, which is the source of truth.
- No payments. No mainnet deployment.

## Future roadmap

Stronger verification — signed QR codes, NFC taps, geofencing — so the event-code step cannot be screenshotted and shared. Encrypted event codes that only resolve at the venue. A campus discovery feed for nearby events. Limited badge drops for early attendees. RSVP and start-time alerts. A shareable on-chain learning profile that other apps can read as a credential.
