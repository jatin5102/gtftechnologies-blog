const { prisma } = require('../../config/db');
const helper = require('../../utils/helper')

exports.getAllBlogList = async (req, res) => {
     try {
          const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 10;
          const offset = (page - 1) * limit;
          let where = {}
          const search = req.query.search || '';
          if (search) {
               where = {
                    OR: [
                         { heading: { contains: search, mode: 'insensitive' } },
                         { description: { contains: search, mode: 'insensitive' } }
                    ]
               }
          }

          const [blogs, totalCount] = await Promise.all([
               prisma.blogs.findMany({
                    skip: offset,
                    take: limit,
                    orderBy: { date_at: 'desc' }
               }),
               prisma.blogs.count()
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