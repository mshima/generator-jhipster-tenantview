const randexp = require('randexp');
const debug = require('debug')('tenantview:entity:server:files');
const faker = require('faker');

const jhipsterEnv = require('generator-jhipster-customizer');

const jhipsterConstants = jhipsterEnv.constants;

// In order to have consistent results with Faker, the seed is fixed.
faker.seed(42);

/*
 * Current faker version is 4.1.0 and was release in 2017
 * It is outdated
 * https://github.com/Marak/faker.js/blob/10bfb9f467b0ac2b8912ffc15690b50ef3244f09/lib/date.js#L73-L96
 * Needed for reproducible builds
 */
/* eslint-disable-next-line */
const recentDate = function (days, refDate) {
    /* eslint-disable */
    var date = new Date();
    if (typeof refDate !== "undefined") {
        date = new Date(Date.parse(refDate));
    }

    var range = {
            min: 1000,
            max: (days || 1) * 24 * 3600 * 1000
    };

    var future = date.getTime();
    future -= faker.random.number(range); // some time from now to N days ago, in milliseconds
    date.setTime(future);

    return date;
};

const recentForLiquibase = function (days, changelogDate) {
    let formatedDate;
    if (changelogDate !== undefined) {
        formatedDate = changelogDate.substring(0, 4) + '-' + changelogDate.substring(4, 6) + '-' + changelogDate.substring(6, 8);
    }
    return recentDate(1, formatedDate);
}

module.exports = {
    files: {
        tenant_base: [
            {
                condition: generator => generator.databaseType === 'sql',
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/fake-data/table.csv',
                        options: {
                            interpolate: jhipsterConstants.INTERPOLATE_REGEX,
                            context: {
                                faker,
                                recentDate,
                                recentForLiquibase,
                                debug,
                                randexp
                            }
                        },
                        renameTo: generator => `config/liquibase/fake-data/${generator.entityTableName}.csv`
                    }
                ]
            },
            {
                condition: context => context.tenantAware,
                path: jhipsterConstants.SERVER_MAIN_SRC_DIR,
                templates: [
                    {
                        file: 'package/_EntityAspect.java',
                        renameTo: context =>
                            `${context.packageFolder}/aop/${context.tenantNameLowerFirst}/${context.entityClass}Aspect.java`
                    }
                ]
            },
            {
                condition: context => context.isTenant,
                path: jhipsterConstants.SERVER_MAIN_SRC_DIR,
                templates: [
                    {
                        file: 'package/domain/_TenantParameter.java',
                        renameTo: context => `${context.packageFolder}/domain/${context.tenantNameUpperFirst}Parameter.java`
                    },
                    {
                        file: 'package/aop/_tenant/_TenantAspect.java',
                        renameTo: context =>
                            `${context.packageFolder}/aop/${context.tenantNameLowerFirst}/${context.tenantNameUpperFirst}Aspect.java`
                    }
                ]
            },
            {
                condition: context => context.isTenant,
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/changelog/_user_tenant_constraints.xml',
                        renameTo: context =>
                            `config/liquibase/changelog/${context.changelogDate}-1__user_${context.tenantNameUpperFirst}_constraints.xml`
                    }
                ]
            }
        ],
        liquibase_data: [
            {
                condition: context => context.isTenant,
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/changelog/_tenant_user_data.xml',
                        renameTo: context =>
                            `config/liquibase/changelog/${context.changelogDate}-2__${context.tenantNameLowerCase}_user_data.xml`
                    }
                ]
            },
            {
                condition: context => context.isTenant,
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/data/_tenant.csv',
                        renameTo: context => `config/liquibase/data/${context.tenantNameLowerCase}.csv`
                    }
                ]
            },
            {
                condition: context => context.isTenant,
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/data/_tenant_user.csv',
                        renameTo: context => `config/liquibase/data/${context.tenantNameLowerCase}_user.csv`
                    }
                ]
            },
            {
                condition: context => context.isTenant,
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/data/_tenant_authority.csv',
                        renameTo: context => `config/liquibase/data/${context.tenantNameLowerCase}_authority.csv`
                    }
                ]
            },
            {
                condition: context => context.isTenant,
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/data/_tenant_user_authority.csv',
                        renameTo: context => `config/liquibase/data/${context.tenantNameLowerCase}_user_authority.csv`
                    }
                ]
            }
        ]
    }
};
