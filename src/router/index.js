var express = require('express')
var router = express.Router();

router.use('/stores', require('./store'));
module.exports=router;