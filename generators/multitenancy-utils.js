const _ = require('lodash');

/**
 * Utils file to hold methods common to both generator and sub generator
 */
module.exports = {
  getArrayItemWithFieldValue,
  configureTenantAwareEntity
};

/**
 * Look at an array for a item with field name equal fieldName and with field value equals value.
 * @param {Array} array
 * @param {string} fieldName
 * @param {string} value
 * @returns {boolean} true if found
 */
function getArrayItemWithFieldValue(array, fieldName, value) {
  value = _.toLower(value);
  let found;
  array.forEach(item => {
    const valueFound = item[fieldName];
    if (valueFound !== undefined && _.toLower(valueFound) === _.toLower(value)) {
      found = item;
    }
  });
  return found;
}

function configureTenantAwareEntity(tenantAwareEntity, tenant) {
  const tenantRelationship = getArrayItemWithFieldValue(
    tenantAwareEntity.definitions.relationships || [],
    'otherEntityName',
    tenant.entityInstance
  );
  const defaultTenantRel = createDefaultTenantAwareRelationship(tenant);
  if (tenantRelationship) {
    tenantRelationship.ownerSide = true;
    tenantRelationship.relationshipValidateRules = 'required';
    _.defaults(tenantRelationship, defaultTenantRel);
    tenantAwareEntity.definitions.relationships = tenantAwareEntity.definitions.relationships.concat([]);
  } else {
    tenantAwareEntity.definitions.relationships = tenantAwareEntity.definitions.relationships.concat([defaultTenantRel]);
  }
}

function createDefaultTenantAwareRelationship(tenant) {
  return {
    relationshipName: tenant.entityInstance,
    otherEntityName: tenant.entityInstance,
    relationshipType: 'many-to-one',
    otherEntityField: 'name',
    relationshipValidateRules: 'required',
    ownerSide: true,
    clientRootFolder: tenant.clientRootFolder,
    otherEntityStateName: tenant.entityStateName,
    // Should be tenantFolderName, as of 6.4.1 this is wrong
    otherEntityFolderName: tenant.entityFileName,
    otherEntityAngularName: tenant.entityAngularName,
    otherEntityRelationshipName: tenant.entityInstance
  };
}
