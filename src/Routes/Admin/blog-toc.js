const express = require('express');
const router = express.Router();
const authMiddleware = require('../../Middleware/authMiddleware');
const BlogTocController = require('../../Controllers/Admin/BlogTocController');
const { validateBlogToc } = require('../../Controllers/Admin/BlogTocController');
const { uploadBlog } = require('../../Middleware/multer');

// define routes
router.use(authMiddleware);
router.get('/blog-toc', BlogTocController.getAllBlogToc);
router.get('/blog-toc/:id', BlogTocController.getBlogTocById);
router.post('/blog-toc', uploadBlog.none(), validateBlogToc, BlogTocController.createBlogToc);
router.put('/blog-toc/:id', uploadBlog.none(), validateBlogToc, BlogTocController.updateBlogToc);
router.delete('/blog-toc/:id', BlogTocController.deleteBlogToc);

module.exports = router;
