const _ = require('lodash');
const pluralize = require('pluralize');
const debug = require('debug')('tenantview:utils');

/**
 * Utils file to hold methods common to both generator and sub generator
 */
module.exports = {
  getArrayItemWithFieldValue
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
