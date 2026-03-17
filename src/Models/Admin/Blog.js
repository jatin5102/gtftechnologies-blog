const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class Blog {

    // Get all blogs with pagination
    static async getAll(limit, offset) {
        const blogs = await prisma.blog.findMany({
            skip: offset,
            take: limit,
            orderBy: { date_at: 'desc' },
        });

        // Format date_at as 'YYYY-MM-DD'
        return blogs.map(blog => ({
            ...blog,
            date_at: blog.date_at
                ? blog.date_at.toISOString().slice(0, 10)
                : null,
        }));
    }

    // Get total blog count
    static async getCount() {
        const count = await prisma.blog.count();
        return count;
    }

    // Get a blog by ID, format date
    static async getById(id) {
        const blog = await prisma.blog.findUnique({
            where: { id: Number(id) }
        });
        if (!blog) return null;
        return {
            ...blog,
            date_at: blog.date_at ? blog.date_at.toISOString().slice(0, 10) : null,
        };
    }

    // Create a new blog
    static async create(data) {
        const {
            slug, heading, tags, feature_image, mb_image, alt,
            date_at, short_description, description,
            meta_title, meta_keywords, meta_description
        } = data;

        const blog = await prisma.blog.create({
            data: {
                slug, heading, tags, feature_image, mb_image, alt,
                short_description, description,
                date_at: date_at ? new Date(date_at) : undefined,
                meta_title, meta_keywords, meta_description,
            }
        });

        return blog.id;
    }

    // Update a blog by id
    static async update(id, data) {
        const {
            slug, heading, tags, feature_image, mb_image, alt,
            date_at, short_description, description,
            meta_title, meta_keywords, meta_description
        } = data;

        // Prepare data for update
        const updateData = {
            heading, tags, slug, alt,
            date_at: date_at ? new Date(date_at) : undefined,
            short_description, description,
            meta_title, meta_keywords, meta_description,
        };

        if (feature_image) updateData.feature_image = feature_image;
        if (mb_image) updateData.mb_image = mb_image;

        const updatedBlog = await prisma.blog.update({
            where: { id: Number(id) },
            data: updateData,
        });

        return updatedBlog ? 1 : 0; // Prisma throws if not found
    }

    // Find blog by id (return as array, like old code)
    static async findById(id) {
        const blog = await prisma.blog.findUnique({
            where: { id: Number(id) }
        });
        if (!blog) return [];
        return [{
            ...blog,
            date_at: blog.date_at ? blog.date_at.toISOString().slice(0, 10) : null,
        }];
    }

    // Delete a blog by id
    static async delete(id) {
        await prisma.blog.delete({
            where: { id: Number(id) }
        });
    }

}

module.exports = Blog;
