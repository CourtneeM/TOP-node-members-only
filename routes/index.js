var express = require('express');
var router = express.Router();
const messages_controller = require('../controllers/messages');

/* GET home page. */
router.get('/', messages_controller.index);

module.exports = router;
