/**
 * Optimizes a Cloudinary image URL for delivery by injecting transformation parameters.
 * Forces modern formats (WebP/AVIF), automatic quality, and scales to a max width.
 * 
 * @param {string} url - The original Cloudinary URL
 * @param {number} width - The target maximum width in pixels
 * @returns {string} The optimized URL
 */
export const getOptimizedCloudinaryUrl = (url, width = 800) => {
  if (!url || typeof url !== 'string') return url;
  
  // Only process Cloudinary URLs
  if (!url.includes('res.cloudinary.com')) return url;

  // Check if it already has transformations (like /upload/w_...)
  // Cloudinary URLs usually follow this pattern:
  // https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<public_id>
  const uploadPart = '/upload/';
  if (url.includes(uploadPart)) {
    const parts = url.split(uploadPart);
    if (parts.length === 2) {
      // Inject the transformation string
      // f_auto: automatic format (WebP/AVIF)
      // q_auto: automatic quality compression
      // c_limit: scale down if larger than width, but don't scale up
      const transformations = `f_auto,q_auto,c_limit,w_${width}/`;
      return `${parts[0]}${uploadPart}${transformations}${parts[1]}`;
    }
  }

  return url;
};
