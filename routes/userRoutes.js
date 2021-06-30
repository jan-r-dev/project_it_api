const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/')
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getSingleUser)
    .patch(userController.updateUser)

router.route('/login')
    .post(authController.loginUser);

router.route('/forgotPassword')
    .post(authController.forgotPassTokenGenerate);

router.use(authController.validateAccess);

router.route('/changePassword')
    .post(authController.changePassword);

module.exports = router;