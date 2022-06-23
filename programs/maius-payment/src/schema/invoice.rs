use anchor_lang::prelude::*;

#[account]
pub struct Invoice {
    pub user_wallet: Pubkey,
    pub is_paid: bool,
    pub start_timestamp: u64, 
    // unix timestamp: expiration_timestamp = current_timestamp + expiration_period
    pub expiration_timestamp: u64,
    pub created_timestamp: u64,
}

impl Invoice {
    pub fn space() -> usize {
        32 + // user_wallet
        1 +  // is_paid
        8 + // start_timestamp
        8 + // expiration_timestamp
        8 // created_timestamp
    }
}