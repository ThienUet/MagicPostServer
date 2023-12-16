const multer = require('multer');
const path = require('path');

// Tạo một thư mục lưu trữ tạm để chờ upload ảnh lên
const createStorage = (img_path = '') => {
    let ext = null;
    const storage = multer.diskStorage({
        destination: path.resolve(process.cwd(), `images_temp/${img_path}`),
        filename(req, file, cb) {
            switch (file.mimetype) {
                case "image/jpeg":
                  ext = ".jpeg";
                  break;
                case "image/png":
                  ext = ".png";
                  break;
                case "image/jpg":
                  ext = ".jpg";
                  break;
                case "image/gif":
                  ext = ".gif";
                  break;
              }
              cb(null, file.originalname.slice(0,4) + `_` + Date.now() + ext );
        }
    });
    return storage;
};

const checkImageType = (file, cb) => {
    // Cho phép những file có đuôi sau
    const fileTypes = /jpeg|jpg|png|gif/;
    // Check đuôi file
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimType = fileTypes.test(file.mimeType);

    if (mimType && extName) {
        return cb(null, true)
    }
    cb("Error: Images Only");
}

const uploadImage = (img_path) => {
    const uploadSingle = multer({
        storage: createStorage(img_path),
        limits: {
            fileSize: 5 * 1024 * 1024
        },
        fileFilter(req, file, cb) {
            checkImageType(file, cb);
        }
    });
    return uploadSingle.single('file');
}

const imgur = multer({ storage: multer.memoryStorage({}) });

module.exports = {
    uploadSingle: uploadImage,
    uploadImgur: imgur,
  };