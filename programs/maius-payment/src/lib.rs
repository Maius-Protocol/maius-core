use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

pub mod schema;
pub mod instructions;


declare_id!("DxpaiU8mDpHZ3fLbN15ruifDP1QaFpY3QBSpMw71L6Pe");

#[program]
pub mod maius_payment {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn initialize_merchant(ctx: Context<InitializeMerchant>) -> ProgramResult {
        ctx.accounts.merchant_account.authority = *ctx.accounts.user.to_account_info().key;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}


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
    space = 500
    )]
    pub merchant_account: Account<'info, Merchant>,
    #[account(mut)]
    pub user: Signer<'info>,
    system_program: Program<'info, System>,
}


#[account]
#[derive(Default)]
pub struct Merchant {
    pub bump: u8,
    pub service_count: u8,
    pub title: String,
    pub logo: String,
    pub authority: Pubkey,
}

