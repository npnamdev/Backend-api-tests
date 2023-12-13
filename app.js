const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const app = express();
const port = 3000;

// Thiết lập Cloudinary
cloudinary.config({
    cloud_name: 'dijvnrdmc',
    api_key: '683867852619334',
    api_secret: 'FranOnASnXo3wJ01y-hh5dBlK6w',
});

// Thiết lập Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint để tải lên file
app.post('/upload', upload.single('file'), (req, res) => {
    // Kiểm tra xem có file được tải lên không
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Tải file lên Cloudinary
    cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) {
            return res.status(500).send('Error uploading file to Cloudinary.');
        }

        // Trả về đường dẫn của file đã tải lên
        res.json({ fileUrl: result.secure_url });
    }).end(req.file.buffer);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
