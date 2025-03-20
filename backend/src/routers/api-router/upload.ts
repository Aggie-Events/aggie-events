import express, { Request, Response } from 'express';
import multer from 'multer'; // For handling file uploads
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { authMiddleware } from '../../middlewares/authMiddleware'; // Import authentication middleware

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    cb(null, true);
  }
});

export const uploadRouter = express.Router();

uploadRouter.post('/', authMiddleware, upload.single('image'), async (req: Request, res: Response) => {
    try {
      console.log("Uploading image YAY");
      const file = req.file;
      
      if (!file)  {
        console.log("No file uploaded");
        return res.status(400).json({ error: 'No file uploaded' });
      }

      console.log(file);
  
      // Upload image to Cloudinary
      const uploadToCloudinary = (fileBuffer: Buffer): Promise<any> => {
        return new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'uploads' },
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(fileBuffer);
        });
      };

    // Wait for the upload result
    const result = await uploadToCloudinary(file.buffer);

    console.log(result);

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});
