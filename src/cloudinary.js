// Cloudinary configuration
const CLOUD_NAME = 'dtxtinest';
const UPLOAD_PRESET = 'ml_default'; // You may need to create an unsigned upload preset in Cloudinary
const API_KEY = '362781521447941';

/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {string} publicId - Public ID for the image (e.g., "backgrounds/user123.editing.jpg")
 * @param {number} maxSizeBytes - Maximum file size in bytes (default 2MB)
 * @returns {Promise<Object>} Upload response with secure_url
 */
export async function uploadToCloudinary(file, publicId, maxSizeBytes = 2 * 1024 * 1024) {
  // Validate file size (2MB limit)
  if (file.size > maxSizeBytes) {
    throw new Error(`File size exceeds ${maxSizeBytes / (1024 * 1024)}MB limit`);
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('public_id', publicId);
  formData.append('api_key', API_KEY);

  try {
    console.log('Uploading to Cloudinary...', { publicId, cloudName: CLOUD_NAME, preset: UPLOAD_PRESET });
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    console.log('Cloudinary response status:', response.status);

    if (!response.ok) {
      const error = await response.json();
      console.error('Cloudinary error response:', error);
      throw new Error(error.error?.message || `Upload failed with status ${response.status}`);
    }

    const result = await response.json();
    console.log('Upload successful:', result.secure_url);
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<Object>} Delete response
 */
export async function deleteFromCloudinary(publicId) {
  try {
    console.log('Deleting image from Cloudinary:', publicId);
    
    // Call our Vercel serverless function to delete the image
    const response = await fetch('/api/delete-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Delete API error:', error);
      throw new Error(error.error || 'Delete failed');
    }

    const result = await response.json();
    console.log('Delete successful:', result);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
}

/**
 * Get Cloudinary image URL
 * @param {string} publicId - Public ID of the image
 * @param {Object} transformations - Optional transformations (width, height, etc.)
 * @returns {string} Full Cloudinary URL
 */
export function getCloudinaryUrl(publicId, transformations = {}) {
  const baseUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
  
  // Build transformation string
  const transforms = [];
  if (transformations.width) transforms.push(`w_${transformations.width}`);
  if (transformations.height) transforms.push(`h_${transformations.height}`);
  if (transformations.crop) transforms.push(`c_${transformations.crop}`);
  if (transformations.quality) transforms.push(`q_${transformations.quality}`);
  
  const transformString = transforms.length > 0 ? `/${transforms.join(',')}` : '';
  
  return `${baseUrl}${transformString}/${publicId}`;
}

/**
 * Check if user has a background image
 * @param {string} userId - User ID
 * @returns {Promise<string|null>} URL of the final background image or null
 */
export async function getUserBackground(userId) {
  try {
    // Try to fetch the final background image
    const imageUrl = getCloudinaryUrl(`backgrounds/${userId}.final`);
    
    // Check if image exists by attempting to fetch it
    const response = await fetch(imageUrl, { method: 'HEAD' });
    
    if (response.ok) {
      return imageUrl;
    }
    
    return null;
  } catch (error) {
    console.error('Error checking user background:', error);
    return null;
  }
}

/**
 * Rename/move image in Cloudinary (from editing to final)
 * @param {string} userId - User ID
 * @param {string} fileExtension - File extension (jpg, png, etc.)
 * @returns {Promise<Object>} Result of the operation
 */
export async function applyEditingImage(userId, fileExtension) {
  try {
    // This requires server-side implementation with your API secret
    // For now, we'll handle this by re-uploading with the new public_id
    
    const editingUrl = getCloudinaryUrl(`backgrounds/${userId}.editing.${fileExtension}`);
    
    // Fetch the editing image
    const response = await fetch(editingUrl);
    const blob = await response.blob();
    const file = new File([blob], `${userId}.final.${fileExtension}`, { type: blob.type });
    
    // Upload as final
    const result = await uploadToCloudinary(file, `backgrounds/${userId}.final`);
    
    // Delete editing image (placeholder - needs server-side)
    await deleteFromCloudinary(`backgrounds/${userId}.editing`);
    
    return result;
  } catch (error) {
    console.error('Error applying editing image:', error);
    throw error;
  }
}
