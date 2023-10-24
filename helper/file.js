const fs = require('fs').promises;
const path = require('path');

async function deleteImageFile(imagePath) {
  try {
    await fs.unlink(imagePath);
    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Error deleting image');
  }
}

module.exports = {
  deleteImageFile
};