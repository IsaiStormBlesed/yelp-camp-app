const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mbxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mbxToken })
const { cloudinary } = require('../cloudinary')


const index = async(req, res) => {
    const camps = await Campground.find({})
    res.render('campgrounds/index', { camps })
}

const showNewForm = (req, res) => {
    res.render('campgrounds/new')
}

const createNewCampground = async(req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    const newCampground = new Campground(req.body.campground)
    newCampground.geometry = geoData.body.features[0].geometry
    newCampground.images =  req.files.map(file => ({ url: file.path, filename: file.filename }))
    newCampground.author = req.user._id
    await newCampground.save()
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${ newCampground._id }`)
}

const showCampground = async(req, res) => {
    const campById = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')

    if (!campById) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campById })
}

const showEditForm = async(req, res) => {
    const campById = await Campground.findById(req.params.id)
    if (!campById) {
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campById })
}

const editCampground = async(req, res) => {
    const { id } = req.params
    const updatedCamp = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    const imagesArray = req.files.map(file => ({
        url: file.path,
        filename: file.filename
    }))
    updatedCamp.images.push(...imagesArray)
    await updatedCamp.save()
    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await updatedCamp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${updatedCamp._id}`)
}

const deleteCampground = async(req, res) => {
    await Campground.findByIdAndDelete(req.params.id)
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds')
}

module.exports.index = index;
module.exports.showNewForm = showNewForm;
module.exports.createNewCampground = createNewCampground;
module.exports.showCampground = showCampground;
module.exports.showEditForm = showEditForm;
module.exports.editCampground = editCampground;
module.exports.deleteCampground = deleteCampground;