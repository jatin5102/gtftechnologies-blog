const multer = require('multer');
const path = require('path');
const fs = require('fs');


const storage = (folder) => multer.diskStorage({
     destination: (req, file, cb) => {
          const uploadPath = path.join('uploads', folder);
          if (!fs.existsSync(uploadPath)) {
               fs.mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
     },
     filename: (req, file, cb) => {
          cb(null, Date.now() + path.extname(file.originalname));
     }
});

// Then define the fileFilter
const fileFilter = (req, file, cb) => {
     const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
     const allowedDocTypes = /pdf|doc|docx/;
     const allowedVideoTypes = /mp4|mov|avi|mkv|webm/;
     
     const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
     
     const isImage = file.mimetype.startsWith('image/');
     const isVideo = file.mimetype.startsWith('video/');
     
     if (isImage) {
         if (allowedImageTypes.test(ext)) {
               cb(null, true);
          } else {
               cb(new Error(
                    'Invalid image format! Only JPEG, JPG, PNG, GIF, and WEBP are allowed.'
               ), false);
          }
     } 
     else if (isVideo) {
          if (allowedVideoTypes.test(ext)) {
               cb(null, true);
          } else {
               cb(new Error(
                    'Invalid video format! Only MP4, MOV, AVI, MKV, and WEBM are allowed.'
               ), false);
          }
     }
     else if (file.mimetype === 'application/json' && ext === 'json') {
         cb(null, true);
     }
     else if (
          (file.mimetype === 'application/pdf' || 
          file.mimetype === 'application/msword' ||
          file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') &&
          allowedDocTypes.test(ext)
     ) {
          cb(null, true);
     }
     else {
          cb(new Error(
               'Invalid file type! Allowed formats: ' +
               'Images (JPEG, JPG, PNG, GIF, WEBP), ' +
               'Videos (MP4, MOV, AVI, MKV, WEBM), ' +
               'Documents (PDF, DOC, DOCX), ' +
               'JSON files'
          ), false);
     }
};
 

// Reusable function to create different upload instances
const uploadBlog = multer({storage: storage('blog'), fileFilter: fileFilter })

module.exports = {
     uploadBlog,
};   
