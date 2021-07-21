const express = require('express');
const router = express.Router({mergeParams:true});
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const reviews=require('../controllers/reviews');

router.route('/')
    .post(isLoggedIn,validateReview,catchAsync(reviews.addReview))


router.route('/:reviewId')
    .get(isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))


module.exports=router;