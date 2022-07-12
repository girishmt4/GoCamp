const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');


router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = req.body.campground;
    const newCampground = new Campground(campground);
    // console.log(req.user);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Successfully Created a Campground..');
    res.redirect(`campgrounds/${newCampground.id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    // const id = req.params;
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
    // console.log(campground);
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find the campground');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const newCampground = req.body.campground;
    const campground = await Campground.findByIdAndUpdate(id, newCampground);
    req.flash('success', 'Successfully Updated the campground');
    res.redirect(`/campgrounds/${campground.id}`);
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted the campground');
    res.redirect('/campgrounds');
}))

module.exports = router;