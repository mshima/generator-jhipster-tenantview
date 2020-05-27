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
              file: 'package/aop/_tenant/_UserAspect.java',
              renameTo: () => `${gen.storage.packageFolder}/aop/${gen.tenant.entityInstance}/UserAspect.java`
            }
          ]
        }
      ]
    };
  }
};
