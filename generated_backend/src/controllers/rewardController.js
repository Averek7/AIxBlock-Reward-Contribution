const prisma = require("../config/db");

// Distribute tokens based on contribution points
exports.distributeTokens = async (req, res) => {
    try {
        const totalPoints = await prisma.contribution.aggregate({
            _sum: { points: true },
        });

        let rewardPool = 10000; // Example monthly pool
        if (totalPoints._sum.points < 500) {
            rewardPool /= 2; // Fairness mechanism
        }

        const contributions = await prisma.contribution.findMany();
        const rewards = contributions.map(c => ({
            userPubkey: c.userPubkey,
            tokens: Math.floor((c.points / totalPoints._sum.points) * rewardPool),
        }));

        for (const reward of rewards) {
            await prisma.reward.create({ data: reward });
        }

        res.json({ success: true, rewards });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get all rewards
exports.getRewards = async (req, res) => {
    try {
        const rewards = await prisma.reward.findMany();
        res.json(rewards);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
