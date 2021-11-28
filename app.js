const express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    http = require('http');

app = express();

mongoose.Promise = global.Promise;

// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://localhost:27017/apod', {
    useNewUrlParser: true, useUnifiedTopology: true,
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// app.use(express.static(path.join(__dirname, 'assets')));
app.use('/images', express.static(path.join(__dirname, 'assets/images')));

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');


const main = require('./router/apod');

app.use('/', main);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

var server = http.createServer(app);
server.listen(3000, function () {
    console.log('server started');
});

module.exports = app;