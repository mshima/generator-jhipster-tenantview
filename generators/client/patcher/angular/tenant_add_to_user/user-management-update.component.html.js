const file = context => `${context.generator.CLIENT_MAIN_SRC_DIR}app/admin/user-management/user-management-update.component.html`;

const tmpls = [
  {
    type: 'replaceContent',
    regex: true,
    // eslint-disable-next-line prettier/prettier
        target: () => /((.*)<div class="form-group">\n(\s*)<label(.*)>Profiles<\/label>)/g,
    tmpl: context => {
      const jhiTranslate = context.storage.enableTranslation ? ` jhiTranslate="userManagement.${context.tenant.entityInstance}"` : '';
      return `$2<div class="form-group" *ngIf="(!currentAccount || currentAccount.${context.tenant.entityInstance}?.id === 0) && ${context.tenant.entityInstancePlural} && ${context.tenant.entityInstancePlural}.length > 0">
$3<label class="form-control-label"${jhiTranslate}>${context.tenant.entityClass}</label>
$3<select class="form-control" id="field_${context.tenant.entityInstance}" name="${context.tenant.entityInstance}" formControlName="${context.tenant.entityInstance}">
$3    <option *ngIf="!editForm.get('${context.tenant.entityInstance}')!.value" [ngValue]="null" selected></option>
$3    <option [ngValue]="${context.tenant.entityInstance}Option.id === editForm.get('${context.tenant.entityInstance}')!.value?.id ? editForm.get('${context.tenant.entityInstance}')!.value : ${context.tenant.entityInstance}Option" *ngFor="let ${context.tenant.entityInstance}Option of ${context.tenant.entityInstancePlural} trackBy: track${context.tenant.entityClass}ById">{{${context.tenant.entityInstance}Option.name}}</option>
$3</select>
$2</div>
$1`;
    }
  }
];

module.exports = {
  file,
  tmpls
};
