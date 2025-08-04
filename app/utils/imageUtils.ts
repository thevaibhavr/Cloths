// Utility function to check if an image URL is external
export function isExternalImage(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

// Utility function to get image dimensions for external images
export function getImageDimensions(url: string): { width: number; height: number } {
  // Default dimensions for external images
  return { width: 400, height: 533 };
}

// Utility function to validate image URL
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  
  // Check if it's a local image
  if (url.startsWith('/')) return true;
  
  // Check if it's an external image with valid protocol
  if (url.startsWith('http://') || url.startsWith('https://')) return true;
  
  return false;
}

// Utility function to get fallback image
export function getFallbackImage(): string {
  return '/images/placeholder.jpg'; // You can create a placeholder image
}

// Utility function to handle image error
export function handleImageError(e: any, fallbackSrc?: string) {
  const target = e.target as HTMLImageElement;
  target.src = fallbackSrc || getFallbackImage();
  target.onerror = null; // Prevent infinite loop
} 