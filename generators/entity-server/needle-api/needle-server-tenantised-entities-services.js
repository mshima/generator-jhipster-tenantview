/**
 * Copyright 2013-2019 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const chalk = require('chalk');
const debug = require('debug')('tenantview:server');

const generatorsPath = require('../../jhipster-environment').generatorsPath;

const needleServer = require(`${generatorsPath}/server/needle-api/needle-server`);
const jhipsterEnv = require('../../jhipster-environment');

const constants = jhipsterEnv.constants;

const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;

module.exports = class extends needleServer {
    addEntityToTenantAspect(generator, tenantAwareEntity) {
        debug(`addEntityToTenantAspect ${tenantAwareEntity}`);
        const errorMessage = `${chalk.yellow('Reference to ') + tenantAwareEntity} ${chalk.yellow('not added.\n')}`;
        // eslint-disable-next-line prettier/prettier
        const tenantAspectPath = `${SERVER_MAIN_SRC_DIR}${generator.packageFolder}/aop/${generator.tenantNameLowerFirst}/${generator.tenantNameUpperFirst}Aspect.java`;
        const content = `+ "|| execution(* ${generator.packageName}.service.${tenantAwareEntity}Service.*(..))"`;
        const rewriteFileModel = this.generateFileModel(tenantAspectPath, 'jhipster-needle-add-entity-to-tenant-aspect', content);
        this.addBlockContentToFile(rewriteFileModel, errorMessage);
    }
};
