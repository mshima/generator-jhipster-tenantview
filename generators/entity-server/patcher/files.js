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
              file: 'config/liquibase/changelog/_user_tenant.xml',
              renameTo: () => `config/liquibase/changelog/${context.entity.changelogDate}-1__user_${context.tenant.entityClass}.xml`
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
                `config/liquibase/changelog/${context.entity.changelogDate}-3__user_${context.tenant.entityClass}_constraints.xml`
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
              file: 'config/liquibase/data/_tenant/authority.csv',
              renameTo: () => `config/liquibase/data/${context.tenant.entityLowerCase}/authority.csv`
            },
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/data/_tenant/_tenant_root.csv',
              renameTo: () => `config/liquibase/data/${context.tenant.entityLowerCase}/${context.tenant.entityLowerCase}_root.csv`
            },
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/data/_tenant/_tenant_others.csv',
              renameTo: () => `config/liquibase/data/${context.tenant.entityLowerCase}/${context.tenant.entityLowerCase}_others.csv`
            },
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/data/_tenant/user_authority.csv',
              renameTo: () => `config/liquibase/data/${context.tenant.entityLowerCase}/user_authority.csv`
            },
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/data/_tenant/user_relationship.csv',
              renameTo: () => `config/liquibase/data/${context.tenant.entityLowerCase}/user_relationship.csv`
            },
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/data/_tenant/user.csv',
              renameTo: () => `config/liquibase/data/${context.tenant.entityLowerCase}/user.csv`
            }
          ]
        }
      ]
    };
  }
};
