module.exports = {
  files: context => {
    return {
      tenantBase: [
        {
          condition: () => context.entity.definitions.tenantAware,
          path: context.constants.SERVER_MAIN_SRC_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'package/_EntityAspect.java',
              renameTo: () =>
                `${context.storage.packageFolder}/aop/${context.tenant.entityInstance}/${context.entity.entityClass}Aspect.java`
            }
          ]
        },
        {
          condition: () => context.isTenant,
          path: context.constants.SERVER_MAIN_RES_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/changelog/_user_tenant_constraints.xml',
              renameTo: () =>
                `config/liquibase/changelog/${context.entity.changelogDate}-1__user_${context.tenant.entityClass}_constraints.xml`
            }
          ]
        }
      ],
      liquibaseData: [
        {
          condition: () => context.isTenant,
          path: context.constants.SERVER_MAIN_RES_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/changelog/_tenant_user_data.xml',
              renameTo: () =>
                `config/liquibase/changelog/${context.entity.changelogDate}-2__${context.tenant.entityLowerCase}_user_data.xml`
            }
          ]
        },
        {
          condition: () => context.isTenant,
          path: context.constants.SERVER_MAIN_RES_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/data/_tenant.csv',
              renameTo: () => `config/liquibase/data/${context.tenant.entityLowerCase}.csv`
            }
          ]
        },
        {
          condition: () => context.isTenant,
          path: context.constants.SERVER_MAIN_RES_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/data/_tenant_user.csv',
              renameTo: () => `config/liquibase/data/${context.tenant.entityLowerCase}_user.csv`
            }
          ]
        },
        {
          condition: () => context.isTenant,
          path: context.constants.SERVER_MAIN_RES_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/data/_tenant_authority.csv',
              renameTo: () => `config/liquibase/data/${context.tenant.entityLowerCase}_authority.csv`
            }
          ]
        },
        {
          condition: () => context.isTenant,
          path: context.constants.SERVER_MAIN_RES_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/data/_tenant_user_authority.csv',
              renameTo: () => `config/liquibase/data/${context.tenant.entityLowerCase}_user_authority.csv`
            }
          ]
        }
      ]
    };
  }
};
