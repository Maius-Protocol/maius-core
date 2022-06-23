use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct CustomerServices {
    pub invoice_count: u8,
}

impl CustomerServices {
    pub fn space() -> usize {
        1 // invoice_count
    }
}