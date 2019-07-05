#!/bin/bash

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
echo "********* PRINT LOCAL PACKAGES"
npm list

echo "********* PRINT GLOBAL PACKAGES"
npm list -g
