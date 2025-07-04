import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { Voting } from "../target/types/voting";
import { PublicKey } from "@solana/web3.js";
import { expect } from "chai";
const IDL = require("../target/idl/voting.json");
const votingAddress= new PublicKey("HrnLkCivatsDhzp7PmLWRdPasPk4o6upf5WgvAoFyGCV");
describe("voting", () => {

  let context;
  let provider;
  let votingProgram;
  before(async () => {
    context = await startAnchor("", [{name:"voting",programId: votingAddress}], []);
    provider = new BankrunProvider(context);
    votingProgram = new Program<Voting>(
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
      "thorn",
      new anchor.BN(1),
    ).rpc();
    await votingProgram.methods.initializeCandidate(
      "fuze",
      new anchor.BN(1),
    ).rpc();
    const [smoothieAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8),Buffer.from("thorn")],
      votingAddress,
    )
    const smoothieCandidate = await votingProgram.account.candidate.fetch(smoothieAddress);
    console.log(smoothieCandidate);
    expect(smoothieCandidate.candidateVotes.toNumber()).to.equal(0);

    const [fuzeAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8),Buffer.from("fuze")],
      votingAddress,
    )
    const fuzeCandidate = await votingProgram.account.candidate.fetch(fuzeAddress);
    console.log(fuzeCandidate);
    expect(fuzeCandidate.candidateVotes.toNumber()).to.equal(0);
  });
  it("vote", async () => {
    await votingProgram.methods.vote("thorn",
      new anchor.BN(1)
    ).rpc()
     const [thornAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8),Buffer.from("thorn")],
      votingAddress,
    )
    const thornCandidate = await votingProgram.account.candidate.fetch(thornAddress);
    console.log(thornCandidate);
    expect(thornCandidate.candidateVotes.toNumber()).to.equal(1);
  });
});
