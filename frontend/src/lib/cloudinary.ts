/**
 * Optimizes Cloudinary URLs for faster loading
 * @param url The original Cloudinary URL
 * @param options Transformation options (width, quality, etc)
 */
export function getOptimizedImage(url: string, width = 800): string {
  if (!url || !url.includes('cloudinary.com')) return url;

  // Split the URL to insert transformations
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  // f_auto: automatic format (webp/avif)
  // q_auto: automatic quality
  // w_: specific width
  // c_limit: don't upscale
  const transformation = `f_auto,q_auto,w_${width},c_limit`;
  
  return `${parts[0]}/upload/${transformation}/${parts[1]}`;
}
