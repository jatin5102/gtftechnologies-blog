const { prisma } = require('../../config/db');
const helper = require('../../utils/helper')

exports.getList = async (req, res) => {
     try {
          const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 10;
          const offset = (page - 1) * limit;
          let where = {}
          const { search } = req.query;
          if (search) {
               where = {
                    OR: [
                         { name: { contains: search, mode: 'insensitive' } },
                    ]
               };
          }

          const [categories, totalCount] = await Promise.all([
               prisma.blog_categories.findMany({
                    where,
                    skip: offset,
                    take: limit,
                    include: {
                         blogs: {
                              take: 3,
                              orderBy: { date_at: 'desc' }
                         }
                    },
                    orderBy: { created_at: 'desc' }
               }),
               prisma.blog_categories.count({ where })
          ]);
          // image full url 
          const data = categories.map(category => {
               return {
                    ...category,
                    blogs: category.blogs.map(blog => {
                         return {
                              ...blog,
                              feature_image: blog.feature_image ? helper.getFileFullPath(blog.feature_image) : null,
                              mb_image: blog.mb_image ? helper.getFileFullPath(blog.mb_image) : null
                         }
                    })
               }
          })

          res.status(200).json({
               status: true,
               statusCode: 200,
               data: data,
               pagination: {
                    total: totalCount,
                    page,
                    limit,
                    totalPages: Math.ceil(totalCount / limit)
               }
          });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
};



exports.getByslug = async (req, res) => {
     const { slug } = req.params;
     try {
          const category = await prisma.blog_categories.findFirst({
               where: { slug },
               include: { blogs: true }
          });
          if (!category) {
               return res.status(404).json({ status: false, statusCode: 404, message: 'Category not found' });
          }

          res.status(200).json({ status: true, statusCode: 200, data: category });
     } catch (error) {
          res.status(500).json({ error: error.message });
     }
};




exports.getBlogSearchList = async (req, res) => {
     const { search } = req.query;
     try {
          const blogs = await prisma.blogs.findMany({
               where: {
                    OR: [
                         { heading: { contains: search, mode: 'insensitive' } },
                         { description: { contains: search, mode: 'insensitive' } }
                    ]
               },
               include: { category: true },
               orderBy: { date_at: 'desc' }
          });
          const data = blogs.map(blog => ({
               ...blog,
               date_at: blog.date_at ? blog.date_at.toISOString().slice(0, 10) : null
          }));
          res.status(200).json({ status: true, statusCode: 200, data });
     } catch (error) {
          res.status(500).json({ error: error.message });
     }
};