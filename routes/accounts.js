const express = require('express');
const router = express.Router();

const accounts_controller = require('../controllers/accounts');

/* GET accounts home page. */
router.get('/accounts', accounts_controller.index);

/* GET account creation page. */
router.get('/account/create', accounts_controller.account_create_get);
router.post('/account/create', accounts_controller.account_create_post);

/* GET view account page  */
router.get('/account/:id', accounts_controller.account_get);

/* GET update account page  */
router.get('/account/:id/update', accounts_controller.account_update_get);
router.post('/account/:id/update', accounts_controller.account_update_post);

/* GET delete account page  */
router.get('/account/:id/delete', accounts_controller.account_delete_get);
router.post('/account/:id/delete', accounts_controller.account_delete_post);


module.exports = router;
