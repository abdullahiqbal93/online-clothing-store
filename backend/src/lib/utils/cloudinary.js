import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { env } from '@/lib/config.js';

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
});

const storage = new multer.memoryStorage();


export async function imageUploadUtil(file) {
    const result = await cloudinary.uploader.upload(file, {
        resource_type: 'auto'
    });
    return result.secure_url;
}

export const upload = multer({ storage });

