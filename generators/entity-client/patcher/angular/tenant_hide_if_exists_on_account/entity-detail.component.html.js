const file = context =>
  `${context.generator.CLIENT_MAIN_SRC_DIR}app/entities/${context.entity.entityFolderName}/${context.entity.entityFileName}-detail.component.html`;

const condition = context => context.entity.definitions.tenantAware;

const tmpls = [
  {
    // Hide tenant if is defined
    type: 'replaceContent',
    condition: context => context.entity.definitions.tenantAware,
    regex: true,
    target: context => `<dt>(<span(.*)>${context.tenant.entityClass}</span></dt>(\\s*)<dd>)`,
    tmpl: context => `<dt *ngIf="${context.entity.entityInstance}.${context.tenant.entityInstance}">$1`
  }
];

module.exports = {
  file,
  condition,
  tmpls
};
