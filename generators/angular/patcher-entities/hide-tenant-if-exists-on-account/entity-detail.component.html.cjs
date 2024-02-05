const file = data => `${data.srcMainWebapp}app/entities/${data.entityFolderName}/detail/${data.entityFileName}-detail.component.html`;

const condition = data => data.tenantAware;

const tmpls = [
  {
    // Hide tenant if is defined
    type: 'replaceContent',
    regex: true,
    target: data => `<dt>(<span(.*)>${data.tenant.entityClass}</span></dt>(\\s*)<dd>)`,
    tmpl: data => `<dt *ngIf="${data.entityInstance}.${data.tenant.entityInstance}">$1`,
  },
];

module.exports = {
  condition: data => data.tenantAware,
  file,
  condition,
  tmpls,
};
