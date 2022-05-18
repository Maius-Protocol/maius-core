use crate::schema::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(seller_wallet: Pubkey, order_id: String, service_id: String)]
pub struct InitTransaction<'info> {
    #[account(init_if_needed, seed=[
            b'transaction'.as_ref(), 
            &authority.key().to_bytes(),  
            &seller_wallet.to_bytes()
        ], 
        payer = authority, 
        bump, 
        space = Transaction::space(&order_id, &service_id)
    )]
    pub transaction: Account<'info, Transaction>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(seller_wallet: Pubkey, order_id: String, service_id: String)]
pub struct TransferFee<'info> {
    #[account(
        mut,
        seed=[
        b'transaction'.as_ref(), 
        &authority.key().to_bytes(),  
        &seller_wallet.to_bytes()
        ], 
        bump,
    )]
    pub transaction: Account<'info, Transaction>
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Chuyen tu vi B -> Seller thanh cong
pub fn init(ctx: Context<InitTransaction>, seller_wallet: Pubkey, order_id: String, service_id: String, user_wallet: Pubkey) -> Result<()> {
    let transaction = &mut ctx.accounts.transaction;
    transaction.order_id = order_id
    transaction.service_id = service_id
    transaction.user_wallet = user_wallet
    transaction.is_paid = false;
    
    Ok(())
}

pub fn transfer(ctx: Context<InitTransaction>, seller_wallet: Pubkey) -> Result<()> {

    let wallet_b = &mut ctx.accounts.authority;
    let transaction = &mut ctx.accounts.transaction;
    let ix_sol_transfer = anchor_lang::solana_program::system_instruction::transfer(
        &wallet_b.key(),
        seller_wallet,
        amount,
    );
    anchor_lang::solana_program::program::invoke(
        &ix_sol_transfer,
        &[wallet_b.to_account_info()],
    )?;
    transaction.is_paid = true;
    Ok(())
}