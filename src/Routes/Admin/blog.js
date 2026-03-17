const express = require('express');
const router = express.Router();
const authMiddleware = require('../../Middleware/authMiddleware');
const { validateBlog } = require('../../Controllers/Admin/BlogController');
const BlogController = require('../../Controllers/Admin/BlogController');
const { uploadBlog } = require('../../Middleware/multer');


// define routes
router.use(authMiddleware);
router.get('/blog', BlogController.getAllBlog);
router.get('/blog/:id', BlogController.getBlogById);
router.post('/blog', uploadBlog.fields([{ name: 'feature_image', maxCount: 1 }, { name: 'mobile_image', maxCount: 1 }]), validateBlog, BlogController.createBlog);
router.put('/blog/:id', uploadBlog.fields([{ name: 'feature_image', maxCount: 1 }, { name: 'mobile_image', maxCount: 1 }]), validateBlog, BlogController.updateBlog);
router.delete('/blog/:id', BlogController.deleteBlog);

module.exports = router;