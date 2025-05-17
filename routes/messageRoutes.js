const express = require("express");
const { attachSocket } = require("../middleware/webSocketMiddleware");
const { sendMessage, getMessages } = require("../controllers/MessageController");
const { authMiddleware } = require("../middleware/auth");
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.memoryStorage();


const upload = multer({storage:storage});

router.post("/send",attachSocket,authMiddleware,sendMessage);
router.get("/:chatId",authMiddleware,getMessages);

module.exports = router;
