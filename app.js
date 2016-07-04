var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var routes = require('./routes/index');
var api = require('./routes/api');
var MemcachedStore = require('connect-memcached')(session);
var bodyParser = require('body-parser');
var proxyApi = require('proxy-api');
var Bootstrap = proxyApi.Bootstrap;
var proxyApiConfigs = proxyApi.Configs;
var apiConfigs = require('./configs/api');
var path = require('path');
var cache = require('./app/services/cache/cache');
Bootstrap.setCacheService(cache);
proxyApiConfigs.set('api', apiConfigs);
// Bootstrap.init(function(){});

var app = express();
var store = new MemcachedStore({
        hosts: ['127.0.0.1:11211'],
        // secret: '123, easy as ABC. ABC, easy as 123' // Optionally use transparent encryption for memcache session data 
    });
//  set trusted proxy

app.set('trust proxy', true);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// to get post data from request
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// enable session 
app.use(cookieParser());
app.use(session({
    secret  : 'CatOnKeyboard',
    key     : 'test_client', 
    proxy   : true, 
    store   : store,
    resave: false,
    cookie: { maxAge: 60000 },
    saveUninitialized: true
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/', api);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
