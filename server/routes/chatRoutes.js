const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.route("/").post(chatController.postMessage);

router.route("/get").post(chatController.getMessages);

router.route("/check").post(chatController.checkIfReceiverAndAdExist);

module.exports = router;
