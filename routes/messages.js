var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', messages_controller.index);

/* GET and POST create message page  */
// router.get('/create', messages_controller.message_create_get);

// router.post('/create', messages_controller.message_create_post);

// /* GET and POST update message page */
// router.get('/:id/:title/update', messages_controller.message_update_get);

// router.post('/:id/:title/update', messages_controller.message_update_post);

// /* GET and POST delete message page */
// router.get('/:id/:title/delete', messages_controller.message_delete_get);

// router.post('/:id/:title/delete', messages_controller.message_delete_get);

module.exports = router;
