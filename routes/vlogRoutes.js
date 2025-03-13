const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createVlogs, updateVlog, getVlogs, getVlogByID, deleteVlog } = require('../controllers/VlogControllers');


const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,'./uploads');
    },
    filename:(req,file,cb) =>{
        cb(null,Date.now()+ path.extname(file.originalname));
    }
})

const upload = multer({storage:storage});


router.post('/', upload.array("media",5),createVlogs); // Allow up to only 5 files to be uploaded.
router.put('/:id',upload.array("media",5),updateVlog);
router.get('/getVlogs',getVlogs);
router.get('/getVlogs/:id',getVlogByID);
router.delete('/:id',deleteVlog);

module.exports = router;