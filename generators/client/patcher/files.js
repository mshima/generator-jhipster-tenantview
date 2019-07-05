const jhipsterEnv = require('../../jhipster-environment');

const jhipsterConstants = jhipsterEnv.constants;

module.exports = {
    files: {
        tenant_admin_menu: [
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: [
                    {
                        file: 'tenant-admin/_tenant-admin-routing.module.ts',
                        renameTo: generator =>
                            `${generator.tenantNameLowerFirst}-admin/${generator.tenantNameLowerFirst}-admin-routing.module.ts`
                    },
                    {
                        file: 'layouts/navbar/navbar.component.html',
                        renameTo: () => 'layouts/navbar/navbar.component.html'
                    }
                ]
            }
        ]
    }
};
