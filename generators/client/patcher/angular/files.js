module.exports = {
  files: context => {
    return {
      tenant_admin_menu: [
        {
          path: context.constants.ANGULAR_DIR,
          templates: [
            {
              file: 'tenant-admin/_tenant-admin-routing.module.ts',
              renameTo: generator => `${generator.tenantNameLowerFirst}-admin/${generator.tenantNameLowerFirst}-admin-routing.module.ts`
            }
          ]
        }
      ]
    };
  }
};
