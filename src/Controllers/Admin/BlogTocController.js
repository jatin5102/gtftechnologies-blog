const { body, validationResult } = require('express-validator');
const { prisma } = require('../../config/db');
const { GenerateSlug } = require('../../utils/helper');

exports.validateBlogToc = [
    body('toc_heading')
        .notEmpty().withMessage('The heading field is required'),


    (req, res, next) => {
        const errors = validationResult(req);
        const errorObj = {};

        errors.array().forEach(err => {
            errorObj[err.path] = err.msg;
        });

        if (Object.keys(errorObj).length > 0) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                errors: errorObj
            });
        }

        next();
    }
];

exports.getAllBlogToc = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const blog_id = req.query.blog_id;

        let where = {};
        if (blog_id) {
            where.blog_id = blog_id;
        }

        const [results, totalCount] = await Promise.all([
            prisma.blog_toc.findMany({
                where,
                skip: offset,
                take: limit,
                orderBy: { created_at: 'desc' },
                include: { blog: true }
            }),
            prisma.blog_toc.count({ where })
        ]);

        res.status(200).json({
            status: true,
            statusCode: 200,
            data: results,
            pagination: {
                totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            }
        });

    } catch (err) {
        res.status(500).json({ status: false, statusCode: 500, error: err.message });
    }
};

exports.getBlogTocById = async (req, res) => {
    try {
        const id = req.params.id;

        const record = await prisma.blog_toc.findUnique({
            where: { id },
            include: { blog: true }
        });

        if (!record) {
            return res.status(404).json({ status: false, statusCode: 404, message: "Record not found" });
        }

        res.json({ status: true, statusCode: 200, data: record });
    } catch (err) {
        res.status(500).json({ status: false, statusCode: 500, error: err.message });
    }
};

exports.createBlogToc = async (req, res) => {
    try {
        const { blog_id, toc_heading, title, slug, description, status } = req.body;
        const generatedSlug = slug || (title ? GenerateSlug(title) : (toc_heading ? GenerateSlug(toc_heading) : ''));

        const record = await prisma.blog_toc.create({
            data: {
                blog_id,
                toc_heading,
                title,
                slug: generatedSlug,
                description,
                status: status !== undefined ? (typeof status === 'string' ? JSON.parse(status) : status) : true
            }
        });

        res.status(201).json({
            status: true,
            statusCode: 201,
            message: "Record created successfully",
            data: record
        });

    } catch (err) {
        res.status(500).json({ status: false, statusCode: 500, error: err.message });
    }
};

exports.updateBlogToc = async (req, res) => {
    try {
        const id = req.params.id;
        const { toc_heading, title, slug, description, status } = req.body;

        const existing = await prisma.blog_toc.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ status: false, statusCode: 404, error: "Record not found" });
        }

        const generatedSlug = slug || (title ? GenerateSlug(title) : (toc_heading ? GenerateSlug(toc_heading) : undefined));

        const updated = await prisma.blog_toc.update({
            where: { id },
            data: {
                toc_heading,
                title,
                slug: generatedSlug,
                description,
                status: status !== undefined ? (typeof status === 'string' ? JSON.parse(status) : status) : undefined
            }
        });

        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Record updated successfully",
            data: updated
        });

    } catch (err) {
        res.status(500).json({ status: false, statusCode: 500, error: err.message });
    }
};

exports.deleteBlogToc = async (req, res) => {
    try {
        const id = req.params.id;
        const existing = await prisma.blog_toc.findUnique({ where: { id } });

        if (!existing) {
            return res.status(404).json({ status: false, statusCode: 404, error: "Record not found" });
        }

        await prisma.blog_toc.delete({ where: { id } });

        res.json({ status: true, statusCode: 200, message: "Record deleted successfully" });
    } catch (err) {
        res.status(500).json({ status: false, statusCode: 500, error: err.message });
    }
};
