const Role = require('../models/Role');

exports.createRole = async (req, res) => {
    try {
        const existingRole = await Role.findOne({
            tenantId: req.user.tenantId._id,
            name: req.body.name,
        });

        if (existingRole) {
            return res.status(400).json({
                success: false,
                message: 'Role already exists',
            });
        }

        const role = await Role.create({
            tenantId: req.user.tenantId._id,
            name: req.body.name,
            permissions: req.body.permissions,
        });

        res.status(201).json({
            success: true,
            data: role,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find({
            tenantId: req.user.tenantId._id,
        });

        res.json({
            success: true,
            data: roles,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getRole = async (req, res) => {
  try {
    const role = await Role.findOne({
      _id: req.params.id,
      tenantId: req.user.tenantId._id,
    });
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }
    res.json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRole = async (req, res) => {
    try {
        const role = await Role.findOneAndUpdate(
            {
                _id: req.params.id,
                tenantId: req.user.tenantId._id,
            },
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            data: role,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        await Role.findOneAndDelete({
            _id: req.params.id,
            tenantId: req.user.tenantId._id,
        });

        res.json({
            success: true,
            message: 'Role deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};