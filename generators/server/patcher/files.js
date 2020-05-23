module.exports = {
  files: context => {
    return {
      tenant_base: [
        // Copy over aspect
        {
          path: context.constants.SERVER_MAIN_SRC_DIR,
          templates: [
            {
              file: 'package/aop/_tenant/_UserAspect.java',
              renameTo: generator => `${generator.packageFolder}/aop/${generator.tenantNameLowerFirst}/UserAspect.java`
            }
          ]
        }
      ]
    };
  }
};
