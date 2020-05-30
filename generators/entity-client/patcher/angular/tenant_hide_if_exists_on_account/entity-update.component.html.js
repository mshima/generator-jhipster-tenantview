const file = context =>
  `${context.generator.CLIENT_MAIN_SRC_DIR}app/entities/${context.entity.entityFolderName}/${context.entity.entityFileName}-update.component.html`;

const condition = context => context.entity.definitions.tenantAware;

const tmpls = [
  {
    // Hide the tenant if the current account is from a tenant (field)
    type: 'replaceContent',
    regex: true,
    target: context => `<div class="form-group">(\\s*)(.*)(for="field_${context.tenant.entityInstance})"`,
    tmpl: context => `<div class="form-group" *ngIf="!currentAccount.${context.tenant.entityInstance}">$1$2$3"`
  },
  {
    // Hide the tenant if the current account is from a tenant (requirements)
    type: 'replaceContent',
    regex: false,
    target: context => `<div *ngIf="editForm.get('${context.tenant.entityInstance}`,
    tmpl: context => `<div *ngIf="!currentAccount.${context.tenant.entityInstance} && editForm.get('${context.tenant.entityInstance}`
  }
];

module.exports = {
  file,
  condition,
  tmpls
};
