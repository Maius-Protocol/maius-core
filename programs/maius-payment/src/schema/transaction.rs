use anchor_lang::prelude::*;

#[account]
pub struct Transaction {
    pub user_wallet: Pubkey,
    pub order_id: String,
    pub service_id: String,
    pub is_paid: bool,
}

impl Transaction {
    pub fn space(order_id: &str, service_id: &str) -> usize {
        8 + // discriminator
        32 + // user_wallet
        4 + order_id.len() + // order_id
        4 + service_id.len() + // service_id
        1 // is_paid
    }
}