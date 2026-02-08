const Permission = require('../models/Permission');

const checkPermission = async (req, res, next) => {
    try {
        const { roleId } = req.user;
        const method = req.method;
        const endpoint = req.baseUrl + req.path;

        const normalizedEndpoint = endpoint.endsWith('/') && endpoint.length > 1
            ? endpoint.slice(0, -1)
            : endpoint;

        const hasPermission = await Permission.checkPermission(
            roleId,
            method,
            normalizedEndpoint
        );

        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You do not have permission to perform this action.',
                details: {
                    requiredPermission: `${method} ${normalizedEndpoint}`,
                    yourRole: req.user.role
                }
            });
        }

        next();
    } catch (error) {
        console.error('Permission check error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error checking permissions.'
        });
    }
};

module.exports = {
    checkPermission
};
