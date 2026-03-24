const express = require('express');
const router = express.Router();
const BlogController = require('../../Controllers/Website/BlogController');



router.get('/blog/category/:category_url', BlogController.getBlogListByCategory);
router.get('/blog/:slug', BlogController.getBlogByslug);
router.get('/get-blog/:id', BlogController.getBlogById);

router.get('/blog', BlogController.getAllBlogList);



module.exports = router;