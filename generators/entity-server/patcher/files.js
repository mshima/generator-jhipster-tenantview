module.exports = {
  files: gen => {
    return {
      tenant_base: [
        {
          condition: gen => gen.tenantAware,
          path: gen.constants.SERVER_MAIN_SRC_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'package/_EntityAspect.java',
              renameTo: gen => `${gen.storage.packageFolder}/aop/${gen.tenantNameLowerFirst}/${gen.entity.entityClass}Aspect.java`
            }
          ]
        },
        {
          condition: gen => gen.isTenant,
          path: gen.constants.SERVER_MAIN_SRC_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'package/domain/_TenantParameter.java',
              renameTo: gen => `${gen.storage.packageFolder}/domain/${gen.tenantNameUpperFirst}Parameter.java`
            },
            {
              method: 'patcherTemplate',
              file: 'package/aop/_tenant/_TenantAspect.java',
              renameTo: gen => `${gen.storage.packageFolder}/aop/${gen.tenantNameLowerFirst}/${gen.tenantNameUpperFirst}Aspect.java`
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
              renameTo: gen =>
                `config/liquibase/changelog/${gen.entity.changelogDate}-1__user_${gen.tenantNameUpperFirst}_constraints.xml`
            }
          ]
        }
      ],
      liquibase_data: [
        {
          condition: gen => gen.isTenant,
          path: gen.constants.SERVER_MAIN_RES_DIR,
          templates: [
            {
              method: 'patcherTemplate',
              file: 'config/liquibase/changelog/_tenant_user_data.xml',
              renameTo: gen => `config/liquibase/changelog/${gen.entity.changelogDate}-2__${gen.tenantNameLowerCase}_user_data.xml`
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
              renameTo: gen => `config/liquibase/data/${gen.tenantNameLowerCase}.csv`
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
              renameTo: gen => `config/liquibase/data/${gen.tenantNameLowerCase}_user.csv`
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
              renameTo: gen => `config/liquibase/data/${gen.tenantNameLowerCase}_authority.csv`
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
              renameTo: gen => `config/liquibase/data/${gen.tenantNameLowerCase}_user_authority.csv`
            }
          ]
        }
      ]
    };
  }
};
