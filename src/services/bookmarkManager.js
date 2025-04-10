/**
 * Bookmark Manager Service
 * 
 * Handles bookmark operations:
 * - Saving bookmarks
 * - Loading bookmarks
 * - Managing bookmark categories
 * - Persisting bookmarks to storage
 */

// Import Electron store for persistent storage
const Store = require('electron-store');

// Initialize the store for bookmarks
const bookmarkStore = new Store({
  name: 'bookmarks',
  defaults: {
    bookmarkedImages: [],
    categories: [],
  },
});

// Get all bookmark categories
export const getBookmarkCategories = () => {
  return bookmarkStore.get('categories', []);
};

// Add a new bookmark category
export const addBookmarkCategory = (categoryName) => {
  const categories = getBookmarkCategories();
  
  // Check if category already exists
  if (categories.includes(categoryName)) {
    return false;
  }
  
  // Add the new category
  categories.push(categoryName);
  bookmarkStore.set('categories', categories);
  
  return true;
};

// Remove a bookmark category
export const removeBookmarkCategory = (categoryName) => {
  const categories = getBookmarkCategories();
  const newCategories = categories.filter(cat => cat !== categoryName);
  
  // Check if anything changed
  if (newCategories.length === categories.length) {
    return false;
  }
  
  // Update categories
  bookmarkStore.set('categories', newCategories);
  
  // Remove this category from all bookmarked images
  const bookmarkedImages = getBookmarkedImages();
  const updatedImages = bookmarkedImages.map(img => {
    if (img.bookmarkLabel === categoryName) {
      return { ...img, bookmarkLabel: '' };
    }
    return img;
  });
  
  bookmarkStore.set('bookmarkedImages', updatedImages);
  
  return true;
};

// Get all bookmarked images
export const getBookmarkedImages = () => {
  return bookmarkStore.get('bookmarkedImages', []);
};

// Bookmark an image
export const bookmarkImage = (image, categoryName = '') => {
  const bookmarkedImages = getBookmarkedImages();
  
  // Check if image is already bookmarked
  const existingIndex = bookmarkedImages.findIndex(img => img.id === image.id);
  
  if (existingIndex >= 0) {
    // Update existing bookmark
    bookmarkedImages[existingIndex] = {
      ...bookmarkedImages[existingIndex],
      bookmarkLabel: categoryName,
    };
  } else {
    // Add new bookmark
    bookmarkedImages.push({
      id: image.id,
      name: image.name,
      path: image.path,
      bookmarkLabel: categoryName,
      thumbnail: image.data, // Store a small thumbnail version
      dateBookmarked: new Date().toISOString(),
    });
  }
  
  // Save to store
  bookmarkStore.set('bookmarkedImages', bookmarkedImages);
  
  // Add the category if it's new
  if (categoryName && !getBookmarkCategories().includes(categoryName)) {
    addBookmarkCategory(categoryName);
  }
  
  return true;
};

// Remove bookmark from an image
export const removeBookmark = (imageId) => {
  const bookmarkedImages = getBookmarkedImages();
  const newBookmarkedImages = bookmarkedImages.filter(img => img.id !== imageId);
  
  // Check if anything changed
  if (newBookmarkedImages.length === bookmarkedImages.length) {
    return false;
  }
  
  // Update bookmarked images
  bookmarkStore.set('bookmarkedImages', newBookmarkedImages);
  
  return true;
};

// Get images by category
export const getImagesByCategory = (categoryName) => {
  if (!categoryName) {
    return getBookmarkedImages();
  }
  
  const bookmarkedImages = getBookmarkedImages();
  return bookmarkedImages.filter(img => img.bookmarkLabel === categoryName);
};

// Check if an image is bookmarked
export const isImageBookmarked = (imageId) => {
  const bookmarkedImages = getBookmarkedImages();
  return bookmarkedImages.some(img => img.id === imageId);
};

// Get bookmark details for an image
export const getBookmarkDetails = (imageId) => {
  const bookmarkedImages = getBookmarkedImages();
  const bookmark = bookmarkedImages.find(img => img.id === imageId);
  
  if (!bookmark) {
    return null;
  }
  
  return {
    isBookmarked: true,
    bookmarkLabel: bookmark.bookmarkLabel,
    dateBookmarked: bookmark.dateBookmarked,
  };
};

// Clear all bookmarks
export const clearAllBookmarks = () => {
  bookmarkStore.set('bookmarkedImages', []);
  return true;
};

// Rename a bookmark category
export const renameBookmarkCategory = (oldName, newName) => {
  // Update category in the categories list
  const categories = getBookmarkCategories();
  const categoryIndex = categories.indexOf(oldName);
  
  if (categoryIndex === -1) {
    return false;
  }
  
  // Check if new name already exists
  if (categories.includes(newName)) {
    return false;
  }
  
  // Update category name
  categories[categoryIndex] = newName;
  bookmarkStore.set('categories', categories);
  
  // Update all bookmarked images with this category
  const bookmarkedImages = getBookmarkedImages();
  const updatedImages = bookmarkedImages.map(img => {
    if (img.bookmarkLabel === oldName) {
      return { ...img, bookmarkLabel: newName };
    }
    return img;
  });
  
  bookmarkStore.set('bookmarkedImages', updatedImages);
  
  return true;
};

// Update thumbnail for a bookmarked image
export const updateBookmarkThumbnail = (imageId, newThumbnail) => {
  const bookmarkedImages = getBookmarkedImages();
  const imageIndex = bookmarkedImages.findIndex(img => img.id === imageId);
  
  if (imageIndex === -1) {
    return false;
  }
  
  // Update thumbnail
  bookmarkedImages[imageIndex].thumbnail = newThumbnail;
  bookmarkStore.set('bookmarkedImages', bookmarkedImages);
  
  return true;
};