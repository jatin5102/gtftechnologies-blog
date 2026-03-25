const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class BlogFaq {
    static async getAll(limit, offset, blog_id = null) {
        let where = {};
        if (blog_id) {
            where.blog_id = blog_id;
        }
        const record = await prisma.blog_faq.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: { created_at: 'desc' },
            include: { blog: true }
        });
        return record;
    }
    static async getCount(blog_id = null) {
        let where = {};
        if (blog_id) {
            where.blog_id = blog_id;
        }
        const count = await prisma.blog_faq.count({ where });
        return count;
    }
    static async getById(id) {
        const record = await prisma.blog_faq.findUnique({
            where: { id },
            include: { blog: true }
        });
        return record;
    }

    static async create(data) {
        const {
            blog_id, question, answer, status
        } = data;

        const record = await prisma.blog_faq.create({
            data: {
                blog_id,
                question,
                answer,
                status: status !== undefined ? status : true
            }
        });

        return record;
    }

    // Update a TOC entry by id
    static async update(id, data) {
        const { question, answer, status
        } = data;

        const updateData = {
            question,
            answer,
            status: status !== undefined ? status : undefined
        };

        const record = await prisma.blog_faq.update({
            where: { id },
            data: updateData,
        });

        return record;
    }

    // Delete a TOC entry by id
    static async delete(id) {
        await prisma.blog_faq.delete({
            where: { id }
        });
    }

}

module.exports = BlogFaq;
