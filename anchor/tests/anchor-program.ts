import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { AnchorProgram } from "../target/types/anchor_program";
import { PublicKey } from "@solana/web3.js";
import { expect } from "chai";
const IDL = require("../target/idl/anchor_program.json");
const votingAddress= new PublicKey("HrnLkCivatsDhzp7PmLWRdPasPk4o6upf5WgvAoFyGCV");
describe("voting", () => {

  let context;
  let provider;
  let votingProgram;
  before(async () => {
    context = await startAnchor("", [{name:"voting",programId: votingAddress}], []);
    provider = new BankrunProvider(context);
    votingProgram = new Program<AnchorProgram>(
      IDL,
      provider,
    );
  });
  it("voting initialized!", async () => {
    
    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "test poll",
      new anchor.BN(0),
      new anchor.BN(1746226096),
    ).rpc();
    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      votingAddress,
    )
    const poll = await votingProgram.account.poll.fetch(pollAddress);
    console.log(poll);
    expect(poll.pollId.toNumber()).to.equal(1);
    expect(poll.description).to.equal("test poll");
    expect(poll.pollStart.toNumber()).to.lessThan(poll.pollEnd.toNumber());
  });
  it("initialize candidate", async () => {
    await votingProgram.methods.initializeCandidate(
      "smoothie",
      new anchor.BN(1),
    ).rpc();
    await votingProgram.methods.initializeCandidate(
      "crepe",
      new anchor.BN(1),
    ).rpc();
    const [smoothieAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8),Buffer.from("smoothie")],
      votingAddress,
    )
    const smoothieCandidate = await votingProgram.account.candidate.fetch(smoothieAddress);
    console.log(smoothieCandidate);
  });
  it("vote", async () => {

  });
});
