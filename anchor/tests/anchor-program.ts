import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { AnchorProgram } from "../target/types/anchor_program";
import { PublicKey } from "@solana/web3.js";
import { expect } from "chai";
const IDL = require("../target/idl/anchor_program.json");
const votingAddress= new PublicKey("HrnLkCivatsDhzp7PmLWRdPasPk4o6upf5WgvAoFyGCV");
describe("voting", () => {

  it("voting initialized!", async () => {
    const context = await startAnchor("", [{name:"voting",programId: votingAddress}], []);

	  const provider = new BankrunProvider(context);
    const votingProgram = new Program<AnchorProgram>(
      IDL,
      provider,
    );
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
});
