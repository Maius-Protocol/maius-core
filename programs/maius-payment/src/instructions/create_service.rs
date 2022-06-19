use crate::{schema::*};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(title: String, expected_amount: u64, expiration_period: u64)]
pub struct CreateService<'info> {
    #[account(mut)]
    pub merchant_account: Account<'info, Merchant>,
    #[account(
    init,
    seeds = [
    b"service".as_ref(),
    merchant_account.key().as_ref(),
    &[merchant_account.service_count as u8].as_ref()
    ],
    bump,
    payer = authority,
    space = 8 + 256 + 8 + 4 + 32*100
    )]
    pub service_account: Account<'info, Service>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>
}

pub fn handler(ctx: Context<CreateService>, title: String, expected_amount: u64, expiration_period: u64) -> Result<()> {
    ctx.accounts.merchant_account.service_count += 1;
    ctx.accounts.service_account.authority = *ctx.accounts.authority.to_account_info().key;
    ctx.accounts.service_account.title = title;
    ctx.accounts.service_account.expected_amount = expected_amount;
    ctx.accounts.service_account.expiration_period = expiration_period;
    Ok(())
}