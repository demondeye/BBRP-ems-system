// Vercel Serverless Function to delete Cloudinary images
// This file should be at: /api/delete-image.js

import crypto from 'crypto';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { publicId } = req.body;

  if (!publicId) {
    return res.status(400).json({ error: 'Missing publicId' });
  }

  // Cloudinary credentials
  const CLOUD_NAME = 'dtxtinest';
  const API_KEY = '362781521447941';
  const API_SECRET = process.env.CLOUDINARY_API_SECRET;

  if (!API_SECRET) {
    return res.status(500).json({ error: 'API Secret not configured' });
  }

  try {
    // Generate timestamp
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Create signature
    const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    // Make delete request to Cloudinary
    const formData = new URLSearchParams();
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', API_KEY);
    formData.append('signature', signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }
    );

    const result = await response.json();

    if (result.result === 'ok' || result.result === 'not found') {
      return res.status(200).json({ success: true, result: result.result });
    } else {
      console.error('Cloudinary delete error:', result);
      return res.status(400).json({ error: 'Delete failed', details: result });
    }
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Server error', message: error.message });
  }
}
