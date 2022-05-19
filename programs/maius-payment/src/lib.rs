use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use chrono::{Datelike, NaiveDate, NaiveDateTime};

pub mod schema;
pub mod instructions;

declare_id!("oBqg1ZeS6J5QJKXMEYmxNGF4CCe3B1rYCJ4ZSkuYXHT");

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

    pub fn update_merchant(ctx: Context<UpdateMerchant>, title: String, logo: String) -> ProgramResult {
        let merchant_account = &mut ctx.accounts.merchant_account;
        merchant_account.title = title;
        merchant_account.logo = logo;
        Ok(())
    }

    pub fn create_service(ctx: Context<CreateService>, title: String, expected_amount: u64) -> ProgramResult {
        ctx.accounts.service_account.authority = *ctx.accounts.authority.to_account_info().key;
        ctx.accounts.service_account.title = title;
        ctx.accounts.service_account.expected_amount = expected_amount;
        ctx.accounts.merchant_account.service_count += 1;
        Ok(())
    }

    pub fn initialize_invoice(ctx: Context<InitializeInvoice>) -> ProgramResult {
        ctx.accounts.invoice_account.user_wallet = *ctx.accounts.authority.to_account_info().key;
        ctx.accounts.service_account.subscription_accounts.push(ctx.accounts.invoice_account.user_wallet);
        ctx.accounts.invoice_account.is_paid = false;
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
    space = 1000
    )]
    pub merchant_account: Account<'info, Merchant>,
    #[account(mut)]
    pub user: Signer<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String, logo: String)]
pub struct UpdateMerchant<'info> {
    #[account(mut)]
    pub merchant_account: Account<'info, Merchant>,
}

#[account]
#[derive(Default)]
pub struct Merchant {
    pub service_count: u8,
    pub title: String,
    pub logo: String,
    pub authority: Pubkey,
}

#[account]
#[derive(Default)]
pub struct Service {
    pub authority: Pubkey,
    pub title: String,
    pub expected_amount: u64,
    pub subscription_accounts: Vec<Pubkey>
}

#[derive(Accounts)]
#[instruction(title: String, expected_amount: u64)]
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

#[derive(Accounts)]
pub struct InitializeInvoice<'info> {
    #[account(mut)]
    pub service_account: Account<'info, Service>,
    #[account(
    init,
    seeds = [
    service_account.key().as_ref(),
    b"invoice".as_ref(),
    authority.key().as_ref(),
    &[get_28th_day_of_current_month().try_into().unwrap()]
    ],
    bump,
    payer = authority,
    space = 1000
    )]
    pub invoice_account: Account<'info, Invoice>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
// #[instruction(title: String, expected_amount: u64)]
pub struct UpdateInvoice<'info> {
    #[account(mut)]
    pub service_account: Account<'info, Service>,
    #[account(mut)]
    pub invoice_account: Account<'info, Invoice>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>
}


#[account]
pub struct Invoice {
    pub user_wallet: Pubkey,
    pub is_paid: bool,
}

pub fn get_28th_day_of_current_month() -> i64 {
    let current_timestamp = Clock::get().unwrap().unix_timestamp;
    let current_date_time = NaiveDateTime::from_timestamp(current_timestamp, 0).date();
    let current_year = current_date_time.year();
    let current_month = current_date_time.month();
    let date_time: NaiveDateTime = NaiveDate::from_ymd(current_year, current_month, 28).and_hms(0, 0, 0);
    return date_time.timestamp();
}


// impl Merchant {
//     pub fn space(title: &str, logo: &str) -> usize {
//         8 + // discriminator
//             8 + // service_count
//             32 + // authority
//             4 + title.len() + // title
//             4 + logo.len() // logo
//     }
// }