const router = require("express").Router();
const { distributeTokens, getRewards } = require("../controllers/rewardController");

router.post("/distribute", distributeTokens);
router.get("/", getRewards);

module.exports = router;
