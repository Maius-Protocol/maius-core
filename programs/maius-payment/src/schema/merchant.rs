use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct Merchant {
    pub service_count: u8,
    pub title: String,
    pub logo: String,
    pub authority: Pubkey,
}