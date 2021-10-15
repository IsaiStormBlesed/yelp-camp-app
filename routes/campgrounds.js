const express = require('express')
const router = express.Router()
const { storage } = require('../cloudinary')
const multer = require('multer')
const upload = multer({ storage })
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, validateCampground, isAuthorized } = require('../middleware')
const { index, showNewForm, createNewCampground, showCampground, showEditForm, editCampground, deleteCampground } = require('../controllers/campgrounds')

router.route('/')
    .get(catchAsync(index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(createNewCampground))

router.get('/new', isLoggedIn, showNewForm)

router.route('/:id')
    .get(catchAsync(showCampground))
    .put(isLoggedIn, isAuthorized, upload.array('image'), validateCampground, catchAsync(editCampground))
    .delete(isLoggedIn, isAuthorized, catchAsync(deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthorized, catchAsync(showEditForm))

module.exports = router;