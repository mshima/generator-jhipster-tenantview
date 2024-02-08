export default {
  condition: data => (data.tenant && !data.tenantEntity.builtInUser) || (data.tenantEntity.builtInUser && data.builtInUserManagement),
};
