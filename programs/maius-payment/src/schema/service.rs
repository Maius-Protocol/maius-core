use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct Service {
    pub authority: Pubkey,
    pub title: String,
    pub expected_amount: u64,
    pub subscription_accounts: Vec<Pubkey>,
    // milliseconds
    pub expiration_period: u64, // Un-explainable bug when using i64.
}