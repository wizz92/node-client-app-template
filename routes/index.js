var express = require('express');
var router = express.Router();
var proxyApi = require('proxy-api');
var Bootstrap = proxyApi.Bootstrap;


router.get('/*', function(req, res, next) {
	req.session.additions = req.query;
	Bootstrap.init(function(){
		var data = { 
			access_token: Bootstrap.getAccessToken(),
			data: Bootstrap.getBootstrapData(),
			title: 'Bootstrap.getAccessToken()',
		};

		// res.json(data);
		res.render('index', data);
	});
});


module.exports = router;
