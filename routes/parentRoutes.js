const express = require('express');
const { assignChild, getParentOverview, updateRestrictions } = require('../controllers/ParentController');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

router.post("/create", authMiddleware,assignChild);
router.get("/paretOverview",authMiddleware,getParentOverview);
router.put("/:childId",authMiddleware,updateRestrictions);

module.exports = router;