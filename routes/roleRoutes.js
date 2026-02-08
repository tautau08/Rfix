const express = require('express');
const router = express.Router();
const {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
} = require('../controllers/roleController');
const authenticate = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');

router.use(authenticate);

router.get('/', checkPermission, getAllRoles);
router.get('/:id', checkPermission, getRoleById);
router.post('/', checkPermission, createRole);
router.put('/:id', checkPermission, updateRole);
router.delete('/:id', checkPermission, deleteRole);

module.exports = router;
