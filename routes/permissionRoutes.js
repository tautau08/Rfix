const express = require('express');
const router = express.Router();
const { getAllPermissions, createPermission } = require('../controllers/roleController');
const authenticate = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');

router.use(authenticate);

router.get('/', checkPermission, getAllPermissions);
router.post('/', checkPermission, createPermission);

module.exports = router;
