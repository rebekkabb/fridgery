const createError = require('http-errors');
const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const mongo_url = process.env.MONGO_URL;
const MongoStore = require('connect-mongo')(session);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const fridgeRouter = require('./routes/fridge');
const itemRouter = require('./routes/item');
const googleRouter = require('./routes/googleReturn');

const app = express();

// view engine setup
app.set('view engine', 'hbs');

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        url: mongo_url
    })
}));

app.use('*', saveAuth);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/fridge', checkAuth, fridgeRouter);
app.use('/item', checkAuth, itemRouter);
app.use('/auth/google', googleRouter);

function saveAuth(req, res, next) {
    if (req.session && req.session.user) {
        res.locals.session = req.session;
    }
    return next();
}

function checkAuth(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        var err = new Error('You must be logged in to see this page');
        err.status = 401;
        return next(err);
    }
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.status = err.status;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
