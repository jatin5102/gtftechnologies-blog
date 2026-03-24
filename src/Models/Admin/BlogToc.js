const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class BlogToc {

    // Get all TOC entries with pagination
    static async getAll(limit, offset, blog_id = null) {
        let where = {};
        if (blog_id) {
            where.blog_id = blog_id;
        }

        const tocEntries = await prisma.blog_toc.findMany({
            where,
            skip: offset,
            take: limit,
            orderBy: { created_at: 'desc' },
            include: { blog: true }
        });

        return tocEntries;
    }

    // Get total TOC count
    static async getCount(blog_id = null) {
        let where = {};
        if (blog_id) {
            where.blog_id = blog_id;
        }
        const count = await prisma.blog_toc.count({ where });
        return count;
    }

    // Get a TOC entry by ID
    static async getById(id) {
        const tocEntry = await prisma.blog_toc.findUnique({
            where: { id },
            include: { blog: true }
        });
        return tocEntry;
    }

    // Create a new TOC entry
    static async create(data) {
        const {
            blog_id, toc_heading, title, slug,
            description, status
        } = data;

        const tocEntry = await prisma.blog_toc.create({
            data: {
                blog_id,
                toc_heading,
                title,
                slug,
                description,
                status: status !== undefined ? status : true
            }
        });

        return tocEntry;
    }

    // Update a TOC entry by id
    static async update(id, data) {
        const {
            blog_id, toc_heading, title, slug,
            description, status
        } = data;

        const updateData = {
            blog_id,
            toc_heading,
            title,
            slug,
            description,
            status: status !== undefined ? status : undefined
        };

        const updatedToc = await prisma.blog_toc.update({
            where: { id },
            data: updateData,
        });

        return updatedToc;
    }

    // Delete a TOC entry by id
    static async delete(id) {
        await prisma.blog_toc.delete({
            where: { id }
        });
    }

}

module.exports = BlogToc;
