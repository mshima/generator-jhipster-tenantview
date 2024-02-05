// Add jpa filter to the entity to remove entries from another tenant
const file = data => `${data.SERVER_MAIN_SRC_DIR}${data.packageFolder}/domain/${data.entityClass}.java`;

const tmpls = [
  {
    condition: data => data.tenantAware,
    type: 'replaceContent',
    regex: true,
    ignorePatchErrors: true,
    target: data => `@NotNull(\n(.*)\n(\\s*)private ${data.tenant.entityClass} ${data.tenant.entityInstance};)`,
    tmpl: () => `@JoinColumn(nullable = false)$1`,
  },
];

module.exports = {
  disabled: true,
  file,
  tmpls,
};
