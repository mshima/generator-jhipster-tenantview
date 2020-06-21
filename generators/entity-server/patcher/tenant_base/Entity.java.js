// Add jpa filter to the entity to remove entries from another tenant
const file = ctx =>
  `${ctx.constants.SERVER_MAIN_SRC_DIR}${ctx.storage.packageFolder}/domain/${ctx.entity.entityClass}.java`;

const tmpls = [
  {
    condition: ctx => ctx.entity.definitions.tenantAware,
    type: 'replaceContent',
    regex: true,
    target: ctx => `@NotNull(\n(.*)\n(\\s*)private ${ctx.tenant.entityClass} ${ctx.tenant.entityInstance};)`,
    tmpl: () => `@JoinColumn(nullable = false)$1`
  }
];

module.exports = {
  file,
  tmpls
};
