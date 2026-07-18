const cloudinary = require('../config/cloudinary');

// Helper to check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && 
            process.env.CLOUDINARY_API_KEY && 
            process.env.CLOUDINARY_API_SECRET);
};

// @desc    Get all cloud resources (photos and videos)
// @route   GET /api/admin/cloud/resources
// @access  Private/Admin
exports.getCloudResources = async (req, res) => {
  try {
    const { type = 'all', maxResults = 50, nextCursor } = req.query;
    
    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
      return res.status(400).json({
        success: false,
        message: 'Cloudinary is not configured. Please check your environment variables.',
        resources: [],
        total: 0,
        hasMore: false,
        nextCursor: null,
      });
    }

    let resources = [];
    let totalCount = 0;
    let nextCursorValue = null;
    let hasMoreValue = false;

    try {
      // Fetch images
      const imageOptions = {
        resource_type: 'image',
        max_results: parseInt(maxResults) || 50,
        prefix: 'temple/',
      };
      
      if (nextCursor) {
        imageOptions.next_cursor = nextCursor;
      }

      const imageResult = await cloudinary.api.resources(imageOptions);
      
      // Fetch videos
      const videoOptions = {
        resource_type: 'video',
        max_results: parseInt(maxResults) || 50,
        prefix: 'temple/',
      };
      
      if (nextCursor) {
        videoOptions.next_cursor = nextCursor;
      }

      const videoResult = await cloudinary.api.resources(videoOptions);

      // Combine resources
      const allImages = (imageResult.resources || []).map(r => ({
        id: r.public_id,
        url: r.secure_url || r.url,
        type: 'image',
        format: r.format || 'unknown',
        size: r.bytes || 0,
        width: r.width || 0,
        height: r.height || 0,
        createdAt: r.created_at || new Date().toISOString(),
        updatedAt: r.updated_at || new Date().toISOString(),
        folder: r.folder || '',
        filename: r.public_id ? r.public_id.split('/').pop() : 'unknown',
      }));

      const allVideos = (videoResult.resources || []).map(r => ({
        id: r.public_id,
        url: r.secure_url || r.url,
        type: 'video',
        format: r.format || 'unknown',
        size: r.bytes || 0,
        width: r.width || 0,
        height: r.height || 0,
        createdAt: r.created_at || new Date().toISOString(),
        updatedAt: r.updated_at || new Date().toISOString(),
        folder: r.folder || '',
        filename: r.public_id ? r.public_id.split('/').pop() : 'unknown',
      }));

      // Filter by type
      if (type === 'image') {
        resources = allImages;
      } else if (type === 'video') {
        resources = allVideos;
      } else {
        resources = [...allImages, ...allVideos];
      }

      // Sort by createdAt (newest first)
      resources.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      totalCount = resources.length;
      nextCursorValue = imageResult.next_cursor || videoResult.next_cursor || null;
      hasMoreValue = !!nextCursorValue;

      console.log(`✅ Found ${resources.length} resources (${allImages.length} images, ${allVideos.length} videos)`);

    } catch (error) {
      console.error('❌ Error fetching from Cloudinary:', error.message);
      
      // Return empty resources with error message
      return res.json({
        success: true,
        resources: [],
        total: 0,
        nextCursor: null,
        hasMore: false,
        message: error.message || 'Failed to fetch resources from Cloudinary',
      });
    }

    res.json({
      success: true,
      resources,
      total: totalCount,
      nextCursor: nextCursorValue,
      hasMore: hasMoreValue,
    });

  } catch (error) {
    console.error('❌ Get cloud resources error:', error.message);
    res.json({
      success: true,
      resources: [],
      total: 0,
      nextCursor: null,
      hasMore: false,
      message: error.message || 'Failed to fetch resources',
    });
  }
};

