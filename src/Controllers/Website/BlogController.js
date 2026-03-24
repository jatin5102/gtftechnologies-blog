const { prisma } = require('../../config/db');
const helper = require('../../utils/helper')

exports.getAllBlogList = async (req, res) => {
     try {
          const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 10;
          const offset = (page - 1) * limit;
          let where = {}
          const { search, category_id, is_featured } = req.query;
          if (search) {
               where = {
                    OR: [
                         { heading: { contains: search, mode: 'insensitive' } },
                         { description: { contains: search, mode: 'insensitive' } }
                    ]
               };
          }
          if (is_featured) {
               where.is_featured = Boolean(is_featured);
          }
          const { categories } = req.query;

          if (categories) {
               const categoryArray = categories.split(",");

               where.category_id = {
                    in: categoryArray, // ✅ Prisma syntax
               };
          }
          const [blogs, totalCount] = await Promise.all([
               prisma.blogs.findMany({
                    where,
                    skip: offset,
                    take: limit,
                    include: { category: true },
                    orderBy: { date_at: 'desc' }
               }),
               prisma.blogs.count({ where })
          ]);

          // Format date
          const data = blogs.map(blog => ({
               ...blog,
               feature_image: blog.feature_image ? helper.getFileFullPath(blog.feature_image) : null,
               mb_image: blog.mb_image ? helper.getFileFullPath(blog.mb_image) : null,
               date_at: blog.date_at ? blog.date_at.toISOString().slice(0, 10) : null
          }));

          res.status(200).json({
               status: true,
               statusCode: 200,
               data,
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

exports.getBlogListByCategory = async (req, res) => {
     try {
          const page = parseInt(req.query.page) || 1;
          const category_url = req.params.category_url;
          const limit = parseInt(req.query.limit) || 10;
          const offset = (page - 1) * limit;
          let where = {}
          const { search } = req.query;
          if (search) {
               where = {
                    OR: [
                         { heading: { contains: search, mode: 'insensitive' } },
                         { description: { contains: search, mode: 'insensitive' } }
                    ]
               }
          }
          where.category_id = category_url;

          const [blogs, totalCount] = await Promise.all([
               prisma.blogs.findMany({
                    where,
                    skip: offset,
                    take: limit,
                    include: { category: true },
                    orderBy: { date_at: 'desc' }
               }),
               prisma.blogs.count({ where })
          ]);

          // Format date
          const data = blogs.map(blog => ({
               ...blog,
               feature_image: blog.feature_image ? helper.getFileFullPath(blog.feature_image) : null,
               mb_image: blog.mb_image ? helper.getFileFullPath(blog.mb_image) : null,
               date_at: blog.date_at ? blog.date_at.toISOString().slice(0, 10) : null
          }));

          res.status(200).json({
               status: true,
               statusCode: 200,
               data,
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


exports.getBlogByslug = async (req, res) => {
     const { slug } = req.params;
     try {
          const blog = await prisma.blogs.findFirst({
               where: { slug },
               include: { category: true }
          });
          if (!blog) {
               return res.status(404).json({ status: false, statusCode: 404, message: 'Blog not found' });
          }
          const record = {
               ...blog,
               date_at: blog.date_at ? blog.date_at.toISOString().slice(0, 10) : null
          };
          res.status(200).json({ status: true, statusCode: 200, data: record });
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