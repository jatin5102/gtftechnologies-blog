const { prisma } = require('../../config/db');
const helper = require('../../utils/helper')

exports.getAllTocList = async (req, res) => {
     try {
          const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 10;
          const offset = (page - 1) * limit;
          let where = {}
          const { search, blog_id } = req.query;
          if (search) {
               where = {
                    OR: [
                         { toc_heading: { contains: search, mode: 'insensitive' } },
                    ]
               };
          }
          if (blog_id) {
               where.blog_id = blog_id;
          }

          const [data, totalCount] = await Promise.all([
               prisma.blog_toc.findMany({
                    where,
                    skip: offset,
                    take: limit,
                    orderBy: { created_at: 'desc' }
               }),
               prisma.blog_toc.count({ where })
          ]);

          // Format date
          ;

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
