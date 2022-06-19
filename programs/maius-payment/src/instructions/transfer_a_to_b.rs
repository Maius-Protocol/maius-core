use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint_deprecated::ProgramResult;

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct TransferAToB<'info> {
    /// CHECK:
    #[account(mut)]
    pub wallet_a: AccountInfo<'info>,
    /// CHECK:
    #[account(mut)]
    pub wallet_b: AccountInfo<'info>,
    system_program: Program<'info, System>,
}

// TODO: Not privacy yet, need light protocol here
pub fn handler(ctx: Context<TransferAToB>, amount: u64) -> Result<()> {
    let wallet_a = &ctx.accounts.wallet_a;
    let wallet_b = &ctx.accounts.wallet_b;

    let ix_sol_transfer = anchor_lang::solana_program::system_instruction::transfer(
        &wallet_a.key(),
        &wallet_b.key(),
        amount,
    );

    anchor_lang::solana_program::program::invoke(
        &ix_sol_transfer,
        &[wallet_a.to_account_info(), wallet_b.to_account_info()]
    )?;

    Ok(())
}