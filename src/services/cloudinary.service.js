const cloudinary = require("cloudinary").v2;

cloudinary.config({
  secure: true,
});

const cloudinaryService = {
  uploadFileSync: async (filePath, options = {}) => {
    try {
      const result = await cloudinary.uploader.upload(filePath, options);
      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        type: result.resource_type,
      };
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  },

  deleteFileSync: async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return {
        success: true,
        message: "File deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting file from Cloudinary:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  },
};

module.exports = cloudinaryService;
