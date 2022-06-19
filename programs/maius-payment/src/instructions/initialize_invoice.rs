use crate::{schema::*};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct InitializeInvoice<'info> {
    #[account(mut)]
    pub service_account: Account<'info, Service>,
    #[account(
    init_if_needed,
    seeds = [
    b"customer_service_account".as_ref(),
    service_account.key().as_ref(),
    customer_authority.key().as_ref(),
    ],
    bump,
    payer = customer_authority,
    space = 256
    )]
    pub customer_services_account: Account<'info, CustomerServices>,
    #[account(
    init,
    seeds = [
    service_account.key().as_ref(),
    b"invoice".as_ref(),
    customer_authority.key().as_ref(),
    &[customer_services_account.invoice_count as u8].as_ref()
    ],
    bump,
    payer = customer_authority,
    space = 1000
    )]
    pub invoice_account: Account<'info, Invoice>,
    #[account(mut)]
    pub customer_authority: Signer<'info>,
    pub system_program: Program<'info, System>
}

pub fn handler(ctx: Context<InitializeInvoice>) -> Result<()> {
    let current_timestamp = Clock::get().unwrap().unix_timestamp as u64;
    ctx.accounts.invoice_account.user_wallet = *ctx.accounts.customer_authority.to_account_info().key;
    ctx.accounts.service_account.subscription_accounts.push(ctx.accounts.invoice_account.user_wallet);
    ctx.accounts.invoice_account.is_paid = false;
    ctx.accounts.invoice_account.expiration_timestamp = Clock::get().unwrap().unix_timestamp as u64 + ctx.accounts.service_account.expiration_period;
    ctx.accounts.invoice_account.created_timestamp = Clock::get().unwrap().unix_timestamp as u64;
    ctx.accounts.customer_services_account.invoice_count += 1;
    Ok(())
}
