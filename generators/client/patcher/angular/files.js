module.exports = {
  files: context => {
    return {
      tenant_admin_menu: [
        {
          path: context.constants.ANGULAR_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'tenant-admin/_tenant-admin-routing.module.ts',
              renameTo: generator => `${generator.tenant.entityInstance}-admin/${generator.tenant.entityInstance}-admin-routing.module.ts`
            }
          ]
        }
      ]
    };
  }
};
