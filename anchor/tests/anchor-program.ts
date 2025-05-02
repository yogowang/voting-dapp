import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { AnchorProgram } from "../target/types/anchor_program";
import { PublicKey } from "@solana/web3.js";
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
  });
});
