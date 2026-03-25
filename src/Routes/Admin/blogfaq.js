const express = require('express');
const router = express.Router();
const authMiddleware = require('../../Middleware/authMiddleware');
const BlogFaqController = require('../../Controllers/Admin/BlogFaqController');
const { validateBlogFaq } = require('../../Controllers/Admin/BlogFaqController');
const { uploadBlog } = require('../../Middleware/multer');

// define routes
router.use(authMiddleware);
router.get('/blog-faq', BlogFaqController.Index);
router.get('/blog-faq/:id', BlogFaqController.Show);
router.post('/blog-faq', uploadBlog.none(), validateBlogFaq, BlogFaqController.Create);
router.put('/blog-faq/:id', uploadBlog.none(), validateBlogFaq, BlogFaqController.Update);
router.delete('/blog-faq/:id', BlogFaqController.Delete);

module.exports = router;
