const jhipsterEnv = require('generator-jhipster-customizer');

const jhipsterConstants = jhipsterEnv.constants;

module.exports = {
    files: {
        tenant_base: [
            // copy over aspect
            {
                condition: context => context.tenantNameLowerFirst !== 'user',
                path: jhipsterConstants.SERVER_MAIN_SRC_DIR,
                templates: [
                    {
                        file: 'package/aop/_tenant/_UserAspect.java',
                        renameTo: generator => `${generator.packageFolder}/aop/${generator.tenantNameLowerFirst}/UserAspect.java`
                    }
                ]
            },
            {
                condition: context => context.tenantNameLowerFirst === 'user' && false,
                templates: [
                    {
                        file: `../../entity-server/templates/${jhipsterConstants.SERVER_MAIN_SRC_DIR}/package/aop/_tenant/_TenantAspect.java`,
                        renameTo: context =>
                            `${jhipsterConstants.SERVER_MAIN_SRC_DIR}/${context.packageFolder}/aop/${context.tenantNameLowerFirst}/${context.tenantNameUpperFirst}Aspect.java`
                    }
                ]
            }
        ]
    }
};
