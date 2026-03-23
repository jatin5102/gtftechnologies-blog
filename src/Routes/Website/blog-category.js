const express = require('express');
const router = express.Router();
const BlogCategoryController = require('../../Controllers/Website/BlogCategoryController');




router.get('/blog-category/:slug', BlogCategoryController.getByslug);
router.get('/blog-category', BlogCategoryController.getList);



module.exports = router;