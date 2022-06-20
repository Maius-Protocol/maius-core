import * as anchor from '@project-serum/anchor';
import {Program, BN, Wallet, AnchorProvider} from '@project-serum/anchor';

import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_CLOCK_PUBKEY
} from '@solana/web3.js';

import { MaiusPayment } from "../target/types/maius_payment";

const utf8 = anchor.utils.bytes.utf8;

describe("maius-core", () => {
  // Configure the client to use the local cluster.
  const provider = AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.MaiusPayment as Program<MaiusPayment>;

  let merchantAuthorWallet: Wallet;

  let service: PublicKey,
      serviceName: string,
      expectedAmount: number,
      expirationPeriod: number,
      merchant: PublicKey;

  let serviceBump: number,
      merchantBump: number;

  before("Boilerplates", async () => {
    // Creating a wallet for subscription author
    merchantAuthorWallet = new Wallet(Keypair.generate());
    await provider.connection.confirmTransaction(
        await provider.connection.requestAirdrop(merchantAuthorWallet.publicKey, 3 * LAMPORTS_PER_SOL),
        "confirmed"
    );
    console.log('merchant author wallet', await provider.connection.getBalance(merchantAuthorWallet.publicKey))
  });

  it('Initialize a merchant', async () => {

    [merchant, merchantBump] = await PublicKey.findProgramAddress(
        [
          utf8.encode("merchant"),
          merchantAuthorWallet.publicKey.toBuffer(),
        ],
        program.programId
    );


    const _tx = await program.rpc.initializeMerchant( {
      accounts: {
        merchantAccount: merchant,
        user: merchantAuthorWallet.publicKey,
        // rent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
      },
      signers: [merchantAuthorWallet.payer]
    });
  });

  it('Initialize a service', async () => {
    serviceName = "Neflix";
    expectedAmount = 1;
    expirationPeriod = 90;
    const merchantAccount = await program.account.merchant.fetch(merchant);
    [service, serviceBump] = await PublicKey.findProgramAddress(
        [
          utf8.encode("service"),
          merchant.toBuffer(),
          new anchor.BN(merchantAccount.serviceCount)?.toArrayLike(Buffer),,
        ],
        program.programId
    );


    const _tx = await program.rpc.createService( serviceName, new BN(expectedAmount), new BN(expirationPeriod), {
      accounts: {
        merchantAccount: merchant,
        serviceAccount: service,
        authority: merchantAuthorWallet.publicKey,
        // rent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
      },
      signers: [merchantAuthorWallet.payer]
    });
  });

});
