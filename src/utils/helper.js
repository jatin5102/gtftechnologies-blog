const fs = require('fs');
const slugify = require('slugify');

exports.deleteFile =  (filename) => {
     if (filename) {
          if (fs.existsSync(filename)) {
               fs.unlinkSync(filename);
          }          
     }
}


exports.GenerateSlug = (slug) => {
     if (!slug) {
          throw new Error('Text input is required for slug generation');
     }
      
     return slugify(slug, {
          lower: true,      // Convert to lowercase
          strict: true,     // Remove special characters
          remove: /[*+~.()'"!:@]/g, // Additional characters to remove
          trim: true        // Trim leading/trailing replacements
     });
}

exports.getFileFullPath = (file) => {
     return `${process.env.BASE_URL}${file}`;
}