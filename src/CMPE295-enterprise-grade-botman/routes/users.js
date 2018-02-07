
/*
 * GET users listing.
 */

 var express = require('express');
 var router = express.Router();

 // Get GET users listing.
 router.get('/users', function(req, res){
 	res.render('users');
 });

 module.exports = router;
