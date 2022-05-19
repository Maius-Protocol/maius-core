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

    pub fn create_transaction(ctx: Context<CreateInvoice>) -> ProgramResult {
        ctx.accounts.transaction_account.user_wallet = *ctx.accounts.authority.to_account_info().key;
        ctx.accounts.transaction_account.is_paid = true;
        ctx.accounts.service_account.invoice_count += 1;
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
    pub invoice_count: u8,
    pub authority: Pubkey,
    pub title: String,
    pub expected_amount: u64

}

#[account]
#[derive(Default)]
pub struct ServicePeriod {
    pub expire_timestamp: i64,
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
    space = 1000
    )]
    pub service_account: Account<'info, Service>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>
}



#[derive(Accounts)]
// #[instruction(title: String, expected_amount: u64)]
pub struct InitializeInvoice<'info> {
    #[account(mut)]
    pub service_account: Account<'info, Service>,
    #[account(
    init,
    seeds = [
    service_account.key().as_ref(),
    b"invoice".as_ref(),
    service_period.key().as_ref()
    ],
    bump,
    payer = authority,
    space = 1000
    )]
    pub transaction_account: Account<'info, Invoice>,
    pub service_period: Account<'info, ServicePeriod>,
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
    pub transaction_account: Account<'info, Invoice>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>
}


#[account]
pub struct Invoice {
    pub user_wallet: Pubkey,
    pub is_paid: bool,
    pub expire_timestamp: i64,
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