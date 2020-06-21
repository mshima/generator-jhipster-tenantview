module.exports = {
  files: gen => {
    return {
      tenantBase: [
        {
          path: gen.constants.SERVER_MAIN_SRC_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'package/aop/_tenant/_UserAspect.java',
              renameTo: () => `${gen.storage.packageFolder}/aop/${gen.tenant.entityInstance}/${gen.tenant.entityClass}AwareUserAspect.java`
            }
          ]
        }
      ]
    };
  }
};
