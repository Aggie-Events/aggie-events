import express, { Request, Response } from 'express';
import multer from 'multer'; // For handling file uploads
import cloudinary from 'cloudinary';
import { authMiddleware } from '../../middlewares/authMiddleware'; // Import authentication middleware

const upload = multer({ storage: multer.memoryStorage() });

export const uploadRouter = express.Router();

uploadRouter.post('/', authMiddleware, upload.single('image'), async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ error: 'No file uploaded' });
  
      // Upload image to Cloudinary
      const uploadToCloudinary = (fileBuffer: Buffer): Promise<any> => {
        return new Promise<any>((resolve, reject) => {
          // Correctly use upload_stream
          const stream = cloudinary.v2.uploader.upload_stream(
            { folder: 'uploads' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(fileBuffer);
        });
      };

    // Wait for the upload result
    const result = await uploadToCloudinary(file.buffer);

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});
