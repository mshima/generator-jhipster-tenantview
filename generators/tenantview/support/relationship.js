import { lowerFirst } from 'lodash-es';

export const createTenantAwareRelationship = (tenantName, tenantLabel) => ({
  relationshipName: lowerFirst(tenantName),
  otherEntityName: tenantName,
  relationshipType: 'many-to-one',
  relationshipSide: 'left',
  otherEntityField: tenantLabel,
  columnRequired: true,
  autoGenerate: true,
});
