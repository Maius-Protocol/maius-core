use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use chrono::{Datelike, NaiveDate, NaiveDateTime};

pub mod schema;
pub mod instructions;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;

declare_id!("oBqg1ZeS6J5QJKXMEYmxNGF4CCe3B1rYCJ4ZSkuYXHT");

#[program]
pub mod maius_payment {
    use super::*;

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

    pub fn create_service(ctx: Context<CreateService>, title: String, expected_amount: u64, expiration_period: i64) -> ProgramResult {
        ctx.accounts.service_account.authority = *ctx.accounts.authority.to_account_info().key;
        ctx.accounts.service_account.title = title;
        ctx.accounts.service_account.expected_amount = expected_amount;
        ctx.accounts.merchant_account.service_count += 1;
        ctx.accounts.service_account.expiration_period = expiration_period;
        Ok(())
    }

    pub fn initialize_invoice(ctx: Context<InitializeInvoice>) -> ProgramResult {
        ctx.accounts.invoice_account.user_wallet = *ctx.accounts.customer_authority.to_account_info().key;
        ctx.accounts.service_account.subscription_accounts.push(ctx.accounts.invoice_account.user_wallet);
        ctx.accounts.invoice_account.is_paid = false;
        ctx.accounts.invoice_account.expiration_timestamp = Clock::get().unwrap().unix_timestamp + ctx.accounts.service_account.expiration_period;
        ctx.accounts.customer_services_account.invoice_count += 1;
        Ok(())
    }
    
    // TODO: Not privacy yet, need light protocol here
    pub fn tranfer_a_to_b(ctx: Context<TransferAToB>, amount: u64) -> Result<()> {
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

    // Pay for invoice
    pub fn transfer_b_to_wallet(ctx: Context<UpdateInvoice>) -> ProgramResult  {
        let wallet_b = &ctx.accounts.wallet_b;
        let invoice = &mut ctx.accounts.invoice_account;
        let expected_amount = ctx.accounts.service_account.expected_amount;
        let merchant_account = &ctx.accounts.merchant_account;
        let wallet_b_sol: u64 = ctx.accounts.wallet_b.try_lamports().unwrap() / LAMPORTS_PER_SOL;

        // if Clock::get().unwrap().unix_timestamp > invoice.expiration_timestamp {
        //     return err!(MyError::expiration_time_exceed);
        // }

        if (wallet_b_sol >= expected_amount && Clock::get().unwrap().unix_timestamp <= invoice.expiration_timestamp) {
            let ix_sol_transfer = anchor_lang::solana_program::system_instruction::transfer(
                &wallet_b.key(),
                &merchant_account.key(),
                expected_amount,
            );
        
            anchor_lang::solana_program::program::invoke(
                &ix_sol_transfer,
                &[wallet_b.to_account_info(), merchant_account.to_account_info()]

            )?;
            
            invoice.is_paid = true;
        }

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct TransferAToB<'info> {
    /// CHECK:
    #[account(mut)]
    pub wallet_a: AccountInfo<'info>,
    /// CHECK:
    #[account(mut)]
    pub wallet_b: AccountInfo<'info>,
}

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
    pub subscription_accounts: Vec<Pubkey>,
    // milliseconds
    pub expiration_period: i64,
}

#[account]
#[derive(Default)]
pub struct ServiceInvoice {
    pub service_account: Pubkey,
    pub invoice_accounts: Vec<Pubkey>,
}

#[account]
#[derive(Default)]
pub struct CustomerServices {
    pub invoice_count: u8,
}

#[derive(Accounts)]
#[instruction(title: String, expected_amount: u64, expiration_period: i64)]
pub struct CreateService<'info> {
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
        init_if_needed,
        seeds = [
        b"customer_service".as_ref(),
        service_account.key().as_ref(),
        customer_authority.key().as_ref(),
        ],
        bump,
        payer = customer_authority,
        space = 8 + 1
    )]
    pub customer_services_account: Account<'info, CustomerServices>,
    #[account(
    init,
    seeds = [
    service_account.key().as_ref(),
    b"invoice".as_ref(),
    customer_authority.key().as_ref(),
    &[customer_services_account.invoice_count as u8].as_ref()
    // u32::to_be_bytes(get_28th_day_of_current_month().date().month()).as_ref(),
    // u32::to_be_bytes((get_28th_day_of_current_month().date().year() % 2000) as u32).as_ref()
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

#[derive(Accounts)]
// #[instruction(title: String, expected_amount: u64)]
pub struct UpdateInvoice<'info> {
    #[account(mut)]
    pub merchant_account: Account<'info, Merchant>,
    #[account(mut)]
    pub service_account: Account<'info, Service>,
    #[account(mut)]
    pub invoice_account: Account<'info, Invoice>,
    #[account(mut)]
    pub wallet_b: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[account]
pub struct Invoice {
    pub user_wallet: Pubkey,
    pub is_paid: bool,
    // unix timestamp: expiration_timestamp = current_timestamp + expiration_period
    pub expiration_timestamp: i64,
}

pub fn get_28th_day_of_current_month() -> NaiveDateTime {
    let current_timestamp = Clock::get().unwrap().unix_timestamp;
    let current_date_time = NaiveDateTime::from_timestamp(current_timestamp, 0).date();
    let current_year = current_date_time.year();
    let current_month = current_date_time.month();
    let date_time: NaiveDateTime = NaiveDate::from_ymd(current_year, current_month, 28).and_hms(0, 0, 0);
    return date_time;
}

#[error_code]
pub enum MyError {
    #[msg("expiration_time_exceed")]
    expiration_time_exceed,
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