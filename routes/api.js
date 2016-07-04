var express = require('express');
var router = express.Router();
var apiMiddleware = require('proxy-api').apiMiddleware;
var multer  = require('multer');

router.all('/*', multer().any(), apiMiddleware);

module.exports = router;