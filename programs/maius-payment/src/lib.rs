use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use chrono::{Datelike, NaiveDate, NaiveDateTime};

pub mod instructions;
pub mod schema;
use anchor_lang::solana_program::native_token::LAMPORTS_PER_SOL;

use instructions::*;

declare_id!("oBqg1ZeS6J5QJKXMEYmxNGF4CCe3B1rYCJ4ZSkuYXHT");

#[program]
pub mod maius_payment {
    use super::*;

    pub fn initialize_merchant(ctx: Context<InitializeMerchant>) -> Result<()> {
        instructions::initialize_merchant::handler(ctx)
    }

    pub fn update_merchant(ctx: Context<UpdateMerchant>, title: String, logo: String) -> Result<()> {
        instructions::update_merchant::handler(ctx, title, logo)
    }

    pub fn create_service(ctx: Context<CreateService>, title: String, expected_amount: u64, expiration_period: u64) -> Result<()> {
        instructions::create_service::handler(ctx, title, expected_amount, expiration_period)
    }


    pub fn initialize_invoice(ctx: Context<InitializeInvoice>) -> Result<()> {
        instructions::initialize_invoice::handler(ctx)
    }
    
    // TODO: Not privacy yet, need light protocol here
    pub fn tranfer_a_to_b(ctx: Context<TransferAToB>, amount: u64) -> Result<()> {
       instructions::transfer_a_to_b::handler(ctx, amount)
    }

    // Pay for invoice
    pub fn transfer_b_to_wallet(ctx: Context<UpdateInvoice>) -> Result<()>  {
        instructions::update_invoice::handler(ctx)
    }
}


