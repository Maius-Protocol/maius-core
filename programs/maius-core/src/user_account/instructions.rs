use crate::user_account::state::UserAccount;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct InitializeUserAccount<'info> {
    #[account(
        init_if_needed,
        payer = pubkey_signer,
        space=UserAccount::SIZE
    )]
    pub user_account_data: Account<'info, UserAccount>,

    #[account(mut)]
    pub pubkey_signer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn initialize_user_account(_ctx: Context<InitializeUserAccount>) -> Result<()> {
    Ok(())
}

// pub fn initialize_user_account(
//     account: &AccountInfo,
//     pubkey_signer: Pubkey,
//     rent: Rent,
// ) -> Result<(), ProgramError> {
//     //check for rent exemption
//     if !rent.is_exempt(**account.lamports.borrow(), account.data.borrow().len()) {
//         msg!("Insufficient balance to initialize rent exempt user account.");
//         return Err(ProgramError::AccountNotRentExempt);
//     }

//     //initialize
//     let mut user_account_data = UserAccount::unpack(&account.data.borrow())?;
//     user_account_data.owner_pubkey = pubkey_signer;
//     UserAccount::pack_into_slice(&user_account_data, &mut account.data.borrow_mut());
//     Ok(())
// }
