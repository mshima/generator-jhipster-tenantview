module.exports = {
  files: ctx => {
    return {
      tenantBase: [
        {
          path: ctx.constants.SERVER_MAIN_SRC_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'package/aop/_tenant/_UserAspect.java',
              renameTo: () => `${ctx.storage.packageFolder}/aop/${ctx.tenant.entityInstance}/${ctx.tenant.entityClass}AwareUserAspect.java`
            }
          ]
        }
      ]
    };
  }
};
