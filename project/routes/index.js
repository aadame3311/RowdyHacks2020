var express = require('express');
var router = express.Router();


/* GET home page. */
var indexRoute = function() {
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
  });
  return router;
}

module.exports = indexRoute;
