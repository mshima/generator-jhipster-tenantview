/*
 * =======================
 * Implement entityModule
 * Workaround https://github.com/jhipster/generator-jhipster/pull/10286
 */
const chalk = require('chalk');
const _ = require('lodash');
// const debug = require('debug')('tenantview:generator-extender:custom-entity-module');

const jhipsterEnv = require('../jhipster-environment');

const NeedleClientAngular = require(`${jhipsterEnv.generatorsPath}/client/needle-api/needle-client-angular`);

const jhipsterConstants = jhipsterEnv.constants;
const jhipsterUtils = jhipsterEnv.utils;

const isNot63 = !jhipsterEnv.jhipsterVersion.startsWith('6.3');
const adminRouteFile = isNot63 ? 'admin-routing.module.ts' : 'admin.route.ts';
const aditionalRouteOptions = isNot63
    ? ''
    : `data: {
    |            authorities: ['ROLE_ADMIN']
    |        },
    |        canActivate: [UserRouteAccessService],
    |        `;

class NeedleClientAngularExtend extends NeedleClientAngular {
    addEntityToModule(entityInstance, entityClass, entityAngularName, entityFolderName, entityFileName, entityUrl, microServiceName) {
        this.addEntityToAnyModule(
            entityInstance,
            entityClass,
            entityAngularName,
            entityFolderName,
            entityFileName,
            entityUrl,
            microServiceName,
            {
                entityModulePath: `${jhipsterConstants.CLIENT_MAIN_SRC_DIR}app/entities/entity.module.ts`,
                needleName: 'jhipster-needle-add-entity-route'
            }
        );
    }

    addEntityToAdminModule(entityInstance, entityClass, entityAngularName, entityFolderName, entityFileName, entityUrl, microServiceName) {
        this.addEntityToAnyModule(
            entityInstance,
            entityClass,
            entityAngularName,
            entityFolderName,
            entityFileName,
            entityUrl,
            microServiceName,
            {
                entityModulePath: `${jhipsterConstants.CLIENT_MAIN_SRC_DIR}app/admin/${adminRouteFile}`,
                needleName: 'jhipster-needle-add-admin-route',
                aditionalRouteOptions,
                addComma: true
            }
        );
    }

    /* eslint-disable */
    addEntityToAnyModule(
        entityInstance,
        entityClass,
        entityAngularName,
        entityFolderName,
        entityFileName,
        entityUrl,
        microServiceName,
        options
    ) {
        const entityModulePath = options.entityModulePath;
        const needleName = options.needleName;
        const errorMessage = `${chalk.yellow('Reference to ') +
            entityInstance +
            entityClass +
            entityFolderName +
            entityFileName} ${chalk.yellow(`not added to ${entityModulePath}.\n`)}`;

        try {
            const isSpecificEntityAlreadyGenerated = jhipsterUtils.checkStringInFile(
                entityModulePath,
                `path: '${entityUrl}'`,
                this.generator
            );

            if (!isSpecificEntityAlreadyGenerated) {
                const appName = this.generator.getAngularXAppName();
                const addComma = options.addComma || jhipsterUtils.checkStringInFile(entityModulePath, 'loadChildren', this.generator);

                const modulePath = `./${entityFolderName}/${entityFileName}.module`;
                const moduleName = microServiceName
                    ? `${this.generator.upperFirstCamelCase(microServiceName)}${entityAngularName}Module`
                    : `${appName}${entityAngularName}Module`;

                let splicable = addComma ? ',' : '';
                const aditionalRouteOptions = options.aditionalRouteOptions || '';
                splicable = `|    ${splicable}{
                       |        path: '${entityUrl}',
                       |        ${aditionalRouteOptions}loadChildren: () => import('${modulePath}').then(m => m.${moduleName})
                       |    }`;
                const rewriteFileModel = this.generateFileModel(
                    entityModulePath,
                    needleName,
                    this.generator.stripMargin(splicable)
                );

                this.addBlockContentToFile(rewriteFileModel, errorMessage);
            }
        } catch (e) {
            this.generator.debug('Error:', e);
        }
    }
}

function extend(Superclass) {
    return class GeneratorExtender extends Superclass {
        constructor(args, opts) {
            super(args, opts);
            this.needleApi.clientAngular = new NeedleClientAngularExtend(this);
        }

        /*
         * Override addEntityToMenu changing the menu tenant is added to.
         */
        addEntityToMenu(routerName, enableTranslation, clientFramework, entityTranslationKeyMenu = _.camelCase(routerName)) {
            /*
             * entity-client files.js
             * this.entityUrl instead of this.entityStateName
             */
            routerName = this.entityUrl;

            if (clientFramework === 'react' || this.entityModule === undefined || this.entityModule === 'entities') {
                if (clientFramework === 'angularX') {
                    this.needleApi.clientAngular.addEntityToMenu(routerName, enableTranslation, entityTranslationKeyMenu);
                } else if (clientFramework === 'react') {
                    this.needleApi.clientReact.addEntityToMenu(routerName, enableTranslation, entityTranslationKeyMenu);
                }
            } else if (this.entityModule === 'admin') {
                this.addElementToAdminMenu(
                    routerName,
                    'asterisk',
                    this.enableTranslation,
                    clientFramework,
                    entityTranslationKeyMenu
                );
            }
        }

        /*
         * Override addEntityTranslationKey changing the menu tenant is added to.
         */
        addEntityTranslationKey(key, value, language) {
            if (this.clientFramework === 'react' || this.entityModule === undefined || this.entityModule === 'entities') {
                this.needleApi.clientI18n.addEntityTranslationKey(key, value, language);
            } else if (this.entityModule === 'admin') {
                this.addAdminElementTranslationKey(key, value, language);
            } else {
                
            }
        }

        /*
         * Workaround entity always been add to entity module
         */
        addEntityToModule(
            entityInstance,
            entityClass,
            entityName,
            entityFolderName,
            entityFileName,
            entityState,
            clientFramework,
            microServiceName
        ) {
            entityState = this.entityStateName;
            if (clientFramework === 'react' || this.entityModule === undefined || this.entityModule === 'entities') {
                if (clientFramework === 'angularX') {
                    this.needleApi.clientAngular.addEntityToModule(
                        entityInstance,
                        entityClass,
                        entityName,
                        entityFolderName,
                        entityFileName,
                        entityState,
                        microServiceName
                    );
                } else if (clientFramework === 'react') {
                    this.needleApi.clientReact.addEntityToModule(entityInstance, entityClass, entityName, entityFolderName, entityFileName);
                }
            } else if (this.entityModule === 'admin') {
                if (clientFramework === 'angularX') {
                    this.needleApi.clientAngular.addEntityToAdminModule(
                        entityInstance,
                        entityClass,
                        entityName,
                        entityFolderName,
                        entityFileName,
                        entityState,
                        microServiceName
                    );
                }
            }
        }
    };
}

module.exports = {
    extend
};
