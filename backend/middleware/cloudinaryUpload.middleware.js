import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.config.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'Ejar_ID_Pictures',
    resource_type: 'image',
    format: file.mimetype.split('/')[1], // e.g. 'jpeg'
    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`,
  }),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else  {const err = new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname);
    err.message = 'Please Check your ID Pictures (Only .png, .jpg and .jpeg formats are allowed!)';
    cb(err, false);}
  },
});


export default upload;
