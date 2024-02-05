module.exports = {
  condition: data => data.tenantAware && !data.tenant.builtInUser,
};
