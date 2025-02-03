use anchor_lang::prelude::*;

declare_id!("CbKtS5cKQLBKS9Hn89jpxoRLQvG9KdjcqsaHhdZqaVwx");

#[program]
pub mod contract {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn log_contribution(
        ctx: Context<LogContribution>,
        contribution_type: String,
        points: u64,
    ) -> Result<()> {
        let contribution = &mut ctx.accounts.contribution;
        contribution.user_pubkey = *ctx.accounts.user.key;
        contribution.contribution_type = contribution_type;
        contribution.points = points;
        contribution.timestamp = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn distribute_rewards(
        ctx: Context<DistributeRewards>,
        total_points: u64,
        monthly_pool: u64,
    ) -> Result<()> {
        let user = &ctx.accounts.user;
        let user_points = ctx.accounts.contribution.points;
        let reward_tokens =
            (user_points as u128 * monthly_pool as u128 / total_points as u128) as u64;

        let reward = &mut ctx.accounts.reward;
        reward.user_pubkey = *user.key;
        reward.tokens = reward_tokens;
        reward.timestamp = Clock::get()?.unix_timestamp;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct LogContribution<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(init, payer = user, space = 8 + 64)]
    pub contribution: Account<'info, Contribution>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DistributeRewards<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub contribution: Account<'info, Contribution>,
    #[account(init, payer = user, space = 8 + 64)]
    pub reward: Account<'info, Reward>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Contribution {
    pub user_pubkey: Pubkey,
    pub contribution_type: String,
    pub points: u64,
    pub timestamp: i64,
}

#[account]
pub struct Reward {
    pub user_pubkey: Pubkey,
    pub tokens: u64,
    pub timestamp: i64,
}
