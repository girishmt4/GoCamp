const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    const campground = req.body.campground;
    const newCampground = new Campground(campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Successfully Created a Campground..');
    res.redirect(`campgrounds/${newCampground.id}`);
}

module.exports.displayCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
    console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot find the campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find the campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const newCampground = req.body.campground;
    const campground = await Campground.findByIdAndUpdate(id, newCampground);
    req.flash('success', 'Successfully Updated the campground');
    res.redirect(`/campgrounds/${campground.id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted the campground');
    res.redirect('/campgrounds');
}