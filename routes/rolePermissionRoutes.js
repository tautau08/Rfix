const express = require('express');
const router = express.Router();
const {
    getAllRolePermissions,
    assignPermission,
    revokePermission
} = require('../controllers/roleController');
const authenticate = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');

router.use(authenticate);

router.get('/', checkPermission, getAllRolePermissions);
router.post('/', checkPermission, assignPermission);
router.delete('/', checkPermission, revokePermission);

module.exports = router;
