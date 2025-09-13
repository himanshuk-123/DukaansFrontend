/**
 * Format a price in rupees
 * @param {number} price - The price to format
 * @returns {string} Formatted price
 */
export const formatPrice = (price) => {
  return `₹${price.toFixed(2)}`;
};

/**
 * Format a date
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date (e.g., "15 Oct 2023")
 */
export const formatDate = (date) => {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const year = dateObj.getFullYear();
  return `${day} ${month} ${year}`;
};

/**
 * Get image dimensions maintaining aspect ratio
 * @param {number} originalWidth - Original width
 * @param {number} originalHeight - Original height
 * @param {number} targetWidth - Target width
 * @returns {Object} New dimensions { width, height }
 */
export const calculateImageDimensions = (originalWidth, originalHeight, targetWidth) => {
  const aspectRatio = originalWidth / originalHeight;
  const newHeight = targetWidth / aspectRatio;
  return { width: targetWidth, height: newHeight };
};

/**
 * Truncate text to a specific length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 30) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
