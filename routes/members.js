const express = require('express');
const router = express.Router();

const members_controller = require('../controllers/members');

/* GET home page. */
router.get('/members', members_controller.index);

// /* GET and POST create message page  */
// router.get('/members/add', members_controller.member_create_get);
// router.post('/members/add', members_controller.member_create_post);

// /* GET view member page  */
router.get('/member/:id', members_controller.member_get);

// /* GET and POST update message page */
router.get('/member/:id/update', members_controller.member_update_get);
router.post('/member/:id/update', members_controller.member_update_post);

// /* GET and POST delete message page */
router.get('/member/:id/delete', members_controller.member_delete_get);
router.post('/member/:id/delete', members_controller.member_delete_post);

module.exports = router;
