const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.route("/updateData").put(userController.changeUserData);

router.route("/updatePassword").put(userController.changeUserPassword);

router.route("/updateEmail").put(userController.changeUserEmail);

router.route("/delete").delete(userController.deleteUser);

module.exports = router;