// @desc    Get cloud resource by ID
// @route   GET /api/admin/cloud/resource/:publicId
// @access  Private/Admin
exports.getCloudResource = async (req, res) => {
  try {
    const { publicId } = req.params;
    
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required',
      });
    }
    
    if (!isCloudinaryConfigured()) {
      return res.status(400).json({
        success: false,
        message: 'Cloudinary is not configured.',
      });
    }
    
    const result = await cloudinary.api.resource(publicId);
    
    res.json({
      success: true,
      resource: {
        id: result.public_id,
        url: result.secure_url || result.url,
        type: result.resource_type || 'image',
        format: result.format || 'unknown',
        size: result.bytes || 0,
        width: result.width || 0,
        height: result.height || 0,
        createdAt: result.created_at || new Date().toISOString(),
        updatedAt: result.updated_at || new Date().toISOString(),
        folder: result.folder || '',
        filename: result.public_id ? result.public_id.split('/').pop() : 'unknown',
      }
    });
  } catch (error) {
    console.error('Get cloud resource error:', error.message);
    res.status(404).json({
      success: false,
      message: error.message || 'Resource not found',
    });
  }
};

// @desc    Delete cloud resource
// @route   DELETE /api/admin/cloud/resource/:publicId
// @access  Private/Admin
exports.deleteCloudResource = async (req, res) => {
  try {
    const { publicId } = req.params;
    const { resourceType = 'image' } = req.query;
    
    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required',
      });
    }
    
    if (!isCloudinaryConfigured()) {
      return res.status(400).json({
        success: false,
        message: 'Cloudinary is not configured.',
      });
    }
    
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    
    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Resource deleted successfully',
        publicId,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.result || 'Failed to delete resource',
      });
    }
  } catch (error) {
    console.error('Delete cloud resource error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete resource',
    });
  }
};

// @desc    Delete multiple cloud resources
// @route   POST /api/admin/cloud/resources/delete
// @access  Private/Admin
exports.deleteMultipleCloudResources = async (req, res) => {
  try {
    const { publicIds, resourceType = 'image' } = req.body;
    
    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of public IDs',
      });
    }
    
    if (!isCloudinaryConfigured()) {
      return res.status(400).json({
        success: false,
        message: 'Cloudinary is not configured.',
      });
    }
    
    const results = [];
    for (const publicId of publicIds) {
      try {
        const result = await cloudinary.uploader.destroy(publicId, {
          resource_type: resourceType,
        });
        results.push({
          publicId,
          success: result.result === 'ok',
          message: result.result === 'ok' ? 'Deleted' : result.result,
        });
      } catch (error) {
        results.push({
          publicId,
          success: false,
          message: error.message,
        });
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    
    res.json({
      success: true,
      results,
      total: results.length,
      successCount,
      failedCount: results.length - successCount,
    });
  } catch (error) {
    console.error('Delete multiple resources error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete resources',
    });
  }
};

// @desc    Get cloud storage stats
// @route   GET /api/admin/cloud/stats
// @access  Private/Admin
exports.getCloudStats = async (req, res) => {
  try {
    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
      return res.json({
        success: true,
        stats: {
          totalResources: 0,
          totalImages: 0,
          totalVideos: 0,
          totalSize: 0,
          totalSizeMB: 0,
          totalSizeGB: 0,
        },
        message: 'Cloudinary not configured.',
      });
    }
    
    let images = { resources: [] };
    let videos = { resources: [] };
    
    // Try to fetch images
    try {
      images = await cloudinary.api.resources({
        resource_type: 'image',
        max_results: 500,
        prefix: 'temple/',
      });
    } catch (error) {
      console.log('Error fetching images:', error.message);
    }
    
    // Try to fetch videos
    try {
      videos = await cloudinary.api.resources({
        resource_type: 'video',
        max_results: 500,
        prefix: 'temple/',
      });
    } catch (error) {
      console.log('Error fetching videos:', error.message);
    }
    
    const allResources = [...(images.resources || []), ...(videos.resources || [])];
    const totalImages = (images.resources || []).length;
    const totalVideos = (videos.resources || []).length;
    const totalResources = allResources.length;
    
    const totalSize = allResources.reduce((acc, r) => acc + (r.bytes || 0), 0);
    const totalSizeMB = totalSize > 0 ? parseFloat((totalSize / (1024 * 1024)).toFixed(2)) : 0;
    const totalSizeGB = totalSize > 0 ? parseFloat((totalSize / (1024 * 1024 * 1024)).toFixed(2)) : 0;
    
    res.json({
      success: true,
      stats: {
        totalResources,
        totalImages,
        totalVideos,
        totalSize,
        totalSizeMB,
        totalSizeGB,
      }
    });
  } catch (error) {
    console.error('Get cloud stats error:', error.message);
    res.json({
      success: true,
      stats: {
        totalResources: 0,
        totalImages: 0,
        totalVideos: 0,
        totalSize: 0,
        totalSizeMB: 0,
        totalSizeGB: 0,
      },
      message: error.message || 'Failed to fetch stats',
    });
  }
};

