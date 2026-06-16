module.exports = (resource, action) => {
    return (req, res, next) => {

        console.log('===================');
        console.log('USER:', req.user?.name);
        console.log('ROLE OBJECT:', req.user?.roleId);
        console.log('RESOURCE:', resource);
        console.log('ACTION:', action);

        const allowed =
            req.user?.roleId?.permissions?.[resource]?.[action];

        console.log('ALLOWED:', allowed);
        console.log('===================');

        if (!allowed) {
            return res.status(403).json({
                success: false,
                message: 'Access denied',
            });
        }

        next();
    };
};