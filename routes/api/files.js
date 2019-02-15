const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/files/test
 * @desc    Test Files route
 * @access  Public
 */
router.get('/test', (req, res) => res.json({msg: 'Files route works'}));

module.exports = router;