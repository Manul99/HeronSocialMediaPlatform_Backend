const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createClubs, updateClubs, getClubs, getClubById, deleteClubs, getInvitedClubs, acceptClubInvitation, getAllClubs, getClubsByParentChild } = require('../controllers/ClubsController');
const { authMiddleware } = require('../middleware/auth');


const storage1 = multer.memoryStorage();
const upload = multer({storage:storage1});

router.post('/', upload.single("clubLogo"), createClubs);
router.put('/:id', upload.fields([{ name: "clubLogo", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), updateClubs);
//router.get('/getClubs',getClubs);
router.get('/invited',authMiddleware,getInvitedClubs);
router.post('/accept/:clubId',authMiddleware, acceptClubInvitation);
router.get('/getclubs',getAllClubs);
router.get('/getclubsp',authMiddleware,getClubsByParentChild)
// router.get('/:id',getClubById);
// router.get('/:id',deleteClubs);
module.exports = router;