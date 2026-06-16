const mongoose = require('mongoose');

const actionSchema = {
    view: { type: Boolean, default: false },
    create: { type: Boolean, default: false },
    update: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
};

const roleSchema = new mongoose.Schema(
    {
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tenant',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },

        // ── isAdmin flag ──────────────────────────────────────────────────────
        // true  → this role has full admin access (Owner, Super Admin, etc.)
        // false → normal user role
        // Used by getHomeRoute() and ProtectedRoute as a reliable single check
        isAdmin: {
            type: Boolean,
            default: false,
        },

        permissions: {
            dashboard: { ...actionSchema },
            users: { ...actionSchema },
            roles: { ...actionSchema },
            profile: { ...actionSchema },
            settings: { ...actionSchema },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Role', roleSchema);