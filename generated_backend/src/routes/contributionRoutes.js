const router = require('express').Router();
const { addContribution, getContributions } = require("../controllers/contributionController");

router.post("/", addContribution);
router.get("/", getContributions);

module.exports = router;