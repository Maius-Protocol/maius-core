import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { MaiusCore } from "../target/types/maius_core";

describe("maius-core", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.MaiusCore as Program<MaiusCore>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
