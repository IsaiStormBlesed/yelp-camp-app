const { campgroundSchema, reviewSchema } = require('./schemas')
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground')
const Review = require('./models/review')


const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in')
        return res.redirect('/login')
    }
    next()
}

//Server Validation with JOI -- middleware
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(ele => ele.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}
//JOI STUFF ENDS HERE

const isAuthorized = async(req, res, next) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission')
        return res.redirect(`/campgrounds/${req.params.id}`)
    }
    next()
}

const isReviewAuthorized = async(req, res, next) => {
    const review = await Review.findById(req.params.reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission')
        return res.redirect(`/campgrounds/${req.params.id}`)
    }
    next()
}


module.exports.isLoggedIn = isLoggedIn;
module.exports.validateCampground = validateCampground;
module.exports.isAuthorized = isAuthorized;
module.exports.isReviewAuthorized = isReviewAuthorized;
module.exports.validateReview = validateReview;
