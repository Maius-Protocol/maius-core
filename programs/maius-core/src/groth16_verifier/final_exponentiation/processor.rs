use crate::groth16_verifier::final_exponentiation::{
    instructions::{
        conjugate_wrapper, custom_cubic_inverse_1, custom_cubic_inverse_2,
        custom_cyclotomic_square, custom_cyclotomic_square_in_place, custom_f_inverse_1,
        custom_f_inverse_2, custom_f_inverse_3, custom_f_inverse_4, custom_f_inverse_5,
        custom_frobenius_map_1, custom_frobenius_map_2, custom_frobenius_map_3,
        custom_quadratic_fp256_inverse_1, custom_quadratic_fp256_inverse_2, mul_assign_1,
        mul_assign_2,
    },
    ranges::*,
    state::FinalExponentiationState,
};
use solana_program::program_error::ProgramError;

// processes instructions to compute final exponentiation analogue to
// https://docs.rs/ark-ec/0.3.0/src/ark_ec/models/bn/mod.rs.html#151-211
// for a detailed test see tests/offchain_final_exponentiation.rs

pub fn _process_instruction(
    account_struct: &mut FinalExponentiationState,
    id: u8,
) -> Result<(), ProgramError> {
    if id == 0 {
        //init and conjugate
        account_struct.f1_r_range = account_struct.f_f2_range.clone();
        //Zero out y6_range for proof data was stored in this range for miller loop.
        let zeros = vec![0u8; 384];
        account_struct.y6_range = zeros;
        conjugate_wrapper(&mut account_struct.f1_r_range);
        account_struct.changed_variables[F2_R_RANGE_ITER] = true;
        account_struct.changed_variables[F_F2_RANGE_ITER] = true;
        account_struct.changed_variables[Y6_RANGE_ITER] = true;
    } else if id == 1 {
        custom_f_inverse_1(
            &account_struct.f_f2_range,
            &mut account_struct.cubic_range_1,
        );
        account_struct.changed_variables[CUBIC_RANGE_1_ITER] = true;
    } else if id == 2 {
        custom_f_inverse_2(
            &account_struct.f_f2_range,
            &mut account_struct.cubic_range_0,
            &account_struct.cubic_range_1,
        );
        account_struct.changed_variables[CUBIC_RANGE_0_ITER] = true;
    } else if id == 3 {
        custom_cubic_inverse_1(
            &account_struct.cubic_range_0,
            &mut account_struct.quad_range_0,
            &mut account_struct.quad_range_1,
            &mut account_struct.quad_range_2,
            &mut account_struct.quad_range_3,
        );
        account_struct.changed_variables[QUAD_RANGE_0_ITER] = true;
        account_struct.changed_variables[QUAD_RANGE_1_ITER] = true;
        account_struct.changed_variables[QUAD_RANGE_2_ITER] = true;
        account_struct.changed_variables[QUAD_RANGE_3_ITER] = true;
    } else if id == 4 {
        custom_quadratic_fp256_inverse_1(
            &account_struct.quad_range_3,
            &mut account_struct.fp256_range,
        );
        account_struct.changed_variables[FP384_RANGE_ITER] = true;
    } else if id == 5 {
        custom_quadratic_fp256_inverse_2(
            &mut account_struct.quad_range_3,
            &account_struct.fp256_range,
        );
        account_struct.changed_variables[QUAD_RANGE_3_ITER] = true;
    } else if id == 6 {
        custom_cubic_inverse_2(
            &mut account_struct.cubic_range_0,
            &account_struct.quad_range_0,
            &account_struct.quad_range_1,
            &account_struct.quad_range_2,
            &account_struct.quad_range_3,
        );
        account_struct.changed_variables[CUBIC_RANGE_0_ITER] = true;
    } else if id == 7 {
        custom_f_inverse_3(
            &mut account_struct.cubic_range_1,
            &account_struct.cubic_range_0,
            &account_struct.f_f2_range,
        );
        account_struct.changed_variables[CUBIC_RANGE_1_ITER] = true;
    } else if id == 8 {
        custom_f_inverse_4(
            &mut account_struct.cubic_range_0,
            &account_struct.f_f2_range,
        );
        account_struct.changed_variables[CUBIC_RANGE_0_ITER] = true;
    } else if id == 9 {
        custom_f_inverse_5(
            &account_struct.cubic_range_0,
            &account_struct.cubic_range_1,
            &mut account_struct.f_f2_range,
        );
        account_struct.changed_variables[F_F2_RANGE_ITER] = true;
    } else if id == 10 {
        mul_assign_1(
            &account_struct.f1_r_range,
            &account_struct.f_f2_range,
            &mut account_struct.cubic_range_0,
            &mut account_struct.cubic_range_1,
        );
        account_struct.changed_variables[CUBIC_RANGE_0_ITER] = true;
        account_struct.changed_variables[CUBIC_RANGE_1_ITER] = true;
    } else if id == 11 {
        mul_assign_2(
            &account_struct.f_f2_range,
            &account_struct.cubic_range_0,
            &account_struct.cubic_range_1,
            &mut account_struct.f1_r_range,
        );
        account_struct.changed_variables[F2_R_RANGE_ITER] = true;
    } else if id == 12 {
        account_struct.f_f2_range = account_struct.f1_r_range.clone();
        account_struct.changed_variables[F_F2_RANGE_ITER] = true;
    } else if id == 13 {
        custom_frobenius_map_2(&mut account_struct.f1_r_range);
        account_struct.changed_variables[F2_R_RANGE_ITER] = true;
    } else if id == 14 {
        account_struct.i_range = account_struct.f1_r_range.clone();
        conjugate_wrapper(&mut account_struct.i_range);
        account_struct.y0_range = account_struct.f1_r_range.clone();
        account_struct.changed_variables[I_RANGE_ITER] = true;
        account_struct.changed_variables[Y0_RANGE_ITER] = true;
    } else if id == 15 {
        custom_cyclotomic_square_in_place(&mut account_struct.y0_range);
        account_struct.changed_variables[Y0_RANGE_ITER] = true;
    } else if id == 16 {
        mul_assign_1(
            &account_struct.y0_range,
            &account_struct.f1_r_range,
            &mut account_struct.cubic_range_0,
            &mut account_struct.cubic_range_1,
        );
        account_struct.changed_variables[CUBIC_RANGE_0_ITER] = true;
        account_struct.changed_variables[CUBIC_RANGE_1_ITER] = true;
    } else if id == 17 {
        mul_assign_2(
            &account_struct.f1_r_range,
            &account_struct.cubic_range_0,
            &account_struct.cubic_range_1,
            &mut account_struct.y0_range,
        );
        account_struct.changed_variables[Y0_RANGE_ITER] = true;
    } else if id == 18 {
        mul_assign_1(
            &account_struct.y0_range,
            &account_struct.i_range,
            &mut account_struct.cubic_range_0,
            &mut account_struct.cubic_range_1,
        );
        account_struct.changed_variables[CUBIC_RANGE_0_ITER] = true;
        account_struct.changed_variables[CUBIC_RANGE_1_ITER] = true;
    } else if id == 19 {
        mul_assign_2(
            &account_struct.i_range,
            &account_struct.cubic_range_0,
            &account_struct.cubic_range_1,
            &mut account_struct.y0_range,
        );
        account_struct.changed_variables[Y0_RANGE_ITER] = true;
    } else if id == 20 {
        conjugate_wrapper(&mut account_struct.y0_range);
        custom_cyclotomic_square(&account_struct.y0_range, &mut account_struct.y1_range);
        account_struct.changed_variables[Y1_RANGE_ITER] = true;
    } else if id == 21 {
        custom_cyclotomic_square(&account_struct.y1_range, &mut account_struct.y0_range);
        account_struct.changed_variables[Y0_RANGE_ITER] = true;
    } else if id == 22 {
        mul_assign_1(
            &account_struct.y0_range,
            &account_struct.y1_range,
            &mut account_struct.cubic_range_0,
            &mut account_struct.cubic_range_1,
        );

        account_struct.changed_variables[CUBIC_RANGE_0_ITER] = true;
        account_struct.changed_variables[CUBIC_RANGE_1_ITER] = true;
    } else if id == 23 {
        mul_assign_2(
            &account_struct.y1_range,
            &account_struct.cubic_range_0,
            &account_struct.cubic_range_1,
            &mut account_struct.y0_range,
        );
        account_struct.changed_variables[Y0_RANGE_ITER] = true;
    } else if id == 24 {
        account_struct.i_range = account_struct.y0_range.clone();
        conjugate_wrapper(&mut account_struct.i_range);
        account_struct.y2_range = account_struct.y0_range.clone();
        account_struct.changed_variables[I_RANGE_ITER] = true;
        account_struct.changed_variables[Y2_RANGE_ITER] = true;
    } else if id == 25 {
        custom_cyclotomic_square_in_place(&mut account_struct.y2_range);
        account_struct.changed_variables[Y2_RANGE_ITER] = true;
    } else if id == 26 {
        mul_assign_1(
            &account_struct.y2_range,
            &account_struct.y0_range,
            &mut account_struct.cubic_range_0,
            &mut account_struct.cubic_range_1,
        );

        account_struct.changed_variables[CUBIC_RANGE_0_ITER] = true;
        account_struct.changed_variables[CUBIC_RANGE_1_ITER] = true;
    } else if id == 27 {
        mul_assign_2(
            &account_struct.y0_range,
            &account_struct.cubic_range_0,
            &account_struct.cubic_range_1,
            &mut account_struct.y2_range,
        );

        account_struct.changed_variables[Y2_RANGE_ITER] = true;
    } else if id == 28 {
        mul_assign_1(
            &account_struct.y2_range,
            &account_struct.i_range,
            &mut account_struct.cubic_range_0,
            &mut account_struct.cubic_range_1,
        );
        account_struct.changed_variables[CUBIC_RANGE_0_ITER] = true;
        account_struct.changed_variables[CUBIC_RANGE_1_ITER] = true;
    } else if id == 29 {
        mul_assign_2(
            &account_struct.i_range,
            &account_struct.cubic_range_0,
            &account_struct.cubic_range_1,
            &mut account_struct.y2_range,
        );

        account_struct.changed_variables[Y2_RANGE_ITER] = true;
    } else if id == 30 {
        conjugate_wrapper(&mut account_struct.y2_range);
        custom_cyclotomic_square(&account_struct.y2_range, &mut account_struct.f_f2_range);
        account_struct.changed_variables[Y2_RANGE_ITER] = true;
        account_struct.changed_variables[F_F2_RANGE_ITER] = true;
    } else if id == 31 {
        account_struct.i_range = account_struct.f_f2_range.clone();
        conjugate_wrapper(&mut account_struct.i_range);
        account_struct.y6_range = account_struct.f_f2_range.clone();
        //custom_cyclotomic_square_in_place(&mut account_struct.y6_range);
        account_struct.changed_variables[I_RANGE_ITER] = true;
        account_struct.changed_variables[Y6_RANGE_ITER] = true;
    } else if id == 32 {
        custom_cyclotomic_square_in_place(&mut account_struct.y6_range);
        account_struct.changed_variables[Y6_RANGE_ITER] = true;
    } else if id == 33 {
        mul_assign_1(
            &account_struct.y6_range,
            &account_struct.f_f2_range,
            &mut account_struct.cubic_range_0,
            &mut account_struct.cubic_range_1,
        );
        account_struct.changed_variables[CUBIC_RANGE_0_ITER] = true;
        account_struct.changed_variables[CUBIC_RANGE_1_ITER] = true;
    } else if id == 34 {
        mul_assign_2(
            &account_struct.f_f2_range,
            &account_struct.cubic_range_0,
            &account_struct.cubic_range_1,
            &mut account_struct.y6_range,
        );
        account_struct.changed_variables[Y6_RANGE_ITER] = true;
    } else if id == 35 {
        mul_assign_1(
            &account_struct.y6_range,
            &account_struct.i_range,
            &mut account_struct.cubic_range_0,
            &mut account_struct.cubic_range_1,
        );
        account_struct.changed_variables[CUBIC_RANGE_0_ITER] = true;
        account_struct.changed_variables[CUBIC_RANGE_1_ITER] = true;
    } else if id == 36 {
        mul_assign_2(
            &account_struct.i_range,
            &account_struct.cubic_range_0,
            &account_struct.cubic_range_1,
            &mut account_struct.y6_range,
        );
        account_struct.changed_variables[Y6_RANGE_ITER] = true;
    } else if id == 37 {
        conjugate_wrapper(&mut account_struct.y6_range);
        conjugate_wrapper(&mut account_struct.y0_range);
        conjugate_wrapper(&mut account_struct.y6_range);
        account_struct.changed_variables[Y6_RANGE_ITER] = true;
        account_struct.changed_variables[Y0_RANGE_ITER] = true;
    } else if id == 38 {
        mul_assign_1(
            &account_struct.y6_range,
            &account_struct.y2_range,
            &mut account_struct.cubic_range_0,
            &mut account_struct.cubic_range_1,
        );
        account_struct.changed_variables[CUBIC_RANGE_0_ITER] = true;
        account_struct.changed_variables[CUBIC_RANGE_1_ITER] = true;
    } else if id == 39 {
        mul_assign_2(
            &account_struct.y2_range,
            &account_struct.cubic_range_0,
            &account_struct.cubic_range_1,
            &mut account_struct.y6_range,
        );
        account_struct.changed_variables[Y6_RANGE_ITER] = true;
    } else if id == 40 {
        mul_assign_1(
            &account_struct.y6_range,
            &account_struct.y0_range,
            &mut account_struct.cubic_range_0,
            &mut account_struct.cubic_range_1,
        );
        account_struct.changed_variables[CUBIC_RANGE_0_ITER] = true;
        account_struct.changed_variables[CUBIC_RANGE_1_ITER] = true;
    } else if id == 41 {
        mul_assign_2(
            &account_struct.y0_range,
            &account_struct.cubic_range_0,
            &account_struct.cubic_range_1,
            &mut account_struct.y6_range,
        );
        account_struct.changed_variables[Y6_RANGE_ITER] = true;
    } else if id == 42 {
        mul_assign_1(
            &account_struct.y1_range,
            &account_struct.y6_range,
            &mut account_struct.cubic_range_0,
            &mut account_struct.cubic_range_1,
        );
        account_struct.changed_variables[CUBIC_RANGE_0_ITER] = true;
        account_struct.changed_variables[CUBIC_RANGE_1_ITER] = true;
    } else if id == 43 {
        mul_assign_2(
            &account_struct.y6_range,
            &account_struct.cubic_range_0,
            &account_struct.cubic_range_1,
            &mut account_struct.y1_range,
        );
        account_struct.changed_variables[Y1_RANGE_ITER] = true;
    } else if id == 44 {
        mul_assign_1(
            &account_struct.y2_range,
            &account_struct.y6_range,
            &mut account_struct.cubic_range_0,
            &mut account_struct.cubic_range_1,
        );
        account_struct.changed_variables[CUBIC_RANGE_0_ITER] = true;
        account_struct.changed_variables[CUBIC_RANGE_1_ITER] = true;
    } else if id == 45 {
        mul_assign_2(
            &account_struct.y6_range,
            &account_struct.cubic_range_0,
            &account_struct.cubic_range_1,
            &mut account_struct.y2_range,
        );
        account_struct.changed_variables[Y2_RANGE_ITER] = true;
    } else if id == 46 {
        mul_assign_1(
            &account_struct.y2_range,
            &account_struct.f1_r_range,
            &mut account_struct.cubic_range_0,
            &mut account_struct.cubic_range_1,
        );

        account_struct.changed_variables[CUBIC_RANGE_0_ITER] = true;
        account_struct.changed_variables[CUBIC_RANGE_1_ITER] = true;
    } else if id == 47 {
        mul_assign_2(
            &account_struct.f1_r_range,
            &account_struct.cubic_range_0,
            &account_struct.cubic_range_1,
            &mut account_struct.y2_range,
        );

        account_struct.changed_variables[Y2_RANGE_ITER] = true;
    } else if id == 48 {
        account_struct.y0_range = account_struct.y1_range.clone();
        custom_frobenius_map_1(&mut account_struct.y0_range);
        account_struct.changed_variables[Y0_RANGE_ITER] = true;
    } else if id == 49 {
        mul_assign_1(
            &account_struct.y2_range,
            &account_struct.y0_range,
            &mut account_struct.cubic_range_0,
            &mut account_struct.cubic_range_1,
        );

        account_struct.changed_variables[CUBIC_RANGE_0_ITER] = true;
        account_struct.changed_variables[CUBIC_RANGE_1_ITER] = true;
    } else if id == 50 {
        mul_assign_2(
            &account_struct.y0_range,
            &account_struct.cubic_range_0,
            &account_struct.cubic_range_1,
            &mut account_struct.y2_range,
        );
        account_struct.changed_variables[Y2_RANGE_ITER] = true;
    } else if id == 51 {
        custom_frobenius_map_2(&mut account_struct.y6_range);
        account_struct.changed_variables[Y6_RANGE_ITER] = true;
    } else if id == 52 {
        conjugate_wrapper(&mut account_struct.f1_r_range);

        account_struct.changed_variables[F2_R_RANGE_ITER] = true;
    } else if id == 53 {
        mul_assign_1(
            &account_struct.y1_range,
            &account_struct.f1_r_range,
            &mut account_struct.cubic_range_0,
            &mut account_struct.cubic_range_1,
        );
        account_struct.changed_variables[CUBIC_RANGE_0_ITER] = true;
        account_struct.changed_variables[CUBIC_RANGE_1_ITER] = true;
    } else if id == 54 {
        mul_assign_2(
            &account_struct.f1_r_range,
            &account_struct.cubic_range_0,
            &account_struct.cubic_range_1,
            &mut account_struct.y1_range,
        );
        account_struct.changed_variables[Y1_RANGE_ITER] = true;
    } else if id == 55 {
        custom_frobenius_map_3(&mut account_struct.y1_range);
        account_struct.changed_variables[Y1_RANGE_ITER] = true;
    } else if id == 121 {
        mul_assign_1(
            &account_struct.f1_r_range,
            &account_struct.f_f2_range,
            &mut account_struct.cubic_range_0,
            &mut account_struct.cubic_range_1,
        );
        account_struct.changed_variables[CUBIC_RANGE_0_ITER] = true;
        account_struct.changed_variables[CUBIC_RANGE_1_ITER] = true;
    } else if id == 122 {
        mul_assign_2(
            &account_struct.f1_r_range,
            &account_struct.cubic_range_0,
            &account_struct.cubic_range_1,
            &mut account_struct.f_f2_range,
        );
        account_struct.changed_variables[F2_R_RANGE_ITER] = true;
    }
    Ok(())
}
