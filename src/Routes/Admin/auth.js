const express = require('express');
const router = express.Router();
const registerController = require('../../Controllers/Admin/RegisterController');
const loginController = require('../../Controllers/Admin/LoginController');
const authMiddleware = require('../../Middleware/authMiddleware');

 

// **Register Route** No Auth Check
router.post('/register', registerController.authRegister);
router.post('/login', loginController.authLogin);

// check token is valid or not
router.use(authMiddleware);
router.post('/validate-token', loginController.checkAuth)
 

module.exports = router;