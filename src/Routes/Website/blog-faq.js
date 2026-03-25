const express = require('express');
const router = express.Router();
const BlogFaqController = require('../../Controllers/Website/BlogFaqController');



router.get('/blog-faq', BlogFaqController.getAllFaqList);



module.exports = router;