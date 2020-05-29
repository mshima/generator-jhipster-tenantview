module.exports = {
  files: gen => {
    return {
      tenantBase: [
        {
          condition: gen => gen.entity.definitions.tenantAware,
          path: gen.constants.SERVER_MAIN_SRC_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'package/_EntityAspect.java',
              renameTo: gen => `${gen.storage.packageFolder}/aop/${gen.tenant.entityInstance}/${gen.entity.entityClass}Aspect.java`
            }
          ]
        },
        {
          condition: gen => gen.isTenant,
          path: gen.constants.SERVER_MAIN_RES_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/changelog/_user_tenant_constraints.xml',
              renameTo: gen => `config/liquibase/changelog/${gen.entity.changelogDate}-1__user_${gen.tenant.entityClass}_constraints.xml`
            }
          ]
        }
      ],
      liquibaseData: [
        {
          condition: gen => gen.isTenant,
          path: gen.constants.SERVER_MAIN_RES_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/changelog/_tenant_user_data.xml',
              renameTo: gen => `config/liquibase/changelog/${gen.entity.changelogDate}-2__${gen.tenant.entityLowerCase}_user_data.xml`
            }
          ]
        },
        {
          condition: gen => gen.isTenant,
          path: gen.constants.SERVER_MAIN_RES_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/data/_tenant.csv',
              renameTo: gen => `config/liquibase/data/${gen.tenant.entityLowerCase}.csv`
            }
          ]
        },
        {
          condition: gen => gen.isTenant,
          path: gen.constants.SERVER_MAIN_RES_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/data/_tenant_user.csv',
              renameTo: gen => `config/liquibase/data/${gen.tenant.entityLowerCase}_user.csv`
            }
          ]
        },
        {
          condition: gen => gen.isTenant,
          path: gen.constants.SERVER_MAIN_RES_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/data/_tenant_authority.csv',
              renameTo: gen => `config/liquibase/data/${gen.tenant.entityLowerCase}_authority.csv`
            }
          ]
        },
        {
          condition: gen => gen.isTenant,
          path: gen.constants.SERVER_MAIN_RES_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/data/_tenant_user_authority.csv',
              renameTo: gen => `config/liquibase/data/${gen.tenant.entityLowerCase}_user_authority.csv`
            }
          ]
        }
      ]
    };
  }
};
