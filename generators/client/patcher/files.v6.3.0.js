const jhipsterEnv = require('../../jhipster-environment');

const jhipsterConstants = jhipsterEnv.constants;

module.exports = {
    files: {
        user_management_module: [
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: ['admin/admin.module.ts']
            },
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: ['admin/admin.route.ts']
            },
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: ['admin/user-management/user-management.module.ts']
            },
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: ['admin/user-management/user-management.route.ts']
            }
        ]
    }
};
