/**
 * Spider Task 3
 * Mohamed Sohail
 */

const express = require("express");

const router = express.Router();
const api = require("./endpoints");

router.get("/bookstatus", api.getBookStatusController);
router.get("/book/:id", api.getBookController);
router.post("/newreview", api.newReviewController);
router.post("/newrating", api.newRatingController);
router.post("/newstatus", api.newStatusController);
router.post("/newlibrary", api.newLibraryController);
router.post("/newfavourite", api.newFavouriteController);
router.post("/profilevisibility", api.profileVisibilityController);

exports = module.exports = router;