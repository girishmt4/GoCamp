const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', 'Successfully Created the review');
    res.redirect(`/campgrounds/${campground.id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review');
    res.redirect(`/campgrounds/${id}`);
}