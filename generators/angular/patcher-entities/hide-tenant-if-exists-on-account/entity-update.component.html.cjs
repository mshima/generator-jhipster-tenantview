const file = data => `${data.srcMainWebapp}app/entities/${data.entityFolderName}/update/${data.entityFileName}-update.component.html`;

const condition = data => data.tenantAware;

const tmpls = [
  {
    // Hide the tenant if the current account is from a tenant (field)
    type: 'replaceContent',
    regex: true,
    target: data => `<div class="form-group">(\\s*)(.*)(for="field_${data.tenant.entityInstance})"`,
    tmpl: data => `<div class="form-group" *ngIf="currentAccount.${data.tenant.entityInstance}.id === 0">$1$2$3"`,
  },
];

module.exports = {
  file,
  condition,
  tmpls,
};
