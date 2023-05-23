const express = require("express");
const router = express.Router();
const adController = require("../controllers/adController");

router.route("/create").post(adController.createAd);

router.route("/get").post(adController.getAds);

router.route("/get/single").post(adController.getSingleAd);

router.route("/get/user").post(adController.getUserAds);

router.route("/get/favourite").post(adController.getFavourites);

router.route("/deactivate").delete(adController.deactivateAd);

router.route("/activate").post(adController.activateAd);

router.route("/delete").delete(adController.deleteAd);

router.route("/update").put(adController.updateAd);

router
  .route("/favourite")
  .post(adController.addToFavourites)
  .delete(adController.removeFromFavourites);

module.exports = router;
