const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const {isLoggedIn,validateReview, isReviewAuthor}= require("../middleware.js");
const reviewConttroller = require("../controllers/review.js");

// Add express.json() middleware to parse JSON-formatted request bodies
router.use(express.json());


// Review Post
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewConttroller.createReview));

router.delete("/:reviewId",isReviewAuthor, wrapAsync(reviewConttroller.destroyReview));

module.exports = router;
