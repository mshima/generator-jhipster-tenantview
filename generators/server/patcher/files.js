module.exports = {
  files: gen => {
    return {
      tenant_base: [
        // Copy over aspect
        {
          path: gen.constants.SERVER_MAIN_SRC_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'package/domain/_TenantParameter.java',
              renameTo: gen => `${gen.storage.packageFolder}/domain/${gen.tenant.entityClass}Parameter.java`
            },
            {
              method: 'patcherTemplate',
              file: 'package/aop/_tenant/_TenantAspect.java',
              renameTo: gen => `${gen.storage.packageFolder}/aop/${gen.tenant.entityInstance}/${gen.tenant.entityClass}Aspect.java`
            }
          ]
        },
        {
          path: gen.constants.SERVER_MAIN_SRC_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'package/aop/_tenant/_UserAspect.java',
              renameTo: () => `${gen.storage.packageFolder}/aop/${gen.tenant.entityInstance}/UserAspect.java`
            }
          ]
        }
      ]
    };
  }
};
