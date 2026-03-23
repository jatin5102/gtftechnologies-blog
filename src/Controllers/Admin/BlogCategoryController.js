const { body, validationResult } = require('express-validator');
const { prisma } = require('../../config/db');
const { GenerateSlug } = require('../../utils/helper');

exports.validateBlogCategory = [
    body('name')
        .notEmpty().withMessage('The name field is required'),

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

exports.getAllBlogCategory = async (req, res) => {
    try {
        let where = {};
        const search = req.query.search || '';

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }
        const categories = await prisma.blog_categories.findMany({
            where,
            orderBy: { created_at: 'desc' },
            skip: offset,
            take: limit,
        });
        const totalCount = await prisma.blog_categories.count();

        res.status(200).json({
            status: true,
            statusCode: 200,
            data: categories,
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

exports.getBlogCategoryById = async (req, res) => {
    try {
        const id = req.params.id;

        const category = await prisma.blog_categories.findUnique({
            where: { id }
        });

        if (!category) {
            return res.status(404).json({ status: false, statusCode: 404, message: "Record not found" });
        }

        res.json({ status: true, statusCode: 200, data: category });
    } catch (err) {
        res.status(500).json({ status: false, statusCode: 500, error: err.message });
    }
};

exports.createBlogCategory = async (req, res) => {
    try {
        const { name, status } = req.body;
        const slug = GenerateSlug(name);

        const category = await prisma.blog_categories.create({
            data: {
                name,
                slug,
                status: status !== undefined ? JSON.parse(status) : true
            }
        });

        res.status(201).json({
            status: true,
            statusCode: 201,
            message: "Record created successfully",
            data: category
        });

    } catch (err) {
        res.status(500).json({ status: false, statusCode: 500, error: err.message });
    }
};

exports.updateBlogCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, status } = req.body;
        const slug = name ? GenerateSlug(name) : undefined;

        const existing = await prisma.blog_categories.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ status: false, statusCode: 404, error: "Record not found" });
        }

        const updated = await prisma.blog_categories.update({
            where: { id },
            data: {
                name,
                slug,
                status: status !== undefined ? JSON.parse(status) : undefined
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

exports.deleteBlogCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const existing = await prisma.blog_categories.findUnique({ where: { id } });

        if (!existing) {
            return res.status(404).json({ status: false, statusCode: 404, error: "Record not found" });
        }

        await prisma.blog_categories.delete({ where: { id } });

        res.json({ status: true, statusCode: 200, message: "Record deleted successfully" });
    } catch (err) {
        res.status(500).json({ status: false, statusCode: 500, error: err.message });
    }
};
