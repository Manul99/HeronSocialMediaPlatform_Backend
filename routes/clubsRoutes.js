const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createClubs, updateClubs, getClubs, getClubById, deleteClubs } = require('../controllers/ClubsController');

 const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,'./uploads');
    },
    filename:(req,file,cb) =>{
        cb(null,Date.now()+ path.extname(file.originalname));
    }
})

const upload = multer({storage:storage});

router.post('/', upload.fields([{ name: "clubLogo", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), createClubs);
router.put('/:id', upload.fields([{ name: "clubLogo", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]), updateClubs);
router.get('/getClubs',getClubs);
router.get('/:id',getClubById);
router.get('/:id',deleteClubs);
module.exports = router;