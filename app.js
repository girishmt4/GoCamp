const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground')

mongoose.connect('mongodb://localhost:27017/go-camp', {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error: "));
db.once("open", () => {
    console.log("Database Connected");
})


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    console.log("Hello from GoCamp!!");
    res.render('home');
})

app.get('/makecampground', async (req, res) => {
    const camp = new Campground({ title: "My Backyard", description: "cheap camping" })
    await camp.save();
    res.send(camp);
})

app.listen(3000, () => {
    console.log("Listening on Port 3000");
})