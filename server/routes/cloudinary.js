const router = require('express').Router();
const crypto = require('crypto');

router.post('/sign', (req, res) => {
  const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } = process.env;
  if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET || !CLOUDINARY_CLOUD_NAME) {
    return res.status(503).json({
      success: false,
      message: 'Cloudinary env vars missing on server. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to Render dashboard.',
    });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder    = 'technandu-inventory'; // no slash — avoids path encoding issues

  // Params must be alphabetically sorted: folder < timestamp
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature    = crypto
    .createHash('sha1')
    .update(paramsToSign + CLOUDINARY_API_SECRET)
    .digest('hex');

  res.json({
    success:    true,
    signature,
    timestamp,
    folder,
    api_key:    CLOUDINARY_API_KEY,
    cloud_name: CLOUDINARY_CLOUD_NAME,
  });
});

module.exports = router;
