import express from 'express';
import stream from 'stream';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';
import { verifyAdminAuth } from '../utils/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('image'), async (req, res) => {
  const authResult = verifyAdminAuth(req);
  if (!authResult.authenticated || authResult.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'vedalush_products',
        timeout: 120000
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          if (error.message?.includes('Signature verification failed')) {
            return res.status(400).json({ 
              message: 'Upload failed: Signature verification failed. Check your Cloudinary API Secret in .env file.',
              error: 'Signature verification failed'
            });
          }
          return res.status(500).json({ 
            message: 'Upload failed: ' + (error.message || 'Unknown error'),
            error: error.message 
          });
        }
        res.json({ secure_url: result.secure_url });
      }
    );

    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);
    bufferStream.pipe(uploadStream);

  } catch (error) {
    console.error('Cloudinary stream error:', error);
    res.status(500).json({ 
      message: 'Upload failed: ' + error.message,
      error: error.message 
    });
  }
});

export default router;
