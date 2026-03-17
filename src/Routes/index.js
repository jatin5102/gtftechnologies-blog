const fs = require('fs');
const path = require('path');
const router = require('express').Router();


const routeDirectories = [
    path.join(__dirname, 'Admin'),
    path.join(__dirname, 'Website')
];

routeDirectories.forEach(dir => {
    fs.readdirSync(dir).forEach(file => {
        if (!file.endsWith('.js')) return;

        const route = require(path.join(dir, file));
        let basePath;
        if (dir.includes('Website')) {
            basePath = '/api/v1/website';
        } else if (dir.includes('Admin')) {
            basePath = '/api/v1/admin';
        }
        router.use(basePath, route);
    });
});



module.exports = router;