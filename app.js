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

// Endpoint để lấy tất cả hình ảnh từ Cloudinary
app.get('/images', async (req, res) => {
    try {
        // Lấy giá trị của tham số max_results từ query string (nếu không có sẽ sử dụng giá trị mặc định là 30)
        const maxResults = req.query.max_results || 30;

        const result = await cloudinary.api.resources({
            type: 'upload',
            resource_type: 'image',
            max_results: maxResults, // Số lượng hình ảnh tối đa bạn muốn lấy
        });

        res.json(result.resources);
    } catch (error) {
        console.error('Error fetching images from Cloudinary:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Endpoint để tải lên file vào một thư mục trên Cloudinary
app.post('/image', upload.single('file'), (req, res) => {
    // Kiểm tra xem có file được tải lên không
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Tên thư mục muốn tải lên (đổi thành thư mục mong muốn)
    const targetFolder = 'ABC';

    // Tải file lên Cloudinary vào thư mục cụ thể
    cloudinary.uploader.upload_stream({ resource_type: 'auto', folder: targetFolder }, (error, result) => {
        if (error) {
            return res.status(500).send('Error uploading file to Cloudinary.');
        }

        // Trả về đường dẫn của file đã tải lên
        res.json({ fileUrl: result.secure_url });
    }).end(req.file.buffer);
});

// Endpoint để xóa hình ảnh trên Cloudinary
app.delete('/images/:folder/:file', async (req, res) => {
    const folder = req.params.folder;
    const file = req.params.file;
    const public_id = `${folder}/${file}`;

    try {
        // Sử dụng Cloudinary SDK để xóa hình ảnh
        const result = await cloudinary.uploader.destroy(public_id);

        // Trả về kết quả xóa
        res.json(result);
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
