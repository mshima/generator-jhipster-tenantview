const jhipsterEnv = require('../../jhipster-environment');

const jhipsterConstants = jhipsterEnv.constants;

module.exports = {
    files: {
        tenant_base: [
            {
                condition: context => context.isTenant && context.protractorTests,
                path: jhipsterConstants.CLIENT_TEST_SRC_DIR,
                templates: [
                    {
                        // File for custom tests, use this instead of changing upstream
                        file: 'e2e/admin/_tenant-management.spec.ts',
                        renameTo: context => `e2e/admin/${context.tenantFolderName}/${context.tenantFileName}-tenant.spec.ts`
                    }
                ]
            }
        ]
    }
};
