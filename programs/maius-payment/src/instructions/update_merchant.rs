use crate::{schema::*};
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(title: String, logo: String)]
pub struct UpdateMerchant<'info> {
    #[account(mut)]
    pub merchant_account: Account<'info, Merchant>,
}

pub fn handler(ctx: Context<UpdateMerchant>, title: String, logo: String) -> Result<()> {
    let merchant_account = &mut ctx.accounts.merchant_account;
    merchant_account.title = title;
    merchant_account.logo = logo;
    Ok(())
}