// @desc    Search cloud resources
// @route   GET /api/admin/cloud/search
// @access  Private/Admin
exports.searchCloudResources = async (req, res) => {
  try {
    const { q, type = 'all', maxResults = 50 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }
    
    if (!isCloudinaryConfigured()) {
      return res.status(400).json({
        success: false,
        message: 'Cloudinary is not configured.',
        resources: [],
        total: 0,
      });
    }
    
    let resources = [];
    let searchResults = [];

    try {
      // Search in images
      const imageResult = await cloudinary.api.resources({
        resource_type: 'image',
        max_results: parseInt(maxResults) || 50,
        prefix: 'temple/',
      });

      // Search in videos
      const videoResult = await cloudinary.api.resources({
        resource_type: 'video',
        max_results: parseInt(maxResults) || 50,
        prefix: 'temple/',
      });

      // Combine and filter
      const allImages = (imageResult.resources || []).map(r => ({
        id: r.public_id,
        url: r.secure_url || r.url,
        type: 'image',
        format: r.format || 'unknown',
        size: r.bytes || 0,
        width: r.width || 0,
        height: r.height || 0,
        createdAt: r.created_at || new Date().toISOString(),
        updatedAt: r.updated_at || new Date().toISOString(),
        folder: r.folder || '',
        filename: r.public_id ? r.public_id.split('/').pop() : 'unknown',
      }));

      const allVideos = (videoResult.resources || []).map(r => ({
        id: r.public_id,
        url: r.secure_url || r.url,
        type: 'video',
        format: r.format || 'unknown',
        size: r.bytes || 0,
        width: r.width || 0,
        height: r.height || 0,
        createdAt: r.created_at || new Date().toISOString(),
        updatedAt: r.updated_at || new Date().toISOString(),
        folder: r.folder || '',
        filename: r.public_id ? r.public_id.split('/').pop() : 'unknown',
      }));

      const combined = [...allImages, ...allVideos];
      
      // Filter by search query
      resources = combined.filter(r => {
        const filename = r.filename || '';
        return filename.toLowerCase().includes(q.toLowerCase()) ||
               (r.format && r.format.toLowerCase().includes(q.toLowerCase()));
      });

      // Filter by type
      if (type === 'image') {
        resources = resources.filter(r => r.type === 'image');
      } else if (type === 'video') {
        resources = resources.filter(r => r.type === 'video');
      }

    } catch (error) {
      console.error('Search error:', error.message);
      return res.json({
        success: true,
        resources: [],
        total: 0,
        message: error.message || 'Search failed',
      });
    }

    res.json({
      success: true,
      resources,
      total: resources.length,
    });
  } catch (error) {
    console.error('Search cloud resources error:', error.message);
    res.json({
      success: true,
      resources: [],
      total: 0,
      message: error.message || 'Search failed',
    });
  }
};