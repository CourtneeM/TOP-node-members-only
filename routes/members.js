const express = require('express');
const router = express.Router();

const members_controller = require('../controllers/members');

/* GET home page. */
router.get('/members', members_controller.index);

// /* GET and POST create message page  */
// router.get('/members/create', members_controller.member_create_get);

// router.post('/members/create', members_controller.member_create_post);

// /* GET and POST update message page */
// router.get('/members/:id/update', members_controller.member_update_get);

// router.post('/members/:id/update', members_controller.member_update_post);

// /* GET and POST delete message page */
// router.get('/members/:id/delete', members_controller.member_delete_get);

// router.post('/members/:id/delete', members_controller.member_delete_get);

module.exports = router;
