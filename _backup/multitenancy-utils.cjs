const _ = require('lodash');

/**
 * Utils file to hold methods common to both generator and sub generator
 */
module.exports = {
  getArrayItemWithFieldValue,
  configureTenantAwareEntity,
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
    tenant.entityInstance,
  );
  const defaultTenantRel = createDefaultTenantAwareRelationship(tenant);
  if (tenantRelationship) {
    tenantRelationship.ownerSide = true;
    tenantRelationship.relationshipValidate = true;
    tenantRelationship.relationshipValidateRules = 'required';
    _.defaults(tenantRelationship, defaultTenantRel);
    tenantAwareEntity.definitions.relationships = tenantAwareEntity.definitions.relationships.concat([]);
  } else {
    tenantAwareEntity.definitions.relationships = tenantAwareEntity.definitions.relationships.concat([defaultTenantRel]);
  }
}
