var express = require('express');
var router = express.Router();
var api = require('../api')

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user){
    var data = {
      title: 'Express',
      user : req.session.user
    }
    res.render('index', data);
  } else {
    var data = {
      title: 'Express',
    }
    res.render('index', data);
  }
});

module.exports = router;