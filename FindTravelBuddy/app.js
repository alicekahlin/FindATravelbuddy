// Run by entering: nodemon app
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const { checkUser } = require('./controllers/authMiddleware');
const methodOverride = require('method-override');

// Routes
const traveladdRoutes = require('./routes/traveladdRoutes');
const profileRoutes = require('./routes/profileRoutes');
const authRoutes = require('./routes/authRoutes');
const generalRoutes = require('./routes/generalRoutes');
const searchTravelRoutes = require('./routes/searchTravelRoutes');

// Connect to mongodb, if the connection is made listen to requests
const dbURI = 'mongodb+srv://adminUser:Password123@TravelBuddyCluster.ix4rz.mongodb.net/TravelBuddyCollection?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// Express app
const app = express();

// Able to overide POST with PUT method
app.use(methodOverride('_method'));

// Register the view engine EJS
app.set('view engine', 'ejs');

// Thirdpart middleware and static files
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

//Bootstrap
const path = require("path");
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
app.use("/js", express.static(path.join(__dirname, "node_modules/jquery/dist")));

// Able to acess uer form every ejs file
app.get('*', checkUser)

// Middleware: Console log all the requestes made 
app.use((req, res, next) => {
    console.log('New request made:');
    console.log('Host: ', req.hostname);
    console.log('Path: ', req.path);
    console.log("Methode: ", req.method);
    next();
});

// General routes
app.use('/', generalRoutes);

// The users profile routes
app.use('/profile', profileRoutes);

// Auth routes
app.use('/', authRoutes);

// Traveladd Routes
app.use('/traveladds/', traveladdRoutes);

// Search routes
app.use('/search-travel', searchTravelRoutes);

// 404 page, if the page does not exist (must be places last)
app.use((req, res) => {
    res.status(404).render('404', { title: 'Error' });
});