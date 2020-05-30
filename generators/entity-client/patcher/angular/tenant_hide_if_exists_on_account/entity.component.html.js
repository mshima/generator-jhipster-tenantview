const file = context =>
  `${context.generator.CLIENT_MAIN_SRC_DIR}app/entities/${context.entity.entityFolderName}/${context.entity.entityFileName}.component.html`;

const tmpls = [
  {
    // Hide if currentAccount has a tenant
    condition: context => context.entity.definitions.tenantAware,
    type: 'replaceContent',
    regex: true,
    target: context => `<th(.*)><span(.*)>${context.tenant.entityClass}</span>`,
    tmpl: context => `<th$1 *ngIf="!currentAccount.${context.tenant.entityInstance}"><span$2>${context.tenant.entityClass}</span>`
  },
  {
    // Hide if currentAccount has a tenant
    condition: context => context.entity.definitions.tenantAware,
    type: 'replaceContent',
    regex: true,
    target: context => `<td>\n(\\s*)(<div \\*ngIf="${context.entity.entityInstance}.${context.tenant.entityInstance}">)`,
    tmpl: context => `<td *ngIf="!currentAccount.${context.tenant.entityInstance}">\n$1$2`
  }
];
module.exports = {
  file,
  tmpls
};
