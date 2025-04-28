import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
import { AnchorProgram } from "../target/types/anchor_program";
const IDL = require("../target/idl/anchor_program.json");

describe("voting", () => {

  it("voting initialized!", async () => {
    const context = await startAnchor("", [], []);

	  const provider = new BankrunProvider(context);
  });
});
