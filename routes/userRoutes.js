const express = require('express');
const router = express.Router();
const {
    getProfile,
    updateProfile,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');

router.use(authenticate);

router.get('/profile', checkPermission, getProfile);
router.put('/profile', checkPermission, updateProfile);
router.get('/', checkPermission, getAllUsers);
router.get('/:id', checkPermission, getUserById);
router.post('/', checkPermission, createUser);
router.put('/:id', checkPermission, updateUser);
router.delete('/:id', checkPermission, deleteUser);

module.exports = router;
