const file = data => `${data.srcMainWebapp}app/entities/${data.entityFolderName}/list/${data.entityFileName}.component.html`;

const tmpls = [
  {
    // Hide if currentAccount has a tenant
    type: 'replaceContent',
    regex: true,
    target: data => `<th(.*)><span(.*)>${data.tenant.entityClass}</span>`,
    tmpl: data => `<th$1 *ngIf="currentAccount.${data.tenant.entityInstance}.id === 0"><span$2>${data.tenant.entityClass}</span>`,
  },
  {
    // Hide if currentAccount has a tenant
    type: 'replaceContent',
    regex: true,
    target: data => `<td>\n(\\s*)(<div \\*ngIf="${data.entityInstance}.${data.tenant.entityInstance}">)`,
    tmpl: data => `<td *ngIf="currentAccount.${data.tenant.entityInstance}.id === 0">\n$1$2`,
  },
];
module.exports = {
  condition: data => data.tenantAware,
  file,
  tmpls,
};
