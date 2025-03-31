const express = require("express");
const { attachSocket } = require("../middleware/webSocketMiddleware");
const { sendMessage, getMessages } = require("../controllers/MessageController");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

router.post("/send",attachSocket,authMiddleware,sendMessage);
router.get("/:userId/:chatType/:chatId",getMessages);

module.exports = router;
