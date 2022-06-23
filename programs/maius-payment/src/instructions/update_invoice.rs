use crate::{schema::*};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;

#[derive(Accounts)]
// #[instruction(title: String, expected_amount: u64)]
pub struct UpdateInvoice<'info> {
    /// CHECK:
    #[account(mut)]
    pub merchant_wallet: AccountInfo<'info>,
    #[account(mut)]
    pub service_account: Account<'info, Service>,
    #[account(mut)]
    pub invoice_account: Account<'info, Invoice>,
    #[account(mut)]
    pub wallet_b: Signer<'info>,
    pub system_program: Program<'info, System>
}

// Pay for invoice
pub fn handler(ctx: Context<UpdateInvoice>) -> Result<()>  {
    let wallet_b = &ctx.accounts.wallet_b;
    let invoice = &mut ctx.accounts.invoice_account;
    let expected_amount = ctx.accounts.service_account.expected_amount;
    let merchant_wallet = &ctx.accounts.merchant_wallet;
    let wallet_b_sol: u64 = ctx.accounts.wallet_b.try_lamports().unwrap() / LAMPORTS_PER_SOL;
    // if (wallet_b_sol >= expected_amount && Clock::get().unwrap().unix_timestamp <= invoice.expiration_timestamp) {
    let ix_sol_transfer = anchor_lang::solana_program::system_instruction::transfer(
        &wallet_b.key(),
        &merchant_wallet.key(),
        expected_amount,
    );

    anchor_lang::solana_program::program::invoke(
        &ix_sol_transfer,
        &[wallet_b.to_account_info(), merchant_wallet.clone()]

    )?;

    invoice.is_paid = true;
    // }

    Ok(())
}