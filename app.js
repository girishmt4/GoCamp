const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const { STATUS_CODES } = require('http');

mongoose.connect('mongodb://localhost:27017/go-camp');

app.engine('ejs', ejsMate);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error: "));
db.once("open", () => {
    console.log("Database Connected");
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    console.log("Hello from GoCamp!!");
    res.render('home');
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', catchAsync(async (req, res, next) => {
    const campground = req.body.campground;
    const newCampground = new Campground(campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground.id}`);
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    // const id = req.params;
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
    console.log(campground);
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const newCampground = req.body.campground;
    const campground = await Campground.findByIdAndUpdate(req.params.id, newCampground);
    res.redirect(`/campgrounds/${campground.id}`);
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.all('*', (req, res, next) => {
    // res.status(404).send("404 Not Found!");
    next(new ExpressError('Page Not Found', 404))
})


app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something Went Wrong!" } = err;
    res.status(statusCode).send(message)
    // res.send("We got an error!");

})

app.listen(3000, () => {
    console.log("Listening on Port 3000");
})