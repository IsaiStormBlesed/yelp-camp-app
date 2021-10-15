const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthorized } = require('../middleware')
const { createReview, deleteReview } = require('../controllers/reviews')


router.post('/', isLoggedIn, validateReview, catchAsync(createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthorized, catchAsync(deleteReview))

module.exports = router