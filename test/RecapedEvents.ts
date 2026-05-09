import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

const SAMPLE = {
  title: "Solidity Workshop",
  description: "Intro to Solidity for builders",
  category: "Workshop",
  materialsURI: "ipfs://materials",
  eventCodeHash: "hash-RECAPED2026",
  capacity: 5n,
  startTime: 1900000000n,
};

async function deployFixture() {
  const [organizer, attendee, other] = await ethers.getSigners();
  const Factory = await ethers.getContractFactory("RecapedEvents");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();
  return { contract, organizer, attendee, other };
}

async function deployWithEvent(capacity: bigint = SAMPLE.capacity) {
  const fx = await deployFixture();
  await fx.contract.createEvent(
    SAMPLE.title,
    SAMPLE.description,
    SAMPLE.category,
    SAMPLE.materialsURI,
    SAMPLE.eventCodeHash,
    capacity,
    SAMPLE.startTime
  );
  return fx;
}

describe("RecapedEvents", () => {
  it("creates an event", async () => {
    const { contract, organizer } = await loadFixture(deployFixture);
    await expect(
      contract.createEvent(
        SAMPLE.title,
        SAMPLE.description,
        SAMPLE.category,
        SAMPLE.materialsURI,
        SAMPLE.eventCodeHash,
        SAMPLE.capacity,
        SAMPLE.startTime
      )
    )
      .to.emit(contract, "EventCreated")
      .withArgs(1n, organizer.address, SAMPLE.title, SAMPLE.category);

    const ev = await contract.getFunction("getEvent")(1);
    expect(ev.title).to.equal(SAMPLE.title);
    expect(ev.organizer).to.equal(organizer.address);
    expect(ev.capacity).to.equal(SAMPLE.capacity);
  });

  it("rejects empty title", async () => {
    const { contract } = await loadFixture(deployFixture);
    await expect(
      contract.createEvent(
        "",
        SAMPLE.description,
        SAMPLE.category,
        SAMPLE.materialsURI,
        SAMPLE.eventCodeHash,
        SAMPLE.capacity,
        SAMPLE.startTime
      )
    ).to.be.revertedWith("Title required");
  });

  it("rejects empty materialsURI", async () => {
    const { contract } = await loadFixture(deployFixture);
    await expect(
      contract.createEvent(
        SAMPLE.title,
        SAMPLE.description,
        SAMPLE.category,
        "",
        SAMPLE.eventCodeHash,
        SAMPLE.capacity,
        SAMPLE.startTime
      )
    ).to.be.revertedWith("Materials URI required");
  });

  it("rejects zero capacity", async () => {
    const { contract } = await loadFixture(deployFixture);
    await expect(
      contract.createEvent(
        SAMPLE.title,
        SAMPLE.description,
        SAMPLE.category,
        SAMPLE.materialsURI,
        SAMPLE.eventCodeHash,
        0n,
        SAMPLE.startTime
      )
    ).to.be.revertedWith("Capacity must be > 0");
  });

  it("joins event", async () => {
    const { contract, attendee } = await loadFixture(deployWithEvent);
    await expect(contract.connect(attendee).joinEvent(1))
      .to.emit(contract, "EventJoined")
      .withArgs(1n, attendee.address);
    expect(await contract.hasJoined(1, attendee.address)).to.equal(true);
  });

  it("rejects duplicate join", async () => {
    const { contract, attendee } = await loadFixture(deployWithEvent);
    await contract.connect(attendee).joinEvent(1);
    await expect(contract.connect(attendee).joinEvent(1)).to.be.revertedWith(
      "Already joined"
    );
  });

  it("rejects invalid event ID", async () => {
    const { contract, attendee } = await loadFixture(deployFixture);
    await expect(contract.connect(attendee).joinEvent(999)).to.be.revertedWith(
      "Invalid event ID"
    );
  });

  it("rejects joining full event", async () => {
    const fx = await loadFixture(deployFixture);
    const { contract, attendee, other } = fx;
    await contract.createEvent(
      SAMPLE.title,
      SAMPLE.description,
      SAMPLE.category,
      SAMPLE.materialsURI,
      SAMPLE.eventCodeHash,
      1n,
      SAMPLE.startTime
    );
    await contract.connect(attendee).joinEvent(1);
    await expect(contract.connect(other).joinEvent(1)).to.be.revertedWith(
      "Event full"
    );
  });

  it("submits attendance verification", async () => {
    const { contract, attendee } = await loadFixture(deployWithEvent);
    await contract.connect(attendee).joinEvent(1);
    await expect(
      contract.connect(attendee).submitAttendanceVerification(1, "proof://x")
    )
      .to.emit(contract, "AttendanceVerificationSubmitted")
      .withArgs(1n, attendee.address, "proof://x");
    expect(await contract.hasVerifiedAttendance(1, attendee.address)).to.equal(true);
  });

  it("rejects verification before joining", async () => {
    const { contract, attendee } = await loadFixture(deployWithEvent);
    await expect(
      contract.connect(attendee).submitAttendanceVerification(1, "proof://x")
    ).to.be.revertedWith("Not joined");
  });

  it("rejects empty verificationURI", async () => {
    const { contract, attendee } = await loadFixture(deployWithEvent);
    await contract.connect(attendee).joinEvent(1);
    await expect(
      contract.connect(attendee).submitAttendanceVerification(1, "")
    ).to.be.revertedWith("Verification URI required");
  });

  it("rejects duplicate verification", async () => {
    const { contract, attendee } = await loadFixture(deployWithEvent);
    await contract.connect(attendee).joinEvent(1);
    await contract.connect(attendee).submitAttendanceVerification(1, "proof://x");
    await expect(
      contract.connect(attendee).submitAttendanceVerification(1, "proof://y")
    ).to.be.revertedWith("Already submitted");
  });

  it("organizer approves attendance", async () => {
    const { contract, organizer, attendee } = await loadFixture(deployWithEvent);
    await contract.connect(attendee).joinEvent(1);
    await contract.connect(attendee).submitAttendanceVerification(1, "proof://x");
    await expect(contract.connect(organizer).approveAttendance(1, attendee.address))
      .to.emit(contract, "AttendanceApproved")
      .withArgs(1n, attendee.address);
    const status = await contract.getAttendeeStatus(1, attendee.address);
    expect(status.approved).to.equal(true);
  });

  it("rejects approval by non-organizer", async () => {
    const { contract, attendee, other } = await loadFixture(deployWithEvent);
    await contract.connect(attendee).joinEvent(1);
    await contract.connect(attendee).submitAttendanceVerification(1, "proof://x");
    await expect(
      contract.connect(other).approveAttendance(1, attendee.address)
    ).to.be.revertedWith("Only organizer");
  });

  it("rejects approval for non-attendee", async () => {
    const { contract, organizer, other } = await loadFixture(deployWithEvent);
    await expect(
      contract.connect(organizer).approveAttendance(1, other.address)
    ).to.be.revertedWith("Not an attendee");
  });

  it("rejects approval before verification", async () => {
    const { contract, organizer, attendee } = await loadFixture(deployWithEvent);
    await contract.connect(attendee).joinEvent(1);
    await expect(
      contract.connect(organizer).approveAttendance(1, attendee.address)
    ).to.be.revertedWith("Verification not submitted");
  });

  it("claims skill badge after approval", async () => {
    const { contract, organizer, attendee } = await loadFixture(deployWithEvent);
    await contract.connect(attendee).joinEvent(1);
    await contract.connect(attendee).submitAttendanceVerification(1, "proof://x");
    await contract.connect(organizer).approveAttendance(1, attendee.address);
    await expect(contract.connect(attendee).claimSkillBadge(1))
      .to.emit(contract, "SkillBadgeClaimed")
      .withArgs(1n, attendee.address);
    expect(await contract.hasClaimedBadge(1, attendee.address)).to.equal(true);
  });

  it("rejects badge claim before approval", async () => {
    const { contract, attendee } = await loadFixture(deployWithEvent);
    await contract.connect(attendee).joinEvent(1);
    await contract.connect(attendee).submitAttendanceVerification(1, "proof://x");
    await expect(contract.connect(attendee).claimSkillBadge(1)).to.be.revertedWith(
      "Not approved"
    );
  });

  it("rejects duplicate badge claim", async () => {
    const { contract, organizer, attendee } = await loadFixture(deployWithEvent);
    await contract.connect(attendee).joinEvent(1);
    await contract.connect(attendee).submitAttendanceVerification(1, "proof://x");
    await contract.connect(organizer).approveAttendance(1, attendee.address);
    await contract.connect(attendee).claimSkillBadge(1);
    await expect(contract.connect(attendee).claimSkillBadge(1)).to.be.revertedWith(
      "Already claimed"
    );
  });

  it("returns user event IDs", async () => {
    const { contract, attendee } = await loadFixture(deployWithEvent);
    await contract.createEvent(
      "Second",
      "desc",
      "Hackathon",
      "ipfs://m2",
      "hash2",
      3n,
      SAMPLE.startTime
    );
    await contract.connect(attendee).joinEvent(1);
    await contract.connect(attendee).joinEvent(2);
    const ids = await contract.getUserEventIds(attendee.address);
    expect(ids.map((x) => Number(x))).to.deep.equal([1, 2]);
  });

  it("emits key events", async () => {
    const { contract, organizer, attendee } = await loadFixture(deployFixture);
    await expect(
      contract.createEvent(
        SAMPLE.title,
        SAMPLE.description,
        SAMPLE.category,
        SAMPLE.materialsURI,
        SAMPLE.eventCodeHash,
        SAMPLE.capacity,
        SAMPLE.startTime
      )
    ).to.emit(contract, "EventCreated");
    await expect(contract.connect(attendee).joinEvent(1)).to.emit(
      contract,
      "EventJoined"
    );
    await expect(
      contract.connect(attendee).submitAttendanceVerification(1, "proof://x")
    ).to.emit(contract, "AttendanceVerificationSubmitted");
    await expect(
      contract.connect(organizer).approveAttendance(1, attendee.address)
    ).to.emit(contract, "AttendanceApproved");
    await expect(contract.connect(attendee).claimSkillBadge(1)).to.emit(
      contract,
      "SkillBadgeClaimed"
    );
  });
});
