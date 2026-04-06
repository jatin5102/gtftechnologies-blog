const path = require('path');
const { body, validationResult } = require('express-validator');
const { prisma } = require('../../config/db');
const { deleteFile, GenerateSlug, getFileFullPath } = require('../../utils/helper');

exports.validateBlog = [
    body('heading')
        .notEmpty().withMessage('This heading field is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        const errorObj = {};

        errors.array().forEach(err => {
            errorObj[err.path] = err.msg;
        });

        if (req.method === 'POST') {
            if (!req.files || !req.files.feature_image || req.files.feature_image.length === 0) {
                errorObj['feature_image'] = 'Feature Image field is required';
            }
            if (!req.files || !req.files.mobile_image || req.files.mobile_image.length === 0) {
                errorObj['mobile_image'] = 'Mobile Image field is required';
            }
        }

        if (Object.keys(errorObj).length > 0) {
            return res.status(400).json({
                status: true,
                statusCode: 400,
                errors: errorObj
            });
        }

        next();
    }
];

exports.getAllBlog = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [blogs, totalCount] = await Promise.all([
            prisma.blogs.findMany({
                skip: offset,
                take: limit,
                include: { category: true },
                orderBy: { date_at: 'desc' }
            }),
            prisma.blogs.count()
        ]);

        // Format date
        const data = blogs.map(blog => ({
            ...blog,
            // image show
            feature_image: blog.feature_image ? getFileFullPath(blog.feature_image) : null,
            mb_image: blog.mb_image ? getFileFullPath(blog.mb_image) : null,
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

exports.getBlogById = async (req, res) => {
    try {
        const id = req.params.id;

        const blog = await prisma.blogs.findUnique({
            where: { id },
            include: { category: true }
        });

        if (!blog) {
            return res.status(404).json({ message: "Record not found" });
        }

        const result = {
            ...blog,
            feature_image: blog.feature_image ? getFileFullPath(blog.feature_image) : null,
            mb_image: blog.mb_image ? getFileFullPath(blog.mb_image) : null,
            date_at: blog.date_at ? blog.date_at.toISOString().slice(0, 10) : null
        };

        res.json({ status: true, statusCode: 200, data: result });
    } catch (err) {
        res.status(500).json({ status: true, statusCode: 404, error: err.message });
    }
};

exports.createBlog = async (req, res) => {
    try {
        const {
            category_id, heading, tags, alt, date_at,
            short_description, description,
            meta_title, meta_keywords, meta_description, head_tags, body_tags
        } = req.body;

        const feature_image = req.files.feature_image ? req.files.feature_image[0].path : null;
        const mb_image = req.files.mobile_image ? req.files.mobile_image[0].path : null;
        const slug = GenerateSlug(heading);

        const blog = await prisma.blogs.create({
            data: {
                category_id,
                slug,
                heading,
                tags,
                alt,
                date_at: date_at ? new Date(date_at) : undefined,
                feature_image,
                mb_image,
                short_description,
                description,
                meta_title,
                meta_keywords,
                meta_description,
                head_tags,
                body_tags

            }
        });

        if (blog) {
            const record = {
                ...blog,
                date_at: blog.date_at ? blog.date_at.toISOString().slice(0, 10) : null
            };
            res.status(201).json({
                status: true,
                statusCode: 200,
                message: "Record created successfully",
                data: record
            });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const id = req.params.id;

        const {
            category_id, heading, tags, alt, date_at,
            short_description, description,
            meta_title, meta_keywords, meta_description
        } = req.body;
        let feature_image = req.body.feature_image;

        const slug = GenerateSlug(heading);

        const existingData = await prisma.blogs.findUnique({ where: { id } });
        if (!existingData) {
            return res.status(404).json({ status: true, statusCode: 200, error: "Record not found" });
        }
        let mb_image = existingData.mb_image;
        // Handle updating of images
        if (req.files.feature_image) {
            if (existingData.feature_image) {
                const oldfeatureImagePath = path.join(existingData.feature_image);
                deleteFile(oldfeatureImagePath);
            }
            feature_image = req.files.feature_image[0].path;
        }

        if (req.files.mobile_image) {
            if (existingData.mb_image) {
                const oldmb_imagePath = path.join(existingData.mb_image);
                deleteFile(oldmb_imagePath);
            }
            mb_image = req.files.mobile_image[0].path;
        }

        // Construct update data
        const updateData = {
            category_id, heading, tags, slug, alt,
            date_at: date_at ? new Date(date_at) : undefined,
            short_description, description,
            head_tags,
            body_tags,
            meta_title, meta_keywords, meta_description
        };
        if (feature_image) updateData.feature_image = feature_image;
        if (mb_image) updateData.mb_image = mb_image;

        const updated = await prisma.blogs.update({
            where: { id },
            data: updateData
        });

        if (updated) {
            const record = {
                ...updated,
                date_at: updated.date_at ? updated.date_at.toISOString().slice(0, 10) : null
            };
            res.status(200).json({
                status: true,
                statusCode: 200,
                message: "Record updated successfully",
                data: record
            });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.isFeatured = async (req, res) => {
    try {
        const id = req.params.id;
        const { is_featured } = req.body;
        const existingData = await prisma.blogs.findUnique({ where: { id } });
        if (!existingData) {
            return res.status(404).json({ status: true, statusCode: 200, error: "Record not found" });
        }
        const updateData = {
            is_featured: Boolean(is_featured)
        };
        const updated = await prisma.blogs.update({
            where: { id },
            data: updateData
        });
        if (updated) {
            const record = {
                ...updated,
            };
            res.status(200).json({
                status: true,
                statusCode: 200,
                message: "Featured status updated successfully",
                data: record
            });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.deleteBlog = async (req, res) => {
    try {
        const id = req.params.id;
        const existingData = await prisma.blogs.findUnique({ where: { id } });

        if (!existingData) {
            return res.status(404).json({ status: true, statusCode: 200, error: "Record not found" });
        }

        if (existingData.feature_image) {
            const oldImagePath = path.join(existingData.feature_image);
            deleteFile(oldImagePath);
        }

        if (existingData.mb_image) {
            const oldmb_imagePath = path.join(existingData.mb_image);
            deleteFile(oldmb_imagePath);
        }

        await prisma.blogs.delete({ where: { id } });

        res.json({ status: true, statusCode: 200, message: "Record deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
