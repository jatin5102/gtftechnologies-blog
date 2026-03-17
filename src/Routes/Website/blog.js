const express = require('express');
const router = express.Router();
const BlogController = require('../../Controllers/Website/BlogController');



router.get('/blog/:slug', BlogController.getBlogByslug);
router.get('/blog', BlogController.getAllBlogList);


module.exports = router;