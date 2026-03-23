const express = require('express');
const router = express.Router();
const authMiddleware = require('../../Middleware/authMiddleware');
const BlogCategoryController = require('../../Controllers/Admin/BlogCategoryController');
const { validateBlogCategory } = require('../../Controllers/Admin/BlogCategoryController');
const { uploadBlog } = require('../../Middleware/multer');

// define routes
router.use(authMiddleware);
router.get('/blog-category', BlogCategoryController.getAllBlogCategory);
router.get('/blog-category/:id', BlogCategoryController.getBlogCategoryById);
router.post('/blog-category', uploadBlog.none(), validateBlogCategory, BlogCategoryController.createBlogCategory);
router.put('/blog-category/:id', uploadBlog.none(), validateBlogCategory, BlogCategoryController.updateBlogCategory);
router.delete('/blog-category/:id', BlogCategoryController.deleteBlogCategory);

module.exports = router;
