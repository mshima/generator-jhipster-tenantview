#!/bin/bash

set -e
source $(dirname $0)/00-init-env.sh

#-------------------------------------------------------------------------------
# Project Customizations
#-------------------------------------------------------------------------------

if $BLUEPRINT_BUILD; then
    echo "*** jhipster: blueprint installation"

else
    echo "*** jhipster: not a blueprint installation"
    exit 0
fi

cd "$JHI_FOLDER_APP"
if [[ "$BLUEPRINT_ENTITY" == "jdl" ]]; then
    #-------------------------------------------------------------------------------
    # Generate blueprint project with JDL
    #-------------------------------------------------------------------------------
    jhipster import-jdl *.jdl --no-insight --blueprints tenantview --tenant-name company --relation-tenant-aware
    echo "Finished project generation"
    echo $?
fi

if $BLUEPRINT_FIX_VERSION; then
    # Replace version (latest) with local path
    echo 'Fixing blueprint version'
    echo $(cat package.json | grep 'generator-jhipster-')
    sed -e 's#"generator-jhipster-\(.*\)": ".*",#"generator-jhipster-\1": "file:'$JHI_HOME'",#1;' package.json > package.json.sed
    mv -f package.json.sed package.json
    echo 'Fixed blueprint version'
    echo $(cat package.json | grep 'generator-jhipster-')
fi

if [[ "$JHI_GEN_BRANCH" != "release" && "$JHI_BUILD_SOURCE" == "generator-jhipster-blueprint" ]]; then
    # Replace jhipster version with local path
    echo 'Fixing jhipster version'
    echo `cat package.json | grep '"generator-jhipster"'`
    sed -e 's#"generator-jhipster": ".*",#"generator-jhipster": "file:'$HOME'/generator-jhipster",#1;' package.json > package.json.sed
    mv -f package.json.sed package.json
    echo 'Fixed jhipster version'
    echo `cat package.json | grep '"generator-jhipster"'`
fi

if $BLUEPRINT_RUN_NPM; then
    npm install
fi

if $BLUEPRINT_REGENERATE; then
    # Regenerate to fix errors
    jhipster --force --no-insight --skip-checks --with-entities --from-cli --blueprints tenantview
fi

echo "Updation webdriver from chrome"
npm install webdriver-manager@12.1.6
