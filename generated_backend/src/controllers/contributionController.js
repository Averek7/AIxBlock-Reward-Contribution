const prisma = require('../config/db');
// Add a new contribution
exports.addContribution = async (req, res) => {
    const { userPubkey, contributionType, points } = req.body;
    try {
        const contribution = await prisma.contribution.create({
            data: { userPubkey, contributionType, points },
        });
        res.status(201).json({ success: true, contribution });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get all contributions
exports.getContributions = async (req, res) => {
    try {
        const contributions = await prisma.contribution.findMany();
        res.json(contributions);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
