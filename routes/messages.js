const express = require('express');
const router = express.Router();

const messages_controller = require('../controllers/messages');

/* GET home page. */
router.get('/', messages_controller.index);

/* GET and POST create message page  */
router.get('/create', messages_controller.message_create_get);

router.post('/create', messages_controller.message_create_post);

/* GET and POST edit message page */
router.get('/:id/edit', messages_controller.message_edit_get);

router.post('/:id/edit', messages_controller.message_edit_post);

// /* GET and POST delete message page */
router.get('/:id/delete', messages_controller.message_delete_get);

router.post('/:id/delete', messages_controller.message_delete_post);

module.exports = router;
