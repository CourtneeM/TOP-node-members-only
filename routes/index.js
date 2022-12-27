var express = require('express');
var router = express.Router();

const messages_controller = require('../controllers/messages');
const accounts_controller = require('../controllers/accounts');

/* GET home page. */
router.get('/', messages_controller.index);

/* GET login page. */
router.get('/log-in', accounts_controller.log_in_get);
router.post('/log-in', accounts_controller.log_in_post);

router.get('/log-out', accounts_controller.log_out_post);

module.exports = router;
