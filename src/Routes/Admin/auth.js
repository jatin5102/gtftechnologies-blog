const express = require('express');
const router = express.Router();
const registerController = require('../../Controllers/Admin/RegisterController');
const loginController = require('../../Controllers/Admin/LoginController');
const authMiddleware = require('../../Middleware/authMiddleware');

const { uploadBlog } = require('../../Middleware/multer');

// **Register Route** No Auth Check
router.post('/register', uploadBlog.none(), registerController.authRegister);
router.post('/login', uploadBlog.none(), loginController.authLogin);

// check token is valid or not
router.use(authMiddleware);
router.post('/validate-token', loginController.checkAuth)


module.exports = router;