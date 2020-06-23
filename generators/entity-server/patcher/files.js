module.exports = {
  files: ctx => {
    return {
      tenantBase: [
        {
          condition: () => ctx.entity.definitions.tenantAware,
          path: ctx.constants.SERVER_MAIN_SRC_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'package/_EntityAspect.java',
              renameTo: () =>
                `${ctx.storage.packageFolder}/aop/${ctx.tenant.entityInstance}/${ctx.tenant.entityClass}Aware${ctx.entity.entityClass}Aspect.java`
            }
          ]
        },
        {
          condition: () => ctx.isTenant,
          path: ctx.constants.SERVER_MAIN_RES_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/changelog/_user_tenant.xml',
              renameTo: () => `config/liquibase/changelog/${ctx.entity.changelogDate}-1__user_${ctx.tenant.entityClass}.xml`
            },
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/changelog/_user_tenant_constraints.xml',
              renameTo: () => `config/liquibase/changelog/${ctx.entity.changelogDate}-3__user_${ctx.tenant.entityClass}_constraints.xml`
            }
          ]
        },
        {
          condition: () => ctx.isTenant,
          path: ctx.constants.SERVER_MAIN_SRC_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'package/config/_tenant/_TenantAwareSessionConfiguration.java',
              renameTo: () =>
                `${ctx.storage.packageFolder}/config/${ctx.tenant.entityInstance}/${ctx.tenant.entityClass}AwareSessionConfiguration.java`
            }
          ]
        },
        {
          condition: () => ctx.isTenant,
          path: ctx.constants.SERVER_TEST_SRC_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'package/config/_tenant/_TenantAwareSessionTestConfiguration.java',
              renameTo: () =>
                `${ctx.storage.packageFolder}/config/${ctx.tenant.entityInstance}/${ctx.tenant.entityClass}AwareSessionTestConfiguration.java`
            }
          ]
        }
      ],
      liquibaseData: [
        {
          condition: () => ctx.isTenant,
          path: ctx.constants.SERVER_MAIN_RES_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/changelog/_tenant_user_data.xml',
              renameTo: () => `config/liquibase/changelog/${ctx.entity.changelogDate}-2__${ctx.tenant.entityLowerCase}_user_data.xml`
            },
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/data/_tenant/authority.csv',
              renameTo: () => `config/liquibase/data/${ctx.tenant.entityLowerCase}/authority.csv`
            },
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/data/_tenant/_tenant_root.csv',
              renameTo: () => `config/liquibase/data/${ctx.tenant.entityLowerCase}/${ctx.tenant.entityLowerCase}_root.csv`
            },
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/data/_tenant/_tenant_others.csv',
              renameTo: () => `config/liquibase/data/${ctx.tenant.entityLowerCase}/${ctx.tenant.entityLowerCase}_others.csv`
            },
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/data/_tenant/user_authority.csv',
              renameTo: () => `config/liquibase/data/${ctx.tenant.entityLowerCase}/user_authority.csv`
            },
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/data/_tenant/user_relationship.csv',
              renameTo: () => `config/liquibase/data/${ctx.tenant.entityLowerCase}/user_relationship.csv`
            },
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/data/_tenant/user.csv',
              renameTo: () => `config/liquibase/data/${ctx.tenant.entityLowerCase}/user.csv`
            }
          ]
        }
      ]
    };
  }
};
