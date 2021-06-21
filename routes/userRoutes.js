const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/')
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getSingleUser)
    .patch(userController.updateUser)
    
router.route('/testing/:id')
    .get(userController.checkPass);

router.route('/login')
    .post(authController.loginUser);

module.exports = router;