use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct ServiceInvoice {
    pub service_account: Pubkey,
    pub invoice_accounts: Vec<Pubkey>,
}