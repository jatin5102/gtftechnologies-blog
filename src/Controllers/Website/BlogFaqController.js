const { prisma } = require('../../config/db');
const helper = require('../../utils/helper')

exports.getAllFaqList = async (req, res) => {
     try {
          let where = {}
          const { search, blog_id } = req.query;
          if (search) {
               where = {
                    OR: [
                         { question: { contains: search, mode: 'insensitive' } },
                    ]
               };
          }
          if (blog_id) {
               where.blog_id = blog_id;
          }

          const [data, totalCount] = await Promise.all([
               prisma.blog_faq.findMany({
                    where,
                    orderBy: { created_at: 'desc' }
               }),
               prisma.blog_faq.count({ where })
          ]);

          // Format date
          ;

          res.status(200).json({
               status: true,
               statusCode: 200,
               data
          });
     } catch (err) {
          res.status(500).json({ error: err.message });
     }
};
