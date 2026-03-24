const express = require('express');
const router = express.Router();
const BlogTocController = require('../../Controllers/Website/BlogTocController');



router.get('/blog-toc', BlogTocController.getAllTocList);



module.exports = router;