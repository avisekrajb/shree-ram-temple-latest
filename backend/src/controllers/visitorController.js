const Visitor = require('../models/Visitor');
const axios = require('axios');

// Try to load geoip-lite, but don't fail if not available
let geoip;
try {
  geoip = require('geoip-lite');
} catch (error) {
  console.log('⚠️ geoip-lite not available, using IP API fallback');
  geoip = null;
}

// @desc    Track visitor
// @route   POST /api/visitors/track
// @access  Public
exports.trackVisitor = async (req, res) => {
  try {
    const { 
      sessionId, 
      page, 
      pageTitle, 
      referrer, 
      userAgent, 
      isNewVisitor,
      visitCount 
    } = req.body;

    console.log('📊 Tracking visitor:', { sessionId, page, pageTitle });

    // Get IP address
    let ipAddress = req.headers['x-forwarded-for'] || 
                    req.headers['x-real-ip'] ||
                    req.connection?.remoteAddress || 
                    req.socket?.remoteAddress ||
                    req.ip ||
                    '0.0.0.0';

    // Handle multiple IPs in x-forwarded-for
    if (ipAddress && ipAddress.includes(',')) {
      ipAddress = ipAddress.split(',')[0].trim();
    }

    // Clean IP (remove IPv6 prefix if present)
    const cleanIp = ipAddress.replace(/^::ffff:/, '');

    console.log('📍 IP Address:', cleanIp);

    // Get location from IP
    let location = await getLocationFromIP(cleanIp);
    console.log('📍 Location found:', location);

    // Parse user agent
    const deviceInfo = parseUserAgent(userAgent);

    // Check if visitor already exists for this session and page today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingVisitor = await Visitor.findOne({
      sessionId,
      page,
      date: { $gte: today },
    });

    if (existingVisitor) {
      // Update visit count
      existingVisitor.visitCount = (existingVisitor.visitCount || 0) + 1;
      existingVisitor.ipAddress = cleanIp;
      existingVisitor.location = location;
      existingVisitor.timeSpent = 0;
      await existingVisitor.save();
      
      return res.json({ 
        success: true, 
        visitor: existingVisitor,
        isNew: false 
      });
    }

    // Create new visitor
    const visitor = await Visitor.create({
      sessionId,
      ipAddress: cleanIp,
      page,
      pageTitle: pageTitle || page,
      referrer: referrer || '',
      userAgent: userAgent || '',
      deviceType: deviceInfo.deviceType,
      browser: deviceInfo.browser,
      os: deviceInfo.os,
      location,
      isNewVisitor: isNewVisitor !== false,
      visitCount: visitCount || 1,
      entryPage: page,
      exitPage: page,
      date: new Date(),
      day: new Date().toISOString().split('T')[0],
      month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
      year: new Date().getFullYear(),
    });

    console.log('✅ Visitor tracked:', visitor._id);

    res.json({ 
      success: true, 
      visitor,
      isNew: true 
    });
  } catch (error) {
    console.error('❌ Track visitor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update time spent on page
// @route   POST /api/visitors/time
// @access  Public
exports.updateTimeSpent = async (req, res) => {
  try {
    const { sessionId, page, timeSpent } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Visitor.findOneAndUpdate(
      { sessionId, page, date: { $gte: today } },
      { $set: { timeSpent } },
      { new: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Update time spent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get visitor stats (admin only)
// @route   GET /api/visitors/stats
// @access  Private/Admin
exports.getVisitorStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    console.log('📊 Fetching visitor stats for last', days, 'days');

    // Get all visitors in date range
    const visitors = await Visitor.find({
      date: { $gte: startDate }
    }).sort({ date: 1 });

    console.log('📊 Total visitors found:', visitors.length);

    // Total visitors (unique by session)
    const uniqueSessions = new Set();
    visitors.forEach(v => uniqueSessions.add(v.sessionId));
    const totalVisitors = uniqueSessions.size;

    // Today's visitors
    const today = new Date().toISOString().split('T')[0];
    const todayVisitors = await Visitor.countDocuments({ day: today });

    // Unique visitors (by IP)
    const uniqueIPs = new Set();
    visitors.forEach(v => {
      if (v.ipAddress) uniqueIPs.add(v.ipAddress);
    });
    const uniqueVisitors = uniqueIPs.size;

    // Daily stats
    const dailyStats = visitors.reduce((acc, v) => {
      const day = v.day || v.date.toISOString().split('T')[0];
      if (!acc[day]) {
        acc[day] = { date: day, count: 0, sessions: 0, uniqueIPs: new Set() };
      }
      acc[day].count += 1;
      acc[day].sessions += 1;
      if (v.ipAddress) acc[day].uniqueIPs.add(v.ipAddress);
      return acc;
    }, {});

    const dailyStatsArray = Object.values(dailyStats).map(d => ({
      date: d.date,
      count: d.count,
      sessions: d.sessions,
      uniqueIPs: d.uniqueIPs.size,
    }));

    // Page-wise stats
    const pageStats = visitors.reduce((acc, v) => {
      const page = v.page || '/';
      if (!acc[page]) {
        acc[page] = { page, count: 0, uniqueIPs: new Set(), timeSpent: 0 };
      }
      acc[page].count += 1;
      if (v.ipAddress) acc[page].uniqueIPs.add(v.ipAddress);
      acc[page].timeSpent += (v.timeSpent || 0);
      return acc;
    }, {});

    const pageStatsArray = Object.values(pageStats).map(p => ({
      page: p.page,
      count: p.count,
      uniqueVisitors: p.uniqueIPs.size,
      avgTimeSpent: p.count > 0 ? Math.round(p.timeSpent / p.count) : 0,
    })).sort((a, b) => b.count - a.count);

    // Device stats
    const deviceStats = visitors.reduce((acc, v) => {
      const device = v.deviceType || 'unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});

    // Browser stats
    const browserStats = visitors.reduce((acc, v) => {
      const browser = v.browser || 'unknown';
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {});

    // OS stats
    const osStats = visitors.reduce((acc, v) => {
      const os = v.os || 'unknown';
      acc[os] = (acc[os] || 0) + 1;
      return acc;
    }, {});

    // Location stats - filter out Unknown
    const locationStats = visitors.reduce((acc, v) => {
      if (v.location?.country && v.location.country !== 'Unknown' && v.location.country !== '') {
        const key = `${v.location.country}${v.location.city && v.location.city !== 'Unknown' ? `, ${v.location.city}` : ''}`;
        if (!acc[key]) {
          acc[key] = {
            country: v.location.country,
            city: v.location.city || '',
            count: 0,
            visitors: new Set(),
            locations: [],
          };
        }
        acc[key].count += 1;
        if (v.sessionId) acc[key].visitors.add(v.sessionId);
        if (v.location.latitude && v.location.longitude) {
          acc[key].locations.push({
            lat: v.location.latitude,
            lng: v.location.longitude,
            sessionId: v.sessionId,
          });
        }
      }
      return acc;
    }, {});

    const locationStatsArray = Object.values(locationStats).map(l => ({
      country: l.country,
      city: l.city,
      count: l.count,
      uniqueVisitors: l.visitors.size,
      locations: l.locations.slice(0, 5),
    })).sort((a, b) => b.count - a.count);

    // Recent visitors (last 50)
    const recentVisitors = await Visitor.find()
      .sort({ date: -1 })
      .limit(50)
      .populate('userId', 'name email');

    // Hourly distribution
    const hourlyStats = Array(24).fill(0);
    visitors.forEach(v => {
      const hour = new Date(v.date).getHours();
      hourlyStats[hour] += 1;
    });

    // Average time spent
    const totalTimeSpent = visitors.reduce((sum, v) => sum + (v.timeSpent || 0), 0);
    const avgTimeSpent = visitors.length > 0 ? Math.round(totalTimeSpent / visitors.length) : 0;

    // Bounce rate (visitors with only 1 page view)
    const pageViewCounts = visitors.reduce((acc, v) => {
      const sessionId = v.sessionId;
      if (!acc[sessionId]) acc[sessionId] = new Set();
      acc[sessionId].add(v.page);
      return acc;
    }, {});
    
    const bounceCount = Object.values(pageViewCounts).filter(pages => pages.size <= 1).length;
    const bounceRate = Object.keys(pageViewCounts).length > 0 
      ? Math.round((bounceCount / Object.keys(pageViewCounts).length) * 100) 
      : 0;

    // Most popular entry pages
    const entryPages = visitors.reduce((acc, v) => {
      const page = v.entryPage || v.page || '/';
      acc[page] = (acc[page] || 0) + 1;
      return acc;
    }, {});

    const topEntryPages = Object.entries(entryPages)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    console.log('📍 Location stats found:', locationStatsArray.length);

    // Return comprehensive stats
    res.json({
      success: true,
      data: {
        // Overview
        totalVisitors,
        todayVisitors,
        uniqueVisitors,
        totalPageViews: visitors.length,
        avgTimeSpent,
        bounceRate,
        
        // Time series
        dailyStats: dailyStatsArray.slice(-parseInt(days)),
        weeklyStats: [],
        monthlyStats: [],
        hourlyStats,
        
        // Breakdown
        pageStats: pageStatsArray,
        deviceStats,
        browserStats,
        osStats,
        locationStats: locationStatsArray,
        
        // Recent
        recentVisitors: recentVisitors.map(v => ({
          _id: v._id,
          sessionId: v.sessionId,
          page: v.page,
          pageTitle: v.pageTitle,
          ipAddress: v.ipAddress,
          location: v.location,
          deviceType: v.deviceType,
          browser: v.browser,
          os: v.os,
          timeSpent: v.timeSpent,
          date: v.date,
          isNewVisitor: v.isNewVisitor,
          visitCount: v.visitCount,
          user: v.userId,
          userName: v.userName,
        })),
        
        // Top entry pages
        topEntryPages,
      },
    });
  } catch (error) {
    console.error('❌ Get visitor stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get visitor details by ID
// @route   GET /api/visitors/:id
// @access  Private/Admin
exports.getVisitorDetails = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id).populate('userId', 'name email profilePhoto');
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }
    res.json({
      success: true,
      data: visitor,
    });
  } catch (error) {
    console.error('Get visitor details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get location from IP
// @route   GET /api/visitors/location/:ip
// @access  Private/Admin
exports.getLocationFromIP = async (req, res) => {
  try {
    const { ip } = req.params;
    const location = await getLocationFromIP(ip);
    res.json({
      success: true,
      data: location,
    });
  } catch (error) {
    console.error('Get location error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get location from IP address using geoip-lite or IP API
 */
async function getLocationFromIP(ip) {
  // Default location
  const defaultLocation = {
    country: 'Unknown',
    city: 'Unknown',
    region: '',
    latitude: 0,
    longitude: 0,
    timezone: '',
    isp: '',
  };

  if (!ip || ip === '0.0.0.0' || ip === '::1' || ip === 'localhost' || ip === '127.0.0.1') {
    console.log('📍 Local/Invalid IP detected');
    return defaultLocation;
  }

  // Clean IP
  const cleanIp = ip.replace(/^::ffff:/, '');

  // Try geoip-lite first
  if (geoip) {
    try {
      const geo = geoip.lookup(cleanIp);
      if (geo && geo.country) {
        console.log(`📍 GeoIP found: ${geo.country}, ${geo.city || 'Unknown'}`);
        return {
          country: geo.country || 'Unknown',
          city: geo.city || 'Unknown',
          region: geo.region || '',
          latitude: geo.ll?.[0] || 0,
          longitude: geo.ll?.[1] || 0,
          timezone: geo.timezone || '',
          isp: '',
        };
      }
    } catch (error) {
      console.log('GeoIP lookup failed:', error.message);
    }
  }

  // Fallback: Use ip-api.com
  try {
    const response = await axios.get(`http://ip-api.com/json/${cleanIp}?fields=status,country,city,regionName,lat,lon,timezone,isp`, {
      timeout: 5000,
    });
    const data = response.data;
    if (data && data.status === 'success') {
      console.log(`📍 IP-API found: ${data.country}, ${data.city || 'Unknown'}`);
      return {
        country: data.country || 'Unknown',
        city: data.city || 'Unknown',
        region: data.regionName || '',
        latitude: data.lat || 0,
        longitude: data.lon || 0,
        timezone: data.timezone || '',
        isp: data.isp || '',
      };
    }
  } catch (error) {
    console.log('IP-API lookup failed:', error.message);
  }

  return defaultLocation;
}

/**
 * Parse user agent string
 */
function parseUserAgent(userAgent) {
  if (!userAgent) {
    return { deviceType: 'unknown', browser: 'unknown', os: 'unknown' };
  }

  let deviceType = 'desktop';
  let browser = 'unknown';
  let os = 'unknown';

  // Detect device
  if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(userAgent)) {
    deviceType = 'mobile';
  }
  if (/tablet|ipad|kindle|playbook|silk/i.test(userAgent)) {
    deviceType = 'tablet';
  }

  // Detect browser
  if (/Chrome/i.test(userAgent) && !/Edge|OPR|Brave/i.test(userAgent)) {
    browser = 'Chrome';
  } else if (/Firefox/i.test(userAgent)) {
    browser = 'Firefox';
  } else if (/Safari/i.test(userAgent) && !/Chrome|Edge/i.test(userAgent)) {
    browser = 'Safari';
  } else if (/Edge/i.test(userAgent)) {
    browser = 'Edge';
  } else if (/OPR|Opera/i.test(userAgent)) {
    browser = 'Opera';
  } else if (/Brave/i.test(userAgent)) {
    browser = 'Brave';
  }

  // Detect OS
  if (/Windows NT 10.0/i.test(userAgent)) {
    os = 'Windows 10';
  } else if (/Windows NT 6.3/i.test(userAgent)) {
    os = 'Windows 8.1';
  } else if (/Windows NT 6.2/i.test(userAgent)) {
    os = 'Windows 8';
  } else if (/Windows NT 6.1/i.test(userAgent)) {
    os = 'Windows 7';
  } else if (/Windows/i.test(userAgent)) {
    os = 'Windows';
  } else if (/Mac OS X/i.test(userAgent)) {
    os = 'macOS';
  } else if (/Linux/i.test(userAgent) && !/Android/i.test(userAgent)) {
    os = 'Linux';
  } else if (/Android/i.test(userAgent)) {
    os = 'Android';
  } else if (/iOS|iPhone|iPad|iPod/i.test(userAgent)) {
    os = 'iOS';
  }

  return { deviceType, browser, os };
}