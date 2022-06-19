use crate::{schema::*};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct InitializeMerchant<'info> {
    #[account(
    init,
    seeds = [
    b"merchant".as_ref(),
    user.key().as_ref(),
    ],
    bump,
    payer = user,
    space = 1000
    )]
    pub merchant_account: Account<'info, Merchant>,
    #[account(mut)]
    pub user: Signer<'info>,
    system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializeMerchant>) -> Result<()> {
    ctx.accounts.merchant_account.authority = *ctx.accounts.user.to_account_info().key;
    Ok(())
}